import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
console.log('API KEY:', import.meta.env.VITE_WEATHER_API_KEY);

export default function WeatherLive() {
  const [location, setLocation] = useState('');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState('');

  const getWeather = async () => {
    try {
      setError('');
      const currentRes = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
        params: {
          q: location,
          appid: API_KEY,
          units: 'metric'
        }
      });

      const forecastRes = await axios.get('https://api.openweathermap.org/data/2.5/forecast', {
        params: {
          q: location,
          appid: API_KEY,
          units: 'metric'
        }
      });

      setWeather(currentRes.data);
      const daily = forecastRes.data.list.filter((_, idx) => idx % 8 === 0);
      setForecast(daily);

    } catch (err) {
      console.error(err);
      setWeather(null);
      setForecast([]);
      setError('Could not fetch weather. Please check the location.');
    }
  };

  const getCurrentLocationWeather = () => {
    navigator.geolocation.getCurrentPosition(async ({ coords }) => {
      try {
        setError('');
        const res = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
          params: {
            lat: coords.latitude,
            lon: coords.longitude,
            appid: API_KEY,
            units: 'metric'
          }
        });

        setWeather(res.data);
        const forecastRes = await axios.get('https://api.openweathermap.org/data/2.5/forecast', {
          params: {
            lat: coords.latitude,
            lon: coords.longitude,
            appid: API_KEY,
            units: 'metric'
          }
        });

        const daily = forecastRes.data.list.filter((_, idx) => idx % 8 === 0);
        setForecast(daily);

      } catch (err) {
        console.error(err);
        setError('Failed to get weather from current location.');
      }
    }, () => setError('Geolocation permission denied.'));
  };

  return (
    <div className="min-h-screen p-6 bg-black-50 flex flex-col items-center">
        <Link to="/" className="text-blue-600 underline">Go to Backend Page</Link>
      <h1 className="text-2xl font-bold mb-4">Live Weather</h1>

      <div className="flex flex-col md:flex-row gap-2 items-center mb-4">
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter city, town, landmark, etc."
          className="border p-2 w-64"
        />
        <button onClick={getWeather} className="bg-black-600 text-white px-4 py-2 rounded">Search</button>
        <button onClick={getCurrentLocationWeather} className="bg-green-600 text-white px-4 py-2 rounded">Use My Location</button>
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {weather && (
        <div className="bg-gray-600 p-4 rounded shadow w-full max-w-md text-center mb-6">
          <h2 className="text-xl font-semibold">{weather.name}</h2>
          <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt="" className="mx-auto" />
          <p>{weather.weather[0].main} — {weather.weather[0].description}</p>
          <p className="text-lg font-bold">{weather.main.temp}°C</p>
        </div>
      )}

      {forecast.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 w-full max-w-4xl">
          {forecast.map(day => (
            <div key={day.dt} className="bg-gray-600 p-3 rounded shadow text-center">
              <p className="font-semibold">{new Date(day.dt_txt).toLocaleDateString()}</p>
              <img src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`} alt="" className="mx-auto" />
              <p>{day.weather[0].main}</p>
              <p>{day.main.temp}°C</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
