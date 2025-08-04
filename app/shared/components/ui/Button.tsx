import { type ButtonHTMLAttributes, forwardRef } from "react";
import { clsx } from "clsx";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'gradient' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', fullWidth = false, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={clsx(
          // Base styles
          "relative inline-flex items-center justify-center font-medium transition-all duration-300",
          "focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
          "transform active:scale-[0.96] overflow-hidden",
          
          // Size variants
          size === 'sm' && "px-3 py-1.5 text-sm rounded-xl",
          size === 'md' && "px-5 py-2.5 text-sm rounded-xl",
          size === 'lg' && "px-7 py-3.5 text-base rounded-xl",
          
          // Variant styles
          variant === 'primary' && [
            "bg-blue-600 text-white hover:bg-blue-700",
            "focus:ring-blue-500",
            "shadow-lg shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-600/40"
          ],
          
          variant === 'gradient' && [
            "bg-gradient-to-r from-purple-600 to-blue-600 text-white",
            "hover:from-purple-700 hover:to-blue-700",
            "focus:ring-purple-500",
            "shadow-lg shadow-purple-600/25 hover:shadow-xl hover:shadow-purple-600/40"
          ],
          
          variant === 'secondary' && [
            "bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-600",
            "focus:ring-gray-500",
            "border border-gray-200 dark:border-gray-600 shadow-sm hover:shadow-md"
          ],
          
          variant === 'outline' && [
            "bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800",
            "focus:ring-gray-500",
            "border-2 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
          ],
          
          variant === 'ghost' && [
            "bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
            "focus:ring-gray-500"
          ],
          
          variant === 'danger' && [
            "bg-red-600 text-white hover:bg-red-700",
            "focus:ring-red-500",
            "shadow-lg shadow-red-600/25 hover:shadow-xl hover:shadow-red-600/40"
          ],
          
          fullWidth && "w-full",
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };