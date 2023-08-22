import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { promisify } from "util";
import { UserInterface } from "../interface/userInterface";
import User from "../models/authModel";
import bcrypt from "bcryptjs";
import AppError from "../utils/appError";
import catchAsync from "../utils/catchAsync";

const signToken = (id: string) => {
  return jwt.sign({ id }, "Thisisasecuresecretebybenji", {
    expiresIn: 900000000000,
  });
};
const createSendToken = (user: any, statusCode: number, res: Response) => {
  const token = signToken(user._id);
  user.password = undefined;
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

const signup = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });

    createSendToken(newUser, 201, res);
  }
);

const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new AppError("Please provide email and password", 400));
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return next(new AppError("Email and password mismatch", 400));
    }
    createSendToken(user, 200, res);
  }
);
const protect = catchAsync(
  async (req: any, res: Response, next: NextFunction) => {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return next(new AppError("Not Authorized", 401));
    }
    const decoded: any = jwt.verify(token, "Thisisasecuresecretebybenji");
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(new AppError("This user doesn't exist", 400));
    }

    req.user = currentUser;
    next();
  }
);
export { signToken, signup, login, protect };
