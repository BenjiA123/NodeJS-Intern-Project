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
const mongodb_memory_server_1 = require("mongodb-memory-server");
const mongoose_1 = __importDefault(require("mongoose"));
const server_1 = __importDefault(require("../server"));
const TodoService = __importStar(require("../controllers/todoController"));
const newTodo = {
    title: "Wash your car",
    completed: true,
};
const userId = new mongoose_1.default.Types.ObjectId().toString();
let testUser;
let testTodo;
const newUser = {
    email: "goodluck@gmail.com",
    password: "1234567890",
    name: "Teck Wrld",
};
describe("Unit tests", () => {
    describe("Auth functions to be functions", () => {
        it("should have a signup function", () => {
            expect(typeof TodoService.createTodo).toBe("function");
        });
        it("should have a signup function", () => {
            expect(typeof TodoService.deleteOneTodo).toBe("function");
        });
        it("should have a signup function", () => {
            expect(typeof TodoService.getAllTodo).toBe("function");
        });
        it("should have a signup function", () => {
            expect(typeof TodoService.getOneTodo).toBe("function");
        });
        it("should have a signup function", () => {
            expect(typeof TodoService.updateOneTodo).toBe("function");
        });
    });
});
describe("ToDo List", () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        const mongoServer = yield mongodb_memory_server_1.MongoMemoryServer.create();
        yield mongoose_1.default.connect(mongoServer.getUri());
        const createdUser = yield (0, supertest_1.default)(server_1.default)
            .post("/api/v1/auth/signup")
            .send(newUser);
        testUser = createdUser.body;
        const createdTodo = yield (0, supertest_1.default)(server_1.default)
            .post("/api/v1/todos")
            .set("Authorization", "Bearer " + testUser.token)
            .send(newTodo);
        testTodo = createdTodo.body;
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield mongoose_1.default.disconnect();
        yield mongoose_1.default.connection.close();
    }));
    describe("Get Todo List Route", () => {
        it("should return a 200 status and the todolist", () => __awaiter(void 0, void 0, void 0, function* () {
            const { statusCode, body } = yield (0, supertest_1.default)(server_1.default)
                .get(`/api/v1/todos`)
                .set("Authorization", "Bearer " + testUser.token);
            expect(statusCode).toBe(200);
        }));
    });
    describe("Create Todo Route", () => {
        describe("It should create a todo and return 200", () => {
            it("Should create a todo and return 200", () => __awaiter(void 0, void 0, void 0, function* () {
                const { statusCode, body } = yield (0, supertest_1.default)(server_1.default)
                    .post(`/api/v1/todos`)
                    .set("Authorization", `Bearer ${testUser.token}`)
                    .send(newTodo);
                expect(statusCode).toBe(200);
                expect(body.doc).toEqual({
                    userId: expect.any(String),
                    __v: 0,
                    title: newTodo.title,
                    _id: expect.any(String),
                    completed: newTodo.completed,
                });
            }));
        });
    });
    describe("Update ToDo List", () => {
        it("It should update a given list and return 200", () => __awaiter(void 0, void 0, void 0, function* () {
            const { statusCode, body } = yield (0, supertest_1.default)(server_1.default)
                .patch(`/api/v1/todos/${testTodo.doc._id}`)
                .set("Authorization", `Bearer ${testUser.token}`)
                .send({
                title: "Go to the Gym",
                completed: true,
            });
            expect(statusCode).toBe(200);
            expect(body.doc).toEqual({
                __v: 0,
                title: testTodo.doc.title,
                _id: expect.any(String),
                completed: testTodo.doc.completed,
                userId: expect.any(String),
            });
        }));
    });
    describe("Delete Single ToDo List", () => {
        it("It should update a given list and return 200", () => __awaiter(void 0, void 0, void 0, function* () {
            const { statusCode } = yield (0, supertest_1.default)(server_1.default)
                .delete(`/api/v1/todos/${testTodo.doc._id}`)
                .set("Authorization", `Bearer ${testUser.token}`);
            expect(statusCode).toBe(204);
        }));
    });
});
