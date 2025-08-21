// src/context/ZpendContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { useUser } from "@supabase/auth-helpers-react";
import { supabase } from "../supabaseClient";

const ZpendContext = createContext();

export function ZpendProvider({ children }) {
  const user = useUser();

  const [income, setIncome] = useState(0);
  const [savingsGoal, setSavingsGoal] = useState(0);
  const [essentials, setEssentials] = useState([]);
  const [loading, setLoading] = useState(true);

  const availableBudget = income - savingsGoal;

  // 🚀 Load profile and all logs, then group them
  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      setLoading(true);

      // 1️⃣ Load profile
      const { data: profile } = await supabase
        .from("zpend_profile")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (profile) {
        setIncome(profile.income || 0);
        setSavingsGoal(profile.savings_goal || 0);
      }

      // 2️⃣ Load all essential expense logs
      const { data: logs, error } = await supabase
        .from("essential_expenses")
        .select("*")
        .eq("user_id", user.id);

      if (error) {
        console.error("❌ Failed to fetch essentials:", error.message);
        setLoading(false);
        return;
      }

      // 3️⃣ Group logs by category
      const grouped = {};

      for (const log of logs) {
        const cat = log.category?.trim() || "Uncategorized";
        if (!grouped[cat]) {
          grouped[cat] = {
            category: cat,
            total_spent: 0,
            monthly_planned: 0,
          };
        }

        // Total all spends for the category
        grouped[cat].total_spent += Number(log.amount || 0);

        // Update monthly planned if latest
        if (log.monthly_planned && log.monthly_planned > 0) {
          grouped[cat].monthly_planned = log.monthly_planned;
        }
      }

      // 4️⃣ Flatten and set
      setEssentials(Object.values(grouped));
      setLoading(false);
    };

    loadData();
  }, [user]);

  // 💾 Save profile
  const saveProfile = async () => {
    if (!user) return;

    const { error } = await supabase
      .from("zpend_profile")
      .upsert(
        {
          user_id: user.id,
          income,
          savings_goal: savingsGoal,
          inserted_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      );

    if (error) {
      console.error("❌ Profile save error:", error.message);
    } else {
      console.log("✅ Profile saved");
    }
  };

  // 💾 Save new daily log entries (does NOT overwrite history)
  const saveEssentials = async () => {
    if (!user) return;

    const cleaned = essentials.map((e) => ({
      user_id: user.id,
      category: e.category?.trim() || "Uncategorized",
      amount: Number(e.amount || 0), // Today’s spend
      monthly_planned: Number(e.monthly_planned || 0), // Stored per log
      note: e.note || "",
      date: e.date || new Date().toISOString().split("T")[0],
    }));

    const { error } = await supabase.from("essential_expenses").insert(cleaned);

    if (error) {
      console.error("❌ Essentials save error:", error.message);
    } else {
      console.log("✅ Essentials saved successfully");
    }
  };

  return (
    <ZpendContext.Provider
      value={{
        income,
        setIncome,
        savingsGoal,
        setSavingsGoal,
        essentials,
        setEssentials,
        availableBudget,
        saveProfile,
        saveEssentials,
        loading,
      }}
    >
      {children}
    </ZpendContext.Provider>
  );
}

export function useZpend() {
  return useContext(ZpendContext);
}
