import React from "react";

export const Label = ({ className = "", children, ...props }) => {
  return (
    <label className={`text-sm font-medium text-gray-800 ${className}`} {...props}>
      {children}
    </label>
  );
};
