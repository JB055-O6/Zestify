// src/components/ZpendLite/UnifiedTracker.jsx
import { useState, useEffect } from "react";
import { useZpend } from "../../context/ZpendContext";
import ConfirmLogModal from "./ConfirmLogModal";
import { supabase } from "../../supabaseClient";
import { useUser } from "@supabase/auth-helpers-react";

export default function UnifiedTracker() {
  const {
    income,
    savingsGoal,
    availableBudget,
    essentials,
    setEssentials,
    saveEssentials,
  } = useZpend();

  const user = useUser();
  const [dailySpends, setDailySpends] = useState({});
  const [showConfirm, setShowConfirm] = useState(false);
  const [totals, setTotals] = useState({});
  const [todaySpends, setTodaySpends] = useState({});

  // 🧮 Total historical spend per category
  useEffect(() => {
    const fetchTotals = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from("essential_expenses")
        .select("category, amount")
        .eq("user_id", user.id);

      if (data) {
        const grouped = {};
        data.forEach((row) => {
          const cat = row.category?.trim();
          grouped[cat] = (grouped[cat] || 0) + Number(row.amount || 0);
        });
        setTotals(grouped);
      }
    };

    fetchTotals();
  }, [essentials, user]);

  // ✅ Track real spend today
  useEffect(() => {
    const fetchTodaySpend = async () => {
      if (!user) return;

      const today = new Date().toISOString().split("T")[0];

      const { data, error } = await supabase
        .from("essential_expenses")
        .select("category, amount, date")
        .eq("user_id", user.id)
        .eq("date", today);

      if (data) {
        const grouped = {};
        data.forEach((row) => {
          const cat = row.category?.trim();
          grouped[cat] = (grouped[cat] || 0) + Number(row.amount || 0);
        });
        setTodaySpends(grouped);
      }
    };

    fetchTodaySpend();
  }, [essentials, user]);

  const handleChange = (index, key, value) => {
    const updated = [...essentials];
    updated[index] = {
      ...updated[index],
      [key]: key === "monthly_planned" ? Number(value) : value,
    };
    setEssentials(updated);
  };

  const handleAddRow = () => {
    setEssentials([
      ...essentials,
      {
        category: "",
        monthly_planned: 0,
      },
    ]);
  };

  const handleLogChange = (index, value) => {
    const updatedSpends = { ...dailySpends, [index]: Number(value || 0) };
    setDailySpends(updatedSpends);
  };

  const confirmTodayLog = async () => {
    const today = new Date().toISOString().split("T")[0];

    const rowsToInsert = essentials.map((item, index) => {
      const spendToday = dailySpends[index] || 0;
      return {
        user_id: user?.id,
        category: item.category?.trim() || "Uncategorized",
        amount: spendToday,
        monthly_planned: item.monthly_planned || 0,
        date: today,
        note: "",
      };
    });

    const { error } = await supabase
      .from("essential_expenses")
      .insert(rowsToInsert);

    if (error) {
      console.error("❌ Error saving logs:", error.message);
      alert("Failed to save today's expenses.");
    } else {
      alert("✅ Today's expenses logged!");
      setDailySpends({});
      setShowConfirm(false);
    }
  };

  const totalPlanned = essentials.reduce(
    (sum, e) => sum + (e.monthly_planned || 0),
    0
  );

  // ✅ Real today's spend using fetched today's data
  const totalToday = Object.values(todaySpends).reduce((sum, val) => sum + val, 0);

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-4xl">
      <h2 className="text-2xl font-bold mb-2">📋 Expense Tracker</h2>
      <p className="text-dark/70 mb-4">
        Income: ₹{income} | Savings Goal: ₹{savingsGoal} | Available: ₹{availableBudget}
      </p>

      <table className="w-full text-left border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Product/Service</th>
            <th className="p-2 border">Monthly Planned (₹)</th>
            <th className="p-2 border">Today's Spend (₹)</th>
            <th className="p-2 border">Total Spent (₹)</th>
          </tr>
        </thead>
        <tbody>
          {essentials.map((item, index) => {
            const cat = item.category?.trim();
            return (
              <tr key={index}>
                <td className="p-2 border">
                  <input
                    value={item.category || ""}
                    onChange={(e) =>
                      handleChange(index, "category", e.target.value)
                    }
                    className="w-full border p-1 rounded"
                    placeholder="e.g. Groceries"
                  />
                </td>
                <td className="p-2 border">
                  <input
                    type="number"
                    value={item.monthly_planned || ""}
                    onChange={(e) =>
                      handleChange(index, "monthly_planned", e.target.value)
                    }
                    className="w-full border p-1 rounded"
                    placeholder="e.g. 3000"
                  />
                </td>
                <td className="p-2 border">
                  <input
                    type="number"
                    value={dailySpends[index] || ""}
                    onChange={(e) => handleLogChange(index, e.target.value)}
                    className="w-full border p-1 rounded"
                    placeholder="e.g. 200"
                  />
                </td>
                <td className="p-2 border">₹{totals[cat] || 0}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="mt-4 flex justify-between">
        <button
          onClick={handleAddRow}
          className="text-blue-600 hover:underline"
        >
          ➕ Add Item
        </button>
        <button
          onClick={() => setShowConfirm(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          ✅ Confirm Today's Expense
        </button>
      </div>

      <p className="mt-4 text-sm text-dark/70">
        Total Planned: ₹{totalPlanned} | Today's Spend: ₹{totalToday} | Remaining: ₹
        {availableBudget - totalPlanned}
      </p>

      {showConfirm && (
        <ConfirmLogModal
          dailyLogs={dailySpends}
          essentials={essentials}
          onClose={() => setShowConfirm(false)}
          onConfirm={confirmTodayLog}
        />
      )}
    </div>
  );
}
