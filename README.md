# 🌤️ Weather Forecast Application

Ứng dụng dự báo thời tiết hiện đại với giao diện đẹp mắt, hỗ trợ tìm kiếm địa điểm và hiển thị dự báo chi tiết theo giờ và theo ngày.

![React](https://img.shields.io/badge/React-18.x-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-38B2AC)
![Zustand](https://img.shields.io/badge/Zustand-4.x-orange)

## ✨ Tính năng

- 🔍 **Tìm kiếm địa điểm**: Tìm kiếm thời tiết theo tên thành phố bất kỳ
- 📍 **Định vị tự động**: Sử dụng vị trí hiện tại của người dùng
- 🌡️ **Thông tin chi tiết**: Nhiệt độ, tốc độ gió, độ ẩm
- ⏰ **Dự báo theo giờ**: Xem dự báo 24 giờ tới với giao diện kéo ngang mượt mà
- 📅 **Dự báo nhiều ngày**: Hỗ trợ xem dự báo 3, 5, 7, 10 hoặc 14 ngày
- 📱 **Responsive**: Giao diện tối ưu cho mọi thiết bị
- 🎨 **UI hiện đại**: Thiết kế đẹp mắt với Tailwind CSS
- 🌍 **Đa ngôn ngữ**: Hỗ trợ tiếng Việt

## 🚀 Demo

🔗 **Live Demo**: [weather-app](https://weather-app-duyphatpeo.vercel.app)

## 📁 Cấu trúc dự án

```
src/
├── api/
│   └── weatherApi.ts          # API calls (Open-Meteo, Nominatim)
├── types/
│   └── weather.ts             # TypeScript interfaces
├── stores/
│   └── weatherStore.ts        # Zustand state management
├── utils/
│   └── weatherUtils.ts        # Helper functions
├── components/
│   ├── SearchBar.tsx          # Thanh tìm kiếm và định vị
│   ├── CurrentWeather.tsx     # Hiển thị thời tiết hiện tại
│   ├── HourlyForecast.tsx     # Dự báo theo giờ
│   └── ForecastList.tsx       # Danh sách dự báo nhiều ngày
└── App.tsx                    # Main component
```

## 🛠️ Công nghệ sử dụng

- **React 18** - UI Framework
- **TypeScript** - Type safety
- **Zustand** - State management (nhẹ và đơn giản)
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Open-Meteo API** - Dữ liệu thời tiết (miễn phí, không cần API key)
- **Nominatim API** - Geocoding (OpenStreetMap)

## 📦 Cài đặt

### Prerequisites

- Node.js >= 16.x
- npm hoặc yarn hoặc pnpm

### Các bước cài đặt

1. **Clone repository**

```bash
git clone https://github.com/DuyPhatpeo/weather-app.git
cd weather-app
```

1. **Cài đặt dependencies**

```bash
npm install
# hoặc
yarn install
# hoặc
pnpm install
```

1. **Chạy development server**

```bash
npm run dev
# hoặc
yarn dev
# hoặc
pnpm dev
```

1. **Mở trình duyệt**

```
http://localhost:3000
```

# ️ Premium Weather Elite

A high-performance, visually stunning weather application built with **React**, **TypeScript**, and **Tailwind CSS**. Designed with a "Premium Flat Elite" aesthetic, focusing on bold typography, vibrant color blocking, and professional-grade user experience.

![Weather App Screenshot](public/sreen.png)

## ✨ Highlight Features

### 🔍 Advanced Search Experience (v2.0)

- **Super-Pod Design**: A unified, high-contrast search bar that integrates input, location pinning, and action buttons into a sleek pill-shaped container.
- **Real-time Suggestions**: Intelligent auto-complete powered by the Open-Meteo Geocoding API with debouncing for a smooth experience.
- **Keyboard Navigation**: Full support for `Arrow Up/Down` navigation and `Enter` selection within search results.
- **Quick Shortcuts**: Global focus with `Ctrl + K` and trending location suggestions for instant discovery.

### 📊 Comprehensive Weather Insights

- **Poster-Style Current Weather**: High-impact display of primary metrics (Temp, Feels Like, Condition).
- **Hourly Insight**: 24-hour horizontal forecast with an auto-scrolling "Now" indicator.
- **7-Day Dynamic Forecast**: Detailed daily breakdowns including Sunrise/Sunset times and Precipitation probability.
- **Contextual Weather Advice**: Smart recommendations for health and activities based on AQI (Air Quality Index), UV levels, and rain status.

### 💎 Elite Design System

- **Premium Aesthetics**: Bold weights (`font-black`), uppercase tracking, and curated HSL color palettes.
- **Micro-animations**: Smooth transitions using **Framer Motion** for a high-end feel.
- **Flat 2D Elevation**: Unique shadow system (`shadow-[12px_12px_0px_0px]`) that provides depth without skeuomorphism.

## 🛠️ Tech Stack

- **Framework**: React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **API**: Open-Meteo (Weather, Air Quality, Geocoding)

## 🚀 Getting Started

1. **Clone the repository**:

    ```bash
    git clone https://github.com/DuyPhatpeo/weather-app.git
    ```

2. **Install dependencies**:

    ```bash
    npm install
    ```

3. **Run the development server**:

    ```bash
    npm run dev
    ```

## 🏗️ Build production

```bash
npm run build
# hoặc
yarn build
# hoặc
pnpm build
```

## 👥 Contributing

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---
Built with ❤️ for a better weather experience.

⭐ Nếu bạn thấy project này hữu ích, hãy cho nó một star nhé!
