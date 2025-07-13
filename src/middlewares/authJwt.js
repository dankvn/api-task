import jwt from "jsonwebtoken";
import { SECRET } from "../config.js";
import User from "../models/User.js";
import Role from "../models/Role.js";

export const verifyToken = async (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) return res.status(403).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, SECRET);
    req.userId = decoded.id;

    const user = await User.findById(req.userId, { password: 0 });
    if (!user) return res.status(404).json({ message: "No user found" });

    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized!" });
  }
};

export const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    const roles = await Role.find({ _id: { $in: user.roles } });

    const isAdmin = roles.some((role) => role.name === "admin");

    if (isAdmin) return next();

    return res.status(403).json({ message: "Require Admin Role!" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const isModeratorOrAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    const roles = await Role.find({ _id: { $in: user.roles } });

    const hasRole = roles.some(role =>
      role.name === "admin" || role.name === "moderator"
    );

    if (hasRole) {
      next();
    } else {
      return res.status(403).json({ message: "Require Moderator or Admin Role!" });
    }
  } catch (error) {
    return res.status(500).send({ message: error });
  }
};