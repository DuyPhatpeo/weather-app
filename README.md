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

2. **Cài đặt dependencies**

```bash
npm install
# hoặc
yarn install
# hoặc
pnpm install
```

3. **Chạy development server**

```bash
npm run dev
# hoặc
yarn dev
# hoặc
pnpm dev
```

4. **Mở trình duyệt**

```
http://localhost:3000
```

## 🏗️ Build production

```bash
npm run build
# hoặc
yarn build
# hoặc
pnpm build
```

File build sẽ được tạo trong thư mục `dist/`

## 📖 Hướng dẫn sử dụng

### 1. Tìm kiếm địa điểm

- Nhập tên thành phố vào ô tìm kiếm
- Nhấn nút "Tìm" hoặc Enter

### 2. Sử dụng vị trí hiện tại

- Nhấn nút 📍 bên cạnh ô tìm kiếm
- Cho phép trình duyệt truy cập vị trí của bạn

### 3. Xem dự báo theo giờ

- Kéo ngang để xem các giờ tiếp theo
- Click vào một ngày trong danh sách dự báo để xem dự báo theo giờ cho ngày đó

### 4. Thay đổi số ngày dự báo

- Nhấn các nút 3d, 5d, 7d, 10d, 14d để thay đổi số ngày hiển thị

## 🔧 Cấu hình

### API Endpoints

Ứng dụng sử dụng các API công khai, không cần cấu hình API key:

- **Weather Data**: https://api.open-meteo.com/v1/forecast
- **Geocoding**: https://nominatim.openstreetmap.org/search

### Tùy chỉnh

Bạn có thể tùy chỉnh các thiết lập trong file `weatherStore.ts`:

```typescript
// Số ngày dự báo mặc định
forecastDays: 7;

// Thay đổi đơn vị nhiệt độ trong API params (weatherApi.ts)
// Celsius (mặc định) hoặc Fahrenheit
```

## 📱 Responsive Design

Ứng dụng được tối ưu cho các kích thước màn hình:

- 📱 Mobile: < 640px
- 💻 Tablet: 640px - 1024px
- 🖥️ Desktop: > 1024px

## 🎨 Tùy chỉnh giao diện

Ứng dụng sử dụng Tailwind CSS, bạn có thể dễ dàng tùy chỉnh:

- Colors: Sửa trong `tailwind.config.js`
- Spacing: Thay đổi padding/margin trong components
- Fonts: Cấu hình trong `index.css`

## 🤝 Đóng góp

Mọi đóng góp đều được hoan nghênh! Vui lòng:

1. Fork project
2. Tạo branch mới (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

## 🐛 Bug Reports

Nếu bạn phát hiện bug, vui lòng tạo issue mới với:

- Mô tả chi tiết
- Các bước tái hiện
- Screenshots (nếu có)
- Thông tin môi trường (browser, OS)

## 👤 Tác giả

**DuyPhatpeo**

- GitHub: [@DuyPhatpeo](https://github.com/DuyPhatpeo)
- Repository: [weather-app](https://github.com/DuyPhatpeo/weather-app)

## 🙏 Cảm ơn

- [Open-Meteo](https://open-meteo.com/) - Weather API miễn phí
- [OpenStreetMap Nominatim](https://nominatim.org/) - Geocoding API
- [Lucide Icons](https://lucide.dev/) - Beautiful icons
- [Tailwind CSS](https://tailwindcss.com/) - Styling framework
- [Zustand](https://zustand-demo.pmnd.rs/) - State management

---

⭐ Nếu bạn thấy project này hữu ích, hãy cho nó một star nhé!
