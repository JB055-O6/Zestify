import { useZpend } from "../../context/ZpendContext";
import { motion } from "framer-motion";
import dayjs from "dayjs";

export default function ExpenseHistory() {
  const { expenses, loading } = useZpend();

  const formatDate = (date) => {
    return dayjs(date).format("MMM D, YYYY");
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-8">
      <h2 className="text-3xl font-cartoon text-dark text-center mb-6">
        🧾 Expense History
      </h2>

      {loading ? (
        <p className="text-center text-dark/70">⏳ Loading your expense history...</p>
      ) : expenses.length === 0 ? (
        <p className="text-center text-dark/70">No expenses logged yet. Start tracking now! 💰</p>
      ) : (
        <div className="flex flex-col gap-3">
          {expenses
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) // Recent first
            .map((exp, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl shadow p-4 border border-dark/10"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="flex justify-between items-center">
                  <div className="text-lg font-semibold text-dark">
                    ₹{exp.amount.toFixed(2)} - {exp.category}
                  </div>
                  <div className="text-sm text-dark/60">
                    {formatDate(exp.created_at)}
                  </div>
                </div>
                {exp.note && (
                  <p className="text-sm mt-1 text-dark/80 italic">📝 {exp.note}</p>
                )}
              </motion.div>
            ))}
        </div>
      )}
    </div>
  );
}
