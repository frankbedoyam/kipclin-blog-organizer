import React from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

const SortIcon = ({ columnKey, sortConfig }) => {
  if (sortConfig.key !== columnKey) return null;
  return sortConfig.direction === "asc" ? (
    <ChevronUp className="w-4 h-4" />
  ) : (
    <ChevronDown className="w-4 h-4" />
  );
};

export default SortIcon;