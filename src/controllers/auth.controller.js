import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Role from "../models/Role.js";
import { SECRET } from "../config.js";

export const signupHandler = async (req, res) => {
  try {
    const { username, email, password, roles } = req.body;

    // Creating a new User Object
    const newUser = new User({
      username,
      email,
      password,
    });

    // checking for roles
    if (roles) {
      const foundRoles = await Role.find({ name: { $in: roles } });
      newUser.roles = foundRoles.map((role) => role._id);
    } else {
      const role = await Role.findOne({ name: "user" });
      newUser.roles = [role._id];
    }

    // Saving the User Object in Mongodb
    
    const savedUser = await newUser.save();

    // Create a token
    const token = jwt.sign({ id: savedUser._id }, SECRET, {
      expiresIn: 86400, // 24 hours
    });

    return res.status(200).json({ token });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

export const signinHandler = async (req, res) => {
  try {
    console.log('Datos recibidos:', req.body); // 👈 IMPORTANTE

    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email y contraseña requeridos" });

    const userFound = await User.findOne({ email }).populate("roles");

    if (!userFound) {
      console.log("Usuario no encontrado para email:", email); // 👈 debug
      return res.status(400).json({ message: "User Not Found" });
    }

    const matchPassword = await User.comparePassword(password, userFound.password);

    if (!matchPassword) {
      console.log("Contraseña inválida para:", email); // 👈 debug
      return res.status(401).json({ message: "Invalid Password" });
    }

    const token = jwt.sign({ id: userFound._id }, SECRET, { expiresIn: 86400 });

    return res.json({
      token,
      username: userFound.username,
      roles: userFound.roles.map((r) => r.name),
    });
  } catch (error) {
    console.log("ERROR en signin:", error); // 👈 debug completo
    res.status(500).json({ message: "Internal server error" });
  }
};


export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('roles', 'name');
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      roles: user.roles.map(role => ({ name: role.name }))
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener perfil' });
  }
};
