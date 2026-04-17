import { motion } from "framer-motion";

const divisions = [
  "Y",
  "D",
  "H",
  "I",
  "M",
  "Q",
];

type Props = {
  selectedCampaign: string;
  onSelectCampaign: (c: string) => void;
  discount: number;
  onDiscountChange: (v: number) => void;
};

export default function CampaignSelectors({
  selectedCampaign,
  onSelectCampaign,
  discount,
  onDiscountChange,
}: Props) {
  return (
    <div className="flex flex-col gap-6">
      {/* Division selector */}
      <div>
        <h2 className="text-lg font-semibold text-[#7D71A7] mb-3">Select Division</h2>
        <div className="flex gap-3 flex-wrap">
          {divisions.map((div) => {
            const active = div === selectedCampaign;

            return (
              <motion.button
                key={div}
                onClick={() => onSelectCampaign(div)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className={`
                  px-4 py-2 rounded-xl text-sm font-medium transition-all
                  ${
                    active
                      ? "bg-[#7D71A7] text-white shadow-md"
                      : "bg-white/70 text-[#7D71A7] hover:bg-[#CAADFF]/60"
                  }
                `}
              >
                Division {div}
              </motion.button>
            );
          })}
        </div>
      </div>

    </div>
  );
}
