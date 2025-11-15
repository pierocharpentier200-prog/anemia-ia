import React from "react";

export const Button = ({
  children,
  className = "",
  variant = "default",
  size = "md",
  ...props
}) => {
  const base =
    "inline-flex items-center justify-center rounded-md font-medium transition focus:outline-none focus:ring disabled:opacity-50 disabled:pointer-events-none";
  const variants = {
    default: "bg-gray-900 text-white hover:bg-gray-800",
    outline: "bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-50",
    ghost: "bg-transparent text-gray-700 hover:bg-gray-100",
  };
  const sizes = {
    sm: "h-9 px-3 text-sm",
    md: "h-10 px-4 text-sm",
    lg: "h-12 px-6 text-base",
  };

  return (
    <button
      className={`${base} ${variants[variant] ?? variants.default} ${sizes[size] ?? sizes.md} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
