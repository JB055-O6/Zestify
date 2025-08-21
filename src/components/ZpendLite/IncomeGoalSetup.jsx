// src/components/ZpendLite/IncomeGoalSetup.jsx
import { useZpend } from "../../context/ZpendContext";
import { useState, useEffect } from "react";

export default function IncomeGoalSetup() {
  const { income, setIncome, savingsGoal, setSavingsGoal, saveProfile } = useZpend();
  const [localIncome, setLocalIncome] = useState(income);
  const [localGoal, setLocalGoal] = useState(savingsGoal);

  useEffect(() => {
    setLocalIncome(income);
    setLocalGoal(savingsGoal);
  }, [income, savingsGoal]);

  const handleSave = async () => {
    setIncome(localIncome);
    setSavingsGoal(localGoal);
    await saveProfile();
    alert("✅ Income & goal saved");
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow mb-6 w-full max-w-2xl mx-auto">
      <h2 className="text-xl font-bold text-dark mb-2">🎯 Set Monthly Income & Savings Goal</h2>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700">Income (₹)</label>
          <input
            type="number"
            value={localIncome}
            onChange={(e) => setLocalIncome(Number(e.target.value))}
            className="w-full p-2 rounded border border-gray-300"
            placeholder="e.g. 50000"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700">Savings Goal (₹)</label>
          <input
            type="number"
            value={localGoal}
            onChange={(e) => setLocalGoal(Number(e.target.value))}
            className="w-full p-2 rounded border border-gray-300"
            placeholder="e.g. 10000"
          />
        </div>
      </div>

      <button
        onClick={handleSave}
        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        💾 Save
      </button>
    </div>
  );
}
