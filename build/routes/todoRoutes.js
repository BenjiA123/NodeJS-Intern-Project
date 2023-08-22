"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const todoController_1 = require("../controllers/todoController");
const authController_1 = require("../controllers/authController");
const todoRouter = express_1.default.Router({});
todoRouter.route("/").post(authController_1.protect, todoController_1.createTodo).get(authController_1.protect, todoController_1.getAllTodo);
todoRouter
    .route("/:id")
    .get(authController_1.protect, todoController_1.getOneTodo)
    .patch(authController_1.protect, todoController_1.updateOneTodo)
    .delete(authController_1.protect, todoController_1.deleteOneTodo);
exports.default = todoRouter;
