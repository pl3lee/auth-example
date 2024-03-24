import express, {Request, Response, NextFunction} from "express";
import passport from "passport";
import {Strategy} from "passport-local";
import crypto from "crypto";
import { pool } from "..";

const router = express.Router()


passport.use(new Strategy(function verify(username, password, cb) {
pool.query('SELECT * FROM users WHERE username = ?', [ username ], function(err, user) {
    if (err) { return cb(err); }
    if (!user) { return cb(null, false, { message: 'Incorrect username or password.' }); }

    crypto.pbkdf2(password, user.salt, 310000, 32, 'sha256', function(err, hashedPassword) {
      if (err) { return cb(err); }
      if (!crypto.timingSafeEqual(user.hashed_password, hashedPassword)) {
        return cb(null, false, { message: 'Incorrect username or password.' });
      }
      return cb(null, user);
    });
  });
}));


router.post("/register", async (req: Request, res: Response, next: NextFunction) => {
    res.send("Register route");
  });



export {router as authRouter}