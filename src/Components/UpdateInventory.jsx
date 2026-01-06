import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit3,
  Trash2,
  Package,
  Save,
  X,
  Loader2,
  ChevronLeft,
  AlertTriangle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import axiosApi from "../axiosApi";

const UpdateInventory = () => {
  const navigate = useNavigate();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    category: "FOOD",
    itemName: "",
    quantity: "",
    unit: "",
    description: "",
  });

  // 1. Fetch Resources
  const fetchResources = async () => {
    try {
      const response = await axiosApi.get("/users/getResources");
      setResources(response.data.data);
    } catch (error) {
      toast.error("Failed to load inventory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  // 2. Handle Add or Update Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading(
      editingId ? "Updating..." : "Adding item..."
    );

    try {
      if (editingId) {
        // Update Logic
        await axiosApi.patch(`/users/updateResource/${editingId}`, formData);
        toast.success("Resource updated", { id: loadingToast });
      } else {
        // Add Logic
        await axiosApi.post("/users/addResources", formData);
        toast.success("Resource added", { id: loadingToast });
      }
      resetForm();
      fetchResources();
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed", {
        id: loadingToast,
      });
    }
  };

  // 3. Handle Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this item?")) return;

    try {
      await axiosApi.delete(`/users/deleteResource/${id}`);
      toast.success("Item removed");
      setResources((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  const resetForm = () => {
    setFormData({
      category: "",
      itemName: "",
      quantity: "",
      unit: "",
      description: "",
    });
    setEditingId(null);
    setIsModalOpen(false);
  };

  const startEdit = (item) => {
    setFormData({
      category: item.category,
      itemName: item.itemName,
      quantity: item.quantity,
      unit: item.unit || "unit",
      description: item.description || "",
    });
    setEditingId(item.id);
    setIsModalOpen(true);
  };

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-indigo-600" />
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <Toaster position="top-center" />
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="text-gray-500 hover:text-indigo-600 flex items-center gap-1 text-sm mb-2"
            >
              <ChevronLeft size={16} /> Back to Dashboard
            </button>
            <h1 className="text-3xl font-bold text-gray-900">
              Inventory Management
            </h1>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition shadow-lg shadow-indigo-200"
          >
            <Plus size={20} /> Add New Item
          </button>
        </div>

        {/* Inventory Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase">
                  Item Details
                </th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase">
                  Category
                </th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase text-center">
                  Quantity
                </th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {resources.length > 0 ? (
                resources.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition">
                    <td className="p-4">
                      <p className="font-bold text-gray-900">{item.itemName}</p>
                      <p className="text-xs text-gray-500 truncate max-w-[200px]">
                        {item.description || "No description"}
                      </p>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 rounded-md text-[10px] font-black bg-indigo-50 text-indigo-700 uppercase tracking-tighter">
                        {item.category}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <p className="text-lg font-bold text-gray-800">
                        {item.quantity}{" "}
                        <span className="text-xs font-normal text-gray-400">
                          {item.unit}
                        </span>
                      </p>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => startEdit(item)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        >
                          <Edit3 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-12 text-center text-gray-400">
                    <Package size={48} className="mx-auto mb-2 opacity-20" />
                    No items in inventory. Add your first resource!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Add/Edit Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="bg-indigo-600 p-6 text-white flex justify-between items-center">
                <h2 className="text-xl font-bold">
                  {editingId ? "Update Resource" : "Add to Inventory"}
                </h2>
                <button
                  onClick={resetForm}
                  className="hover:bg-white/20 p-1 rounded-full"
                >
                  <X size={20} />
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();

                  // --- FRONTEND VALIDATIONS ---
                  if (!formData.itemName.trim())
                    return toast.error("Item Name is required");
                  if (!formData.quantity || formData.quantity <= 0) {
                    return toast.error(
                      "Please enter a valid quantity greater than 0"
                    );
                  }
                  if (!formData.category)
                    return toast.error("Please select a category");

                  // Prepare payload: Convert quantity to Integer to satisfy Prisma
                  const payload = {
                    ...formData,
                    quantity: parseInt(formData.quantity, 10), // Crucial fix for 500 error
                    itemName: formData.itemName.trim(),
                    unit: formData.unit.trim() || "unit",
                    description: formData.description.trim() || null,
                  };

                  // Call the handlesubmit logic with the cleaned payload
                  // (Make sure your handleSubmit function accepts 'payload' as an argument)
                  handleSubmit(e, payload);
                }}
                className="p-6 space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1 tracking-wider">
                      Category *
                    </label>
                    <select
                      required
                      className="w-full border border-gray-200 p-2.5 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50"
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                    >
                      <option value="">Select...</option>
                      <option value="FOOD">Food / Rations</option>
                      <option value="MEDICAL">Medical Supplies</option>
                      <option value="SHELTER">Shelter / Bedding</option>
                      <option value="TRANSPORT">Transport / Vehicles</option>
                      <option value="TOOLS">Rescue Tools</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1 tracking-wider">
                      Quantity *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      placeholder="0"
                      className="w-full border border-gray-200 p-2.5 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                      value={formData.quantity}
                      onChange={(e) =>
                        setFormData({ ...formData, quantity: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1 tracking-wider">
                    Item Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Surgical Masks"
                    className="w-full border border-gray-200 p-2.5 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                    value={formData.itemName}
                    onChange={(e) =>
                      setFormData({ ...formData, itemName: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1 tracking-wider">
                    Unit (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., boxes, kg, units"
                    className="w-full border border-gray-200 p-2.5 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                    value={formData.unit}
                    onChange={(e) =>
                      setFormData({ ...formData, unit: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1 tracking-wider">
                    Description
                  </label>
                  <textarea
                    rows="2"
                    placeholder="Batch numbers, expiry, or specific details..."
                    className="w-full border border-gray-200 p-2.5 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-[0.98]"
                  >
                    <Save size={18} />
                    {editingId
                      ? "Update Inventory Item"
                      : "Confirm & Add Resource"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpdateInventory;
