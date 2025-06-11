import Role from '../models/Role.js';

export const getRoles = async (req, res) => {
  try {
    const roles = await Role.find();
    res.status(200).json(roles);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener roles' });
  }
};

export const createRole = async (req, res) => {
  try {
    const { name } = req.body;
    const newRole = new Role({ name });
    await newRole.save();
    res.status(201).json(newRole);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el rol' });
  }
};

export const getRole = async (req, res) => {
  try {
    const role = await Role.findById(req.params.roleId);
    if (!role) return res.status(404).json({ message: 'Rol no encontrado' });
    res.status(200).json(role);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el rol' });
  }
};

export const updateRole = async (req, res) => {
  try {
    const updatedRole = await Role.findByIdAndUpdate(
      req.params.roleId,
      req.body,
      { new: true }
    );
    if (!updatedRole) return res.status(404).json({ message: 'Rol no encontrado' });
    res.status(200).json(updatedRole);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el rol' });
  }
};

export const deleteRole = async (req, res) => {
  try {
    const deletedRole = await Role.findByIdAndDelete(req.params.roleId);
    if (!deletedRole) return res.status(404).json({ message: 'Rol no encontrado' });
    res.status(200).json({ message: 'Rol eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el rol' });
  }
};
