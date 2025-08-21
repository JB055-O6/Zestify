import { easeInOut, motion, useAnimation } from "framer-motion";
import { useEffect } from "react";

export default function FocusTimer({ timeLeft, isFocus, isRunning }) {
  const pulseControl = useAnimation();
  const titleControl = useAnimation();

  useEffect(() => {
    if (isRunning) {
      pulseControl.start({
        scale: [1, 1.25, 0.95, 1.1, 1],
        rotate: [0, 5, -5, 3, 0],
        transition: {
          duration: 0.5,
          type: "tween",
          ease: "easeInOut",
        },
      });
    }
  }, [timeLeft]);

  useEffect(() => {
    titleControl.start({
      rotate: [0, -10, 10, -6, 6, 0],
      transition: { duration: 0.6 },
    });
  }, [isFocus]);

  const formatTime = (secs) => {
    if (!secs || secs <= 0) return "--:--";
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const bgColor = isFocus
    ? "from-yellow-300 via-orange-200 to-pink-300"
    : "from-blue-200 via-purple-200 to-pink-200";

  return (
    <motion.div
      className={`relative bg-gradient-to-br ${bgColor} p-6 rounded-full shadow-[0_0_50px_rgba(0,0,0,0.2)] border-[6px] border-white w-64 h-64 flex flex-col items-center justify-center animate-float ${
        isFocus ? "ring-4 ring-yellow-400" : "ring-4 ring-pink-400"
      }`}
      initial={{ y: -200, scale: 0.3, opacity: 0 }}
      animate={{ y: 0, scale: 1, opacity: 1 }}
      transition={{ type: "spring", bounce: 0.6, duration: 1 }}
    >
      <motion.h2 className="text-lg font-bold text-dark mb-2" animate={titleControl}>
        {isFocus ? "🧠 FOCUS MODE" : "☕ BREAK MODE"}
      </motion.h2>

      <motion.p
        className="text-6xl font-black text-white tracking-widest drop-shadow-lg"
        animate={pulseControl}
      >
        {formatTime(timeLeft)}
      </motion.p>

      <motion.p
        className="text-sm text-dark mt-2"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        {isRunning ? "🚀 Turbo Mode Active" : "🛑 Frozen In Time"}
      </motion.p>
    </motion.div>
  );
}
