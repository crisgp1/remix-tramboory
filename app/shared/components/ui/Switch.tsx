import { type InputHTMLAttributes, forwardRef } from "react";
import { clsx } from "clsx";

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  description?: string;
}

const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, label, description, ...props }, ref) => {
    return (
      <div className="flex items-start space-x-3">
        <div className="relative">
          <input
            type="checkbox"
            ref={ref}
            className="sr-only"
            {...props}
          />
          <div 
            className={clsx(
              "w-11 h-6 rounded-full transition-colors duration-200 cursor-pointer",
              "focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500",
              props.checked 
                ? "bg-blue-600 dark:bg-blue-500" 
                : "bg-gray-200 dark:bg-gray-700",
              props.disabled && "opacity-50 cursor-not-allowed",
              className
            )}
            onClick={() => !props.disabled && props.onChange?.({ 
              target: { checked: !props.checked } 
            } as any)}
          >
            <div 
              className={clsx(
                "absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200",
                props.checked ? "translate-x-5" : "translate-x-0.5"
              )}
            />
          </div>
        </div>
        
        {(label || description) && (
          <div className="flex-1">
            {label && (
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 cursor-pointer">
                {label}
              </label>
            )}
            {description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {description}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Switch.displayName = "Switch";

export { Switch };