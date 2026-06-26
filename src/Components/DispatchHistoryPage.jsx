import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, History, ClipboardList, Calendar, MapPin, Layers } from "lucide-react";
import { format } from "date-fns";
import axiosApi from "../axiosApi";

const DispatchHistoryPage = () => {
  const [historyLogs, setHistoryLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAuditHistory = async () => {
      try {
        const res = await axiosApi.get("/users/dispatch-history");
        setHistoryLogs(res.data.data || []);
      } catch (err) {
        setError("Failed to load historical dispatch telemetry reports.");
      } finally {
        setLoading(false);
      }
    };
    loadAuditHistory();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <Link to="/updateInventory" className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 font-semibold mb-2">
        <ArrowLeft size={14} /> Back to Warehouse Stock
      </Link>

      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
        <div className="border-b pb-3 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <History size={20} className="text-indigo-600" /> Outbound Shipment Auditing Ledger
            </h2>
            <p className="text-xs text-gray-400">Chronological history log tracking tracking supplies sent out to field locations.</p>
          </div>
          <span className="px-2.5 py-1 text-xs bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold rounded-full">
            Total Dispatches: {historyLogs.length}
          </span>
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs font-semibold">{error}</div>
        )}

        {loading ? (
          <div className="text-center py-12 text-sm text-gray-400 font-medium">Loading ledger indexes database rows...</div>
        ) : historyLogs.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed rounded-xl bg-gray-50/50 flex flex-col items-center gap-2">
            <ClipboardList className="text-gray-300" size={32} />
            <p className="text-sm text-gray-400 font-medium">No previous shipments have been logged by this NGO yet.</p>
          </div>
        ) : (
          /* AUDIT TABLE CONTAINER OVERVIEW GRID */
          <div className="overflow-x-auto rounded-xl border border-gray-100">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <th className="p-3.5 flex items-center gap-1.5"><Layers size={13}/> Item Description</th>
                  <th className="p-3.5">Quantity Shipped</th>
                  <th className="p-3.5-flex items-center gap-1.5"><MapPin size={13}/> Destined Zone Location</th>
                  <th className="p-3.5 flex items-center gap-1.5"><Calendar size={13}/> Dispatch Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm text-gray-700">
                {historyLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50/50 transition">
                    <td className="p-3.5">
                      <span className="font-bold text-gray-800 block">{log.resource?.itemName}</span>
                      <span className="text-[10px] font-extrabold uppercase bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded tracking-wide">
                        {log.resource?.category}
                      </span>
                    </td>
                    <td className="p-3.5 font-black text-gray-900">
                      {log.quantitySent} <span className="text-xs font-normal text-gray-400 font-mono uppercase">{log.resource?.unit}</span>
                    </td>
                    <td className="p-3.5">
                      <span className="font-semibold text-gray-700 flex items-center gap-1">
                        {log.dispatchedTo}
                      </span>
                    </td>
                    <td className="p-3.5 text-xs text-gray-500 font-mono font-medium">
                      {format(new Date(log.dispatchedAt), "dd MMM yyyy, hh:mm a")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DispatchHistoryPage;