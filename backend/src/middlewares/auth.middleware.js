import jwt from "jsonwebtoken";
import User from "../models/user.models.js";
import { api_error } from "../utils/api_error.js";

export const protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return next(new api_error(401, "No token provided"));

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (err) {
    return next(new api_error(401, "Invalid token"));
    
  }
};
