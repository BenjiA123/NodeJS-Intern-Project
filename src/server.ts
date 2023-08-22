import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import globalErrorHandler from "./controllers/errorController";

dotenv.config({ path: "./config.env" });

const app = express();
app.use(bodyParser.json());

import todoRouter from "./routes/todoRoutes";
import authRouter from "./routes/authRoutes";
import AppError from "./utils/appError";

app.use("/api/v1/todos", todoRouter);
app.use("/api/v1/auth", authRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

export default app;
