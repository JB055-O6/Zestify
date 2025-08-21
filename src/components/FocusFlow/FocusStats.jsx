import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "../../supabaseClient";
import { useFocusData } from "../../context/FocusDataContext";

const timeSlots = ["Morning", "Afternoon", "Evening", "Night"];
const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const colors = {
  Morning: "#FFD93D",
  Afternoon: "#6BCB77",
  Evening: "#4D96FF",
  Night: "#845EC2",
};

// Utility to format duration into "X min Y sec" or "Z sec"
const formatDuration = (seconds) => {
  if (seconds < 60) return `${seconds} sec`;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return secs === 0 ? `${mins} min` : `${mins} min ${secs} sec`;
};

export default function FocusStats() {
  const { user } = useFocusData();
  const [focusData, setFocusData] = useState({});

  useEffect(() => {
    if (!user) return;

    const fetchFocusData = async () => {
      const { data, error } = await supabase
        .from("focus_sessions")
        .select("*")
        .eq("user_id", user.id);

      if (error) {
        console.error("❌ Error fetching focus data:", error.message);
        return;
      }

      const grouped = {};
      for (const { weekday, time_slot, duration } of data) {
        if (!grouped[weekday]) grouped[weekday] = {};
        if (!grouped[weekday][time_slot]) grouped[weekday][time_slot] = 0;
        grouped[weekday][time_slot] += duration;
      }

      setFocusData(grouped);
    };

    fetchFocusData();
  }, [user]);

  return (
    <div className="w-full max-w-4xl mt-10 px-4">
      <motion.h2
        className="text-3xl font-cartoon text-dark mb-6 text-center"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        📊 Your Focus Patterns
      </motion.h2>

      <div className="grid grid-cols-7 gap-4">
        {days.map((day) => (
          <div key={day} className="flex flex-col items-center">
            <p className="text-dark font-bold mb-2">{day.slice(0, 3)}</p>
            <div className="flex flex-col-reverse gap-1 h-48 justify-end">
              {timeSlots.map((slot) => {
                const duration = focusData[day]?.[slot] || 0;
                return (
                  <motion.div
                    key={slot}
                    className="w-8 rounded-full"
                    style={{
                      backgroundColor: colors[slot],
                      height: `${duration * 1.5}px`,
                    }}
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ duration: 0.5, delay: Math.random() * 0.3 }}
                    title={`${slot}: ${formatDuration(duration)}`}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-dark/80 font-medium">
        {Object.entries(colors).map(([slot, color]) => (
          <div key={slot} className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: color }} />
            <span>How focused have you been for the {slot} each day</span>
          </div>
        ))}
      </div>
    </div>
  );
}
