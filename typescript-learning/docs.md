Exactly. Let’s continue with **Lesson 2: Advanced TypeScript Types**.

Since you already know Go well, I’ll explain the TypeScript concepts by comparing them to **Go interfaces, generics, maps, and error handling**.

## Lesson 2 — Types That Matter in Real Projects

We’ll cover:

1. `interface`
2. `type` vs `interface`
3. Generics
4. `keyof`
5. `typeof`
6. Utility types
   - `Partial<T>`
   - `Pick<T, K>`
   - `Omit<T, K>`
   - `Record<K, T>`
   - `Readonly<T>`
7. `unknown`
8. `never`
9. Type narrowing
10. A Go-like `Result<T, E>` pattern
11. Unit tests with Vitest

---

# 1. `interface`

An interface describes the shape of an object.

```ts
interface User {
  id: number;
  name: string;
  email: string;
}
```

Then:

```ts
const user: User = {
  id: 1,
  name: "Hamdi",
  email: "hamdi@example.com",
};
```

This is somewhat similar to a Go struct:

```go
type User struct {
    ID    int
    Name  string
    Email string
}
```

But TypeScript interfaces are much more flexible.

For example:

```ts
interface User {
  id: number;
  name: string;
}

interface Admin extends User {
  permissions: string[];
}
```

Now:

```ts
const admin: Admin = {
  id: 1,
  name: "Hamdi",
  permissions: ["users:read", "users:write"],
};
```

Think:

```text
interface User
      ↓
interface Admin extends User
      ↓
Admin = User + permissions
```

---

# 2. `type` vs `interface`

You will see both everywhere.

### `type`

```ts
type User = {
  id: number;
  name: string;
};
```

### `interface`

```ts
interface User {
  id: number;
  name: string;
}
```

For simple objects, either is fine.

But `type` can represent things that interfaces can't express as conveniently:

```ts
type Status = "pending" | "running" | "completed";
```

Or:

```ts
type ID = string | number;
```

Or:

```ts
type Result<T> =
  | { success: true; data: T }
  | { success: false; error: string };
```

A useful rule:

```text
Object contract       → interface
Union / composition   → type
```

In real TypeScript projects you'll encounter both.

---

# 3. Generics

This is where things start feeling familiar if you know Go generics.

Go:

```go
func First[T any](items []T) T {
    return items[0]
}
```

TypeScript:

```ts
function first<T>(items: T[]): T {
  return items[0];
}
```

Usage:

```ts
const numbers = first([1, 2, 3]);

const names = first(["Alice", "Bob"]);
```

TypeScript infers:

```text
numbers → number
names   → string
```

You can also explicitly provide the type:

```ts
const value = first<number>([1, 2, 3]);
```

---

## Generic API response

This is extremely common in backend TypeScript.

```ts
interface ApiResponse<T> {
  data: T;
  status: number;
}
```

Then:

```ts
type UserResponse = ApiResponse<User>;
```

or:

```ts
type TaskResponse = ApiResponse<Task>;
```

You can create:

```ts
const response: ApiResponse<User> = {
  data: {
    id: 1,
    name: "Hamdi",
  },
  status: 200,
};
```

This is conceptually similar to:

```go
type ApiResponse[T any] struct {
    Data   T
    Status int
}
```

---

# 4. `keyof`

This is one of the biggest differences from Go.

Suppose:

```ts
type User = {
  id: number;
  name: string;
  email: string;
};
```

You can get the keys:

```ts
type UserKey = keyof User;
```

`UserKey` becomes:

```ts
"id" | "name" | "email"
```

So:

```ts
function getValue(user: User, key: keyof User) {
  return user[key];
}
```

Now:

```ts
getValue(user, "name");  // OK
getValue(user, "email"); // OK
getValue(user, "id");    // OK
```

But:

```ts
getValue(user, "password");
```

produces a compile-time error.

This is very useful for generic functions.

---

# 5. `typeof`

Don't confuse TypeScript's `typeof` with JavaScript's runtime `typeof`.

For example:

```ts
const config = {
  host: "localhost",
  port: 8080,
};
```

We can create a type from the value:

```ts
type Config = typeof config;
```

So TypeScript effectively gets:

```ts
type Config = {
  host: string;
  port: number;
};
```

This is useful when you have a constant configuration object.

```ts
const defaultConfig = {
  retries: 3,
  timeout: 5000,
};

type Config = typeof defaultConfig;
```

Now:

```ts
const config: Config = {
  retries: 5,
  timeout: 10000,
};
```

---

# 6. Utility Types

These are used **everywhere** in professional TypeScript.

Suppose:

```ts
type User = {
  id: number;
  name: string;
  email: string;
  active: boolean;
};
```

## `Partial<T>`

Makes everything optional.

```ts
type UpdateUser = Partial<User>;
```

Equivalent to:

```ts
type UpdateUser = {
  id?: number;
  name?: string;
  email?: string;
  active?: boolean;
};
```

Very useful for PATCH APIs.

```ts
function updateUser(
  id: number,
  changes: Partial<User>,
) {
  // ...
}
```

You can now:

```ts
updateUser(1, {
  name: "New Name",
});
```

---

# 7. `Pick<T, K>`

Select specific fields.

```ts
type UserSummary = Pick<User, "id" | "name">;
```

Equivalent to:

```ts
type UserSummary = {
  id: number;
  name: string;
};
```

Very useful for DTOs.

---

# 8. `Omit<T, K>`

Remove fields.

```ts
type CreateUser = Omit<User, "id">;
```

Result:

```ts
type CreateUser = {
  name: string;
  email: string;
  active: boolean;
};
```

This is extremely common:

```ts
type UserFromDatabase = {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
};

type CreateUser = Omit<UserFromDatabase, "id" | "createdAt">;
```

---

# 9. `Record<K, T>`

This represents a dictionary/map.

In Go you might write:

```go
map[string]int
```

TypeScript:

```ts
Record<string, number>
```

Example:

```ts
const scores: Record<string, number> = {
  alice: 100,
  bob: 90,
};
```

You can also restrict the keys:

```ts
type Environment = "dev" | "staging" | "production";

const servers: Record<Environment, string> = {
  dev: "dev.example.com",
  staging: "staging.example.com",
  production: "example.com",
};
```

TypeScript will make sure **all three keys exist**.

---

# 10. `Readonly<T>`

Makes properties immutable from the TypeScript type system.

```ts
type User = {
  id: number;
  name: string;
};

const user: Readonly<User> = {
  id: 1,
  name: "Hamdi",
};
```

This won't compile:

```ts
user.name = "Alice";
```

Think of it somewhat like communicating immutability expectations through the type system.

---

# 11. `unknown`

This is extremely important.

Avoid:

```ts
function parse(data: any) {
  return data;
}
```

`any` essentially disables type checking.

Instead:

```ts
function parse(data: unknown) {
  return data;
}
```

Now TypeScript forces you to check the value before using it.

For example:

```ts
function printName(value: unknown) {
  if (
    typeof value === "object" &&
    value !== null &&
    "name" in value
  ) {
    console.log(value.name);
  }
}
```

`unknown` means:

> "I don't know what this is yet."

`any` means:

> "Don't check this."

For production TypeScript, prefer `unknown` when the type really isn't known.

---

# 12. `never`

`never` means:

> This code can never produce a value.

Example:

```ts
function fail(message: string): never {
  throw new Error(message);
}
```

Another important use is exhaustive checking.

```ts
type Status =
  | "todo"
  | "in_progress"
  | "done";
```

Then:

```ts
function statusMessage(status: Status): string {
  switch (status) {
    case "todo":
      return "Not started";

    case "in_progress":
      return "Working";

    case "done":
      return "Completed";
  }
}
```

We can make the compiler protect us if a new status gets added:

```ts
function assertNever(value: never): never {
  throw new Error(`Unexpected value: ${value}`);
}
```

Then:

```ts
function statusMessage(status: Status): string {
  switch (status) {
    case "todo":
      return "Not started";

    case "in_progress":
      return "Working";

    case "done":
      return "Completed";

    default:
      return assertNever(status);
  }
}
```

Later, if we add:

```ts
type Status =
  | "todo"
  | "in_progress"
  | "done"
  | "cancelled";
```

TypeScript will tell us that the switch isn't handling `"cancelled"`.

This pattern is very useful in backend code.

---

# 13. Type Narrowing

Consider:

```ts
function printId(id: string | number) {
  console.log(id);
}
```

We don't know whether `id` is a string or number.

We can narrow it:

```ts
function printId(id: string | number) {
  if (typeof id === "string") {
    console.log(id.toUpperCase());
  } else {
    console.log(id.toFixed(2));
  }
}
```

TypeScript understands:

```text
if string
   ↓
id = string

else
   ↓
id = number
```

This is called **type narrowing**.

---

# 14. Discriminated Unions

This is one of the most useful TypeScript patterns for backend development.

```ts
type Result<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: string;
    };
```

Now:

```ts
function getUser(): Result<User> {
  return {
    success: true,
    data: {
      id: 1,
      name: "Hamdi",
      email: "hamdi@example.com",
    },
  };
}
```

We can safely use it:

```ts
const result = getUser();

if (result.success) {
  console.log(result.data.name);
} else {
  console.error(result.error);
}
```

TypeScript understands that:

```text
success === true
       ↓
data exists

success === false
       ↓
error exists
```

This pattern is particularly interesting coming from Go because it gives you a structured alternative to:

```go
value, err := getUser()
```

---








# 16. Tests

Run:

```powershell
npm run typecheck
```

then:

```powershell
npm test
```

---

## What I want you to understand from Lesson 2

Coming from Go, focus especially on this mapping:

| TypeScript | Go concept |
|---|---|
| `interface` | interface / struct-like contract |
| `type` | named type / type composition |
| `T` | generic type parameter |
| `keyof T` | roughly compile-time set of struct keys |
| `Record<K,V>` | `map[K]V` |
| `Partial<T>` | optional version of a struct |
| `Pick<T,K>` | selected struct fields |
| `Omit<T,K>` | struct without selected fields |
| `unknown` | safely unknown value |
| `never` | impossible/unreachable value |
| discriminated union | tagged union / sum type |
| type narrowing | compiler-assisted runtime checks |

### The three concepts I'd practice hardest

```ts
K extends keyof User
```

```ts
Partial<User>
```

and:

```ts
type Result<T> =
  | { success: true; data: T }
  | { success: false; error: string };
```


### 1. `K extends keyof User`

Useful for **generic repository/service functions**:

```ts
function getField<T, K extends keyof T>(
  object: T,
  key: K,
): T[K] {
  return object[key];
}
```

For example:

```ts
getField(user, "name");  // string
getField(user, "id");    // number
```

This gives us type-safe generic code without falling back to `any`.

---

### 2. `Partial<T>`

Very useful for **PATCH/update operations**:

```ts
type Task = {
  id: number;
  title: string;
  description: string;
  completed: boolean;
};
```

Instead of creating a separate type manually:

```ts
type UpdateTask = {
  title?: string;
  description?: string;
  completed?: boolean;
};
```

we can write:

```ts
type UpdateTask = Partial<Omit<Task, "id">>;
```

Then:

```ts
updateTask(1, {
  completed: true,
});
```

---

### 3. `Result<T>`

Useful for **service/repository error handling**:

```ts
type Result<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: string;
    };
```

A service could return:

```ts
async function findTask(id: number): Promise<Result<Task>> {
  // ...
}
```

Then the caller gets safe narrowing:

```ts
const result = await findTask(1);

if (result.success) {
  console.log(result.data.title);
} else {
  console.error(result.error);
}
```

---

## How the final architecture will look

We'll gradually build something like:

```text
                    HTTP
                     │
                     ▼
              ┌─────────────┐
              │   Fastify   │
              │ Controllers │
              └──────┬──────┘
                     │
                     ▼
              ┌─────────────┐
              │    Zod      │
              │ Validation  │
              └──────┬──────┘
                     │
                     ▼
              ┌─────────────┐
              │   Service   │
              │   Layer     │
              └──────┬──────┘
                     │
                     ▼
              ┌─────────────┐
              │ Repository  │
              │   Prisma    │
              └──────┬──────┘
                     │
                     ▼
                 PostgreSQL
```

And Vitest will test each layer.

We'll eventually have endpoints like:

```text
POST   /tasks
GET    /tasks
GET    /tasks/:id
PATCH  /tasks/:id
DELETE /tasks/:id
```

with types flowing through the whole application.

The next important step is **Zod**, because it teaches a crucial TypeScript lesson:

> **TypeScript types disappear at runtime.**

That's why this:

```ts
type CreateTask = {
  title: string;
};
```

cannot protect an HTTP API from:

```json
{
  "title": 123
}
```


## TypeScript types vs runtime validation

Consider:

```ts
type CreateTask = {
  title: string;
  description?: string;
};
```

This protects you **while writing TypeScript**:

```ts
const task: CreateTask = {
  title: "Learn TypeScript",
};
```

But TypeScript disappears when your program runs.

Imagine an HTTP request:

```json
{
  "title": 123
}
```

Your server receives JSON at runtime. TypeScript doesn't automatically validate it.

That's where **Zod** comes in.

---

# 1. Create a Zod schema

Install it:

```powershell
npm install zod
```

Then:

```ts
import { z } from "zod";

const createTaskSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
});
```

Now we have **runtime validation**.

```ts
const result = createTaskSchema.safeParse({
  title: "Learn TypeScript",
});

console.log(result.success);
```

Output:

```text
true
```

But:

```ts
const result = createTaskSchema.safeParse({
  title: 123,
});
```

gives:

```text
false
```

Zod actually checks the value at runtime.

---

# 2. The really nice part: infer the TypeScript type

We don't need to write this manually:

```ts
type CreateTask = {
  title: string;
  description?: string;
};
```

Instead:

```ts
const createTaskSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
});

type CreateTask = z.infer<typeof createTaskSchema>;
```

TypeScript generates:

```ts
type CreateTask = {
  title: string;
  description?: string;
};
```

So we have:

```text
             Zod Schema
                  │
          ┌───────┴───────┐
          │               │
          ▼               ▼
     Runtime          TypeScript
     validation          type
          │               │
          ▼               ▼
      safeParse       z.infer<T>
```

**One source of truth.**

That's one of the biggest reasons Zod is popular.

---

# 3. A more realistic schema

Let's make our Task API schema.

```ts
import { z } from "zod";

export const createTaskSchema = z.object({
  title: z
    .string()
    .min(1)
    .max(200),

  description: z
    .string()
    .max(2000)
    .optional(),
});

export type CreateTask = z.infer<typeof createTaskSchema>;
```

Now:

```ts
const input = {
  title: "Learn TypeScript",
  description: "Study Zod",
};

const result = createTaskSchema.safeParse(input);
```

If valid:

```ts
if (result.success) {
  const task: CreateTask = result.data;

  console.log(task.title);
}
```

Notice the important part:

```ts
result.data
```

is already typed as:

```ts
CreateTask
```

---

# 4. `parse()` vs `safeParse()`

Zod gives you two common approaches.

### `parse`

```ts
const task = createTaskSchema.parse(input);
```

If invalid, Zod throws an exception.

```text
valid   → returns data
invalid → throws ZodError
```

### `safeParse`

```ts
const result = createTaskSchema.safeParse(input);
```

If invalid:

```ts
{
  success: false,
  error: ZodError
}
```

If valid:

```ts
{
  success: true,
  data: ...
}
```

This fits beautifully with the discriminated-union pattern we just learned.

```ts
if (result.success) {
  // result.data
} else {
  // result.error
}
```

TypeScript automatically narrows the type.

---

# 5. Zod + `Partial`

Remember `Partial<T>`?

We can combine the concepts.

Create:

```ts
export const createTaskSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  completed: z.boolean().default(false),
});
```

For update:

```ts
export const updateTaskSchema =
  createTaskSchema.partial();
```

Now all fields become optional.

For example:

```ts
updateTaskSchema.parse({
  title: "New title",
});
```

is valid.

So our API can have:

```text
POST /tasks

{
  "title": "Learn TypeScript",
  "description": "Study Zod"
}
```

and:

```text
PATCH /tasks/1

{
  "completed": true
}
```

---

# 6. Zod can validate more than primitive types

For example:

```ts
const userSchema = z.object({
  id: z.number().int().positive(),

  name: z
    .string()
    .min(2)
    .max(100),

  email: z.email(),

  age: z
    .number()
    .int()
    .min(18),

  active: z.boolean(),
});
```

We can also have arrays:

```ts
const tagsSchema = z.array(z.string());
```

Enums:

```ts
const statusSchema = z.enum([
  "todo",
  "in_progress",
  "done",
]);
```

Objects:

```ts
const taskSchema = z.object({
  id: z.number(),
  title: z.string(),
  status: statusSchema,
});
```

---

# 7. Nested schemas

Real applications often have nested data.

```ts
const addressSchema = z.object({
  city: z.string(),
  country: z.string(),
});

const userSchema = z.object({
  name: z.string(),
  email: z.email(),
  address: addressSchema,
});
```

Then:

```ts
type User = z.infer<typeof userSchema>;
```

becomes approximately:

```ts
type User = {
  name: string;
  email: string;
  address: {
    city: string;
    country: string;
  };
};
```

---

# 8. Zod is especially useful at system boundaries

This is the mental model I want you to remember:

```text
                 UNTRUSTED
                    │
                    ▼
            ┌───────────────┐
            │ HTTP request  │
            │ JSON / input  │
            └───────┬───────┘
                    │
                    ▼
                 ZOD
              validation
                    │
             ┌──────┴──────┐
             │             │
          invalid        valid
             │             │
             ▼             ▼
         HTTP 400       Service
                           │
                           ▼
                       Database
```

The boundary is important.

Don't blindly trust:

- HTTP request bodies
- query parameters
- URL parameters
- environment variables
- external API responses
- configuration
- message queues

Validate data when it enters your application.

---

# 9. Exercise

Let's make this a small exercise before Fastify.

Create:

```text
src/
└── task-schema.ts

tests/
└── task-schema.test.ts
```

Your schema should support:

```ts
{
  title: string;
  description?: string;
  priority: "low" | "medium" | "high";
  completed: boolean;
}
```

Requirements:

```text
title
  required
  1–200 characters

description
  optional
  maximum 2000 characters

priority
  required
  "low" | "medium" | "high"

completed
  boolean
  default false
```

Then infer:

```ts
type CreateTask = z.infer<typeof createTaskSchema>;
```

And write tests for:

1. Valid task
2. Missing title
3. Empty title
4. Invalid priority
5. Invalid `completed`
6. Description too long
7. `completed` defaults to `false`

### Expected architecture

```text
task-schema.ts
       │
       ├── createTaskSchema
       │
       ├── updateTaskSchema
       │
       └── CreateTask / UpdateTask
                    │
                    ▼
             Vitest tests
```

Yes. Now we move from **TypeScript types + Zod** into an actual backend.

# Lesson 4 — Fastify + Zod

We'll build:

```text
POST /tasks
```

and the flow will be:

```text
HTTP Request
     │
     ▼
  Fastify
     │
     ▼
   Zod
 validation
     │
     ├── invalid → 400
     │
     ▼
  Controller
     │
     ▼
  Response
```

We'll deliberately **not add Prisma/PostgreSQL yet**. First we'll understand Fastify and HTTP handlers.

---

## 1. Install Fastify

```powershell
npm install fastify zod
npm install -D @types/node tsx typescript vitest
```

Your project:

```text
typescript-learning/
├── src/
│   ├── server.ts
│   └── task-schema.ts
├── tests/
│   └── server.test.ts
├── package.json
└── tsconfig.json
```

---

# 2. Create the Zod schema

`src/task-schema.ts`

```ts
import { z } from "zod";

export const createTaskSchema = z.object({
  title: z
    .string()
    .min(1)
    .max(200),

  description: z
    .string()
    .max(2000)
    .optional(),

  priority: z.enum([
    "low",
    "medium",
    "high",
  ]),

  completed: z
    .boolean()
    .default(false),
});

export type CreateTask = z.infer<typeof createTaskSchema>;
```

Now our TypeScript type comes directly from Zod:

```ts
type CreateTask = z.infer<typeof createTaskSchema>;
```

---

# 3. Create the Fastify server

`src/server.ts`

```ts
import Fastify from "fastify";
import {
  createTaskSchema,
  type CreateTask,
} from "./task-schema.js";

export function buildServer() {
  const app = Fastify({
    logger: true,
  });

  app.post("/tasks", async (request, reply) => {
    const result = createTaskSchema.safeParse(request.body);

    if (!result.success) {
      return reply.status(400).send({
        error: "Invalid request",
        details: result.error.issues,
      });
    }

    const task: CreateTask = result.data;

    return reply.status(201).send({
      id: 1,
      ...task,
    });
  });

  return app;
}
```

There are several important things happening here.

---

# 4. `request.body`

Fastify gives us the HTTP request body:

```ts
request.body
```

But notice something important:

```ts
request.body
```

isn't magically a `CreateTask`.

The client controls it.

For example, somebody could send:

```json
{
  "title": 123,
  "priority": "banana"
}
```

So we validate it:

```ts
const result = createTaskSchema.safeParse(
  request.body,
);
```

---

# 5. Zod narrows the data

Before validation:

```ts
request.body
```

is untrusted data.

After:

```ts
if (!result.success) {
  // invalid
}
```

the successful branch gives us:

```ts
result.data
```

with the inferred type:

```ts
CreateTask
```

Therefore:

```ts
const task: CreateTask = result.data;
```

is safe.

---

# 6. Start the server

Add this to `src/server.ts`:

```ts
if (import.meta.url === `file://${process.argv[1]}`) {
  const app = buildServer();

  await app.listen({
    port: 3000,
    host: "0.0.0.0",
  });
}
```

So the complete file becomes:

```ts
import Fastify from "fastify";

import {
  createTaskSchema,
  type CreateTask,
} from "./task-schema.js";

export function buildServer() {
  const app = Fastify({
    logger: true,
  });

  app.post("/tasks", async (request, reply) => {
    const result = createTaskSchema.safeParse(
      request.body,
    );

    if (!result.success) {
      return reply.status(400).send({
        error: "Invalid request",
        details: result.error.issues,
      });
    }

    const task: CreateTask = result.data;

    return reply.status(201).send({
      id: 1,
      ...task,
    });
  });

  return app;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const app = buildServer();

  await app.listen({
    port: 3000,
    host: "0.0.0.0",
  });
}
```

Run:

```powershell
npx tsx src/server.ts
```

You should see Fastify listening on port `3000`.

---

# 7. Test with PowerShell

You can use `Invoke-RestMethod`.

```powershell
Invoke-RestMethod `
  -Method POST `
  -Uri http://localhost:3000/tasks `
  -ContentType "application/json" `
  -Body '{"title":"Learn Fastify","priority":"high"}'
```

Expected response:

```json
{
  "id": 1,
  "title": "Learn Fastify",
  "priority": "high",
  "completed": false
}
```

Notice:

```json
"completed": false
```

We didn't send it.

Zod applied:

```ts
.default(false)
```

---

# 8. Try invalid data

Send:

```powershell
Invoke-RestMethod `
  -Method POST `
  -Uri http://localhost:3000/tasks `
  -ContentType "application/json" `
  -Body '{"title":123,"priority":"banana"}'
```

Fastify should return HTTP `400`.

Something similar to:

```json
{
  "error": "Invalid request",
  "details": [
    {
      "code": "invalid_type",
      "path": ["title"]
    },
    {
      "code": "invalid_value",
      "path": ["priority"]
    }
  ]
}
```

The exact Zod error structure can vary by Zod version.

---

# 9. Now the important part: testing Fastify

We don't actually need to start a real server for our tests.

Fastify has:

```ts
app.inject()
```

This lets us send HTTP requests directly to the application.

This is extremely useful.

Create:

`tests/server.test.ts`

```ts
import { describe, expect, it } from "vitest";

import { buildServer } from "../src/server.js";

describe("POST /tasks", () => {
  it("creates a task", async () => {
    const app = buildServer();

    const response = await app.inject({
      method: "POST",
      url: "/tasks",
      payload: {
        title: "Learn Fastify",
        priority: "high",
      },
    });

    expect(response.statusCode).toBe(201);

    expect(response.json()).toEqual({
      id: 1,
      title: "Learn Fastify",
      priority: "high",
      completed: false,
    });

    await app.close();
  });

  it("rejects invalid input", async () => {
    const app = buildServer();

    const response = await app.inject({
      method: "POST",
      url: "/tasks",
      payload: {
        title: 123,
        priority: "invalid",
      },
    });

    expect(response.statusCode).toBe(400);

    const body = response.json();

    expect(body.error).toBe("Invalid request");

    await app.close();
  });
});
```

Run:

```powershell
npm test
```

You now have a real HTTP endpoint tested without opening a port.

---

# 10. Why `buildServer()` is important

You might wonder why we wrote:

```ts
export function buildServer() {
  const app = Fastify();

  // routes...

  return app;
}
```

instead of:

```ts
const app = Fastify();

app.listen(...);
```

The factory pattern gives us:

```text
              buildServer()
                  │
          ┌───────┴───────┐
          ▼               ▼
     Production        Vitest
          │               │
       listen()        inject()
```

This is a very common backend testing pattern.

You can create a completely isolated Fastify instance for every test.

---

# 11. Compare this to your Go experience

The Fastify test:

```ts
const response = await app.inject({
  method: "POST",
  url: "/tasks",
  payload: {
    title: "Learn Fastify",
    priority: "high",
  },
});
```

is conceptually similar to testing an HTTP handler in Go with:

```go
req := httptest.NewRequest(...)
rec := httptest.NewRecorder(...)

handler.ServeHTTP(rec, req)
```

The philosophy is the same:

```text
Don't start the whole application.

Create the HTTP application.

Send a fake request.

Inspect the response.
```

---

# 12. Our current architecture

We're starting to get a proper backend:

```text
                    POST /tasks
                         │
                         ▼
                    ┌─────────┐
                    │ Fastify │
                    └────┬────┘
                         │
                         ▼
                  ┌─────────────┐
                  │    Zod      │
                  │  Validation │
                  └──────┬──────┘
                         │
                    valid │ invalid
                         │    │
                         ▼    ▼
                    Controller 400
                         │
                         ▼
                       Task
```

But we're deliberately missing:

```text
Service
Repository
Database
```

That's the next architectural step.

---

## What you've learned so far

You now have the beginning of a real TypeScript backend:

```text
TypeScript
    │
    ├── interfaces / types
    ├── generics
    ├── keyof
    ├── utility types
    ├── discriminated unions
    └── type narrowing
          │
          ▼
        Zod
          │
          ├── runtime validation
          └── type inference
                │
                ▼
             Fastify
                │
                └── HTTP API
                      │
                      ▼
                    Vitest
                      │
                      └── HTTP integration tests
```