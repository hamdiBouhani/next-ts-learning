import { describe, expect, it } from "vitest";

import {
  first,
  getUserField,
  updateUser,
  type User,
} from "../src/lesson2";

const user: User = {
  id: 1,
  name: "Hamdi",
  email: "hamdi@example.com",
  active: true,
};

describe("getUserField", () => {
  it("gets a string field", () => {
    expect(getUserField(user, "name")).toBe("Hamdi");
  });

  it("gets a number field", () => {
    expect(getUserField(user, "id")).toBe(1);
  });
});

describe("updateUser", () => {
  it("updates selected fields", () => {
    const updated = updateUser(user, {
      name: "Alice",
      active: false,
    });

    expect(updated).toEqual({
      id: 1,
      name: "Alice",
      email: "hamdi@example.com",
      active: false,
    });
  });

  it("does not mutate the original user", () => {
    updateUser(user, {
      name: "Alice",
    });

    expect(user.name).toBe("Hamdi");
  });
});

describe("first", () => {
  it("returns the first element", () => {
    expect(first([10, 20, 30])).toBe(10);
  });

  it("works with strings", () => {
    expect(first(["a", "b", "c"])).toBe("a");
  });

  it("returns undefined for an empty array", () => {
    expect(first([])).toBeUndefined();
  });
});