import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { UserRole, AdminRole } from "@/shared/types/user";

// Development helper component to set user roles in Clerk metadata
export default function RoleSelector() {
  const { user } = useUser();
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState('');

  const updateUserRole = async (role: UserRole, adminRole?: AdminRole) => {
    if (!user) return;
    
    setIsUpdating(true);
    setMessage('');
    
    try {
      const metadata: any = { role };
      
      if (role === UserRole.ADMIN && adminRole) {
        metadata.adminRole = adminRole;
        // Add default permissions based on admin role
        switch (adminRole) {
          case AdminRole.SUPER_ADMIN:
            metadata.permissions = ['*']; // All permissions
            break;
          case AdminRole.OPERATIONS_MANAGER:
            metadata.permissions = ['create_event', 'edit_event', 'view_all_events', 'manage_suppliers'];
            break;
          case AdminRole.EVENT_COORDINATOR:
            metadata.permissions = ['create_event', 'edit_event', 'view_all_events'];
            break;
          case AdminRole.FINANCE_MANAGER:
            metadata.permissions = ['view_financial_reports', 'manage_pricing', 'process_payments'];
            break;
          case AdminRole.MARKETING_MANAGER:
            metadata.permissions = ['view_all_users', 'manage_suppliers'];
            break;
        }
      }
      
      await user.update({
        unsafeMetadata: metadata
      });
      
      setMessage(`✅ Rol actualizado a: ${role}${adminRole ? ` (${adminRole})` : ''}`);
      
      // Reload page after a delay to see the changes
      setTimeout(() => {
        window.location.reload();
      }, 1500);
      
    } catch (error) {
      console.error('Error updating role:', error);
      setMessage('❌ Error al actualizar el rol');
    } finally {
      setIsUpdating(false);
    }
  };

  const currentRole = (user?.publicMetadata?.role as UserRole) || (user?.unsafeMetadata?.role as UserRole);
  const currentAdminRole = (user?.publicMetadata?.adminRole as AdminRole) || (user?.unsafeMetadata?.adminRole as AdminRole);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Selector de Roles</h1>
          <p className="text-gray-600 mb-8">
            Herramienta de desarrollo para asignar roles de usuario en Clerk metadata
          </p>

          {user && (
            <div className="mb-8 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Usuario Actual:</h3>
              <p className="text-blue-800">Email: {user.emailAddresses[0]?.emailAddress}</p>
              <p className="text-blue-800">Nombre: {user.fullName || 'No definido'}</p>
              <p className="text-blue-800">Rol Actual: {currentRole || 'No definido'}</p>
              {currentAdminRole && (
                <p className="text-blue-800">Rol Admin: {currentAdminRole}</p>
              )}
            </div>
          )}

          {message && (
            <div className="mb-6 p-4 bg-gray-50 border-l-4 border-purple-500 rounded">
              <p className="text-gray-700">{message}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Customer Role */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-sm">C</span>
                </div>
                Cliente
              </h3>
              <p className="text-gray-600 mb-4">
                Acceso al panel de cliente para gestionar reservas y eventos personales.
              </p>
              <button
                onClick={() => updateUserRole(UserRole.CUSTOMER)}
                disabled={isUpdating}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-2 px-4 rounded-lg font-medium transition-all duration-300"
              >
                {isUpdating ? 'Actualizando...' : 'Asignar Rol Cliente'}
              </button>
              <div className="mt-3 text-xs text-gray-500">
                URL: <code>/customer/dashboard</code>
              </div>
            </div>

            {/* Admin Roles */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-sm">A</span>
                </div>
                Administrador
              </h3>
              <p className="text-gray-600 mb-4">
                Diferentes niveles de acceso administrativo con permisos específicos.
              </p>
              
              <div className="space-y-2">
                <button
                  onClick={() => updateUserRole(UserRole.ADMIN, AdminRole.SUPER_ADMIN)}
                  disabled={isUpdating}
                  className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white py-2 px-3 rounded text-sm font-medium transition-colors"
                >
                  Super Admin
                </button>
                <button
                  onClick={() => updateUserRole(UserRole.ADMIN, AdminRole.OPERATIONS_MANAGER)}
                  disabled={isUpdating}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-2 px-3 rounded text-sm font-medium transition-colors"
                >
                  Gerente Operaciones
                </button>
                <button
                  onClick={() => updateUserRole(UserRole.ADMIN, AdminRole.EVENT_COORDINATOR)}
                  disabled={isUpdating}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-2 px-3 rounded text-sm font-medium transition-colors"
                >
                  Coordinador Eventos
                </button>
                <button
                  onClick={() => updateUserRole(UserRole.ADMIN, AdminRole.FINANCE_MANAGER)}
                  disabled={isUpdating}
                  className="w-full bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-400 text-white py-2 px-3 rounded text-sm font-medium transition-colors"
                >
                  Gerente Finanzas
                </button>
                <button
                  onClick={() => updateUserRole(UserRole.ADMIN, AdminRole.MARKETING_MANAGER)}
                  disabled={isUpdating}
                  className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white py-2 px-3 rounded text-sm font-medium transition-colors"
                >
                  Gerente Marketing
                </button>
              </div>
              
              <div className="mt-3 text-xs text-gray-500">
                URL: <code>/admin/dashboard</code>
              </div>
            </div>

            {/* Supplier Role */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-sm">P</span>
                </div>
                Proveedor
              </h3>
              <p className="text-gray-600 mb-4">
                Panel para proveedores para gestionar servicios, contratos e inventario.
              </p>
              <button
                onClick={() => updateUserRole(UserRole.SUPPLIER)}
                disabled={isUpdating}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-2 px-4 rounded-lg font-medium transition-all duration-300"
              >
                {isUpdating ? 'Actualizando...' : 'Asignar Rol Proveedor'}
              </button>
              <div className="mt-3 text-xs text-gray-500">
                URL: <code>/supplier/dashboard</code>
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Nota de Desarrollo</h4>
            <p className="text-yellow-700 text-sm">
              Este selector solo debe usarse en desarrollo. Los roles se asignan automáticamente 
              en el metadata de Clerk y determinan el acceso a cada panel.
            </p>
          </div>

          <div className="mt-6 flex justify-center space-x-4">
            <a
              href="/"
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              ← Volver al Inicio
            </a>
            <a
              href="/dashboard"
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300"
            >
              Ir a Mi Panel →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}