import passport from 'passport';
import passportLocal from 'passport-local';
import users from './users.js';

const { Strategy } = passportLocal;

const strategy = new Strategy(async (username, password, done) => {
  if (!await users.findUser(username)) {
    return done(null, false, { message: 'Wrong username' });
  }
  if (!await users.validatePassword(username, password)) {
    await new Promise((r) => setTimeout(r, 2000));
    return done(null, false, { message: 'Wrong password' });
  }
  return done(null, username);
});

passport.use(strategy);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((uid, done) => {
  done(null, uid);
});

export default {
  configure: (app) => {
    app.use(passport.initialize());
    app.use(passport.session());
  },

  authenticate: (domain, where) => {
    return passport.authenticate(domain, where);
  },
};