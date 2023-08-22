import supertest from "supertest";
import mongoose from "mongoose";
import app from "../server";
import * as AuthService from "../controllers/authController";
import { MongoMemoryServer } from "mongodb-memory-server";

const userInput = {
  email: "teckwrlpd@gmail.com",
  password: "1234567890",
  name: "Teck Wrld",
};
let testNewUser: any;
beforeAll(async () => {
  const mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());

  // Create A User and sign him up
  const createdUser = await supertest(app)
    .post("/api/v1/auth/signup")
    .send(userInput);
  testNewUser = createdUser.body;
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoose.connection.close();
});
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
    it("Should return a 200 and the user object", async () => {
      const testSignUpUser = {
        email: "nodejsinter@gmail.com",
        password: "1234567890",
        name: "NodeJs Intern",
      };

      const signUpUserMock = jest
        .spyOn(AuthService, "signup")
        // @ts-ignore
        .mockReturnValueOnce({ name: "Mali" });
      const { statusCode, body } = await supertest(app)
        .post(`/api/v1/auth/signup`)
        .send(testSignUpUser);

      expect(body.data.user).toEqual({
        __v: 0,
        name: testSignUpUser.name,
        _id: expect.any(String),
        email: testSignUpUser.email,
      });
      expect(statusCode).toEqual(201);
    });
  });

  describe("User login with correct email and password", () => {
    it("Should return a 200 and the user object", async () => {
      const { statusCode, body } = await supertest(app)
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
    });
  });
});
