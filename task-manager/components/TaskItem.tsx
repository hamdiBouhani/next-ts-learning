"use client";

import { useState } from "react";
import type { Task } from "@/types/task";

type TaskItemProps = {
  task: Task;
};

export default function TaskItem({ task }: TaskItemProps) {
  const [completed, setCompleted] = useState(task.completed);

  function handleChange() {
    setCompleted(!completed);
  }

  return (
    <div className="flex items-center gap-3 border-b py-3">
      <input
        type="checkbox"
        checked={completed}
        onChange={handleChange}
      />

      <span
        className={
          completed
            ? "text-gray-400 line-through"
            : ""
        }
      >
        {task.title}
      </span>
    </div>
  );
}