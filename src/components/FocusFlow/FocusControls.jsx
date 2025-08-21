import { motion } from "framer-motion";
import { useFocusData } from "../../context/FocusDataContext";

const buttonVariants = {
  initial: { scale: 1 },
  hover: { scale: 1.1 },
  tap: { scale: 0.9 },
  animate: {
    scale: [1, 1.03, 1],
    transition: { repeat: Infinity, duration: 2 },
  },
};

export default function FocusControls({
  isRunning,
  startTimer,
  pauseTimer,
  resetTimer,
  switchMode,
}) {
  const { currentProject } = useFocusData();

  const handleStart = () => {
    if (!currentProject) {
      alert("⚠️ Please select a project before starting the timer.");
      return;
    }
    startTimer();
  };

  const renderButton = (label, onClick, color) => (
    <motion.button
      onClick={onClick}
      className={`px-6 py-3 rounded-xl font-bold text-white text-lg shadow-xl border-4 border-white ${color}`}
      variants={buttonVariants}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      animate="animate"
    >
      {label}
    </motion.button>
  );

  return (
    <div className="flex flex-wrap gap-6 justify-center mt-4">
      {renderButton(
        isRunning ? "⏸️ Pause" : "▶️ Start",
        isRunning ? pauseTimer : handleStart,
        "bg-green-500 hover:bg-green-600"
      )}
      {renderButton("🔄 Reset", resetTimer, "bg-red-500 hover:bg-red-600")}
      {renderButton("🎯 Switch Mode", switchMode, "bg-blue-500 hover:bg-blue-600")}
    </div>
  );
}
