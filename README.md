# Features
- Frontend: User input, shows weather, geolocation, five-day forecasting, error handling
- Backend: CRUD, data export (JSON and CSV), error handling (fuzzy matching for locations)

# Tech Stack

- **Frontend**: React (Vite), Tailwind CSS
- **Backend**: Node.js, Express, Mongoose
- **Database**: MongoDB (Atlas or Local)
- **APIs**: OpenWeather

# Installation

## 1. Clone the Repository

```bash
git clone https://github.com/yourusername/weather-app.git
cd weather-app
```

---

## 2. Setup Backend

```bash
cd server
npm install
```

Create `server/.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

Start the server:

```bash
npm run dev
```

---

## 3. Setup Frontend

```bash
cd ../client
npm install
```

Create `client/.env`:

```env
VITE_WEATHER_API_KEY=your_openweather_api_key
```

Start the app:

```bash
npm run dev
```

---

# 🌐 Usage

- Visit: [http://localhost:5173](http://localhost:5173)
- Navigate between:
  - **Backend page (Uses MongoDB)**: Create, edit, delete, and export weather records
  - **Live page** (`/live`): Real-time weather + 5-day forecast
- Use buttons to:
  - Lookup weather by location/date
  - Download records in multiple formats

---

# 🔐 Environment Variables Summary

| File          | Variable                    | Description                          |
|---------------|-----------------------------|--------------------------------------|
| `server/.env` | `MONGO_URI`                 | MongoDB connection string            |
|               | `WEATHER_API_KEY`           | OpenWeather API key                  |
|               | `YOUTUBE_API_KEY`           | YouTube Data API key (optional)      |
| `client/.env` | `VITE_WEATHER_API_KEY`      | Frontend OpenWeather API key         |
|               | `VITE_YOUTUBE_API_KEY`      | Frontend YouTube key (optional)      |
|               | `VITE_GOOGLE_MAPS_API_KEY`  | Maps Embed key (optional)            |
