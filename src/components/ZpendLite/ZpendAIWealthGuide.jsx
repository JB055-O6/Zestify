// src/components/ZpendLite/ZpendAIWealthGuide.jsx

import { useEffect, useState } from "react";
import { useZpend } from "../../context/ZpendContext";
import { motion } from "framer-motion";

export default function ZpendAIWealthGuide() {
  const {
    income,
    savingsGoal,
    essentials,
    setSavingsGoal,
    saveProfile,
  } = useZpend();

  const [summary, setSummary] = useState("");
  const [forecast, setForecast] = useState("");
  const [suggestedGoal, setSuggestedGoal] = useState(null);
  const [categoryBreakdown, setCategoryBreakdown] = useState([]);
  const [insights, setInsights] = useState([]);

  useEffect(() => {
    if (!income || essentials.length === 0) return;

    const today = new Date().toISOString().split("T")[0];
    const spentPerCategory = {};
    const plannedPerCategory = {};

    let totalSpentToday = 0;
    let totalSpent = 0;
    let totalPlanned = 0;

    const seenCategories = new Set();

    for (let item of essentials) {
      const cat = item.category?.toLowerCase() || "uncategorized";
      const amt = Number(item.amount || 0);
      const plan = Number(item.monthly_planned || 0);
      const isToday = item.date === today;

      // Spend accumulation
      spentPerCategory[cat] = (spentPerCategory[cat] || 0) + amt;
      totalSpent += amt;
      if (isToday) totalSpentToday += amt;

      // Plan (take latest available)
      if (!seenCategories.has(cat)) {
        plannedPerCategory[cat] = plan;
        seenCategories.add(cat);
      }
    }

    totalPlanned = Object.values(plannedPerCategory).reduce((a, b) => a + b, 0);
    const available = income - savingsGoal;
    const projectedSavings = income - totalSpent;
    const predictedSpend = totalSpent;

    const newGoal = Math.max(Math.floor(projectedSavings * 0.9), 0);

    const generated = [];

    if (totalPlanned > available) {
      generated.push({
        type: "⚠️ Budget Overplanned",
        message: `You've planned ₹${totalPlanned} for essentials, but only ₹${available} is available after savings. Adjust your expectations or goals.`,
      });
    }

    if (totalSpent > totalPlanned) {
      generated.push({
        type: "❌ Overspending Alert",
        message: `You've spent ₹${totalSpent} so far, overshooting the planned ₹${totalPlanned}. Control upcoming expenses.`,
      });
    }

    if (totalSpent < totalPlanned * 0.4 && totalSpent > 0) {
      generated.push({
        type: "✅ Smart Start",
        message: `You've spent only ₹${totalSpent}, staying within safe limits. Keep it up!`,
      });
    }

    if (totalSpent === 0) {
      generated.push({
        type: "ℹ️ No Spending Yet",
        message: "Start logging expenses to get personalized insights.",
      });
    }

    const breakdown = Object.entries(spentPerCategory).map(([cat, amt]) => ({
      category: cat,
      spent: amt,
      planned: plannedPerCategory[cat] || 0,
    }));

    setForecast(
      projectedSavings >= savingsGoal
        ? `You're on track to save ₹${projectedSavings}. Well done!`
        : projectedSavings > 0
        ? `You'll save ₹${projectedSavings}, but ₹${savingsGoal - projectedSavings} short of your goal.`
        : `⚠️ Overspending risk: you might exceed your income by ₹${Math.abs(projectedSavings)}.`
    );

    setSummary(
      `
📊 Summary:
• Income: ₹${income}
• Planned Spend: ₹${totalPlanned}
• Spent So Far: ₹${totalSpent}
• Spent Today: ₹${totalSpentToday}
• Projected Savings: ₹${projectedSavings}
      `.trim()
    );

    setSuggestedGoal(newGoal);
    setCategoryBreakdown(breakdown);
    setInsights(generated);
  }, [income, savingsGoal, essentials]);

  const handleApplyGoal = async () => {
    if (suggestedGoal !== null) {
      setSavingsGoal(suggestedGoal);
      await saveProfile();
      setSuggestedGoal(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-xl">
      <h2 className="text-3xl font-cartoon font-bold mb-4 text-center text-dark">
        🤖 ZpendAI Wealth Guide
      </h2>

      <p className="text-center text-sm text-dark/60 mb-4">
        🎯 <strong>Current Goal:</strong> ₹{savingsGoal}
      </p>

      <motion.div
        className="bg-blue-100 border-l-4 border-blue-400 p-4 rounded mb-6 shadow"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <p className="font-semibold text-blue-800">📈 Forecast</p>
        <p className="text-blue-900 text-sm">{forecast}</p>
      </motion.div>

      <motion.div
        className="bg-yellow-50 border border-yellow-300 rounded p-4 mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <h3 className="text-lg font-bold text-yellow-800 mb-2">🧠 Smart Summary</h3>
        <pre className="text-sm text-yellow-900 whitespace-pre-wrap">{summary}</pre>
      </motion.div>

      {categoryBreakdown.length > 0 && (
        <motion.div
          className="bg-gray-50 border border-gray-300 rounded p-4 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h3 className="text-md font-bold text-gray-700 mb-2">📊 Category Breakdown</h3>
          <ul className="text-sm text-gray-800 space-y-1">
            {categoryBreakdown.map((item, i) => (
              <li key={i}>
                • <strong>{item.category}</strong>: Spent ₹{item.spent} / Planned ₹{item.planned}
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {insights.length > 0 && (
        <div className="flex flex-col gap-3 mb-6">
          {insights.map((tip, index) => (
            <motion.div
              key={index}
              className="bg-white border-l-4 border-green-400 shadow rounded p-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <p className="font-bold text-green-800 mb-1">{tip.type}</p>
              <p className="text-sm text-gray-700">{tip.message}</p>
            </motion.div>
          ))}
        </div>
      )}

      {suggestedGoal !== null && (
        <motion.button
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
          whileTap={{ scale: 0.97 }}
          onClick={handleApplyGoal}
        >
          ✅ Apply Suggested Goal: ₹{suggestedGoal}
        </motion.button>
      )}
    </div>
  );
}
