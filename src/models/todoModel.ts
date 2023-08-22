import mongoose, { Document, Query } from "mongoose";

import { TodoListInterface } from "../interface/todoInterface";

const todoSchema = new mongoose.Schema({
  title: { type: String },
  completed: { type: Boolean, default: false },
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Only a registered User Can Create A todo"],
  },
});

todoSchema.pre(
  "find",
  function populateUser(
    this: Query<TodoListInterface, TodoListInterface>,
    next: () => void
  ) {
    this.populate("userId");
    next();
  }
);

export default mongoose.model<TodoListInterface>("Todo", todoSchema);
