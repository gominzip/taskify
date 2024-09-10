import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import userStorage from "../model/UserStorage.js";

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await userStorage.findUserByUsername(username);
      if (!user) {
        return done(null, false, { message: "일치하는 유저가 없습니다" });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return done(null, false, { message: "비밀번호가 일치하지 않습니다" });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

// 세션 저장 방식
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// 세션에서 사용자 정보 복원
passport.deserializeUser(async (id, done) => {
  try {
    const user = await userStorage.findUserById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
