// Admin Reservations Route
import { ProtectedRoute } from "@/shared/components/ProtectedRoute";
import { UserRole, AdminRole } from "@/shared/types/user";
import { AdminReservationsManager } from "@/features/admin/pages/AdminReservationsManager";

export function meta() {
  return [
    { title: "Reservaciones - Panel Admin" },
    { name: "description", content: "Gestión de reservaciones y eventos" },
  ];
}

export default function AdminReservationsRoute() {
  return (
    <ProtectedRoute 
      allowedRoles={[UserRole.ADMIN]}
      allowedAdminRoles={[AdminRole.SUPER_ADMIN, AdminRole.OPERATIONS_MANAGER, AdminRole.EVENT_COORDINATOR]}
    >
      <AdminReservationsManager />
    </ProtectedRoute>
  );
}