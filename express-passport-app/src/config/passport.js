const passport = require("passport");
const User = require("../models/users.model");
const LocalStrategy = require("passport-local").Strategy;

// req.login(user)가 호출되었을 때
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// client => session => request
passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});

passport.use(
  "local",
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    (email, password, done) => {
      User.findOne({ email: email.toLocaleLowerCase() })
        .then((user) => {
          if (!user) {
            return done(null, false, { msg: `Email ${email} not found` });
          }

          user.comparePassword(password, (err, isMatch) => {
            if (err) return done(err);

            if (isMatch) {
              return done(null, user);
            }
            return done(null, false, { msg: "Invalid email or password" });
          });
        })
        .catch((err) => {
          return done(err);
        });
    }
  )
);

// const googleStrategyConfig = new GoogleStrategy(
//   {
//     clientID: process.env.GOOGLE_CLIENT_ID,
//     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     callbackURL: "/auth/google/callback",
//     scope: ["email", "profile"],
//   },
//   async (accessToken, refreshToken, profile, done) => {
//     try {
//       const existingUser = await User.findOne({ googleId: profile.id });
//       if (existingUser) {
//         return done(null, existingUser);
//       } else {
//         const user = new User();
//         user.email = profile.emails[0].value;
//         user.googleId = profile.id;
//         user.save((err) => {
//           console.log(err);
//           if (err) return done(err);
//           done(null, user);
//         });
//       }
//     } catch (error) {
//       return done(error);
//     }
//   }
// );
// passport.use("google", googleStrategyConfig);

// const kakaoStrategyConfig = new KakaoStrategy(
//   {
//     clientID: process.env.KAKAO_CLIENT_ID,
//     callbackURL: "/auth/kakao/callback",
//   },
//   async (accessToken, refreshToken, profile, done) => {
//     try {
//       const existingUser = await User.findOne({ googleId: profile.id });
//       if (existingUser) {
//         return done(null, existingUser);
//       } else {
//         const user = new User();
//         user.email = profile._json.kakao_account.email;
//         user.googleId = profile.id;
//         user.save((err) => {
//           if (err) return done(err);
//           done(null, user);
//         });
//       }
//     } catch (error) {
//       return done(error);
//     }
//   }
// );
// passport.use("kakao", kakaoStrategyConfig);