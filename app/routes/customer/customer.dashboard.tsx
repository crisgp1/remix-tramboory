// Customer Dashboard Route
import { CustomerDashboard } from "@/features/customer/pages/CustomerDashboard";
import { ProtectedRoute } from "@/shared/components/ProtectedRoute";
import { UserRole } from "@/shared/types/user";

export function meta() {
  return [
    { title: "Panel Cliente - Salón de Eventos" },
    { name: "description", content: "Gestiona tus reservas y eventos desde tu panel personal" },
  ];
}

export default function CustomerDashboardRoute() {
  return (
    <ProtectedRoute allowedRoles={[UserRole.CUSTOMER]}>
      <CustomerDashboard />
    </ProtectedRoute>
  );
}