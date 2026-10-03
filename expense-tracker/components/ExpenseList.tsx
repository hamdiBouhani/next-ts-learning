import { listExpenses } from "@/services/expenseService";

export default async function ExpenseList() {
  const expenses = await listExpenses();

  if (expenses.length === 0) {
    return <p>No expenses yet.</p>;
  }

  return (
    <section>
      <h2>Expenses</h2>

      <ul>
        {expenses.map((expense) => (
          <li key={expense.id}>
            <strong>
              €{expense.amount.toString()}
            </strong>

            {" — "}

            {expense.description}

            {" — "}

            {expense.category}

            {" — "}

            {expense.date.toLocaleDateString()}
          </li>
        ))}
      </ul>
    </section>
  );
}