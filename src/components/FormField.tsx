"use client";

import { forwardRef, ReactNode } from "react";
import clsx from "clsx";

// Props for input or textarea field
interface FormFieldProps {
  label: string;
  type?: "text" | "email" | "tel" | "textarea";
  icon?: string;
  placeholder?: string;
  error?: string;
  rows?: number; // for textarea
  // extra props to pass to input/textarea
  inputProps?: React.InputHTMLAttributes<HTMLInputElement> &
    React.TextareaHTMLAttributes<HTMLTextAreaElement>;
}

// Generic form field component
const FormField = forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  FormFieldProps
>(
  (
    { label, type = "text", icon, placeholder, error, rows = 1, inputProps },
    ref
  ) => {
    const isTextarea = type === "textarea";

    return (
      <div
        className="flex border border-gray-300 rounded-2xl items-center px-4 shadow-md cursor-text h-16"
        onClick={() => (ref as any)?.current?.focus()}
      >
        {icon && (
          <img
            src={icon}
            alt={label.toLowerCase()}
            className="w-6 h-6 opacity-70"
          />
        )}
        <div className="w-full pl-5">
          <label
            className={clsx(
              "font-bold transition-all duration-200",
              inputProps?.value ? "text-sm" : "text-md"
            )}
            htmlFor={inputProps?.name}
          >
            {label}
          </label>

          {isTextarea ? (
            <textarea
              rows={rows}
              placeholder={placeholder}
              ref={ref as React.Ref<HTMLTextAreaElement>}
              className="w-full resize-none py-1 focus:outline-none focus:ring-0 active:ring-0"
              {...inputProps} // <-- spread register props here
            />
          ) : (
            <input
              type={type}
              placeholder={placeholder}
              ref={ref as React.Ref<HTMLInputElement>}
              className="w-full py-1 focus:outline-none focus:ring-0 active:ring-0"
              {...inputProps} // <-- spread register props here
            />
          )}

          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
      </div>
    );
  }
);

FormField.displayName = "FormField";

export default FormField;
