import Fastify from "fastify";
import {
  createTaskSchema,
  type CreateTask,
} from "./task-schema.js";

export function buildServer() {
  const app = Fastify({
    logger: true,
  });

  app.post("/tasks", async (request, reply) => {
    const result = createTaskSchema.safeParse(request.body);

    if (!result.success) {
      return reply.status(400).send({
        error: "Invalid request",
        details: result.error.issues,
      });
    }

    const task: CreateTask = result.data;

    return reply.status(201).send({
      id: 1,
      ...task,
    });
  });

  return app;
}

const app = buildServer();

app.listen({
  port: 3000,
  host: "0.0.0.0",
}).catch((error) => {
  app.log.error(error);
  process.exit(1);
});