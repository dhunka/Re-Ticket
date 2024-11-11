import * as React from "react";

interface BadgeProps {
  variant?: "primary" | "secondary";
  className?: string;
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({ variant = "primary", className = "", children }) => {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        variant === "secondary" ? "bg-white/10 text-white" : "bg-blue-500 text-white"
      } ${className}`}
    >
      {children}
    </span>
  );
};
