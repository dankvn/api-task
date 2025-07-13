import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import path from 'path'; 


// Routes

import indexRoutes from "./routes/index.routes.js";
import usersRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js";
import roleRoutes from './routes/role.routes.js';
import projectRoutes from "./routes/project.routes.js";
import taskRoutes from "./routes/task.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Settings
app.set("port", process.env.PORT || 4000);
app.set("json spaces", 4);

// Middlewares
app.use(
  cors({
    // origin: "http://localhost:3000", "http://192.168.0.7:3000"
  })
);
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use("/api", indexRoutes);

app.use("/api/users", usersRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/notifications", notificationRoutes);
app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));
export default app;
