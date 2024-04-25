ALTER TABLE "user" RENAME COLUMN "name" TO "username";--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "hashed_password" varchar(255) NOT NULL;