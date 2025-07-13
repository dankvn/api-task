// models/Project.js
import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: String,
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Campo virtual para poblar tareas relacionadas
projectSchema.virtual("tasks", {
  ref: "Task",
  localField: "_id",
  foreignField: "project",
});
projectSchema.set("toObject", { virtuals: true });
projectSchema.set("toJSON", { virtuals: true });

export default mongoose.model("Project", projectSchema);


