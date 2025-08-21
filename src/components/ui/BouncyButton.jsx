import { motion } from 'framer-motion';

export default function BouncyButton({ children, onClick }) {
  return (
    <motion.button
      whileHover={{
        y: [0, -24, 0, -16, 0], // Double bounce pattern
        rotate: [0, -10, 8, -9, 12, 0], // Extended wiggle
        transition: {
          y: {
            duration: 0.8,
            ease: 'easeOut',
            times: [0, 0.3, 0.6, 0.8, 1],
          },
          rotate: {
            duration: 1,
            ease: 'easeInOut',
          }
        }
      }}
      whileTap={{
        scale: 0.9,
        transition: {
          type: 'spring',
          stiffness: 50,
          damping: 8,
          mass: 1.2
        }
      }}
      className="bg-primary text-white font-cartoon px-6 py-3 rounded-blob shadow-md hover:shadow-lg transition"
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
}
