import { motion } from "framer-motion";

export default function CarouselCard({ card, active }: any) {
  return (
    <motion.div
      className="w-80 h-80 flex flex-col justify-between rounded-3xl p-8 shadow-lg text-white overflow-hidden"
      style={{ backgroundColor: card.accent }}
      animate={{
        scale: active ? 1 : 0.95,
        opacity: active ? 1 : 0.7,
      }}
      transition={{ type: "spring", stiffness: 80, damping: 18 }}
    >
      <div>
        <h2 className="text-lg font-bold mb-2">{card.title}</h2>
        <p className="text-4xl font-extrabold mb-3">{card.value}</p>
      </div>
      
      <div className="flex-1 flex flex-col justify-between">
        <p className="text-sm font-semibold mb-3 text-white/90">{card.description}</p>
        <p className="text-xs leading-relaxed text-white/80">{card.insight}</p>
      </div>
    </motion.div>
  );
}
