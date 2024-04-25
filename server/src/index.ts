import express, { Request } from 'express';
import cors from "cors";
import dotenv from "dotenv";
import { Argon2id } from 'oslo/password';
import path from "path";
import { db } from './drizzle/db.ts';
import { UserTable, SessionTable } from './drizzle/schema.ts';
import { eq } from 'drizzle-orm';
import { lucia } from './lucia/lucia.ts';
import cookieParser from 'cookie-parser'
import type { Session, User } from "lucia";
import { ensureAuthenticated } from './middlewares/ensureAuthenticated.ts';







export const app = express();
const port = 3001;
dotenv.config();


app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(cookieParser())


app.post("/register/password", async (req, res) => {
  const { username, password } = req.body;
  	// username must be between 4 ~ 31 characters, and only consists of lowercase letters, 0-9, -, and _
	// keep in mind some database (e.g. mysql) are case insensitive
	if (
		username.length < 3 ||
		username.length > 31 ||
		!/^[a-z0-9_-]+$/.test(username)
	) {
    return res.status(400).json({ error: "Invalid username" });
	}
	if (password.length < 6 || password.length > 255) {
    return res.status(400).json({ error: "Invalid password" });
	}

	const hashedPassword = await new Argon2id().hash(password);

	const user = await db.select({id: UserTable.id})
  .from(UserTable)
  .where(eq(UserTable.username, username))
  if (user.length > 0) {
    return res.status(400).json({ error: "Username already exists" });
  } 

  const newUser = await db.insert(UserTable).values({
    username: username,
    hashed_password: hashedPassword
  }).returning({
    id: UserTable.id
  })

	const session = await lucia.createSession(newUser[0].id, {});
	const sessionCookie = lucia.createSessionCookie(session.id);
  return res.cookie(sessionCookie.name, sessionCookie.value, sessionCookie.attributes).json({ id: newUser[0].id });
})



app.post("/login/password", async (req, res) => {
  const { username, password } = req.body;
  if (
		username.length < 3 ||
		username.length > 31 ||
		!/^[a-z0-9_-]+$/.test(username)
	) {
    return res.status(400).json({ error: "Invalid username" });
	}
	if (password.length < 6 || password.length > 255) {
    return res.status(400).json({ error: "Invalid password" });
	}

  const user = await db.select({id: UserTable.id, username: UserTable.username, hashed_password: UserTable.hashed_password})
  .from(UserTable)
  .where(eq(UserTable.username, username))
  if (user.length === 0) {
    return res.status(400).json({ error: "Incorrect username or password" });
  } 

  const validPassword = await new Argon2id().verify(user[0].hashed_password, password);
	if (!validPassword) {
		return {
			error: "Incorrect username or password"
		};
	}

  const session = await lucia.createSession(user[0].id, {});
	const sessionCookie = lucia.createSessionCookie(session.id);
	return res.cookie(sessionCookie.name, sessionCookie.value, sessionCookie.attributes).json({ id: user[0].id, username: user[0].username });
})

app.post("/validate", ensureAuthenticated, async (req, res) => {
  const sessionId = req.cookies.auth_session ?? null;
  if (!sessionId) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  const result = await lucia.validateSession(sessionId);


  if (result.session && result.session.fresh) {
    const sessionCookie = lucia.createSessionCookie(result.session.id);
    return res.cookie(sessionCookie.name, sessionCookie.value, sessionCookie.attributes).json(result)
  }
  if (!result.session) {
    const sessionCookie = lucia.createBlankSessionCookie();
    return res.cookie(sessionCookie.name, sessionCookie.value, sessionCookie.attributes).json(result)
  }
  return res.json(result)
})

app.get("/secretdata", ensureAuthenticated, async (req, res) => {
  return res.json({ message: "This is a secret message" });
})

app.post("/logout", async (req, res) => {
  const sessionId = req.cookies.auth_session ?? null;
  if (!sessionId) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  await lucia.invalidateSession(sessionId);
  const sessionCookie = lucia.createBlankSessionCookie();
  return res.cookie(sessionCookie.name, sessionCookie.value, sessionCookie.attributes).json({ message: "Logged out" });
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});