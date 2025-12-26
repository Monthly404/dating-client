import React from "react";
import "./Button.css";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  className = "",
  ...props
}) => {
  return (
    <button
      className={`ds-button variant-${variant} size-${size} ${
        fullWidth ? "full-width" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
