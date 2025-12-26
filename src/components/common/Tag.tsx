import React from "react";
import "./Tag.css";

interface TagProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Tag: React.FC<TagProps> = ({
  children,
  className = "",
  onClick,
}) => {
  return (
    <span
      className={`ds-tag ${onClick ? "interactive" : ""} ${className}`}
      onClick={onClick}
    >
      {children}
    </span>
  );
};
