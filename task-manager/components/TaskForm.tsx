"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function TaskForm() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle || loading) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: trimmedTitle,
        }),
      });

      if (!response.ok) {
        console.error(
          "Failed to create task",
          await response.text(),
        );

        return;
      }

      setTitle("");

      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 flex gap-2"
    >
      <input
        type="text"
        value={title}
        onChange={(event) =>
          setTitle(event.target.value)
        }
        placeholder="Enter a task..."
        disabled={loading}
        className="flex-1 rounded border px-3 py-2"
      />

      <button
        type="submit"
        disabled={loading}
        className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
      >
        {loading ? "Adding..." : "Add"}
      </button>
    </form>
  );
}