import { motion } from "framer-motion";

export default function AnimatedBackground() {
  return (
    <motion.div
      className="absolute inset-0 z-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.6 }}
    >
      <motion.div
        className="absolute -left-24 top-10 h-[420px] w-[420px] rounded-full bg-[#CAADFF]/90 blur-[110px]"
        animate={{ x: [0, 110, 0], y: [0, 70, 0] }}
        transition={{ duration: 40, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute right-[-120px] top-[14%] h-[360px] w-[360px] rounded-full bg-[#FFC2E2]/90 blur-[100px]"
        animate={{ x: [0, -90, 0], y: [0, 80, 0] }}
        transition={{ duration: 45, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[-120px] left-[16%] h-[460px] w-[460px] rounded-full bg-[#FFADC7]/80 blur-[120px]"
        animate={{ x: [0, 90, 0], y: [0, -80, 0] }}
        transition={{ duration: 48, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[12%] right-[18%] h-[320px] w-[320px] rounded-full bg-[#7D71A7]/55 blur-[100px]"
        animate={{ x: [0, -70, 0], y: [0, 60, 0] }}
        transition={{ duration: 42, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute left-[36%] top-[30%] h-[260px] w-[260px] rounded-full bg-[#FCF6D9] blur-[90px]"
        animate={{ x: [0, 45, 0], y: [0, -55, 0] }}
        transition={{ duration: 38, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[18%] left-[52%] h-[240px] w-[240px] rounded-full bg-[#CAADFF]/70 blur-[80px]"
        animate={{ x: [0, 35, 0], y: [0, 42, 0] }}
        transition={{ duration: 50, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.div>
  );
}