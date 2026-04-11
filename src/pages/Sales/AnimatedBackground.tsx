import { motion } from "framer-motion";

export default function AnimatedBackground() {
  return (
    <motion.div
      className="absolute inset-0 z-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
    >
      {/* Sales blobs */}
      <motion.div
        className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-[#7D71A7] blur-[120px]"
        animate={{ x: [0, 80, 0], y: [0, 60, 0] }}
        transition={{ duration: 38, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/3 -right-40 h-[450px] w-[450px] rounded-full bg-[#CAADFF] blur-[110px]"
        animate={{ x: [0, -100, 0], y: [0, -50, 0] }}
        transition={{ duration: 42, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 left-1/4 h-[500px] w-[500px] rounded-full bg-[#FFC2E2] blur-[130px]"
        animate={{ x: [0, 90, 0], y: [0, -70, 0] }}
        transition={{ duration: 45, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Extra blobs */}
      <motion.div
        className="absolute top-10 left-1/2 h-[400px] w-[400px] rounded-full bg-[#FFADC7] blur-[100px]"
        animate={{ x: [0, 50, 0], y: [0, 50, 0] }}
        transition={{ duration: 40, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-20 right-1/3 h-[350px] w-[350px] rounded-full bg-[#FCF6D9] blur-[90px]"
        animate={{ x: [0, -40, 0], y: [0, 40, 0] }}
        transition={{ duration: 43, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/4 left-1/4 h-[300px] w-[300px] rounded-full bg-[#CAADFF] blur-[90px]"
        animate={{ x: [0, 30, 0], y: [0, -30, 0] }}
        transition={{ duration: 47, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.div>
  );
}
