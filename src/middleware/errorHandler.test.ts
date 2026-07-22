import express from "express";
import request from "supertest";
import { AppError, errorHandler } from "./errorHandler";

jest.mock("../config/logger", () => ({
  logger: {
    error: jest.fn(),
    warn: jest.fn(),
  },
}));

describe("errorHandler", () => {
  it("sanitizes AppError details before returning them to clients", async () => {
    const app = express();
    app.get("/test", () => {
      throw new AppError("Invalid request", 400, "BAD_INPUT", {
        token: "secret-token",
        account: "internal-account-id",
      });
    });
    app.use(errorHandler);

    const response = await request(app).get("/test").expect(400);

    expect(response.body.error.details).toEqual({
      type: "object",
      keys: ["token", "account"],
    });
    expect(JSON.stringify(response.body)).not.toContain("secret-token");
    expect(JSON.stringify(response.body)).not.toContain("internal-account-id");
  });
});