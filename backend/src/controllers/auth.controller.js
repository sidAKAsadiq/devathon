import User from "../models/user.models.js";
import jwt from "jsonwebtoken";
import { api_error } from "../utils/api_error.js";
import { api_response } from "../utils/api_response.js";
import {async_handler} from "../utils/async_handler.js";

const createToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: "7d"
  });
};

export const register = async_handler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) throw new api_error(400, "Missing fields");

  const existing = await User.findOne({ email });
  if (existing) throw new api_error(409, "Email already registered");

  const user = await User.create({ name, email, password });
  const token = createToken(user);

  return res.status(201).json(new api_response(201, { token, user }, "Registered successfully"));
});

export const login = async_handler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) throw new api_error(400, "Missing fields");

  const user = await User.findOne({ email });
  if (!user) throw new api_error(401, "Invalid credentials");

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new api_error(401, "Invalid credentials");

  const token = createToken(user);
  return res.status(200).json(new api_response(200, { token, user }, "Login successful"));
});
