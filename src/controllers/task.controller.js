import Task from "../models/Task.js";
import Project from "../models/Project.js";
import { createNotification } from "../services/notificationService.js";
import Notification from "../models/Notification.js";

// Crear tarea (admin o moderador)
export const createTask = async (req, res) => {
  try {
    const { title, description, project, startDate, endDate } = req.body;

    const projectDoc = await Project.findById(project).populate("users");
    if (!projectDoc) {
      return res.status(400).json({ message: "Proyecto no válido" });
    }

    const task = new Task({
      title,
      description,
      assignedTo: projectDoc.users.map((user) => ({
        user: user._id,
        status: "pending",
        deliveryFile: null,
      })),
      project,
      startDate: startDate || new Date(),
      endDate,
    });

    await task.save();
    const newNotification = {
      user: req.userId, // ✅ Asegura que este ID existe
      message: `Nueva tarea asignada: "${task.title}"`,
      task: task._id,
      project: task.project,
      read: false,
    };

    await Notification.create(newNotification);

    // Notificar a cada usuario
    for (const user of projectDoc.users) {
      await createNotification(
        user._id,
        `Se te ha asignado una nueva tarea: "${title}" en el proyecto "${projectDoc.name}"`,
        task._id,
        project
      );
    }

    const populatedTask = await Task.findById(task._id)
      .populate("assignedTo.user", "username email")
      .populate("project", "name");

    return res.status(201).json({
      message: "Tarea creada y notificaciones enviadas",
      task: populatedTask,
    });
  } catch (error) {
    console.error("Error al crear la tarea:", error);
    return res.status(500).json({
      message: "Error al crear la tarea",
      error: error.message,
    });
  }
};

// Obtener todas las tareas (solo admin)
export const getTasks = async (req, res) => {
  try {         
    const tasks = await Task.find()
      .populate("assignedTo.user", "username email")
      .populate("project", "name");
    res.status(200).json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener tareas" });
  }
};

// Obtener tareas asignadas al usuario logueado (user)
export const getMyTasks = async (req, res) => {
  try {
    console.log("Buscando tareas para:", req.userId);

    const tasks = await Task.find({ "assignedTo.user": req.userId })
      .populate("assignedTo.user", "username email")
      .populate("project", "name");

    console.log("Tareas encontradas:", tasks.length);
    res.status(200).json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener tareas del usuario" });
  }
};

// Obtener tarea por ID (con control acceso)
export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("assignedTo.user", "username email")
      .populate("project", "name");

    if (!task) return res.status(404).json({ message: "Tarea no encontrada" });

    // Usuarios solo pueden ver si están asignados
    if (!req.roles.includes("admin") && !req.roles.includes("moderator")) {
      if (task.assignedTo._id.toString() !== req.userId) {
        return res
          .status(403)
          .json({ message: "No tienes acceso a esta tarea" });
      }
    }

    res.status(200).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener la tarea" });
  }
};

// Actualizar tarea (admin y moderador)
export const updateTask = async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedTask)
      return res.status(404).json({ message: "Tarea no encontrada" });
    res.status(200).json(updatedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar la tarea" });
  }
};

// Eliminar tarea (solo admin)
export const deleteTask = async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask)
      return res.status(404).json({ message: "Tarea no encontrada" });
    res.status(200).json({ message: "Tarea eliminada correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar la tarea" });
  }
};

export const uploadTaskFile = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No se subió ningún archivo" });
    }

    const task = await Task.findById(id);
    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Tarea no encontrada" });
    }

    // Buscar el usuario asignado dentro del array
    const assignedUser = task.assignedTo.find(
      (u) => u.user.toString() === req.userId
    );

    if (!assignedUser) {
      return res
        .status(403)
        .json({ success: false, message: "No tienes acceso a esta tarea" });
    }

    // Actualizar solo el estado del usuario actual
    assignedUser.status = "completed";
    assignedUser.deliveryFile = `/uploads/tasks/${req.file.filename}`;
    assignedUser.completedAt = new Date();

    await task.save();

    res.status(200).json({
      success: true,
      message:
        "Archivo subido y tarea marcada como completada para este usuario",
      task,
    });
  } catch (error) {
    console.error("Error en uploadTaskFile:", error);
    res.status(500).json({
      success: false,
      message: "Error al procesar el archivo",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
