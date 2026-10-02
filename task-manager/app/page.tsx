"use client";

import { useState } from "react";
import TaskForm from "@/components/TaskForm";
import TaskItem from "@/components/TaskItem";
import type { Task } from "@/types/task";

const initialTasks: Task[] = [
  {
    id: 1,
    title: "Learn TypeScript",
    completed: true,
  },
  {
    id: 2,
    title: "Learn React",
    completed: false,
  },
  {
    id: 3,
    title: "Learn Next.js",
    completed: false,
  },
];

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  function handleAddTask(title: string) {
    const newTask: Task = {
      id: Date.now(),
      title,
      completed: false,
    };

    setTasks((previousTasks) => [
      ...previousTasks,
      newTask,
    ]);
  }

  return (
    <main className="min-h-screen p-8">
      <h1 className="mb-6 text-3xl font-bold">
        Task Manager
      </h1>

      <div className="max-w-md">
        <TaskForm onAddTask={handleAddTask} />

        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
          />
        ))}
      </div>
    </main>
  );
}