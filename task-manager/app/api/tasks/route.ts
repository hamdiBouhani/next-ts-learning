import { createTask, getTasks } from "@/lib/tasks";

export async function GET() {
  const tasks = await getTasks();

  return Response.json(tasks);
}

export async function POST(request: Request) {
  const body = await request.json();

  if (
    typeof body.title !== "string" ||
    body.title.trim() === ""
  ) {
    return Response.json(
      { error: "Title is required" },
      { status: 400 }
    );
  }

  const task = await createTask(body.title.trim());

  return Response.json(task, { status: 201 });
}