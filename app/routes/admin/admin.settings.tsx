import { useState } from "react";
import { useAuth } from "@/shared/hooks/useAuth";
import { DashboardLayout } from "@/shared/components/Layout/DashboardLayout";
import { AdminSidebar } from "@/features/admin/components/AdminSidebar";
import { ProtectedRoute } from "@/shared/components/ProtectedRoute";
import { ConfigSection } from "@/shared/components/ui/ConfigSection";
import { FormField } from "@/shared/components/ui/FormField";
import { Input } from "@/shared/components/ui/Input";
import { Select } from "@/shared/components/ui/Select";
import { Switch } from "@/shared/components/ui/Switch";
import { Button } from "@/shared/components/ui/Button";
import { Card } from "@/shared/components/ui/Card";
import { UserButton } from "@clerk/clerk-react";
import { UserRole, AdminRole } from "@/shared/types/user";
import { UserManagement } from "@/features/admin/components/UserManagement";
import { RoleManagement } from "@/features/admin/components/RoleManagement";

export function meta() {
  return [
    { title: "Configuración - Panel Admin" },
    { name: "description", content: "Configuración del sistema y preferencias" },
  ];
}

function AdminSettingsContent() {
  const { getCurrentUser } = useAuth();
  const user = getCurrentUser();
  const userRole = user?.role;
  const adminRole = user?.adminRole;

  // Configuration state
  const [config, setConfig] = useState({
    // Company Settings
    companyName: "Tramboory Events",
    companyEmail: "admin@tramboory.com",
    companyPhone: "+1 (555) 123-4567",
    timezone: "America/New_York",
    currency: "USD",
    
    // Notification Settings
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    
    // Security Settings
    twoFactorAuth: false,
    sessionTimeout: "30",
    passwordExpiry: "90",
    
    // System Settings
    maintenanceMode: false,
    debugMode: false,
    backupFrequency: "daily",
  });

  const handleConfigChange = (key: string, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    console.log("Saving configuration:", config);
    // TODO: Implement save functionality
  };

  // Role-based access control
  const canEditSystemSettings = adminRole === AdminRole.SUPER_ADMIN;
  const canEditSecurity = [AdminRole.SUPER_ADMIN, AdminRole.OPERATIONS_MANAGER].includes(adminRole as AdminRole);
  
  // Debug: Log current user role
  console.log("Current user role:", userRole, "Admin role:", adminRole);

  return (
    <DashboardLayout
      sidebar={<AdminSidebar />}
      title="Configuración"
      subtitle="Gestiona la configuración del sistema y preferencias"
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* User Profile Section */}
        <ConfigSection
          title="Perfil de Usuario"
          description="Información de tu cuenta y preferencias personales"
          icon={
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          }
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:col-span-2 flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-16 h-16 ring-2 ring-gray-200 dark:ring-gray-700",
                  }
                }}
              />
              <div className="text-center sm:text-left">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">{user?.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{user?.email}</p>
                <p className="text-xs text-gray-500 dark:text-gray-500 capitalize">
                  {adminRole?.replace('_', ' ').toLowerCase()}
                </p>
              </div>
            </div>
          </div>
        </ConfigSection>

        {/* Company Settings */}
        <ConfigSection
          title="Configuración de Empresa"
          description="Información básica de la empresa y configuración regional"
          icon={
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          }
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <FormField label="Nombre de la Empresa" required>
              <Input
                fullWidth
                value={config.companyName}
                onChange={(e) => handleConfigChange('companyName', e.target.value)}
                placeholder="Nombre de tu empresa"
              />
            </FormField>

            <FormField label="Email Corporativo" required>
              <Input
                fullWidth
                type="email"
                value={config.companyEmail}
                onChange={(e) => handleConfigChange('companyEmail', e.target.value)}
                placeholder="contacto@empresa.com"
              />
            </FormField>

            <FormField label="Teléfono Corporativo">
              <Input
                fullWidth
                type="tel"
                value={config.companyPhone}
                onChange={(e) => handleConfigChange('companyPhone', e.target.value)}
                placeholder="+1 (555) 123-4567"
              />
            </FormField>

            <FormField label="Zona Horaria">
              <Select
                fullWidth
                value={config.timezone}
                onChange={(e) => handleConfigChange('timezone', e.target.value)}
              >
                <option value="America/New_York">Eastern (UTC-5)</option>
                <option value="America/Chicago">Central (UTC-6)</option>
                <option value="America/Denver">Mountain (UTC-7)</option>
                <option value="America/Los_Angeles">Pacific (UTC-8)</option>
                <option value="America/Mexico_City">México (UTC-6)</option>
              </Select>
            </FormField>

            <FormField label="Moneda">
              <Select
                fullWidth
                value={config.currency}
                onChange={(e) => handleConfigChange('currency', e.target.value)}
              >
                <option value="USD">USD - Dólar Americano</option>
                <option value="MXN">MXN - Peso Mexicano</option>
                <option value="EUR">EUR - Euro</option>
                <option value="CAD">CAD - Dólar Canadiense</option>
              </Select>
            </FormField>
          </div>
        </ConfigSection>

        {/* Notification Settings */}
        <ConfigSection
          title="Configuración de Notificaciones"
          description="Controla cómo y cuándo recibes notificaciones"
          icon={
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM11.4 2h-6v20l7-7 7 7V8.6L11.4 2z" />
            </svg>
          }
        >
          <div className="space-y-6">
            <Switch
              checked={config.emailNotifications}
              onChange={(e) => handleConfigChange('emailNotifications', e.target.checked)}
              label="Notificaciones por Email"
              description="Recibe notificaciones importantes por correo electrónico"
            />

            <Switch
              checked={config.smsNotifications}
              onChange={(e) => handleConfigChange('smsNotifications', e.target.checked)}
              label="Notificaciones SMS"
              description="Recibe alertas críticas por mensaje de texto"
            />

            <Switch
              checked={config.pushNotifications}
              onChange={(e) => handleConfigChange('pushNotifications', e.target.checked)}
              label="Notificaciones Push"
              description="Recibe notificaciones en tiempo real en el navegador"
            />
          </div>
        </ConfigSection>

        {/* Security Settings - Role restricted */}
        {canEditSecurity && (
          <ConfigSection
            title="Configuración de Seguridad"
            description="Gestiona la seguridad y acceso del sistema"
            icon={
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="lg:col-span-2">
                <Switch
                  checked={config.twoFactorAuth}
                  onChange={(e) => handleConfigChange('twoFactorAuth', e.target.checked)}
                  label="Autenticación de Dos Factores"
                  description="Requiere un segundo factor de autenticación para mayor seguridad"
                />
              </div>

              <FormField label="Tiempo de Sesión (minutos)">
                <Select
                  fullWidth
                  value={config.sessionTimeout}
                  onChange={(e) => handleConfigChange('sessionTimeout', e.target.value)}
                >
                  <option value="15">15 minutos</option>
                  <option value="30">30 minutos</option>
                  <option value="60">1 hora</option>
                  <option value="120">2 horas</option>
                  <option value="480">8 horas</option>
                </Select>
              </FormField>

              <FormField label="Expiración de Contraseña (días)">
                <Select
                  fullWidth
                  value={config.passwordExpiry}
                  onChange={(e) => handleConfigChange('passwordExpiry', e.target.value)}
                >
                  <option value="30">30 días</option>
                  <option value="60">60 días</option>
                  <option value="90">90 días</option>
                  <option value="180">180 días</option>
                  <option value="never">Nunca</option>
                </Select>
              </FormField>
            </div>
          </ConfigSection>
        )}

        {/* System Settings - Super Admin only */}
        {canEditSystemSettings && (
          <ConfigSection
            title="Configuración del Sistema"
            description="Configuraciones avanzadas del sistema (Solo Super Admin)"
            icon={
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            }
          >
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <Switch
                    checked={config.maintenanceMode}
                    onChange={(e) => handleConfigChange('maintenanceMode', e.target.checked)}
                    label="Modo de Mantenimiento"
                    description="Activa el modo de mantenimiento para todos los usuarios"
                  />
                </div>

                <div>
                  <Switch
                    checked={config.debugMode}
                    onChange={(e) => handleConfigChange('debugMode', e.target.checked)}
                    label="Modo Debug"
                    description="Habilita logs detallados para desarrollo"
                  />
                </div>
              </div>

              <FormField label="Frecuencia de Respaldos">
                <Select
                  fullWidth
                  value={config.backupFrequency}
                  onChange={(e) => handleConfigChange('backupFrequency', e.target.value)}
                >
                  <option value="hourly">Cada Hora</option>
                  <option value="daily">Diario</option>
                  <option value="weekly">Semanal</option>
                  <option value="monthly">Mensual</option>
                </Select>
              </FormField>
            </div>
          </ConfigSection>
        )}

        {/* User Management - Super Admin only */}
        {canEditSystemSettings && (
          <UserManagement />
        )}

        {/* Role Management - Temporarily visible to all admins for development */}
        <ConfigSection
          title="Gestión de Roles de Usuario"
          description="Administra los roles y permisos de todos los usuarios del sistema"
          icon={
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          }
        >
          <RoleManagement />
          {!canEditSystemSettings && (
            <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                Nota: Esta sección normalmente está restringida a Super Admins. 
                Actualmente tienes rol: {adminRole || 'Admin básico'}
              </p>
            </div>
          )}
        </ConfigSection>

        {/* Save Actions */}
        <Card variant="elevated" className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                Guardar Configuración
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Los cambios se aplicarán inmediatamente al sistema
              </p>
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
              <Button variant="secondary" size="md" className="w-full sm:w-auto">
                Cancelar
              </Button>
              <Button variant="gradient" size="md" onClick={handleSave} className="w-full sm:w-auto">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Guardar Cambios
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}

export default function AdminSettingsRoute() {
  return (
    <ProtectedRoute 
      allowedRoles={[UserRole.ADMIN]}
      allowedAdminRoles={[AdminRole.SUPER_ADMIN, AdminRole.OPERATIONS_MANAGER, AdminRole.EVENT_COORDINATOR, AdminRole.FINANCE_MANAGER, AdminRole.MARKETING_MANAGER]}
    >
      <AdminSettingsContent />
    </ProtectedRoute>
  );
}