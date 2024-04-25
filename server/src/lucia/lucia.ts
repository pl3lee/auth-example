import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { db } from "../drizzle/db";
import { UserTable, SessionTable } from "../drizzle/schema";
import { Lucia } from "lucia";

export const adapter = new DrizzlePostgreSQLAdapter(db, SessionTable, UserTable);



export const lucia = new Lucia(adapter, {
    sessionCookie: {
        attributes: {
            // set to `true` when using HTTPS
            secure: process.env.NODE_ENV === "production"
        },
    },
    getUserAttributes: (attributes) => {
		return {
			// attributes has the type of DatabaseUserAttributes
			username: attributes.username
		};
	}

});

// IMPORTANT!
declare module "lucia" {
	interface Register {
		Lucia: typeof lucia;
        DatabaseUserAttributes: DatabaseUserAttributes;
	}
}

interface DatabaseUserAttributes {
	username: string;
}

