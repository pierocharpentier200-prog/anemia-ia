import React, { createContext, useContext, useMemo, useRef, useState, useEffect } from "react";

const SelectCtx = createContext(null);

export const Select = ({ value, onValueChange, children }) => {
  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(value ?? "");

  useEffect(() => {
    setInternalValue(value ?? "");
  }, [value]);

  const api = useMemo(
    () => ({
      open,
      setOpen,
      value: internalValue,
      setValue: (v) => {
        setInternalValue(v);
        onValueChange?.(v);
        setOpen(false);
      },
    }),
    [open, internalValue, onValueChange]
  );

  return <SelectCtx.Provider value={api}>{children}</SelectCtx.Provider>;
};

export const SelectTrigger = ({ className = "", children, ...props }) => {
  const { open, setOpen } = useContext(SelectCtx);
  return (
    <button
      type="button"
      onClick={() => setOpen(!open)}
      className={`w-full h-10 px-3 rounded-md border border-gray-300 bg-white text-left flex items-center justify-between focus:ring-2 focus:ring-red-300 ${className}`}
      {...props}
    >
      <span className="truncate">{children}</span>
      <svg width="16" height="16" viewBox="0 0 20 20" className={`ml-2 transition ${open ? "rotate-180" : ""}`}>
        <path d="M5.5 7.5l4.5 4 4.5-4" stroke="currentColor" strokeWidth="1.5" fill="none" />
      </svg>
    </button>
  );
};

export const SelectValue = ({ placeholder = "Selecciona…", className = "" }) => {
  const { value } = useContext(SelectCtx);
  return <span className={className}>{value ? value.charAt(0).toUpperCase() + value.slice(1) : placeholder}</span>;
};

export const SelectContent = ({ className = "", children }) => {
  const { open, setOpen } = useContext(SelectCtx);
  const ref = useRef(null);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [setOpen]);

  if (!open) return null;

  return (
    <div
      ref={ref}
      className={`relative z-50`}
    >
      <div className={`mt-2 w-full rounded-md border border-gray-200 bg-white shadow-lg p-1 ${className}`}>
        {children}
      </div>
    </div>
  );
};

export const SelectItem = ({ value, children, className = "", ...props }) => {
  const { setValue } = useContext(SelectCtx);
  return (
    <div
      role="option"
      onClick={() => setValue(value)}
      className={`px-3 py-2 rounded-md cursor-pointer hover:bg-gray-100 text-sm ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
