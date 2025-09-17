"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "blue" | "green" | "red";
}

export default function Button({
  children,
  onClick,
  variant = "blue",
  ...props
}: ButtonProps) {
  const variants = {
    blue: "from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700",
    green:
      "from-green-500 to-green-600 hover:from-green-600 hover:to-green-700",
    red: "from-red-500 to-red-600 hover:from-red-600 hover:to-red-700",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        "flex-1 flex items-center justify-center gap-2 text-white py-2 rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-[1.02]",
        "bg-gradient-to-r",
        variants[variant]
      )}
      {...props}
    >
      {children}
    </button>
  );
}
