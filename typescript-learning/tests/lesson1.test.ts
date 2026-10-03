import { describe, expect, it } from "vitest";

import {
  getUserDisplayName,
  isTaskCompleted,
  type Task,
} from "../src/lesson1";

describe("getUserDisplayName", () => {
  it("returns name and email when email exists", () => {
    const user = {
      id: 1,
      name: "Hamdi",
      email: "hamdi@example.com",
      active: true,
    };

    expect(getUserDisplayName(user)).toBe(
      "Hamdi <hamdi@example.com>",
    );
  });

  it("returns only the name when email does not exist", () => {
    const user = {
      id: 2,
      name: "Alice",
      active: true,
    };

    expect(getUserDisplayName(user)).toBe("Alice");
  });
});

describe("isTaskCompleted", () => {
  it("returns true for completed tasks", () => {
    const task: Task = {
      id: 1,
      title: "Learn TypeScript",
      status: "done",
    };

    expect(isTaskCompleted(task)).toBe(true);
  });

  it("returns false for unfinished tasks", () => {
    const task: Task = {
      id: 2,
      title: "Learn TypeScript",
      status: "in_progress",
    };

    expect(isTaskCompleted(task)).toBe(false);
  });
});