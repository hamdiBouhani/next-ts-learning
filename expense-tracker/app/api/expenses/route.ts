import { NextRequest, NextResponse } from "next/server";

import {
  createExpense,
  listExpenses,
} from "@/services/expenseService";

export async function GET() {
  const expenses = await listExpenses();

  return NextResponse.json(expenses);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const expense = await createExpense({
      amount: Number(body.amount),
      description: body.description,
      date: new Date(body.date),
      category: body.category,
    });

    return NextResponse.json(expense, { status: 201 });
  } catch (error) {
    console.error("Failed to create expense:", error);

    return NextResponse.json(
      { error: "Failed to create expense" },
      { status: 400 },
    );
  }
}