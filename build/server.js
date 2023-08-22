"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const errorController_1 = __importDefault(require("./controllers/errorController"));
dotenv_1.default.config({ path: "./config.env" });
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
const todoRoutes_1 = __importDefault(require("./routes/todoRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const appError_1 = __importDefault(require("./utils/appError"));
app.use("/api/v1/todos", todoRoutes_1.default);
app.use("/api/v1/auth", authRoutes_1.default);
app.all("*", (req, res, next) => {
    next(new appError_1.default(`Can't find ${req.originalUrl} on this server`, 404));
});
app.use(errorController_1.default);
exports.default = app;
