export const getWeatherInfo = (code?: number) => {
  if (code == null)
    return {
      icon: "☀️",
      desc: "Trời quang",
      color: "from-amber-400 to-orange-500",
    };

  const weatherMap: Record<
    number,
    { icon: string; desc: string; color: string }
  > = {
    0: {
      icon: "☀️",
      desc: "Trời quang",
      color: "from-amber-400 to-orange-500",
    },
    1: { icon: "🌤️", desc: "Ít mây", color: "from-amber-300 to-yellow-400" },
    2: { icon: "⛅", desc: "Có mây", color: "from-slate-300 to-slate-400" },
    3: { icon: "☁️", desc: "U ám", color: "from-slate-400 to-slate-500" },
    45: {
      icon: "🌫️",
      desc: "Có sương mù",
      color: "from-slate-300 to-slate-400",
    },
    48: { icon: "🌫️", desc: "Sương mù", color: "from-slate-300 to-slate-400" },
    51: {
      icon: "🌦️",
      desc: "Mưa phùn nhẹ",
      color: "from-blue-400 to-blue-500",
    },
    53: { icon: "🌦️", desc: "Mưa phùn", color: "from-blue-400 to-blue-500" },
    55: {
      icon: "🌦️",
      desc: "Mưa phùn dày",
      color: "from-blue-500 to-blue-600",
    },
    61: { icon: "🌧️", desc: "Mưa nhẹ", color: "from-blue-500 to-blue-600" },
    63: { icon: "🌧️", desc: "Mưa", color: "from-blue-500 to-blue-600" },
    65: { icon: "🌧️", desc: "Mưa to", color: "from-blue-600 to-blue-700" },
    71: { icon: "🌨️", desc: "Tuyết nhẹ", color: "from-cyan-300 to-blue-400" },
    73: { icon: "🌨️", desc: "Tuyết", color: "from-cyan-300 to-blue-400" },
    75: { icon: "🌨️", desc: "Tuyết dày", color: "from-cyan-400 to-blue-500" },
    77: { icon: "🌨️", desc: "Mưa tuyết", color: "from-cyan-300 to-blue-400" },
    80: { icon: "🌦️", desc: "Mưa rào nhẹ", color: "from-blue-400 to-blue-500" },
    81: { icon: "🌧️", desc: "Mưa rào", color: "from-blue-500 to-blue-600" },
    82: { icon: "🌧️", desc: "Mưa rào to", color: "from-blue-600 to-blue-700" },
    85: {
      icon: "🌨️",
      desc: "Tuyết rào nhẹ",
      color: "from-cyan-300 to-blue-400",
    },
    86: {
      icon: "🌨️",
      desc: "Tuyết rào to",
      color: "from-cyan-400 to-blue-500",
    },
    95: { icon: "⛈️", desc: "Giông bão", color: "from-slate-600 to-slate-800" },
    96: {
      icon: "⛈️",
      desc: "Giông có mưa đá nhẹ",
      color: "from-slate-600 to-slate-800",
    },
    99: {
      icon: "⛈️",
      desc: "Giông có mưa đá",
      color: "from-slate-700 to-slate-900",
    },
  };

  return weatherMap[code] || weatherMap[0];
};

export const formatHour = (
  timeStr: string,
  selectedDate: string | null
): string => {
  const date = new Date(timeStr);
  const now = new Date();

  // Check if this is the current hour (only if no date selected or selected date is today)
  if (!selectedDate || selectedDate === now.toISOString().split("T")[0]) {
    if (
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear() &&
      date.getHours() === now.getHours()
    ) {
      return "Bây giờ";
    }
  }

  return date.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const compareDate = new Date(date);
  compareDate.setHours(0, 0, 0, 0);

  if (compareDate.getTime() === today.getTime()) {
    return {
      main: "Hôm nay",
      sub: date.toLocaleDateString("vi-VN", {
        day: "numeric",
        month: "short",
      }),
    };
  }
  if (compareDate.getTime() === tomorrow.getTime()) {
    return {
      main: "Ngày mai",
      sub: date.toLocaleDateString("vi-VN", {
        day: "numeric",
        month: "short",
      }),
    };
  }

  return {
    main: date.toLocaleDateString("vi-VN", { weekday: "long" }),
    sub: date.toLocaleDateString("vi-VN", { day: "numeric", month: "short" }),
  };
};
