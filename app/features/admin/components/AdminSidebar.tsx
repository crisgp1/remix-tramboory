import { Link, useLocation } from "react-router";
import { type ReactElement } from "react";
import { useAuth } from "@/shared/hooks/useAuth";
import { AdminRole } from "@/shared/types/user";

// Single Responsibility Principle - Component only handles admin navigation
interface NavigationItem {
  name: string;
  href: string;
  icon: ReactElement;
  roles: AdminRole[];
  permissions?: string[];
}

const navigationItems: NavigationItem[] = [
  {
    name: 'Vista General',
    href: '/admin/dashboard',
    roles: [AdminRole.SUPER_ADMIN, AdminRole.OPERATIONS_MANAGER, AdminRole.EVENT_COORDINATOR, AdminRole.FINANCE_MANAGER, AdminRole.MARKETING_MANAGER],
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
      </svg>
    )
  },
  {
    name: 'Reservaciones',
    href: '/admin/reservations',
    roles: [AdminRole.SUPER_ADMIN, AdminRole.OPERATIONS_MANAGER, AdminRole.EVENT_COORDINATOR],
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v16a2 2 0 002 2z" />
      </svg>
    )
  },
  {
    name: 'Inventario',
    href: '/admin/inventory',
    roles: [AdminRole.SUPER_ADMIN, AdminRole.OPERATIONS_MANAGER],
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    )
  },
  {
    name: 'Proveedores',
    href: '/admin/suppliers',
    roles: [AdminRole.SUPER_ADMIN, AdminRole.OPERATIONS_MANAGER],
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    )
  },
  {
    name: 'Horarios',
    href: '/admin/schedule',
    roles: [AdminRole.SUPER_ADMIN, AdminRole.OPERATIONS_MANAGER, AdminRole.EVENT_COORDINATOR],
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  {
    name: 'Configuración',
    href: '/admin/settings',
    roles: [AdminRole.SUPER_ADMIN],
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )
  }
];

export function AdminSidebar() {
  const location = useLocation();
  const { getAdminRole } = useAuth();
  const adminRole = getAdminRole();

  // Open/Closed Principle - Filter navigation based on role without modifying the component
  const filteredNavigation = navigationItems.filter(item => {
    // If user has no specific admin role, show all items (basic admin access)
    if (!adminRole) return true;
    // Otherwise, filter by specific admin role
    return item.roles.includes(adminRole);
  });

  const getRoleBadgeColor = (role: AdminRole | null) => {
    switch (role) {
      case AdminRole.SUPER_ADMIN: return 'bg-gradient-to-r from-red-500 to-pink-500 text-white';
      case AdminRole.OPERATIONS_MANAGER: return 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white';
      case AdminRole.EVENT_COORDINATOR: return 'bg-gradient-to-r from-emerald-500 to-green-500 text-white';
      case AdminRole.FINANCE_MANAGER: return 'bg-gradient-to-r from-amber-500 to-orange-500 text-white';
      case AdminRole.MARKETING_MANAGER: return 'bg-gradient-to-r from-purple-500 to-violet-500 text-white';
      default: return 'bg-gradient-to-r from-gray-500 to-slate-500 text-white';
    }
  };

  const getRoleDisplayName = (role: AdminRole | null) => {
    switch (role) {
      case AdminRole.SUPER_ADMIN: return 'Super Admin';
      case AdminRole.OPERATIONS_MANAGER: return 'Gerente Operaciones';
      case AdminRole.EVENT_COORDINATOR: return 'Coordinador Eventos';
      case AdminRole.FINANCE_MANAGER: return 'Gerente Finanzas';
      case AdminRole.MARKETING_MANAGER: return 'Gerente Marketing';
      default: return 'Admin';
    }
  };

  return (
    <nav className="p-6">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-lg">A</span>
          </div>
          <span className="font-bold text-xl text-gray-900 dark:text-gray-100">Panel Admin</span>
        </div>
        
        {adminRole && (
          <div className="mb-6">
            <span className={`px-3 py-2 rounded-xl text-xs font-semibold shadow-sm ${getRoleBadgeColor(adminRole)}`}>
              {getRoleDisplayName(adminRole)}
            </span>
          </div>
        )}
      </div>

      <ul className="space-y-3">
        {filteredNavigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <li key={item.name}>
              <Link
                to={item.href}
                className={`group flex items-center space-x-3 px-4 py-3.5 rounded-2xl transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25 transform scale-[1.02]'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-gray-800/80 hover:shadow-md hover:shadow-gray-200/50 dark:hover:shadow-gray-900/50 hover:-translate-y-0.5'
                }`}
              >
                <div className={`p-1 rounded-lg transition-colors ${
                  isActive ? 'bg-white/20' : 'group-hover:bg-gray-100 dark:group-hover:bg-gray-700'
                }`}>
                  {item.icon}
                </div>
                <span className="font-semibold">{item.name}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}