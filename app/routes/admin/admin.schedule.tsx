import { ProtectedRoute } from "@/shared/components/ProtectedRoute";
import { UserRole } from "@/shared/types/user";
import { AdminScheduleManager } from "@/features/admin/pages/AdminScheduleManager";

export function meta() {
  return [
    { title: "Gestión de Horarios - Panel Admin" },
    { name: "description", content: "Gestiona los horarios y disponibilidad del salón de eventos" },
  ];
}

export default function AdminScheduleRoute() {
  return (
    <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
      <AdminScheduleManager />
    </ProtectedRoute>
  );
}