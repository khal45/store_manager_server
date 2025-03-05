import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const accessKey = process.env.ACCESS_TOKEN_SECRET;

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return res
        .status(401)
        .json({ success: false, message: "Authorization header is required" });

    const token = authHeader.split(" ")[1];
    if (!token)
      return res
        .status(401)
        .json({ success: false, message: "No token provided" });

    jwt.verify(token, accessKey, (err, user) => {
      if (err)
        return res
          .status(403)
          .json({ success: false, message: "You are not allowed to access this route!" });
      req.user = user;
      next();
    });
  } catch (err) {
    console.log(err);
  }
};

const isAdmin = async (req, res, next) => {
  try {
    const { role } = req.user;
    if (role !== "Admin") {
      return res
        .status(403)
        .json({ success: false, message: "You are not allowed to access this route!" });
    }
    next();
  } catch (err) {
    console.log(err);
  }
};

export { verifyToken, isAdmin };
