import {
  WiDaySunny,
  WiDayCloudy,
  WiCloud,
  WiFog,
  WiSprinkle,
  WiRain,
  WiRainMix,
  WiSnow,
  WiThunderstorm,
} from "react-icons/wi";

export const getWeatherInfo = (code?: number) => {
  if (code == null)
    return {
      icon: <WiDaySunny size={48} />,
      desc: "Trời quang",
      color: "from-amber-400 to-orange-500",
    };

  const weatherMap: Record<
    number,
    { icon: JSX.Element; desc: string; color: string }
  > = {
    0: {
      icon: <WiDaySunny size={48} />,
      desc: "Trời quang",
      color: "from-amber-400 to-orange-500",
    },
    1: {
      icon: <WiDaySunny size={48} />,
      desc: "Ít mây",
      color: "from-amber-300 to-yellow-400",
    },
    2: {
      icon: <WiDayCloudy size={48} />,
      desc: "Có mây",
      color: "from-slate-300 to-slate-400",
    },
    3: {
      icon: <WiCloud size={48} />,
      desc: "U ám",
      color: "from-slate-400 to-slate-500",
    },
    45: {
      icon: <WiFog size={48} />,
      desc: "Có sương mù",
      color: "from-slate-300 to-slate-400",
    },
    48: {
      icon: <WiFog size={48} />,
      desc: "Sương mù",
      color: "from-slate-300 to-slate-400",
    },
    51: {
      icon: <WiSprinkle size={48} />,
      desc: "Mưa phùn nhẹ",
      color: "from-blue-400 to-blue-500",
    },
    53: {
      icon: <WiSprinkle size={48} />,
      desc: "Mưa phùn",
      color: "from-blue-400 to-blue-500",
    },
    55: {
      icon: <WiSprinkle size={48} />,
      desc: "Mưa phùn dày",
      color: "from-blue-500 to-blue-600",
    },
    61: {
      icon: <WiRain size={48} />,
      desc: "Mưa nhẹ",
      color: "from-blue-500 to-blue-600",
    },
    63: {
      icon: <WiRain size={48} />,
      desc: "Mưa",
      color: "from-blue-500 to-blue-600",
    },
    65: {
      icon: <WiRain size={48} />,
      desc: "Mưa to",
      color: "from-blue-600 to-blue-700",
    },
    71: {
      icon: <WiSnow size={48} />,
      desc: "Tuyết nhẹ",
      color: "from-cyan-300 to-blue-400",
    },
    73: {
      icon: <WiSnow size={48} />,
      desc: "Tuyết",
      color: "from-cyan-300 to-blue-400",
    },
    75: {
      icon: <WiSnow size={48} />,
      desc: "Tuyết dày",
      color: "from-cyan-400 to-blue-500",
    },
    77: {
      icon: <WiRainMix size={48} />,
      desc: "Mưa tuyết",
      color: "from-cyan-300 to-blue-400",
    },
    80: {
      icon: <WiSprinkle size={48} />,
      desc: "Mưa rào nhẹ",
      color: "from-blue-400 to-blue-500",
    },
    81: {
      icon: <WiRain size={48} />,
      desc: "Mưa rào",
      color: "from-blue-500 to-blue-600",
    },
    82: {
      icon: <WiRain size={48} />,
      desc: "Mưa rào to",
      color: "from-blue-600 to-blue-700",
    },
    85: {
      icon: <WiSnow size={48} />,
      desc: "Tuyết rào nhẹ",
      color: "from-cyan-300 to-blue-400",
    },
    86: {
      icon: <WiSnow size={48} />,
      desc: "Tuyết rào to",
      color: "from-cyan-400 to-blue-500",
    },
    95: {
      icon: <WiThunderstorm size={48} />,
      desc: "Giông bão",
      color: "from-slate-600 to-slate-800",
    },
    96: {
      icon: <WiThunderstorm size={48} />,
      desc: "Giông có mưa đá nhẹ",
      color: "from-slate-600 to-slate-800",
    },
    99: {
      icon: <WiThunderstorm size={48} />,
      desc: "Giông có mưa đá",
      color: "from-slate-700 to-slate-900",
    },
  };

  return weatherMap[code] || weatherMap[0];
};
