import React, { useState, useEffect } from "react";
import axios from "axios";
import { Cloud, Sun, CloudRain, Wind, Thermometer, MapPin } from "lucide-react";

const WeatherCard = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // We only need coordinates for the current weather
        navigator.geolocation.getCurrentPosition(async (pos) => {
          const response = await axios.get("http://localhost:8000/api/v1/users/currentWeather", {
            params: { lat: pos.coords.latitude, lon: pos.coords.longitude },
            withCredentials: true
          });
          if (response.data.success) setWeather(response.data.data.current);
          setLoading(false);
        }, () => setLoading(false));
      } catch (err) {
        setLoading(false);
      }
    };
    fetchWeather();
  }, []);

  const getWeatherIcon = (condition) => {
    const cond = condition?.toLowerCase() || "";
    if (cond.includes("rain")) return <CloudRain className="text-blue-300" size={32} />;
    if (cond.includes("cloud")) return <Cloud className="text-gray-200" size={32} />;
    return <Sun className="text-yellow-300" size={32} />;
  };

  if (loading || !weather) return <div className="h-24 bg-indigo-800/10 animate-pulse rounded-2xl w-full" />;

  return (
    <div className="bg-gradient-to-r from-indigo-600 to-blue-500 rounded-2xl p-6 text-white shadow-lg flex justify-between items-center">
      <div className="flex items-center gap-4">
        <div className="bg-white/20 p-3 rounded-xl">
          {getWeatherIcon(weather.conditions)}
        </div>
        <div>
          <p className="text-xs font-bold text-indigo-100 uppercase flex items-center gap-1">
            <MapPin size={12}/> {weather.location}
          </p>
          <h2 className="text-2xl font-black">{Math.round(weather.temp)}°C</h2>
        </div>
      </div>

      <div className="flex gap-6 border-l border-white/20 pl-6">
        <div className="text-center">
          <p className="flex items-center gap-1 text-sm font-bold"><Wind size={14}/> {Math.round(weather.windspeed)}</p>
          <p className="text-[10px] text-indigo-100 uppercase">KM/H</p>
        </div>
        <div className="text-center hidden sm:block">
          <p className="text-sm font-bold capitalize">{weather.conditions}</p>
          <p className="text-[10px] text-indigo-100 uppercase">Status</p>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;