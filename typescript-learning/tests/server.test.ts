import { describe, expect, it } from "vitest";

import { buildServer } from "../src/server.js";

describe("POST /tasks", () => {
  it("creates a task", async () => {
    const app = buildServer();

    const response = await app.inject({
      method: "POST",
      url: "/tasks",
      payload: {
        title: "Learn Fastify",
        priority: "high",
      },
    });

    expect(response.statusCode).toBe(201);

    expect(response.json()).toEqual({
      id: 1,
      title: "Learn Fastify",
      priority: "high",
      completed: false,
    });

    await app.close();
  });

  it("rejects invalid input", async () => {
    const app = buildServer();

    const response = await app.inject({
      method: "POST",
      url: "/tasks",
      payload: {
        title: 123,
        priority: "invalid",
      },
    });

    expect(response.statusCode).toBe(400);

    const body = response.json();

    expect(body.error).toBe("Invalid request");

    await app.close();
  });
});