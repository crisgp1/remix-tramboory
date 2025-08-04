// Admin Dashboard Route
import { AdminDashboard } from "@/features/admin/pages/AdminDashboard";
import { ProtectedRoute } from "@/shared/components/ProtectedRoute";
import { UserRole } from "@/shared/types/user";

export function meta() {
  return [
    { title: "Panel Admin - Salón de Eventos" },
    { name: "description", content: "Panel de administración para gestionar eventos, usuarios y operaciones" },
  ];
}

export default function AdminDashboardRoute() {
  return (
    <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
      <AdminDashboard />
    </ProtectedRoute>
  );
}