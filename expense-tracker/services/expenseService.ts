import * as expenseRepository from "@/repositories/expenseRepository";

export async function listExpenses() {
  return expenseRepository.findAllExpenses();
}

export async function getExpense(id: number) {
  return expenseRepository.findExpenseById(id);
}

export async function createExpense(input: {
  amount: number;
  description: string;
  date: Date;
  category:
    | "FOOD"
    | "TRANSPORT"
    | "HOUSING"
    | "SHOPPING"
    | "ENTERTAINMENT"
    | "HEALTH"
    | "OTHER";
}) {
  if (input.amount <= 0) {
    throw new Error("Amount must be greater than zero");
  }

  if (!input.description.trim()) {
    throw new Error("Description is required");
  }

  return expenseRepository.createExpense(input);
}

export async function deleteExpense(id: number) {
  return expenseRepository.deleteExpense(id);
}