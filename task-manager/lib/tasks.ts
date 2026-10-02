import "server-only";

import db from "@/lib/db";
import type { Task } from "@/types/task";

type TaskRow = {
  id: number;
  title: string;
  completed: number;
};

function toTask(row: TaskRow): Task {
  return {
    id: row.id,
    title: row.title,
    completed: row.completed === 1,
  };
}

export function getTasks(): Task[] {
  const rows = db
    .prepare(
      `
      SELECT id, title, completed
      FROM tasks
      ORDER BY id ASC
      `,
    )
    .all() as TaskRow[];

  return rows.map(toTask);
}

export function createTask(title: string): Task {
  const result = db
    .prepare(
      `
      INSERT INTO tasks (title, completed)
      VALUES (?, 0)
      `,
    )
    .run(title);

  const row = db
    .prepare(
      `
      SELECT id, title, completed
      FROM tasks
      WHERE id = ?
      `,
    )
    .get(result.lastInsertRowid) as TaskRow;

  return toTask(row);
}

export function toggleTask(id: number): Task | null {
  const result = db
    .prepare(
      `
      UPDATE tasks
      SET completed = CASE
        WHEN completed = 0 THEN 1
        ELSE 0
      END
      WHERE id = ?
      `,
    )
    .run(id);

  if (result.changes === 0) {
    return null;
  }

  const row = db
    .prepare(
      `
      SELECT id, title, completed
      FROM tasks
      WHERE id = ?
      `,
    )
    .get(id) as TaskRow;

  return toTask(row);
}

export function deleteTask(id: number): boolean {
  const result = db
    .prepare(
      `
      DELETE FROM tasks
      WHERE id = ?
      `,
    )
    .run(id);

  return result.changes > 0;
}