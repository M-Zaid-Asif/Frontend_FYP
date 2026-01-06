import React, { useState, useEffect } from "react";
import axios from "axios";
import { Thermometer, Cloud, Wind, MapPin } from "lucide-react";

const Weather = () => {
  const [weather, setWeather] = useState({
    temp: "--",
    status: "Detecting location...",
    wind: "--",
    location: "Loading...",
  });

  useEffect(() => {
    const fetchWeather = async (lat, lon) => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/v1/users/currentWeather",
          {
            params: { lat, lon },
            withCredentials: true,
          }
        );

        if (response.data.success) {
          const weatherData = response.data.data;
          setWeather({
            temp: `${Math.round(weatherData.temp)}°C`,
            status: weatherData.conditions,
            wind: `${weatherData.windspeed} km/h`,
            // This will now show the City Name
            location: weatherData.location,
          });
        }
      } catch (error) {
        console.error("Weather error:", error);
      }
    };

    // Use the Geolocation API to get coordinates
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeather(latitude, longitude);
        },
        (error) => {
          console.warn("Location permission denied. Falling back to default.");
          fetchWeather(); // Fallback to default city logic in backend
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      fetchWeather();
    }
  }, []);

  return (
    <div className="bg-gradient-to-r from-indigo-600 to-blue-500 rounded-2xl p-6 text-white shadow-lg transition-all duration-300">
      <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
        <div className="flex items-center gap-3">
          <MapPin className="text-indigo-200 h-6 w-6" />
          <div>
            <p className="text-indigo-100 font-medium text-sm">
              Current Location
            </p>
            <h1 className="text-xl font-bold leading-tight">
              {weather.location}
            </h1>
          </div>
        </div>
        <div className="flex items-center space-x-6 mt-4 md:mt-0">
          <div className="flex items-center space-x-2">
            <Thermometer className="h-10 w-10 text-yellow-300" />
            <span className="text-4xl font-bold">{weather.temp}</span>
          </div>
          <div className="text-right border-l border-indigo-400 pl-6 hidden md:block">
            <p className="flex items-center justify-end gap-2 text-sm font-medium">
              <Cloud size={16} className="text-indigo-200" /> {weather.status}
            </p>
            <p className="flex items-center justify-end gap-2 text-sm mt-1 font-medium">
              <Wind size={16} className="text-indigo-200" /> {weather.wind}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Weather;
