"use client";

import { FormEvent, useState } from "react";

const categories = [
  "FOOD",
  "TRANSPORT",
  "HOUSING",
  "SHOPPING",
  "ENTERTAINMENT",
  "HEALTH",
  "OTHER",
] as const;

type ExpenseCategory = (typeof categories)[number];

export default function ExpenseForm() {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState<ExpenseCategory>("FOOD");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: Number(amount),
          description,
          date,
          category,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create expense");
      }

      // Clear the form after successful creation.
      setAmount("");
      setDescription("");
      setDate("");
      setCategory("FOOD");
    } catch (error) {
      console.error(error);
      setError("Could not create expense");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="amount">Amount</label>

        <input
          id="amount"
          type="number"
          step="0.01"
          min="0"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="description">Description</label>

        <input
          id="description"
          type="text"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="date">Date</label>

        <input
          id="date"
          type="date"
          value={date}
          onChange={(event) => setDate(event.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="category">Category</label>

        <select
          id="category"
          value={category}
          onChange={(event) =>
            setCategory(event.target.value as ExpenseCategory)
          }
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {error && <p>{error}</p>}

      <button type="submit" disabled={loading}>
        {loading ? "Creating..." : "Add Expense"}
      </button>
    </form>
  );
}