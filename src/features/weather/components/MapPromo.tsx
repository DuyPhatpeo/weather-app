import { Globe2 } from "lucide-react";

export default function MapPromo({ onOpenMap }: { onOpenMap: () => void }) {
  return (
    <button
      onClick={onOpenMap}
      className="group relative w-full overflow-hidden rounded-2xl p-6 text-left text-white transition-transform hover:-translate-y-0.5"
      style={{ background: "linear-gradient(135deg, #1e6fd9, #38bdf8)" }}
    >
      <Globe2 size={72} className="absolute -bottom-4 -right-4 opacity-20 transition-transform group-hover:scale-110" />
      <div className="relative z-10">
        <h3 className="text-base font-semibold leading-snug">
          Khám phá bản đồ
          <br />
          thời tiết toàn cầu
        </h3>
        <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold bg-white text-[#1e6fd9] px-4 py-2 rounded-full">
          Xem ngay
        </span>
      </div>
    </button>
  );
}
