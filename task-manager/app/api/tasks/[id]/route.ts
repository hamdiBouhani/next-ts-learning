import {
  deleteTask,
  toggleTask,
} from "@/lib/tasks";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(
  _request: Request,
  context: RouteContext,
) {
  const { id } = await context.params;
  const taskId = Number(id);

  if (Number.isNaN(taskId)) {
    return Response.json(
      { error: "Invalid task ID" },
      { status: 400 },
    );
  }

  const task = await toggleTask(taskId);

  if (!task) {
    return Response.json(
      { error: "Task not found" },
      { status: 404 },
    );
  }

  return Response.json(task);
}

export async function DELETE(
  _request: Request,
  context: RouteContext,
) {
  const { id } = await context.params;
  const taskId = Number(id);

  if (Number.isNaN(taskId)) {
    return Response.json(
      { error: "Invalid task ID" },
      { status: 400 },
    );
  }

  const deleted = await deleteTask(taskId);

  if (!deleted) {
    return Response.json(
      { error: "Task not found" },
      { status: 404 },
    );
  }

  return new Response(null, {
    status: 204,
  });
}