// Admin Suppliers Route
import { DashboardLayout } from "@/shared/components/Layout/DashboardLayout";
import { AdminSidebar } from "@/features/admin/components/AdminSidebar";
import { ProtectedRoute } from "@/shared/components/ProtectedRoute";
import { UserRole, AdminRole } from "@/shared/types/user";

export function meta() {
  return [
    { title: "Proveedores - Panel Admin" },
    { name: "description", content: "Gestión de proveedores y servicios" },
  ];
}

export default function AdminSuppliersRoute() {
  return (
    <ProtectedRoute 
      allowedRoles={[UserRole.ADMIN]}
      allowedAdminRoles={[AdminRole.SUPER_ADMIN, AdminRole.OPERATIONS_MANAGER]}
    >
      <DashboardLayout
        sidebar={<AdminSidebar />}
        title="Proveedores"
        subtitle="Gestión de proveedores y servicios externos"
      >
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Gestión de Proveedores</h2>
            <p className="text-gray-600 mb-6">
              Administra proveedores de servicios y sus contratos.
            </p>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <p className="text-purple-800 text-sm">
                🚧 Esta sección está en desarrollo. Próximamente incluirá:
              </p>
              <ul className="text-purple-700 text-sm mt-2 list-disc list-inside">
                <li>Directorio de proveedores activos</li>
                <li>Evaluación y calificaciones</li>
                <li>Gestión de contratos y tarifas</li>
                <li>Aprobación de nuevos proveedores</li>
                <li>Reportes de desempeño</li>
              </ul>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}