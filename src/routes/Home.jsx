import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import BouncyButton from '../components/ui/BouncyButton';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-r from-yellow-100 to-pink-200 flex flex-col items-center justify-center text-center p-8">
      <motion.h1
        className="text-5xl md:text-6xl font-cartoon text-dark mb-4"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        Welcome to Zestify 🎉
      </motion.h1>

      <motion.p
        className="text-xl text-dark/80 max-w-xl mb-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        Your all-in-one productivity suite! Choose a tool to get started:
      </motion.p>

      <div className="flex flex-col gap-4 w-full max-w-sm">
        <BouncyButton onClick={() => navigate('/resume')}>
            📝 ZestyMatch (Resume Checker)
        </BouncyButton>
        <BouncyButton onClick={() => navigate('/focus')}>
            📅 FocusFlow (Time Tracker)
        </BouncyButton>
        <BouncyButton onClick={() => navigate('/expenses')}>
            💸 ZpendLite (Expense Tracker)
        </BouncyButton>
      </div>

    </div>
  );
}
