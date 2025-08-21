import { motion } from 'framer-motion';
import ResumeUpload from './ResumeUpload';
import KeywordInput from './KeywordInput';
import MatchResults from './MatchResults';
import { useState } from 'react';

export default function ZestyMatch() {
  const [resumeText, setResumeText] = useState('');
  const [keywords, setKeywords] = useState('');
  const [matches, setMatches] = useState([]);

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-r from-lime-100 to-green-200 p-6 flex flex-col gap-6 items-center justify-center text-center"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h1 className="text-4xl md:text-5xl font-cartoon text-dark mb-2">
        📝 ZestyMatch
      </h1>
      <p className="text-lg text-dark/70 mb-4 max-w-xl">
        Upload your resume and enter job keywords to see how well you match!
      </p>

      <ResumeUpload setResumeText={setResumeText} />
      <KeywordInput keywords={keywords} setKeywords={setKeywords} onMatch={setMatches} resumeText={resumeText} />
      <MatchResults keywords={keywords} matches={matches} />
    </motion.div>
  );
}
