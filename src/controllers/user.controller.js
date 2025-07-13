import User from "../models/User.js";
import Role from "../models/Role.js";

export const createUser = async (req, res) => {
  try {
    const { username, email, password, roles } = req.body;

    console.log("📥 Roles recibidos en el backend:", roles); 

    const rolesFound = await Role.find({ name: { $in: roles } });

    console.log("✅ Roles encontrados:", rolesFound); 


    const user = new User({
      username,
      email,
      password,
      roles: rolesFound.map((role) => role._id),
    });

    
    const savedUser = await user.save();

    return res.status(200).json({
      _id: savedUser._id,
      username: savedUser.username,
      email: savedUser.email,
      roles: savedUser.roles,
    });
  } catch (error) {
    console.error("❌ Error al crear usuario:", error);
    res.status(400).json({ message: "Error al crear usuario" });
  }
};


export const getUsers = async (req, res) => {
  try {
    const users = await User.find().populate("roles");
    res.status(200).json(users);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ message: "Error al obtener usuarios" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { username, email, roles, password } = req.body;

    const updatedFields = { username, email };

    if (roles && roles.length > 0) {
      const rolesFound = await Role.find({ _id: { $in: roles } });
      updatedFields.roles = rolesFound.map((role) => role._id);
    }

    if (password && password.trim() !== "") {
      updatedFields.password = await User.encryptPassword(password);
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, updatedFields, {
      new: true,
    }).populate("roles");

    if (!updatedUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    res.status(500).json({ message: "Error al actualizar usuario" });
  }
};


export const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    res.status(500).json({ message: "Error al eliminar usuario" });
  }
};

