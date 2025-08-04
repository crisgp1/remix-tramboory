// Admin Inventory Route
import { DashboardLayout } from "@/shared/components/Layout/DashboardLayout";
import { AdminSidebar } from "@/features/admin/components/AdminSidebar";
import { ProtectedRoute } from "@/shared/components/ProtectedRoute";
import { UserRole, AdminRole } from "@/shared/types/user";

export function meta() {
  return [
    { title: "Inventario - Panel Admin" },
    { name: "description", content: "Gestión de inventario y recursos" },
  ];
}

export default function AdminInventoryRoute() {
  return (
    <ProtectedRoute 
      allowedRoles={[UserRole.ADMIN]}
      allowedAdminRoles={[AdminRole.SUPER_ADMIN, AdminRole.OPERATIONS_MANAGER]}
    >
      <DashboardLayout
        sidebar={<AdminSidebar />}
        title="Inventario"
        subtitle="Gestión de recursos y equipamiento"
      >
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Gestión de Inventario</h2>
            <p className="text-gray-600 mb-6">
              Control y seguimiento de todos los recursos del salón.
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800 text-sm">
                🚧 Esta sección está en desarrollo. Próximamente incluirá:
              </p>
              <ul className="text-green-700 text-sm mt-2 list-disc list-inside">
                <li>Inventario de mobiliario y decoración</li>
                <li>Equipos de sonido y audiovisuales</li>
                <li>Control de stock y disponibilidad</li>
                <li>Mantenimiento y reparaciones</li>
                <li>Reportes de uso y desgaste</li>
              </ul>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}