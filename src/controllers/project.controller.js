import Project from "../models/Project.js";
import mongoose from "mongoose";
import Task from "../models/Task.js";

// Crear un proyecto (admin y moderador)
export const createProject = async (req, res) => {
  try {
    const { name, description, users } = req.body;

    const newProject = new Project({ name, description, users });
    await newProject.save();

    return res.status(201).json(newProject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al crear el proyecto" });
  }
};

// Obtener todos los proyectos (solo admin)
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().populate("users", "username email");
    res.status(200).json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener proyectos" });
  }
};

// Obtener proyectos asignados al usuario logueado (user)

export const getMyProjects = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.userId); 

    const projects = await Project.find({ users: userId }).populate("users", "username email");
    console.log("Proyectos encontrados:", projects.length);

    res.json(projects);
  } catch (error) {
    console.error("Error al obtener el proyecto", error);
    
    res.status(500).json({ message: "Error al obtener el proyecto" });
  }
};

// Obtener un proyecto por ID (todos los roles con permiso)

export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("users", "username email")
      .populate({
        path: 'tasks',
        populate: {
          path: 'assignedTo',
          select: 'username email'
        }
      });

    if (!project) return res.status(404).json({ message: "Proyecto no encontrado" });

    // Verificación de acceso
    if (!req.roles.includes("admin") && !req.roles.includes("moderator")) {
      const isAssigned = project.users.some(u => u._id.toString() === req.userId);
      if (!isAssigned) {
        return res.status(403).json({ message: "No tienes acceso a este proyecto" });
      }
    }

    res.status(200).json(project);
  } catch (error) {
    console.error("Error al obtener el proyecto:", error);
    res.status(500).json({ message: "Error al obtener el proyecto" });
  }
};


// Actualizar proyecto (admin y moderador)
// En tu controlador de proyectos (project.controller.js)
export const updateProject = async (req, res) => {
  try {
    const { users } = req.body;
    
    // Actualizar el proyecto
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    );

    // Si se modificaron los usuarios, actualizar las tareas
    if (users) {
      await Task.updateMany(
        { project: req.params.id },
        { $addToSet: { assignedTo: { $each: users } } }
      );
    }

    if (!updatedProject) {
      return res.status(404).json({ message: "Proyecto no encontrado" });
    }

    res.status(200).json(updatedProject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar el proyecto" });
  }
};

// Eliminar proyecto (solo admin)
export const deleteProject = async (req, res) => {
  try {
    const deletedProject = await Project.findByIdAndDelete(req.params.id);
    if (!deletedProject) return res.status(404).json({ message: "Proyecto no encontrado" });
    res.status(200).json({ message: "Proyecto eliminado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar el proyecto" });
  }
};

