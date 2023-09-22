import { Request, Response, NextFunction } from "express";

import Todo from "../models/todoModel";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";
const createTodo = catchAsync(
  async (req: any, res: Response, next: NextFunction) => {
    const { title, completed } = req.body;
    const newTodo = await Todo.create({
      title,
      completed,
      userId: req.user._id,
    });

    res.status(200).json({
      status: "Success",
      doc: newTodo,
    });
  }
);
const getAllTodo = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log("We are getting all todos");
    const todos = await Todo.find();
    res.status(200).json({
      status: "Success",
      doc: todos,
    });
  }
);
const getOneTodo = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.params.id) return next(new AppError("Please Provide an Id", 400));
    const todo = await Todo.findById(req.params.id);
    if (!todo) return next(new AppError("No Todo Exists with this Id", 400));
    res.status(200).json({
      status: "Success",
      doc: todo,
    });
  }
);
const updateOneTodo = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.params.id) return next(new AppError("Please Provide an Id", 400));
    const updatedTodo = await Todo.findByIdAndUpdate(
      req.params.id,
      { title: req.body.title, completed: req.body.completed },
      {
        new: false,
      }
    );
    if (!updatedTodo)
      return next(new AppError("No todo found with this id", 400));
    res.status(200).json({
      status: "Success",
      doc: updatedTodo,
    });
  }
);
// const updateOrCreateOneTodo = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     // Find todo
//     const todo = await Todo.findById(req.params.id);
//     if (!todo && req.body) {
//       await Todo.create(req.body);
//       res.status(200).json({
//         status: "Success",
//         doc: todo,
//       });
//     } else {
//       await Todo.findByIdAndUpdate(req.params.id);
//       res.status(200).json({
//         status: "Success",
//         doc: todo,
//       });
//     }
//   } catch (error) {}
// };
const deleteOneTodo = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    await Todo.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "Success",
    });
  }
);

export { createTodo, getAllTodo, getOneTodo, updateOneTodo, deleteOneTodo };
