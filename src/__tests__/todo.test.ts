import supertest from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose, { ConnectOptions } from "mongoose";
import app from "../server";
import * as TodoService from "../controllers/todoController";

const newTodo = {
  title: "Wash your car",
  completed: true,
};
let testUser: any;
let testTodo: any;

const newUser = {
  email: "goodluck@gmail.com",
  password: "1234567890", // Password should be more than 8 characters
  name: "Teck Wrld",
};
describe("Unit tests", () => {
  describe("Auth functions to be functions", () => {
    it("should have a signup function", () => {
      expect(typeof TodoService.createTodo).toBe("function");
      expect(typeof TodoService.deleteOneTodo).toBe("function");
      expect(typeof TodoService.getAllTodo).toBe("function");
      expect(typeof TodoService.getOneTodo).toBe("function");
      expect(typeof TodoService.updateOneTodo).toBe("function");
    });
  });
});

describe("ToDo List", () => {
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(
      "mongodb+srv://adeoul001:RMfBrCYYtvUyXiNR@nodejsintern.d53fa5k.mongodb.net"
    );
    const createdUser = await supertest(app)
      .post("/api/v1/auth/signup")
      .send(newUser);
    testUser = createdUser.body;

    const createdTodo = await supertest(app)
      .post("/api/v1/todos")
      .set("Authorization", "Bearer " + testUser.token)
      .send(newTodo);
    testTodo = createdTodo.body;
  });
  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
  });
  describe("Get Todo List Route", () => {
    it("should return a 200 status and the todolist", async () => {
      const { statusCode, body } = await supertest(app)
        .get(`/api/v1/todos`)
        .set("Authorization", "Bearer " + testUser.token);
      expect(statusCode).toBe(200);
    });
  });
  describe("Create Todo Route", () => {
    describe("It should create a todo and return 200", () => {
      it("Should create a todo and return 200", async () => {
        const { statusCode, body } = await supertest(app)
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
      });
    });
  });
  describe("Update ToDo List", () => {
    it("It should update a given list and return 200", async () => {
      const { statusCode, body } = await supertest(app)
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
    });
  });
  describe("Delete Single ToDo List", () => {
    it("It should update a given list and return 200", async () => {
      const { statusCode } = await supertest(app)
        .delete(`/api/v1/todos/${testTodo.doc._id}`)
        .set("Authorization", `Bearer ${testUser.token}`);
      expect(statusCode).toBe(204);
    });
  });
});
