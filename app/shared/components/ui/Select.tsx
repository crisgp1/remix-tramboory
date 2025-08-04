import { forwardRef, type SelectHTMLAttributes } from "react";
import { clsx } from "clsx";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  variant?: 'default' | 'error';
  fullWidth?: boolean;
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, variant = 'default', fullWidth = false, placeholder, children, ...props }, ref) => {
    return (
      <div className="relative">
        <select
          ref={ref}
          className={clsx(
            // Base styles
            "px-4 py-2.5 rounded-xl border transition-all duration-200 appearance-none",
            "font-medium bg-white dark:bg-gray-800",
            "focus:outline-none focus:ring-2 focus:ring-offset-2",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "pr-10", // Space for chevron
            
            // Variant styles
            variant === 'default' && [
              "border-gray-300 dark:border-gray-600",
              "text-gray-900 dark:text-gray-100",
              "focus:border-blue-500 dark:focus:border-blue-400",
              "focus:ring-blue-500 dark:focus:ring-blue-400",
              "hover:border-gray-400 dark:hover:border-gray-500"
            ],
            
            variant === 'error' && [
              "border-red-300 dark:border-red-600",
              "text-gray-900 dark:text-gray-100",
              "focus:border-red-500 dark:focus:border-red-400",
              "focus:ring-red-500 dark:focus:ring-red-400"
            ],
            
            fullWidth && "w-full",
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {children}
        </select>
        
        {/* Chevron icon */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    );
  }
);

Select.displayName = "Select";

export { Select };