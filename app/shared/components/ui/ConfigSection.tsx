import { type ReactNode } from "react";
import { Card, CardHeader, CardTitle, CardDescription } from "./Card";

interface ConfigSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
  icon?: ReactNode;
  className?: string;
}

export function ConfigSection({ 
  title, 
  description, 
  children, 
  icon,
  className = '' 
}: ConfigSectionProps) {
  return (
    <Card variant="elevated" className={`mb-6 ${className}`}>
      <CardHeader className="pb-4">
        <div className="flex items-start space-x-3">
          {icon && (
            <div className="flex-shrink-0 p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
              <div className="w-5 h-5 text-blue-600 dark:text-blue-400">
                {icon}
              </div>
            </div>
          )}
          <div className="flex-1">
            <CardTitle className="text-lg">{title}</CardTitle>
            {description && (
              <CardDescription className="mt-1">{description}</CardDescription>
            )}
          </div>
        </div>
      </CardHeader>
      <div className="px-6 pb-6">
        {children}
      </div>
    </Card>
  );
}