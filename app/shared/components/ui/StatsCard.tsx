import { type ReactNode } from "react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
}

export function StatsCard({ 
  title, 
  value, 
  icon,
  trend,
  color = 'blue' 
}: StatsCardProps) {
  const colorClasses = {
    blue: {
      bg: 'bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10',
      icon: 'bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500',
      text: 'text-white',
      accent: 'text-blue-600 dark:text-blue-400',
      shadow: 'shadow-blue-500/20 dark:shadow-blue-400/30'
    },
    green: {
      bg: 'bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-900/20 dark:to-emerald-800/10',
      icon: 'bg-gradient-to-br from-emerald-500 to-emerald-600 dark:from-emerald-400 dark:to-emerald-500',
      text: 'text-white',
      accent: 'text-emerald-600 dark:text-emerald-400',
      shadow: 'shadow-emerald-500/20 dark:shadow-emerald-400/30'
    },
    purple: {
      bg: 'bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-800/10',
      icon: 'bg-gradient-to-br from-purple-500 to-purple-600 dark:from-purple-400 dark:to-purple-500',
      text: 'text-white',
      accent: 'text-purple-600 dark:text-purple-400',
      shadow: 'shadow-purple-500/20 dark:shadow-purple-400/30'
    },
    orange: {
      bg: 'bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-900/20 dark:to-orange-800/10',
      icon: 'bg-gradient-to-br from-orange-500 to-orange-600 dark:from-orange-400 dark:to-orange-500',
      text: 'text-white',
      accent: 'text-orange-600 dark:text-orange-400',
      shadow: 'shadow-orange-500/20 dark:shadow-orange-400/30'
    },
    red: {
      bg: 'bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-900/20 dark:to-red-800/10',
      icon: 'bg-gradient-to-br from-red-500 to-red-600 dark:from-red-400 dark:to-red-500',
      text: 'text-white',
      accent: 'text-red-600 dark:text-red-400',
      shadow: 'shadow-red-500/20 dark:shadow-red-400/30'
    }
  };

  const colors = colorClasses[color];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 hover:shadow-xl hover:shadow-gray-200/60 dark:hover:shadow-gray-900/60 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
      {/* Background gradient overlay */}
      <div className={`absolute inset-0 ${colors.bg} opacity-20 dark:opacity-30 group-hover:opacity-30 dark:group-hover:opacity-40 transition-opacity duration-300`}></div>
      
      <div className="relative flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">{value}</p>
          
          {trend && (
            <div className="flex items-center">
              <div className={`flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                trend.isPositive 
                  ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300' 
                  : 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300'
              }`}>
                <span className="mr-1">
                  {trend.isPositive ? '↗' : '↘'}
                </span>
                {Math.abs(trend.value)}%
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">vs mes anterior</span>
            </div>
          )}
        </div>
        
        {icon && (
          <div className={`${colors.icon} ${colors.text} p-3 rounded-2xl shadow-lg ${colors.shadow} dark:shadow-lg dark:shadow-gray-900/50 transform group-hover:scale-110 transition-transform duration-300`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}