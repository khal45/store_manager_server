import users from "../database/usersDb.js";
import { compareSync } from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const accessKey = process.env.ACCESS_TOKEN_SECRET;

const postLogin = (req, res) => {
  const { username, password } = req.body;
  const user = users.find((user) => user.username === username);

  if (!user) {
    return res
      .status(401)
      .json({ success: false, message: "user does not exist" });
  }

  const passwordsMatch = compareSync(password, user.password);

  if (passwordsMatch) {
    const accessToken = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      accessKey,
      {
        expiresIn: "1d",
      }
    );

    return res.status(200).json({
      success: true,
      accessToken,
      message: `welcome ${user.username}`,
    });
  } else {
    return res
      .status(401)
      .json({ success: false, message: "incorrect password" });
  }
};

export { postLogin };
