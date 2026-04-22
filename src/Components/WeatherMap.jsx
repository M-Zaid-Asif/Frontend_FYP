import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, AlertTriangle, Crosshair } from "lucide-react";
import axiosApi from "../axiosApi";
import L from "leaflet";

// --- FIX: Leaflet Marker Assets & Anchor Logic ---
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41], // Pinpoints the sharp tip to the coordinate
  popupAnchor: [1, -34],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Helper component to jump to a specific location
const RecenterMap = ({ coords }) => {
  const map = useMap();
  useEffect(() => {
    if (coords) map.setView(coords, 13);
  }, [coords, map]);
  return null;
};

const MapPage = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mapCenter, setMapCenter] = useState([33.6844, 73.0479]); // Default: Islamabad

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await axiosApi.get("/users/getAllReports");
        const data = Array.isArray(res.data.data) ? res.data.data : [];
        
        // DEBUG: Check your coordinates in the console
        console.log("--- MAP DATA DEBUG ---");
        data.forEach(r => console.log(`Report: ${r.title} | Lat: ${r.latitude} | Lon: ${r.longitude}`));
        
        setReports(data);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const getDisasterTheme = (type) => {
    const t = type?.toUpperCase();
    if (t?.includes("FLOOD")) return { color: "#3b82f6", fill: "#3b82f6" }; 
    if (t?.includes("EARTHQUAKE")) return { color: "#ef4444", fill: "#ef4444" }; 
    return { color: "#f59e0b", fill: "#f59e0b" }; 
  };

  if (loading) return (
    <div className="h-screen w-full flex items-center justify-center bg-slate-900">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
    </div>
  );

  return (
    <div className="h-screen w-full relative">
      {/* UI Overlay */}
      <div className="absolute top-6 left-6 z-[1000] flex flex-col gap-3">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)} 
            className="p-3 bg-white rounded-full shadow-2xl hover:scale-110 transition-transform"
          >
            <ArrowLeft size={20} className="text-slate-900" />
          </button>
          
          <div className="bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 text-white shadow-2xl">
            <p className="text-[10px] font-bold uppercase tracking-tighter text-indigo-400">Live Coverage</p>
            <h1 className="text-sm font-black">{reports.length} Active Incidents</h1>
          </div>
        </div>

        {/* Legend */}
        <div className="bg-white/90 backdrop-blur-sm p-3 rounded-xl shadow-xl border border-slate-200 w-fit">
          <p className="text-[9px] font-bold uppercase text-slate-400 mb-2">Legend</p>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-[11px] font-bold text-slate-700">
              <span className="w-3 h-3 rounded-full bg-blue-500"></span> Floods
            </div>
            <div className="flex items-center gap-2 text-[11px] font-bold text-slate-700">
              <span className="w-3 h-3 rounded-full bg-red-500"></span> Earthquakes
            </div>
          </div>
        </div>
      </div>

      <MapContainer
        center={mapCenter}
        zoom={12}
        className="h-full w-full"
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; CARTO'
        />

        <RecenterMap coords={null} />

        {reports.map((report) => {
          // CRITICAL: Ensure parsing is strictly Lat, then Lon
          const lat = parseFloat(report.latitude);
          const lon = parseFloat(report.longitude);

          // Validation to prevent kilometer-level "ghost" markers
          if (isNaN(lat) || isNaN(lon)) return null;

          const theme = getDisasterTheme(report.type);

          return (
            <React.Fragment key={report.id}>
              {/* LEAFLET: [Latitude, Longitude] */}
              <Marker position={[lat, lon]}>
                <Popup>
                  <div className="p-1 min-w-[180px]">
                    <div className="flex justify-between items-center mb-2">
                      <span 
                        style={{ backgroundColor: theme.fill }} 
                        className="text-[9px] font-black text-white px-2 py-0.5 rounded-full uppercase"
                      >
                        {report.type}
                      </span>
                      {report.status === "VERIFIED" && (
                        <div className="text-green-600 flex items-center gap-1">
                           <AlertTriangle size={10} /> <span className="text-[8px] font-bold">VERIFIED</span>
                        </div>
                      )}
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm leading-tight">{report.title}</h3>
                    <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-1">
                      <MapPin size={10} /> {report.locationName}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1 italic">
                      Coord: {lat.toFixed(4)}, {lon.toFixed(4)}
                    </p>
                  </div>
                </Popup>
              </Marker>

              {/* Impact Zone Circle */}
              <Circle
                center={[lat, lon]}
                pathOptions={{ 
                    color: theme.color, 
                    fillColor: theme.fill, 
                    fillOpacity: 0.15,
                    weight: 1 
                }}
                radius={1000} // 1km Radius
              />
            </React.Fragment>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default MapPage;