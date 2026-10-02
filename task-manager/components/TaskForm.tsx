"use client";

import { useState } from "react";

type TaskFormProps = {
  onAddTask: (title: string) => void;
};

export default function TaskForm({ onAddTask }: TaskFormProps) {
  const [title, setTitle] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      return;
    }

    onAddTask(trimmedTitle);
    setTitle("");
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6 flex gap-2">
      <input
        type="text"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Enter a task..."
        className="flex-1 rounded border px-3 py-2"
      />

      <button
        type="submit"
        className="rounded bg-black px-4 py-2 text-white"
      >
        Add
      </button>
    </form>
  );
}