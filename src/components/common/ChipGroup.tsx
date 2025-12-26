import React from "react";
import "./ChipGroup.css";

interface ChipGroupProps {
  items: string[];
  selectedItems: string[];
  onToggle: (item: string) => void;
  className?: string;
}

export const ChipGroup: React.FC<ChipGroupProps> = ({
  items,
  selectedItems,
  onToggle,
  className = "",
}) => {
  return (
    <div className={`chip-container ${className}`}>
      {items.map((item) => (
        <button
          key={item}
          className={`chip-btn ${selectedItems.includes(item) ? "active" : ""}`}
          onClick={() => onToggle(item)}
        >
          {item}
        </button>
      ))}
    </div>
  );
};
