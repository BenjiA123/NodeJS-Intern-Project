"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOneTodo = exports.updateOneTodo = exports.getOneTodo = exports.getAllTodo = exports.createTodo = void 0;
const todoModel_1 = __importDefault(require("../models/todoModel"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const appError_1 = __importDefault(require("../utils/appError"));
const createTodo = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, completed } = req.body;
    const newTodo = yield todoModel_1.default.create({
        title,
        completed,
        userId: req.user._id,
    });
    res.status(200).json({
        status: "Success",
        doc: newTodo,
    });
}));
exports.createTodo = createTodo;
const getAllTodo = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const todos = yield todoModel_1.default.find();
    res.status(200).json({
        status: "Success",
        doc: todos,
    });
}));
exports.getAllTodo = getAllTodo;
const getOneTodo = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.params.id)
        return next(new appError_1.default("Please Provide an Id", 400));
    const todo = yield todoModel_1.default.findById(req.params.id);
    if (!todo)
        return next(new appError_1.default("No Todo Exists with this Id", 400));
    res.status(200).json({
        status: "Success",
        doc: todo,
    });
}));
exports.getOneTodo = getOneTodo;
const updateOneTodo = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.params.id)
        return next(new appError_1.default("Please Provide an Id", 400));
    const updatedTodo = yield todoModel_1.default.findByIdAndUpdate(req.params.id, { title: req.body.title, completed: req.body.completed }, {
        new: false,
    });
    if (!updatedTodo)
        return next(new appError_1.default("No todo found with this id", 400));
    res.status(200).json({
        status: "Success",
        doc: updatedTodo,
    });
}));
exports.updateOneTodo = updateOneTodo;
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
const deleteOneTodo = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield todoModel_1.default.findByIdAndDelete(req.params.id);
    res.status(204).json({
        status: "Success",
    });
}));
exports.deleteOneTodo = deleteOneTodo;
