import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Truck, AlertCircle, CheckCircle2 } from "lucide-react";
import axiosApi from "../axiosApi"; // Pointing to your default configuration Axios Instance

const DispatchFormPage = () => {
  const navigate = useNavigate();
  const [resources, setResources] = useState([]);
  const [selectedResourceId, setSelectedResourceId] = useState("");
  const [quantitySent, setQuantitySent] = useState("");
  const [dispatchedTo, setDispatchedTo] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch available resources to bind to select element fields drop down
  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const res = await axiosApi.get("/users/getResources"); // Adjust to your route path mapping
        // Filters items out that are completely out of stock
        setResources(res.data.data?.filter(r => r.quantity > 0) || []);
      } catch (err) {
        setError("Failed to fetch available stock items.");
      }
    };
    fetchStocks();
  }, []);

  const currentSelection = resources.find(r => r.id === selectedResourceId);

  const handleDispatchSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!selectedResourceId || !quantitySent || !dispatchedTo) {
      setError("Please populate all parameters inputs fields.");
      return;
    }

    const qty = parseInt(quantitySent);
    if (qty > currentSelection.quantity) {
      setError(`Over-allocation fault. Only ${currentSelection.quantity} ${currentSelection.unit} available inside storage.`);
      return;
    }

    setLoading(true);
    try {
      await axiosApi.post("/users/dispatch", {
        resourceId: selectedResourceId,
        quantitySent: qty,
        dispatchedTo
      });

      setSuccess("Outbound distribution asset tracking dispatched successfully!");
      // Reset variables indicators
      setQuantitySent("");
      setDispatchedTo("");
      
      // Refresh local stock tracking parameters balances arrays
      const updated = await axiosApi.get("/users/getResources");
      setResources(updated.data.data?.filter(r => r.quantity > 0) || []);
    } catch (err) {
      setError(err.response?.data?.message || "Internal transaction dispatch fault.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 space-y-4">
      <Link to="/updateInventory" className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 font-semibold mb-2">
        <ArrowLeft size={14} /> Back to Warehouse Stock
      </Link>

      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
        <div className="border-b pb-3">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <Truck size={20} className="text-blue-600" /> Outbound Dispatch Registry
          </h2>
          <p className="text-xs text-gray-400">Deduct cargo stocks and log distribution fields target deployment lines.</p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-100 text-red-700 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle size={16} /> <span className="font-semibold">{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-xl text-xs flex items-center gap-2">
            <CheckCircle2 size={16} /> <span className="font-semibold">{success}</span>
          </div>
        )}

        <form onSubmit={handleDispatchSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Select Supply Resource Item</label>
            <select
              required
              className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedResourceId}
              onChange={e => { setSelectedResourceId(e.target.value); setError(""); }}
            >
              <option value="">-- Choose available warehouse item --</option>
              {resources.map(r => (
                <option key={r.id} value={r.id}>
                  {r.itemName} [{r.category}] ({r.quantity} {r.unit} available)
                </option>
              ))}
            </select>
          </div>

          {currentSelection && (
            <div className="grid grid-cols-2 gap-4 animate-fadeIn">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Quantity to Ship</label>
                <div className="relative">
                  <input
                    type="number" required min={1} max={currentSelection.quantity}
                    className="w-full p-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    value={quantitySent}
                    onChange={e => setQuantitySent(e.target.value)}
                  />
                  <span className="absolute right-3 top-3 text-xs text-gray-400 font-bold uppercase">{currentSelection.unit}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Target Area / Destination Camp</label>
                <input
                  type="text" required placeholder="e.g., G-9 Ground Camp, Islamabad"
                  className="w-full p-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  value={dispatchedTo}
                  onChange={e => setDispatchedTo(e.target.value)}
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !selectedResourceId}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 text-white p-3 font-bold rounded-xl text-sm transition shadow-sm"
          >
            {loading ? "Processing Warehouse Deduction..." : "Execute Asset Shipment Allocation"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DispatchFormPage;