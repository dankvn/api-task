import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    assignedTo: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        status: {
          type: String,
          enum: ["pending", "in-progress", "completed"],
          default: "pending",
        },
        deliveryFile: { type: String },
        completedAt: { type: Date }
      }
    ],
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date },
  },
  { timestamps: true }
);


export default mongoose.model("Task", taskSchema);
