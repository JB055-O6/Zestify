export async function generateAIInsightSummary({
  income,
  savingsGoal,
  totalSpent = 0,
  fixedCosts = [],
  expenses = [], // raw essential_expenses rows from Supabase
}) {
  if (!Array.isArray(expenses)) {
    console.error("🚨 Invalid expenses input:", expenses);
    return {
      summary: "⚠️ Could not process insights — invalid data.",
      forecasted: null,
      suggestedGoal: 0,
      flaggedQuestions: [],
    };
  }

  const essentialsCategories = [
    "groceries", "food", "rent", "bills", "electricity",
    "water", "medicines", "medicine", "doctor", "pharmacy"
  ];

  const todayStr = new Date().toISOString().split("T")[0];

  const categoryMap = {};
  let totalSpentToday = 0;
  let forecastBase = 0;

  // 🧮 Group by category
  for (let row of expenses) {
    const cat = row.category?.toLowerCase() || "uncategorized";
    const amt = Number(row.amount || 0);
    const isToday = row.date === todayStr;

    if (!categoryMap[cat]) {
      categoryMap[cat] = {
        category: cat,
        spent: 0,
        spentToday: 0,
        monthly_planned: Number(row.monthly_planned || 0),
      };
    }

    categoryMap[cat].spent += amt;
    if (isToday) categoryMap[cat].spentToday += amt;

    // Update to latest monthly_planned value
    categoryMap[cat].monthly_planned = Number(row.monthly_planned || 0);

    if (essentialsCategories.includes(cat)) {
      forecastBase += amt;
    }
  }

  const categorized = {
    essentials: [],
    lifestyle: [],
    oneTime: [],
    flagged: [],
  };

  for (let cat in categoryMap) {
    const entry = categoryMap[cat];
    const total = entry.spent;

    if (essentialsCategories.includes(cat)) {
      categorized.essentials.push({ category: cat, amount: total });
    } else if (total > income * 0.4) {
      categorized.oneTime.push({ category: cat, amount: total });
      categorized.flagged.push({
        id: cat,
        question: `🧾 You spent ₹${total} on '${cat}'. Is this recurring or one-time?`,
      });
    } else {
      categorized.lifestyle.push({ category: cat, amount: total });
      forecastBase += total;
    }
  }

  const today = new Date().getDate();
  const dailyAvg = forecastBase / today || 0;
  const predictedSpend = Math.round(dailyAvg * 30);
  const fixedTotal = fixedCosts.reduce((sum, c) => sum + Number(c.amount || 0), 0);
  const projectedSavings = income - fixedTotal - predictedSpend;

  const summarize = (arr) =>
    arr.length
      ? arr.map((e) => `${e.category} - ₹${e.amount}`).slice(0, 3).join(", ")
      : "None";

  const tone =
    projectedSavings >= savingsGoal
      ? "✅ You're aligned with your goal."
      : projectedSavings > 0
      ? `⚠️ Slightly short by ₹${(savingsGoal - projectedSavings).toFixed(0)}.`
      : `🛑 You're projected to miss the goal by ₹${Math.abs(savingsGoal - projectedSavings).toFixed(0)}.`;

  const actionSteps = [];

  if (categorized.lifestyle.length)
    actionSteps.push(`🔹 Reduce lifestyle expenses like: ${summarize(categorized.lifestyle)}`);

  if (categorized.oneTime.length)
    actionSteps.push(`🧾 One-time high spending found: ${summarize(categorized.oneTime)}`);

  const suggestedGoal = Math.max(Math.floor(projectedSavings * 0.9), 0);

  return {
    summary: `
📊 Summary:
• Income: ₹${income}
• Estimated Spend (Monthly): ₹${predictedSpend}
• Projected Savings: ₹${projectedSavings}

📌 Breakdown:
• Essentials: ${summarize(categorized.essentials)}
• Lifestyle: ${summarize(categorized.lifestyle)}
• One-Time: ${summarize(categorized.oneTime)}

🧠 Insight: ${tone}
🧭 Advice: ${actionSteps.join("\n")}

— ZpendAI
    `.trim(),
    forecasted: { projectedSavings, predictedSpend },
    suggestedGoal,
    flaggedQuestions: categorized.flagged,
  };
}

// 💡 Smart Tips
export function generateTipsForUser({ income, essentials, savingsGoal }) {
  const tips = [];

  const todayStr = new Date().toISOString().split("T")[0];
  const categoryMap = {};

  for (let row of essentials) {
    const cat = row.category?.toLowerCase() || "uncategorized";
    const amt = Number(row.amount || 0);
    const isToday = row.date === todayStr;

    if (!categoryMap[cat]) {
      categoryMap[cat] = {
        total: 0,
        today: 0,
        monthly_planned: Number(row.monthly_planned || 0),
      };
    }

    categoryMap[cat].total += amt;
    if (isToday) categoryMap[cat].today += amt;
    categoryMap[cat].monthly_planned = Number(row.monthly_planned || 0); // take latest
  }

  const totalPlanned = Object.values(categoryMap).reduce((sum, c) => sum + (c.monthly_planned || 0), 0);
  const totalSpent = Object.values(categoryMap).reduce((sum, c) => sum + (c.total || 0), 0);
  const available = income - savingsGoal;

  if (totalPlanned > available) {
    tips.push({
      title: "⚠️ Budget Overstretch",
      advice: `You've planned ₹${totalPlanned} for essentials, but only ₹${available} is available. Reconsider your savings or rebalance planned amounts.`,
    });
  }

  if (totalSpent > totalPlanned) {
    tips.push({
      title: "❌ Overspending on Essentials",
      advice: `You've spent ₹${totalSpent}, exceeding your planned budget of ₹${totalPlanned}. Try tightening upcoming spends.`,
    });
  }

  if (totalSpent < totalPlanned * 0.4 && totalSpent > 0) {
    tips.push({
      title: "✅ Great Start",
      advice: `You're at less than 40% of your planned spending. Keep budgeting wisely!`,
    });
  }

  if (totalSpent === 0) {
    tips.push({
      title: "🕓 Start Tracking",
      advice: `Log your first expense to start receiving personalized financial tips.`,
    });
  }

  if (!tips.length) {
    tips.push({
      title: "🎯 On Track",
      advice: `You're managing spending as planned. Keep it steady!`,
    });
  }

  return tips;
}
