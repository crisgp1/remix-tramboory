import { useState } from "react";
import { DashboardLayout } from "@/shared/components/Layout/DashboardLayout";
import { AdminSidebar } from "@/features/admin/components/AdminSidebar";
import { Card } from "@/shared/components/ui/Card";
import { Button } from "@/shared/components/ui/Button";
import TimeSlotManager from "@/components/admin/TimeSlotManager";
import AvailabilityScheduler from "@/components/admin/AvailabilityScheduler";

export function AdminScheduleManager() {
  const [activeTab, setActiveTab] = useState<'timeslots' | 'availability'>('timeslots');

  return (
    <DashboardLayout
      sidebar={<AdminSidebar />}
      title="Gestión de Horarios y Disponibilidad"
      subtitle="Configura los horarios disponibles para reservaciones"
    >
      <div className="space-y-6">
        {/* Tab Navigation */}
        <Card variant="elevated" className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 sm:mb-0">
              Configuración de Horarios
            </h2>
            <div className="flex gap-2">
              <Button
                variant={activeTab === 'timeslots' ? 'gradient' : 'secondary'}
                onClick={() => setActiveTab('timeslots')}
                size="sm"
              >
                Bloques Horarios
              </Button>
              <Button
                variant={activeTab === 'availability' ? 'gradient' : 'secondary'}
                onClick={() => setActiveTab('availability')}
                size="sm"
              >
                Disponibilidad Semanal
              </Button>
            </div>
          </div>

          {/* Information Banner */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="font-semibold text-blue-900 dark:text-blue-100">Información importante</h3>
                <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
                  {activeTab === 'timeslots' 
                    ? 'Define los bloques de tiempo disponibles para eventos (ej: Mañana 8:00-12:00, Tarde 14:00-18:00). Estos bloques se usarán para configurar la disponibilidad semanal.'
                    : 'Configura qué bloques horarios están disponibles para cada día de la semana. También puedes marcar días de descanso con cargo adicional.'
                  }
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Content based on active tab */}
        {activeTab === 'timeslots' ? (
          <TimeSlotManager />
        ) : (
          <AvailabilityScheduler />
        )}

        {/* Additional Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card variant="elevated" className="p-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-white">Horarios Activos</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  Los clientes solo verán los horarios marcados como activos y que tengan disponibilidad configurada.
                </p>
              </div>
            </div>
          </Card>

          <Card variant="elevated" className="p-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-white">Días de Descanso</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  Los días marcados como descanso permitirán reservas pero aplicarán un cargo adicional automático.
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Stats */}
        <Card variant="elevated" className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Resumen de Configuración</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Bloques Horarios</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">--</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Configurados</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Días con Horarios</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">--</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">De 7 días</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Días de Descanso</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">--</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Configurados</p>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}