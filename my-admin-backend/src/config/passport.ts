import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from "bcryptjs";
import User from '../models/User';
import { IUser } from '../types';

// Passport local strategy
passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email }).populate({
          path: 'role',
          populate: { path: 'permissions' },
        });
        if (!user) {
          return done(null, false, { message: "Incorrect email." });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return done(null, false, { message: "Incorrect password." });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).select('-password').populate({
      path: 'role',
      populate: { path: 'permissions' }
    });
    done(null, user);
  } catch (err) {
    done(err);
  }
});
