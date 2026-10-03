import { prisma } from "@/lib/prisma";

export async function findAllExpenses() {
  return prisma.expense.findMany({
    orderBy: {
      date: "desc",
    },
  });
}

export async function findExpenseById(id: number) {
  return prisma.expense.findUnique({
    where: {
      id,
    },
  });
}

export async function createExpense(data: {
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
  return prisma.expense.create({
    data,
  });
}

export async function deleteExpense(id: number) {
  return prisma.expense.delete({
    where: {
      id,
    },
  });
}