import { useState } from 'react';
import { motion } from 'framer-motion';

export default function KeywordInput({ keywords, setKeywords, resumeText, onMatch }) {
  const [localInput, setLocalInput] = useState(keywords);

  const handleMatch = () => {
    const keywordList = localInput
      .split(',')
      .map((kw) => kw.trim().toLowerCase())
      .filter((kw) => kw.length > 0);

    const text = resumeText.toLowerCase();
    const found = keywordList.filter((kw) => text.includes(kw));
    onMatch(found);
    setKeywords(localInput);
  };

  return (
    <motion.div
      className="w-full max-w-xl bg-white p-4 rounded-xl shadow-md flex flex-col gap-4"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
    >
      <label className="text-left font-semibold text-dark">
        🔍 Enter job keywords (comma-separated):
      </label>
      <textarea
        className="w-full h-24 p-3 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary text-sm"
        placeholder="e.g., React, Node.js, Python, Git"
        value={localInput}
        onChange={(e) => setLocalInput(e.target.value)}
      ></textarea>
      <button
        onClick={handleMatch}
        className="px-6 py-2 self-end rounded-full bg-primary text-white font-semibold hover:bg-primary/80 transition-all"
      >
        Match Keywords
      </button>
    </motion.div>
  );
}
