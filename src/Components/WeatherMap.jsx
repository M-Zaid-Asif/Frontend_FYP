import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, AlertTriangle } from "lucide-react";
import axiosApi from "../axiosApi";
import L from "leaflet";

// --- FIX: Leaflet Marker Assets ---
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41], // Crucial: Points the tip of the pin to the coord
  popupAnchor: [1, -34],
});
L.Marker.prototype.options.icon = DefaultIcon;

const MapPage = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await axiosApi.get("/users/getAllReports");
        setReports(Array.isArray(res.data.data) ? res.data.data : []);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  // Helper to determine color based on disaster type
  const getDisasterTheme = (type) => {
    const t = type?.toLowerCase();
    if (t?.includes("flood") || t?.includes("selab")) return { color: "#3b82f6", fill: "#3b82f6" }; // Blue
    if (t?.includes("earthquake") || t?.includes("zalzala")) return { color: "#ef4444", fill: "#ef4444" }; // Red
    return { color: "#f59e0b", fill: "#f59e0b" }; // Orange for general alerts
  };

  if (loading) return <div className="h-screen w-full flex items-center justify-center bg-slate-900"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div></div>;

  return (
    <div className="h-screen w-full relative">
      {/* Back Button & Stats */}
      <div className="absolute top-6 left-6 z-[1000] flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-3 bg-white rounded-full shadow-2xl hover:scale-110 transition-transform">
          <ArrowLeft size={20} className="text-slate-900" />
        </button>
        <div className="bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 text-white shadow-2xl">
          <p className="text-[10px] font-bold uppercase tracking-tighter text-indigo-400">Live Coverage</p>
          <h1 className="text-sm font-black">{reports.length} Active Incidents</h1>
        </div>
      </div>

      <MapContainer
        center={[33.6844, 73.0479]}
        zoom={12}
        className="h-full w-full"
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; OpenStreetMap &copy; CARTO'
        />

        {reports.map((report) => {
          const lat = parseFloat(report.latitude);
          const lon = parseFloat(report.longitude);
          if (isNaN(lat) || isNaN(lon)) return null;

          const theme = getDisasterTheme(report.type);

          return (
            <React.Fragment key={report.id}>
              {/* 1. The Location Pin */}
              <Marker position={[lat, lon]}>
                <Popup>
                  <div className="p-1 min-w-[160px]">
                    <div className="flex justify-between items-start mb-2">
                      <span style={{ backgroundColor: theme.fill }} className="text-[9px] font-black text-white px-2 py-0.5 rounded-full uppercase">
                        {report.type}
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm">{report.title}</h3>
                    <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-1">
                      <MapPin size={10} /> {report.locationName}
                    </p>
                    <p className="text-[11px] text-slate-600 mt-2 line-clamp-2 italic">"{report.description}"</p>
                  </div>
                </Popup>
              </Marker>

              {/* 2. The Impact Radius (Visual Modification) */}
              <Circle
                center={[lat, lon]}
                pathOptions={{ 
                    color: theme.color, 
                    fillColor: theme.fill, 
                    fillOpacity: 0.2,
                    weight: 2 
                }}
                radius={800} // Shows an 800-meter impact zone
              />
            </React.Fragment>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default MapPage;