import React from "react";
import "./Container.css";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl"; // sm: ~800px, md: ~1140px, lg: ~1280px
}

export const Container: React.FC<ContainerProps> = ({
  children,
  className = "",
  size = "md",
}) => {
  return (
    <div className={`ds-container size-${size} ${className}`}>{children}</div>
  );
};
