import { motion } from 'framer-motion';

export default function MatchResults({ keywords, matches }) {
  if (!keywords || keywords.trim().length === 0) return null;

  const keywordList = keywords
    .split(',')
    .map(k => k.trim().toLowerCase())
    .filter(k => k.length > 0);

  const unmatched = keywordList.filter(k => !matches.includes(k));
  const matchPercentage = Math.round((matches.length / keywordList.length) * 100);

  return (
    <motion.div
      className="bg-white p-6 rounded-xl shadow-md w-full max-w-xl text-dark text-center"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold mb-2">🎯 Match Results</h2>
      <p className="text-lg mb-4">
        <strong>{matches.length}</strong> out of <strong>{keywordList.length}</strong> keywords matched!
      </p>

      <div className="w-full bg-gray-200 rounded-full h-4 mb-4 overflow-hidden">
        <motion.div
          className="h-full bg-green-500"
          initial={{ width: 0 }}
          animate={{ width: `${matchPercentage}%` }}
          transition={{ duration: 1 }}
        />
      </div>

      <div className="text-left text-sm">
        <p className="font-semibold text-green-700">✅ Matched:</p>
        <ul className="list-disc list-inside mb-2">
          {matches.map((m, i) => (
            <li key={i}>{m}</li>
          ))}
        </ul>

        {unmatched.length > 0 && (
          <>
            <p className="font-semibold text-red-700">❌ Unmatched:</p>
            <ul className="list-disc list-inside">
              {unmatched.map((m, i) => (
                <li key={i}>{m}</li>
              ))}
            </ul>
          </>
        )}
      </div>
    </motion.div>
  );
}
