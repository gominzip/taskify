import passport from "passport";
import userStorage from "../model/UserStorage.js";

export const register = async (req, res) => {
  const { username, password, name, profileImageUrl } = req.body;

  try {
    const userId = await userStorage.addUser(
      username,
      password,
      name,
      profileImageUrl
    );
    return res.status(201).json({ message: "회원가입 성공", userId });
  } catch (error) {
    return res.status(500).json({ message: "회원가입 실패", error });
  }
};

export const login = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ message: info.message });

    req.logIn(user, (err) => {
      if (err) return next(err);
      const { password, ...rest } = user;
      return res.status(200).json({ message: "로그인 성공", user: rest });
    });
  })(req, res, next);
};

export const logout = (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ message: "로그아웃 실패" });
    return res.status(200).json({ message: "로그아웃 성공" });
  });
};
