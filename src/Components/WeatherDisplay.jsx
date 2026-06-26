import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Cloud,
  Sun,
  CloudRain,
  Wind,
  MapPin,
  Droplets,
  Umbrella,
  Calendar,
  AlertTriangle,
  Search,
} from "lucide-react";
import { format } from "date-fns";

const WeatherDisplay = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cityInput, setCityInput] = useState("");

  // Weather Fetch Function
  const fetchWeatherData = async (lat = null, lon = null, city = null) => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:8000/api/v1/users/currentWeather",
        {
          params: { lat, lon, city },
          withCredentials: true,
        },
      );
      if (response.data.success) {
        setWeatherData(response.data.data);
      }
    } catch (err) {
      console.error("Weather Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Reading Exact Location Weather
  useEffect(() => {
    const initWeather = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            fetchWeatherData(pos.coords.latitude, pos.coords.longitude);
          },
          () => {
            fetchWeatherData(null, null, "Islamabad");
          },
        );
      } else {
        fetchWeatherData(null, null, "Islamabad");
      }
    };
    initWeather();
  }, []);

  // Search Submit Handler
  const handleSearch = (e) => {
    e.preventDefault();
    if (cityInput.trim()) {
      fetchWeatherData(null, null, cityInput);
      setCityInput("");
    }
  };

  // Weather Icon
  const getWeatherIcon = (condition, size = 32) => {
    const cond = condition?.toLowerCase() || "";
    if (cond.includes("rain"))
      return <CloudRain className="text-blue-400" size={size} />;
    if (cond.includes("cloud"))
      return <Cloud className="text-gray-400" size={size} />;
    return <Sun className="text-yellow-400" size={size} />;
  };

  if (loading && !weatherData)
    return (
      <div className="max-w-4xl mx-auto h-64 bg-indigo-800/10 animate-pulse rounded-3xl w-full mt-8" />
    );
  
  if (!weatherData) return null;

  const { current, days } = weatherData;
  const todayStats = days[0];

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-8 px-4">

      {/* SEARCH BAR SECTION */}
      <form onSubmit={handleSearch} className="relative group mb-8">
        <div className="relative flex items-center">
          <Search className="absolute left-4 text-gray-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
          <input
            type="text"
            placeholder="Search for a city (e.g. Rawalpindi)..."
            className="w-full pl-12 pr-32 py-4 bg-white rounded-3xl shadow-xl shadow-indigo-900/5 border border-gray-100 outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all text-gray-700 font-medium"
            value={cityInput}
            onChange={(e) => setCityInput(e.target.value)}
          />
          <button 
            type="submit" 
            className="absolute right-2 bg-indigo-600 text-white px-6 py-2.5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg active:scale-95"
          >
            Update
          </button>
        </div>
      </form>

      {/* SECTION HEADER */}
      <div className="flex items-center gap-3 mb-2">
        <div className="h-8 w-1 bg-indigo-600 rounded-full"></div>
        <h2 className="text-xl font-black text-gray-800 tracking-tight">
          Weather Intelligence
        </h2>
      </div>

      {/* MAIN CURRENT WEATHER CARD */}
      <div className="bg-gradient-to-br from-indigo-600 via-blue-600 to-blue-500 rounded-[2.5rem] p-8 text-white shadow-2xl flex flex-col md:flex-row justify-between items-center relative overflow-hidden border border-white/20">
        <div className="flex items-center gap-6 z-10">
          <div className="bg-white/10 p-5 rounded-3xl backdrop-blur-xl border border-white/20 shadow-2xl">
            {getWeatherIcon(current.conditions, 48)}
          </div>
          <div>
            <p className="text-[10px] font-black text-indigo-100 uppercase tracking-[0.2em] flex items-center gap-2 mb-2 opacity-80">
              <MapPin size={14} className="text-blue-200" /> {weatherData.address || current.location}
            </p>
            <h2 className="text-5xl font-black tracking-tighter">
              {Math.round(current.temp)}°C
            </h2>
            <p className="text-sm text-indigo-100/90 font-bold mt-2 bg-black/10 w-fit px-3 py-1 rounded-full backdrop-blur-sm">
              Feels like {Math.round(todayStats.feelslike)}°C •{" "}
              {current.conditions}
            </p>
          </div>
        </div>

        <div className="flex gap-6 sm:gap-10 mt-8 md:mt-0 border-t md:border-t-0 md:border-l border-white/20 pt-6 md:pt-0 md:pl-10 z-10 w-full md:w-auto justify-center">
          <WeatherStat
            icon={<Droplets size={18} />}
            value={`${Math.round(current.humidity)}%`}
            label="Humidity"
          />
          <WeatherStat
            icon={<Umbrella size={18} />}
            value={`${current.precip || 0}mm`}
            label="Rainfall"
          />
          <WeatherStat
            icon={<Wind size={18} />}
            value={Math.round(current.windspeed)}
            label="KM/H"
            hideMobile
          />
        </div>

        <div className="absolute -right-16 -top-16 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-blue-400/10 rounded-full blur-[80px]"></div>
      </div>

      {/* 7-DAY FORECAST GRID */}
      <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-indigo-900/5 border border-gray-100">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 rounded-xl">
              <Calendar size={20} className="text-indigo-600" />
            </div>
            <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest">
              Weekly Outlook
            </h3>
          </div>
          <div className="hidden sm:flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></div>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">
              Precipitation Logic Active
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-4">
          {days.slice(0, 7).map((day, index) => {
            const precipValue = day.precip || 0;
            const isHighRisk = precipValue > 20;
            const isMidRisk = precipValue > 10 && precipValue <= 20;

            return (
              <div
                key={index}
                className={`flex flex-col items-center rounded-3xl transition-all duration-500 group border overflow-hidden ${
                  isHighRisk
                    ? "bg-red-50 border-red-100 shadow-lg shadow-red-900/5 scale-105 z-10"
                    : isMidRisk
                      ? "bg-amber-50 border-amber-100"
                      : "bg-gray-50/30 border-transparent hover:bg-white hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-900/5"
                }`}
              >
                <div
                  className={`w-full text-center py-3 px-1 mb-2 ${
                    isHighRisk
                      ? "bg-red-500 text-white"
                      : isMidRisk
                        ? "bg-amber-500 text-white"
                        : "bg-transparent"
                  }`}
                >
                  <p
                    className={`text-[10px] font-black uppercase tracking-widest ${
                      isHighRisk || isMidRisk
                        ? "text-white"
                        : index === 0
                          ? "text-indigo-600"
                          : "text-gray-400"
                    }`}
                  >
                    {index === 0
                      ? "Today"
                      : format(new Date(day.datetime), "EEE")}
                  </p>
                  <p
                    className={`text-[9px] font-bold mt-0.5 ${
                      isHighRisk || isMidRisk
                        ? "text-white/80"
                        : "text-gray-400/60"
                    }`}
                  >
                    {format(new Date(day.datetime), "dd MMM")}
                  </p>
                </div>

                <div className="my-2 transform group-hover:rotate-12 transition-transform duration-500">
                  {getWeatherIcon(day.conditions, 28)}
                </div>

                <div className="text-center w-full pb-4 px-2">
                  <p className="text-base font-black text-gray-800">
                    {Math.round(day.tempmax)}°
                  </p>

                  <div className="mt-3 flex flex-col items-center w-full px-2">
                    <div
                      className={`flex items-center gap-1 mb-1.5 ${
                        isHighRisk
                          ? "text-red-600"
                          : isMidRisk
                            ? "text-amber-600"
                            : "text-blue-500"
                      }`}
                    >
                      <Droplets size={12} />
                      <span className="text-[10px] font-black">
                        {precipValue}mm
                      </span>
                    </div>

                    <div className="w-full h-1.5 bg-gray-200/50 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-1000 ${
                          isHighRisk
                            ? "bg-red-500"
                            : isMidRisk
                              ? "bg-amber-500"
                              : "bg-blue-400"
                        }`}
                        style={{
                          width: `${Math.min(day.precipprob || 5, 100)}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const WeatherStat = ({ icon, value, label, hideMobile }) => (
  <div className={`text-center ${hideMobile ? "hidden sm:block" : ""}`}>
    <p className="flex items-center justify-center gap-2 text-lg font-black text-white">
      {React.cloneElement(icon, { className: "text-blue-200" })} {value}
    </p>
    <p className="text-[10px] text-indigo-100 uppercase font-black tracking-widest opacity-60 mt-1">
      {label}
    </p>
  </div>
);

export default WeatherDisplay;