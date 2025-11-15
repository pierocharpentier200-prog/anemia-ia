import React from "react";

export const Input = ({ className = "", ...props }) => {
  return (
    <input
      className={`w-full h-10 px-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-red-300 focus:border-red-400 outline-none ${className}`}
      {...props}
    />
  );
};
