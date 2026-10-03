export type User = {
  id: number;
  name: string;
  email?: string;
  active: boolean;
};

export const user1: User = {
  id: 1,
  name: "Hamdi",
  email: "hamdi@example.com",
  active: true,
};

export const user2: User = {
  id: 2,
  name: "Alice",
  active: false,
};

export function getUserDisplayName(user: User): string {
  if (user.email) {
    return `${user.name} <${user.email}>`;
  }

  return user.name;
}

export type TaskStatus = "todo" | "in_progress" | "done";

export type Task = {
  id: number;
  title: string;
  status: TaskStatus;
};

export const tasks: Task[] = [
  {
    id: 1,
    title: "Learn TypeScript",
    status: "in_progress",
  },
  {
    id: 2,
    title: "Write unit tests",
    status: "todo",
  },
  {
    id: 3,
    title: "Build Task API",
    status: "done",
  },
];

export function isTaskCompleted(task: Task): boolean {
  return task.status === "done";
}