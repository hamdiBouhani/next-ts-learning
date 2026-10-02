import TaskForm from "@/components/TaskForm";
import TaskItem from "@/components/TaskItem";
import { getTasks } from "@/lib/tasks";

export default async function Home() {
  const tasks = await getTasks();

  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-xl">
        <h1 className="mb-6 text-3xl font-bold">
          Task Manager
        </h1>

        <TaskForm />

        <div>
          {tasks.length === 0 ? (
            <p className="text-gray-500">
              No tasks yet.
            </p>
          ) : (
            tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
              />
            ))
          )}
        </div>
      </div>
    </main>
  );
}