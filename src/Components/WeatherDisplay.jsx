import React, { useState, useEffect } from "react";
import axios from "axios";
import { Cloud, Sun, CloudRain, Wind, Thermometer, AlertTriangle, MapPin } from "lucide-react";

const WeatherDisplay = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getLocationAndWeather = () => {
      if (!navigator.geolocation) {
        setError("Geolocation not supported");
        fetchWeather();
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (position) => fetchWeather(position.coords.latitude, position.coords.longitude),
        () => fetchWeather() // Fallback
      );
    };

    const fetchWeather = async (lat = null, lon = null) => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:8000/api/v1/users/currentWeather", {
          params: { lat, lon },
          withCredentials: true
        });

        if (response.data.success) {
          // Now storing the full object containing { current, forecast }
          setWeather(response.data.data);
        }
      } catch (err) {
        setError("Could not sync with local weather stations.");
      } finally {
        setLoading(false);
      }
    };

    getLocationAndWeather();
  }, []);

  // Helper to format dates into "Mon", "Tue", etc.
  const getDayName = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date);
  };

  const getWeatherIcon = (condition, size = 40) => {
    const cond = condition?.toLowerCase() || "";
    if (cond.includes("rain")) return <CloudRain className="text-blue-300" size={size} />;
    if (cond.includes("cloud") || cond.includes("overcast")) return <Cloud className="text-gray-200" size={size} />;
    return <Sun className="text-yellow-300" size={size} />;
  };

  if (loading) return <div className="animate-pulse bg-indigo-900/10 h-64 rounded-3xl" />;
  if (error && !weather) return <div className="text-red-500 p-6">Error: {error}</div>;

  return (
    <div className="bg-gradient-to-br from-indigo-700 via-indigo-600 to-blue-500 rounded-3xl p-8 text-white shadow-2xl relative border border-white/10">
      {/* 1. TOP SECTION: CURRENT WEATHER */}
      <div className="flex flex-col md:flex-row justify-between items-center relative z-10 mb-8">
        <div className="text-left">
          <div className="flex items-center gap-2 mb-2">
            <MapPin size={14} className="text-indigo-200" />
            <p className="text-indigo-100 text-[10px] font-black uppercase tracking-[0.2em]">Live Location</p>
          </div>
          <h2 className="text-4xl font-black tracking-tight">{weather.current.location}</h2>
          <p className="text-indigo-50 text-sm font-medium capitalize mt-1">{weather.current.conditions}</p>
        </div>

        <div className="flex items-center gap-6 mt-4 md:mt-0">
          <div className="bg-black/20 backdrop-blur-xl px-6 py-4 rounded-[2rem] flex items-center gap-4">
            <div className="text-center">
              <p className="text-3xl font-black">{Math.round(weather.current.temp)}°</p>
              <p className="text-[10px] font-bold text-indigo-200 uppercase">Temp</p>
            </div>
            <div className="w-px h-8 bg-white/20"></div>
            <div className="text-center">
              <p className="text-3xl font-black">{Math.round(weather.current.windspeed)}</p>
              <p className="text-[10px] font-bold text-indigo-200 uppercase">KM/H</p>
            </div>
          </div>
          {getWeatherIcon(weather.current.conditions, 48)}
        </div>
      </div>

      {/* 2. BOTTOM SECTION: 7-DAY FORECAST ROW */}
      <div className="grid grid-cols-4 md:grid-cols-7 gap-2 pt-6 border-t border-white/10">
        {weather.forecast.map((day, index) => (
          <div key={index} className="flex flex-col items-center p-2 rounded-2xl hover:bg-white/5 transition-colors">
            <p className="text-[10px] font-bold text-indigo-200 mb-2">
              {index === 0 ? "TODAY" : getDayName(day.date)}
            </p>
            {getWeatherIcon(day.conditions, 24)}
            <p className="text-lg font-black mt-2">{Math.round(day.temp)}°</p>
            <p className="text-[8px] text-indigo-100/60 uppercase text-center leading-tight">
               {day.conditions.split(',')[0]}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherDisplay;