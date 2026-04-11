import { motion } from "framer-motion";

export default function AnimatedBackground() {
  return (
    <motion.div
      className="absolute inset-0 z-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
    >
      <motion.div
        className="absolute -top-40 -left-40 h-[550px] w-[550px] rounded-full bg-[#7D71A7] blur-[140px] opacity-40"
        animate={{ x: [0, 100, 0], y: [0, 80, 0] }}
        transition={{ duration: 38, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute top-1/4 -right-40 h-[500px] w-[500px] rounded-full bg-[#CAADFF] blur-[130px] opacity-40"
        animate={{ x: [0, -120, 0], y: [0, -60, 0] }}
        transition={{ duration: 42, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute bottom-0 left-1/3 h-[600px] w-[600px] rounded-full bg-[#FFC2E2] blur-[150px] opacity-35"
        animate={{ x: [0, 90, 0], y: [0, -100, 0] }}
        transition={{ duration: 46, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute top-12 left-1/2 h-[420px] w-[420px] rounded-full bg-[#FFADC7] blur-[120px] opacity-35"
        animate={{ x: [0, 60, 0], y: [0, 60, 0] }}
        transition={{ duration: 40, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute bottom-24 right-1/4 h-[380px] w-[380px] rounded-full bg-[#FCF6D9] blur-[110px] opacity-30"
        animate={{ x: [0, -50, 0], y: [0, 50, 0] }}
        transition={{ duration: 44, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.div>
  );
}
