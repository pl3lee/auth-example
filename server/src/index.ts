import express from 'express';
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import mongoose from 'mongoose';
import { Schema } from 'mongoose';
import { Document } from 'mongoose';
import { Strategy as BearerStrategy } from "passport-http-bearer";
import { BasicStrategy } from "passport-http";
import { ensureAuthenticated } from './middlewares/ensureAuthenticated';
interface IUser extends Document {
  username: string;
  password: string;
}

const mongoDb = "mongodb://root:password@localhost:27017/auth-example?authSource=admin";
mongoose.connect(mongoDb);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));



const User = mongoose.model(
  "User",
  new Schema<IUser>({
    username: { type: String, required: true },
    password: { type: String, required: true }
  })
);


export const app = express();
const port = 3001;
dotenv.config();



app.use(session({ secret: "cats", resave: false, saveUninitialized: false, cookie: { httpOnly: true } }));
app.use(passport.session());
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

passport.use(
  new LocalStrategy(async (username, password, cb) => {
    try {
      const user = await User.findOne({ username: username });
      if (!user) {
        return cb(null, false, { message: "Incorrect username" });
      };
      if (user.password !== password) {
        return cb(null, false, { message: "Incorrect username or password" });
      };
      return cb(null, user);
    } catch (err) {
      return cb(err);
    };
  })
);

passport.use(new BasicStrategy(
  async (username, password, cb) => {
    try {
      const user = await User.findOne({ username: username });
      if (!user) {
        return cb(null, false);
      };
      if (user.password !== password) {
        return cb(null, false);
      }
      return cb(null, user);
    } catch (err) {
      return cb(err);
    }
  }
));


app.post("/login/password",
  passport.authenticate('local', { failureMessage: true }),
  (req, res) => {
    res.json(req.user);
  }
);

app.post("/register/password",
  async (req, res, next) => {
    const { username, password } = req.body;
    const user = new User({ username, password });
    try {
      await user.save();
      req.login(user, function(err) {
        if (err) { return next(err); }
        return res.json(user);
      });
    } catch (err) {
      res.status(500).send(err);
    }
  })

app.post("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) { return next(err); }
    // Clear the session cookie
    req.session.destroy(function(err) {
      if (err) {
        return next(err);
      }
      // Clear the cookie on the client-side by setting its expiration to the past
      res.clearCookie('connect.sid', { path: '/' });
      return res.send("Logged out");
    });
  })
})

app.get("/secretdata", ensureAuthenticated,
  (req, res) => {
    res.json({
      secretData: "This is some secret data"
    })
  })

app.get("/loggedin", ensureAuthenticated,
  (req, res) => {
    res.json({
      loggedIn: true
    })
  }
)

passport.serializeUser((user: any, cb) => {
  process.nextTick(() => {
    return cb(null, {
      id: user.id,
      username: user.username
    })
  })
});

passport.deserializeUser((user: any, cb) => {
  process.nextTick(function () {
    return cb(null, user);
  });
});



app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});