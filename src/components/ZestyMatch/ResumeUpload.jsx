import { useRef } from 'react';
import { motion } from 'framer-motion';
import * as pdfjsLib from 'pdfjs-dist';

// ✅ Use CDN fallback worker instead of importing locally
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export default function ResumeUpload({ setResumeText }) {
  const fileInputRef = useRef(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || file.type !== 'application/pdf') return;

    const reader = new FileReader();
    reader.onload = async () => {
      const typedArray = new Uint8Array(reader.result);
      const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;

      let fullText = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const strings = content.items.map(item => item.str);
        fullText += strings.join(' ') + '\n';
      }

      setResumeText(fullText);
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <motion.div
      className="p-4 bg-white rounded-xl shadow-md text-dark"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    >
      <input
        type="file"
        accept=".pdf"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/80 cursor-pointer"
      />
    </motion.div>
  );
}
