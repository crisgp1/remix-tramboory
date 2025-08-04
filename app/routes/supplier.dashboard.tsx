// Supplier Dashboard Route
import { SupplierDashboard } from "@/features/supplier/pages/SupplierDashboard";
import { ProtectedRoute } from "@/shared/components/ProtectedRoute";
import { UserRole } from "@/shared/types/user";

export function meta() {
  return [
    { title: "Panel Proveedor - Salón de Eventos" },
    { name: "description", content: "Gestiona tus servicios, contratos e inventario" },
  ];
}

export default function SupplierDashboardRoute() {
  return (
    <ProtectedRoute allowedRoles={[UserRole.SUPPLIER]}>
      <SupplierDashboard />
    </ProtectedRoute>
  );
}