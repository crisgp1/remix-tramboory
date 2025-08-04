import { type ReactNode } from "react";
import { useAuth } from "@/shared/hooks/useAuth";
import { UserRole, AdminRole } from "@/shared/types/user";
import { SignInButton } from "@clerk/clerk-react";

// Single Responsibility Principle - Component only handles route protection
interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
  allowedAdminRoles?: AdminRole[];
  requiredPermissions?: string[];
}

export function ProtectedRoute({ 
  children, 
  allowedRoles = [], 
  allowedAdminRoles = [],
  requiredPermissions = []
}: ProtectedRouteProps) {
  const { 
    isLoaded, 
    isSignedIn, 
    getUserRole, 
    getAdminRole, 
    hasPermission 
  } = useAuth();

  // Loading state
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  // Not signed in
  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">SE</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Acceso Restringido</h1>
            <p className="text-gray-300">Debes iniciar sesión para acceder a esta área</p>
          </div>
          
          <SignInButton mode="modal">
            <button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105">
              Iniciar Sesión
            </button>
          </SignInButton>
        </div>
      </div>
    );
  }

  const userRole = getUserRole();
  const adminRole = getAdminRole();

  // Super Admin has access to everything (impersonation capability)
  const isSuperAdmin = userRole === UserRole.ADMIN && adminRole === AdminRole.SUPER_ADMIN;

  // Check role access
  if (allowedRoles.length > 0 && (!userRole || (!allowedRoles.includes(userRole) && !isSuperAdmin))) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="mb-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">Acceso Denegado</h1>
            <p className="text-gray-600">No tienes permisos para acceder a esta área</p>
          </div>
          
          <button 
            onClick={() => window.history.back()}
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-300"
          >
            Volver Atrás
          </button>
        </div>
      </div>
    );
  }

  // Check admin role access
  if (allowedAdminRoles.length > 0 && userRole === UserRole.ADMIN) {
    // If user has basic admin role but no specific admin role, allow access to non-restricted sections
    if (!adminRole) {
      // Only restrict access to Super Admin specific sections
      const superAdminOnlySections = [AdminRole.SUPER_ADMIN];
      const isRestrictedToSuperAdmin = allowedAdminRoles.length === 1 && allowedAdminRoles.includes(AdminRole.SUPER_ADMIN);
      if (isRestrictedToSuperAdmin) {
        return (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center max-w-md mx-auto p-8">
              <div className="mb-8">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 0h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h1 className="text-xl font-bold text-gray-900 mb-2">Acceso Super Admin Requerido</h1>
                <p className="text-gray-600">Esta sección requiere permisos de Super Administrador</p>
              </div>
              
              <button 
                onClick={() => window.history.back()}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-300"
              >
                Volver Atrás
              </button>
            </div>
          </div>
        );
      }
      // Allow access to other admin sections for basic admin users
      return <>{children}</>;
    }
    
    if (!allowedAdminRoles.includes(adminRole)) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-8">
            <div className="mb-8">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 0h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h1 className="text-xl font-bold text-gray-900 mb-2">Nivel de Admin Insuficiente</h1>
              <p className="text-gray-600">Tu rol de administrador no tiene acceso a esta función</p>
            </div>
            
            <button 
              onClick={() => window.history.back()}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-300"
            >
              Volver Atrás
            </button>
          </div>
        </div>
      );
    }
  }

  // Check specific permissions
  if (requiredPermissions.length > 0) {
    const hasAllPermissions = requiredPermissions.every(permission => hasPermission(permission));
    if (!hasAllPermissions) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-8">
            <div className="mb-8">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h1 className="text-xl font-bold text-gray-900 mb-2">Permisos Insuficientes</h1>
              <p className="text-gray-600">No tienes los permisos necesarios para esta acción</p>
            </div>
            
            <button 
              onClick={() => window.history.back()}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-300"
            >
              Volver Atrás
            </button>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
}