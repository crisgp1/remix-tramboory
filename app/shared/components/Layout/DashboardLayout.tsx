import { type ReactNode } from "react";
import { UserButton } from "@clerk/clerk-react";
import { useAuth } from "@/shared/hooks/useAuth";
import { ThemeToggle } from "@/shared/components/ui/ThemeToggle";

// Single Responsibility Principle - Layout component only handles layout structure
interface DashboardLayoutProps {
  children: ReactNode;
  sidebar: ReactNode;
  title: string;
  subtitle?: string;
}

export function DashboardLayout({ children, sidebar, title, subtitle }: DashboardLayoutProps) {
  const { getCurrentUser } = useAuth();
  const user = getCurrentUser();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100/50 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-sm border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-40">
        <div className="flex items-center justify-between px-6 py-5">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">{title}</h1>
            {subtitle && <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm">{subtitle}</p>}
          </div>
          
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{user?.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">{user?.role}</p>
            </div>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-12 h-12 ring-2 ring-gray-200 dark:ring-gray-700 ring-offset-2 dark:ring-offset-gray-900",
                  userButtonPopoverCard: "bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg border border-gray-200 dark:border-gray-700 shadow-xl",
                }
              }}
            />
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-72 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm shadow-lg border-r border-gray-200/50 dark:border-gray-700/50 min-h-[calc(100vh-81px)]">
          {sidebar}
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 space-y-8">
          {children}
        </main>
      </div>
    </div>
  );
}