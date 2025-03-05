import users from "../database/usersDb.js";
import { hashSync } from "bcrypt";
import { v4 as uuidv4 } from "uuid";
const uniqueId = uuidv4();

const usersRes = users.map(({ password, ...rest }) => rest);

const getUser = (req, res) => {
  res.status(200).json({ success: true, usersRes });
};

const createUser = (req, res) => {
  const usersCopy = users.slice();
  const { username, password, role } = req.body;

  const requiredFields = ["username", "password", "role"];
  const missingFields = requiredFields.filter((field) => !req.body[field]);

  const userExists = usersCopy.find((user) => user.username === username);

  if (missingFields.length > 0) {
    res.status(400).json({
      success: false,
      message: "All fields are required!",
    });
  } else {
    if (userExists) {
      res.status(409).json({
        success: false,
        message: "User already exists!",
      });
    } else {
      const hashedPassword = hashSync(password, 10);
      const newUser = {
        id: uniqueId,
        username: username,
        role: role,
        password: hashedPassword,
      };
      users.push(newUser);
      res.status(200).json({
        success: true,
        message: "User added successfully!",
        newUser,
      });
    }
  }
};

export { getUser, createUser };
