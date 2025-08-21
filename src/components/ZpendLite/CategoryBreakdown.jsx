import { useZpend } from "../../context/ZpendContext";
import { motion } from "framer-motion";

const colorPalette = [
  "#F9A826", "#36A2EB", "#FF6384", "#4BC0C0", "#9966FF", "#FFCD56", "#FF6B6B",
];

export default function CategoryBreakdown() {
  const { expenses } = useZpend();

  // Group by category and sum amounts
  const categoryTotals = expenses.reduce((acc, { category, amount }) => {
    if (!category) return acc;
    acc[category] = (acc[category] || 0) + Number(amount || 0);
    return acc;
  }, {});

  const categories = Object.keys(categoryTotals);
  const maxAmount = Math.max(...Object.values(categoryTotals), 1); // avoid division by 0

  return (
    <div className="w-full bg-white p-6 rounded-2xl shadow-md">
      <motion.h2
        className="text-2xl font-bold mb-4 text-dark"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        📊 Category Breakdown
      </motion.h2>

      {categories.length === 0 ? (
        <p className="text-dark/60 text-sm">No expenses yet to visualize.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {categories.map((cat, index) => {
            const percent = (categoryTotals[cat] / maxAmount) * 100;
            const color = colorPalette[index % colorPalette.length];

            return (
              <div key={cat} className="flex flex-col gap-1">
                <div className="flex justify-between text-sm font-medium text-dark">
                  <span>{cat}</span>
                  <span>₹{categoryTotals[cat].toFixed(2)}</span>
                </div>
                <div className="w-full h-4 bg-dark/10 rounded-full overflow-hidden">
                  <div
                    className="h-full"
                    style={{
                      width: `${percent}%`,
                      backgroundColor: color,
                      transition: "width 0.5s ease-in-out",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
