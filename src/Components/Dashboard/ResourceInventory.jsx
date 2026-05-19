import React from "react";
import { ShieldCheck, Package, Home, Wind, PlusCircle } from "lucide-react";
import { Link } from "react-router-dom";

const ResourceInventory = ({ resources }) => {
  const resourceTotals = resources.reduce((acc, item) => {
    const cat = item.category.toUpperCase();
    acc[cat] = (acc[cat] || 0) + item.quantity;
    return acc;
  }, {});

  const getResourceMeta = (category) => {
    const meta = {
      FOOD: {
        icon: <Package className="text-orange-600" />,
        bg: "bg-orange-50",
        label: "Food Rations",
      },
      MEDICAL: {
        icon: <ShieldCheck className="text-red-600" />,
        bg: "bg-red-50",
        label: "Medical Kits",
      },
      SHELTER: {
        icon: <Home className="text-blue-600" />,
        bg: "bg-blue-50",
        label: "Shelter Units",
      },
      TRANSPORT: {
        icon: <Wind className="text-indigo-600" />,
        bg: "bg-indigo-50",
        label: "Vehicles",
      },
      TOOLS: {
        icon: <PlusCircle className="text-green-600" />,
        bg: "bg-green-50",
        label: "Rescue Tools",
      },
    };
    return (
      meta[category] || { icon: <Package />, bg: "bg-gray-50", label: category }
    );
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
        <ShieldCheck size={20} className="text-indigo-600" /> Current Warehouse
        Stock
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.keys(resourceTotals).length > 0 ? (
          Object.keys(resourceTotals).map((cat) => {
            const { icon, bg, label } = getResourceMeta(cat);
            return (
              <div
                key={cat}
                className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4"
              >
                <div className={`${bg} p-3 rounded-xl`}>{icon}</div>
                <div>
                  <p className="text-2xl font-black text-gray-900">
                    {resourceTotals[cat]}
                  </p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    {label}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full p-8 border-2 border-dashed rounded-2xl text-center bg-white border-gray-200">
            <p className="text-gray-400">
              No resources found in inventory.
            </p>
            <Link
              to="/updateInventory"
              className="text-indigo-600 font-bold hover:underline"
            >
              Add Items Now
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResourceInventory;