"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const supertest_1 = __importDefault(require("supertest"));
const mongoose_1 = __importDefault(require("mongoose"));
const server_1 = __importDefault(require("../server"));
const AuthService = __importStar(require("../controllers/authController"));
const mongodb_memory_server_1 = require("mongodb-memory-server");
const userInput = {
    email: "teckwrlpd@gmail.com",
    password: "1234567890",
    name: "Teck Wrld",
};
let testNewUser;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    const mongoServer = yield mongodb_memory_server_1.MongoMemoryServer.create();
    yield mongoose_1.default.connect(mongoServer.getUri());
    // Create A User and sign him up
    const createdUser = yield (0, supertest_1.default)(server_1.default)
        .post("/api/v1/auth/signup")
        .send(userInput);
    testNewUser = createdUser.body;
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.disconnect();
    yield mongoose_1.default.connection.close();
}));
describe("Unit tests", () => {
    describe("Auth functions to be functions", () => {
        it("should have a signup function", () => {
            expect(typeof AuthService.signup).toBe("function");
        });
        it("should have a signup function", () => {
            expect(typeof AuthService.login).toBe("function");
        });
        it("should have a signup function", () => {
            expect(typeof AuthService.protect).toBe("function");
        });
        it("should have a signup function", () => {
            expect(typeof AuthService.signToken).toBe("function");
        });
    });
});
describe("User Authentication", () => {
    describe("User signup with correct email and password", () => {
        it("Should return a 200 and the user object", () => __awaiter(void 0, void 0, void 0, function* () {
            const testSignUpUser = {
                email: "nodejsinter@gmail.com",
                password: "1234567890",
                name: "NodeJs Intern",
            };
            const signUpUserMock = jest
                .spyOn(AuthService, "signup")
                // @ts-ignore
                .mockReturnValueOnce({ name: "Mali" });
            const { statusCode, body } = yield (0, supertest_1.default)(server_1.default)
                .post(`/api/v1/auth/signup`)
                .send(testSignUpUser);
            expect(body.data.user).toEqual({
                __v: 0,
                name: testSignUpUser.name,
                _id: expect.any(String),
                email: testSignUpUser.email,
            });
            expect(statusCode).toEqual(201);
        }));
    });
    describe("User login with correct email and password", () => {
        it("Should return a 200 and the user object", () => __awaiter(void 0, void 0, void 0, function* () {
            const { statusCode, body } = yield (0, supertest_1.default)(server_1.default)
                .post(`/api/v1/auth/login`)
                .send({
                email: testNewUser.data.user.email,
                password: userInput.password,
            });
            expect(body.data.user).toEqual({
                __v: 0,
                name: testNewUser.data.user.name,
                _id: testNewUser.data.user._id,
                email: testNewUser.data.user.email,
            });
            expect(statusCode).toEqual(200);
        }));
    });
});
