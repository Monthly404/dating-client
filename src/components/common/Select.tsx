import React from "react";
import "./Select.css";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string | number; label: string }[];
}

export const Select: React.FC<SelectProps> = ({
  options,
  className = "",
  ...props
}) => {
  return (
    <select className={`ds-select ${className}`} {...props}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};
