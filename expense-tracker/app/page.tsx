import ExpenseForm from "@/components/ExpenseForm";
import ExpenseList from "@/components/ExpenseList";

export default function ExpensesPage() {
  return (
    <main>
      <h1>Expense Tracker</h1>

      <ExpenseForm />

      <hr />

      <ExpenseList />
    </main>
  );
}