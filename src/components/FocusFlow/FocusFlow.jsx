import { motion } from "framer-motion";
import FocusTimer from "./FocusTimer";
import FocusControls from "./FocusControls";
import FocusStats from "./FocusStats";
import ProjectSelector from "./ProjectSelector";
import { useFocusData } from "../../context/FocusDataContext";

export default function FocusFlow() {
  const {
    timeLeft,
    isRunning,
    mode,
    startTimer,
    pauseTimer,
    resetTimer,
    switchMode,
    loadingProjects,
  } = useFocusData();

  const isFocus = mode === "focus";

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-r from-sky-100 to-indigo-200 p-6 flex flex-col gap-6 items-center justify-center text-center"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h1 className="text-4xl md:text-5xl font-cartoon text-dark mb-2">
        🧘‍♂️ FocusFlow
      </h1>
      <p className="text-lg text-dark/70 mb-4 max-w-xl">
        Track your productivity and focus sessions throughout the day.
      </p>

      {loadingProjects ? (
        <p className="text-dark/60 mt-4 text-sm animate-pulse">⏳ Loading your projects...</p>
      ) : (
        <>
          <ProjectSelector />
          <FocusTimer
            timeLeft={timeLeft}
            isFocus={isFocus}
            isRunning={isRunning}
          />
          <FocusControls
            isRunning={isRunning}
            startTimer={startTimer}
            pauseTimer={pauseTimer}
            resetTimer={resetTimer}
            switchMode={switchMode}
          />
          <FocusStats />
        </>
      )}
    </motion.div>
  );
}
