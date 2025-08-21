// src/components/ZpendLite/ZpendLite.jsx

import { useZpend } from "../../context/ZpendContext";
import { motion } from "framer-motion";
import UnifiedTracker from "./UnifiedTracker";
import ZpendAIWealthGuide from "./ZpendAIWealthGuide";

export default function ZpendLite() {
  const {
    loading,
    income,
    savingsGoal,
    setIncome,
    setSavingsGoal,
    saveProfile,
  } = useZpend();

  const handleSave = async () => {
    await saveProfile();
    alert("✅ Profile saved!");
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-yellow-100 to-pink-200 p-6 flex flex-col gap-10 items-center text-center"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h1 className="text-4xl font-bold text-dark font-cartoon mb-1">
        💸 ZpendLite
      </h1>
      <p className="text-dark/70 text-lg max-w-2xl mb-6">
        A smart, emotionally aware financial companion that tracks, predicts and guides you.
      </p>

      {loading ? (
        <p className="text-dark/50 animate-pulse text-sm">
          🔄 Loading your financial profile...
        </p>
      ) : (
        <div className="flex flex-col gap-10 w-full max-w-6xl">
          {/* 🎯 Profile Inputs */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-dark/10">
            <h2 className="text-xl font-bold text-dark mb-4">
              🎯 Monthly Profile Setup
            </h2>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-dark mb-1">
                  Monthly Income (₹)
                </label>
                <input
                  type="number"
                  className="w-full p-3 rounded-lg border border-dark/10 shadow"
                  value={income}
                  onChange={(e) => setIncome(Number(e.target.value))}
                  placeholder="e.g. 50000"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-dark mb-1">
                  Savings Goal (₹)
                </label>
                <input
                  type="number"
                  className="w-full p-3 rounded-lg border border-dark/10 shadow"
                  value={savingsGoal}
                  onChange={(e) => setSavingsGoal(Number(e.target.value))}
                  placeholder="e.g. 10000"
                />
              </div>
            </div>

            <button
              onClick={handleSave}
              className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded shadow"
            >
              💾 Save Profile
            </button>
          </div>

          {/* 🧾 Unified Table */}
          <UnifiedTracker />

          {/* 🤖 Smart Insight */}
          <ZpendAIWealthGuide />
          
        </div>
      )}
    </motion.div>
  );
}
