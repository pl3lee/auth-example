import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core"
 
// we are creating a table called "user"
export const UserTable = pgTable("user", {
    // the argument id is the name of the column
    // specifies that this is a primary key, and gets a random value by default
    // if we want an auto incrementing id, we can use 
    // serial("id").primaryKey()
    // serial is a function that generates an auto incrementing id
    id: uuid("id").primaryKey().defaultRandom(),
    username: varchar("username", { length: 255 }).notNull(),
    hashed_password: varchar("hashed_password", { length: 255 }).notNull(),
})


export const SessionTable = pgTable("session", {
	id: text("id").primaryKey(),
	userId: uuid("user_id")
		.notNull()
		.references(() => UserTable.id),
	expiresAt: timestamp("expires_at", {
		withTimezone: true,
		mode: "date"
	}).notNull()
});
