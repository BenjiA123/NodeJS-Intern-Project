import express from "express";
import {
  createTodo,
  getAllTodo,
  getOneTodo,
  updateOneTodo,
  deleteOneTodo,
} from "../controllers/todoController";
import { protect } from "../controllers/authController";

const todoRouter = express.Router({});

todoRouter.route("/").post(protect, createTodo).get(protect, getAllTodo);

todoRouter
  .route("/:id")
  .get(protect, getOneTodo)
  .patch(protect, updateOneTodo)
  .delete(protect, deleteOneTodo);

export default todoRouter;
