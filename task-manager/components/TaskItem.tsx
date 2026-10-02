"use client";

import { useRouter } from "next/navigation";
import type { Task } from "@/types/task";

type TaskItemProps = {
  task: Task;
};

export default function TaskItem({
  task,
}: TaskItemProps) {
  const router = useRouter();

  async function handleToggle() {
    const response = await fetch(
      `/api/tasks/${task.id}`,
      {
        method: "PATCH",
      },
    );

    if (!response.ok) {
      console.error(
        "Failed to toggle task",
        await response.text(),
      );

      return;
    }

    router.refresh();
  }

  async function handleDelete() {
    const response = await fetch(
      `/api/tasks/${task.id}`,
      {
        method: "DELETE",
      },
    );

    if (!response.ok) {
      console.error(
        "Failed to delete task",
        await response.text(),
      );

      return;
    }

    router.refresh();
  }

  return (
    <div className="flex items-center gap-3 border-b py-3">
      <input
        type="checkbox"
        checked={task.completed}
        onChange={handleToggle}
      />

      <span
        className={
          task.completed
            ? "flex-1 text-gray-400 line-through"
            : "flex-1"
        }
      >
        {task.title}
      </span>

      <button
        type="button"
        onClick={handleDelete}
        className="text-red-500 hover:text-red-700"
      >
        Delete
      </button>
    </div>
  );
}