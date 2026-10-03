export interface User {
  id: number;
  name: string;
  email: string;
  active: boolean;
}

export type CreateUser = Omit<User, "id">;

export type UpdateUser = Partial<CreateUser>;

export type UserSummary = Pick<User, "id" | "name">;

export function getUserField<K extends keyof User>(
  user: User,
  key: K,
): User[K] {
  return user[key];
}

export function updateUser(
  user: User,
  changes: UpdateUser,
): User {
  return {
    ...user,
    ...changes,
  };
}

export function first<T>(items: T[]): T | undefined {
  return items[0];
}