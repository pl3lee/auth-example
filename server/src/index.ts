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



app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username: username });
      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      };
      if (user.password !== password) {
        return done(null, false, { message: "Incorrect password" });
      };
      return done(null, user);
    } catch(err) {
      return done(err);
    };
  })
);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id) as IUser;
    done(null, user);
  } catch(err) {
    done(err);
  };
});




app.post("/sign-up", async (req, res, next) => {
  try {
    const user = new User({
      username: req.body.username,
      password: req.body.password
    });
    const result = await user.save();
    res.json(result);
  } catch(err) {
    return next(err);
  };
});

app.post("/login", passport.authenticate("local"), (req, res) => {
    res.json(req.user);
  }
);


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});