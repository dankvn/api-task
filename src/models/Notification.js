// models/Notification.js
import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User",
    required: true 
  },
  message: { 
    type: String, 
    required: true 
  },
  task: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Task" 
  },
  project: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Project" 
  },
  read: { 
    type: Boolean, 
    default: false 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

export default mongoose.model("Notification", notificationSchema);