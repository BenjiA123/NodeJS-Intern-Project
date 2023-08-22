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
exports.protect = exports.login = exports.signup = exports.signToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authModel_1 = __importDefault(require("../models/authModel"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const appError_1 = __importDefault(require("../utils/appError"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const signToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, "Thisisasecuresecretebybenji", {
        expiresIn: 900000000000,
    });
};
exports.signToken = signToken;
const createSendToken = (user, statusCode, res) => {
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
const signup = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const newUser = yield authModel_1.default.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
    });
    createSendToken(newUser, 201, res);
}));
exports.signup = signup;
const login = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new appError_1.default("Please provide email and password", 400));
    }
    const user = yield authModel_1.default.findOne({ email }).select("+password");
    if (!user || !(yield bcryptjs_1.default.compare(password, user.password))) {
        return next(new appError_1.default("Email and password mismatch", 400));
    }
    createSendToken(user, 200, res);
}));
exports.login = login;
const protect = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let token;
    if (req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
        return next(new appError_1.default("Not Authorized", 401));
    }
    const decoded = jsonwebtoken_1.default.verify(token, "Thisisasecuresecretebybenji");
    const currentUser = yield authModel_1.default.findById(decoded.id);
    if (!currentUser) {
        return next(new appError_1.default("This user doesn't exist", 400));
    }
    req.user = currentUser;
    next();
}));
exports.protect = protect;
