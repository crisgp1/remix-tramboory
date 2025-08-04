import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { UserRole, AdminRole } from "@/shared/types/user";
import { Card } from "@/shared/components/ui/Card";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { Select } from "@/shared/components/ui/Select";

interface User {
  id: string;
  email: string;
  name: string;
  role?: UserRole;
  adminRole?: AdminRole;
}

export function RoleManagement() {
  const { user: currentUser } = useUser();
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  // Simulated users data - in production, this would come from your backend
  useEffect(() => {
    // Simulate loading users
    setTimeout(() => {
      setUsers([
        {
          id: "user_1",
          email: "admin@tramboory.com",
          name: "Admin User",
          role: UserRole.ADMIN,
          adminRole: AdminRole.SUPER_ADMIN,
        },
        {
          id: "user_2",
          email: "coordinator@tramboory.com",
          name: "Event Coordinator",
          role: UserRole.ADMIN,
          adminRole: AdminRole.EVENT_COORDINATOR,
        },
        {
          id: "user_3",
          email: "customer@example.com",
          name: "John Customer",
          role: UserRole.CUSTOMER,
        },
        {
          id: "user_4",
          email: "supplier@example.com",
          name: "Supply Co",
          role: UserRole.SUPPLIER,
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const updateUserRole = async (userId: string, role: UserRole, adminRole?: AdminRole) => {
    setUpdatingUserId(userId);
    setMessage("");

    try {
      // In production, make an API call to update the user's role
      // For now, we'll update the local state
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === userId
            ? { ...user, role, adminRole: role === UserRole.ADMIN ? adminRole : undefined }
            : user
        )
      );

      setMessage(`✅ Rol actualizado exitosamente`);
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Error updating role:", error);
      setMessage("❌ Error al actualizar el rol");
    } finally {
      setUpdatingUserId(null);
    }
  };

  const filteredUsers = users.filter(
    user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadge = (role?: UserRole, adminRole?: AdminRole) => {
    if (!role) return null;

    const roleConfig = {
      [UserRole.CUSTOMER]: {
        bg: "bg-gradient-to-r from-pink-500 to-purple-600",
        text: "Cliente",
      },
      [UserRole.ADMIN]: {
        bg: "bg-gradient-to-r from-blue-500 to-indigo-600",
        text: adminRole ? adminRole.replace("_", " ") : "Admin",
      },
      [UserRole.SUPPLIER]: {
        bg: "bg-gradient-to-r from-green-500 to-emerald-600",
        text: "Proveedor",
      },
    };

    const config = roleConfig[role];
    return (
      <span className={`${config.bg} text-white text-xs px-2 py-1 rounded-full capitalize`}>
        {config.text}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando usuarios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          fullWidth
          placeholder="Buscar por nombre o email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />
      </div>

      {/* Message */}
      {message && (
        <div className="p-4 bg-gray-50 dark:bg-gray-800 border-l-4 border-purple-500 rounded">
          <p className="text-gray-700 dark:text-gray-300">{message}</p>
        </div>
      )}

      {/* Users List */}
      <div className="grid gap-4">
        {filteredUsers.map((user) => (
          <Card key={user.id} className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              {/* User Info */}
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                  {user.name}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                <div className="mt-2">{getRoleBadge(user.role, user.adminRole)}</div>
              </div>

              {/* Role Selector */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Select
                  value={user.role || ""}
                  onChange={(e) => {
                    const newRole = e.target.value as UserRole;
                    if (newRole !== UserRole.ADMIN) {
                      updateUserRole(user.id, newRole);
                    }
                  }}
                  disabled={updatingUserId === user.id}
                  className="w-full sm:w-48"
                >
                  <option value="">Seleccionar Rol</option>
                  <option value={UserRole.CUSTOMER}>Cliente</option>
                  <option value={UserRole.ADMIN}>Administrador</option>
                  <option value={UserRole.SUPPLIER}>Proveedor</option>
                </Select>

                {user.role === UserRole.ADMIN && (
                  <Select
                    value={user.adminRole || ""}
                    onChange={(e) => {
                      const newAdminRole = e.target.value as AdminRole;
                      updateUserRole(user.id, UserRole.ADMIN, newAdminRole);
                    }}
                    disabled={updatingUserId === user.id}
                    className="w-full sm:w-48"
                  >
                    <option value="">Tipo Admin</option>
                    <option value={AdminRole.SUPER_ADMIN}>Super Admin</option>
                    <option value={AdminRole.OPERATIONS_MANAGER}>Gerente Operaciones</option>
                    <option value={AdminRole.EVENT_COORDINATOR}>Coordinador Eventos</option>
                    <option value={AdminRole.FINANCE_MANAGER}>Gerente Finanzas</option>
                    <option value={AdminRole.MARKETING_MANAGER}>Gerente Marketing</option>
                  </Select>
                )}

                {updatingUserId === user.id && (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600"></div>
                  </div>
                )}
              </div>
            </div>

            {/* Permissions Preview */}
            {user.role === UserRole.ADMIN && user.adminRole && (
              <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded">
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  <strong>Permisos:</strong>{" "}
                  {getPermissionsForRole(user.adminRole).join(", ")}
                </p>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Development Note */}
      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
        <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
          ⚠️ Nota de Desarrollo
        </h4>
        <p className="text-yellow-700 dark:text-yellow-300 text-sm">
          En producción, esta interfaz se conectaría con tu backend para gestionar los roles
          de usuario a través de la API de Clerk. Los cambios se reflejarían en el metadata
          del usuario y controlarían el acceso a las diferentes secciones de la aplicación.
        </p>
      </div>
    </div>
  );
}

function getPermissionsForRole(adminRole: AdminRole): string[] {
  switch (adminRole) {
    case AdminRole.SUPER_ADMIN:
      return ["Todos los permisos"];
    case AdminRole.OPERATIONS_MANAGER:
      return ["Crear eventos", "Editar eventos", "Ver todos los eventos", "Gestionar proveedores"];
    case AdminRole.EVENT_COORDINATOR:
      return ["Crear eventos", "Editar eventos", "Ver todos los eventos"];
    case AdminRole.FINANCE_MANAGER:
      return ["Ver reportes financieros", "Gestionar precios", "Procesar pagos"];
    case AdminRole.MARKETING_MANAGER:
      return ["Ver todos los usuarios", "Gestionar proveedores"];
    default:
      return [];
  }
}