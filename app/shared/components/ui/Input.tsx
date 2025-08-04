import { forwardRef, type InputHTMLAttributes } from "react";
import { clsx } from "clsx";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'error';
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant = 'default', fullWidth = false, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={clsx(
          // Base styles
          "px-4 py-2.5 rounded-xl border transition-all duration-200",
          "font-medium placeholder:text-gray-400 dark:placeholder:text-gray-500",
          "focus:outline-none focus:ring-2 focus:ring-offset-2",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          
          // Variant styles
          variant === 'default' && [
            "bg-white dark:bg-gray-800",
            "border-gray-300 dark:border-gray-600",
            "text-gray-900 dark:text-gray-100",
            "focus:border-blue-500 dark:focus:border-blue-400",
            "focus:ring-blue-500 dark:focus:ring-blue-400",
            "hover:border-gray-400 dark:hover:border-gray-500"
          ],
          
          variant === 'error' && [
            "bg-white dark:bg-gray-800",
            "border-red-300 dark:border-red-600",
            "text-gray-900 dark:text-gray-100",
            "focus:border-red-500 dark:focus:border-red-400",
            "focus:ring-red-500 dark:focus:ring-red-400"
          ],
          
          fullWidth && "w-full",
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export { Input };