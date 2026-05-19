import React from "react";
import { CheckCircle2, XCircle } from "lucide-react";

const FactorRow = ({ label, match }) => (
  <div className="flex items-center justify-between gap-2">
    <span className="text-[10px] text-gray-600 font-medium">{label}</span>
    {match ? (
      <CheckCircle2 size={12} className="text-green-500" />
    ) : (
      <XCircle size={12} className="text-red-400" />
    )}
  </div>
);

export default FactorRow;