import { useState } from "react";
import { DashboardLayout } from "@/shared/components/Layout/DashboardLayout";
import { AdminSidebar } from "@/features/admin/components/AdminSidebar";
import { Card } from "@/shared/components/ui/Card";
import { Button } from "@/shared/components/ui/Button";
import ReservationsList from "@/components/admin/ReservationsList";
import ReservationsCalendar from "@/components/admin/ReservationsCalendar";
import ReservationStats from "@/components/admin/ReservationStats";

export function AdminReservationsManager() {
  const [activeTab, setActiveTab] = useState<'stats' | 'list' | 'calendar'>('stats');

  const getIcon = (iconName: string, className: string = "w-5 h-5") => {
    const icons = {
      'stats': (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      'list': (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
      ),
      'calendar': (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v16a2 2 0 002 2z" />
        </svg>
      ),
      'plus': (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      )
    };
    return icons[iconName as keyof typeof icons] || icons.calendar;
  };

  const tabs = [
    {
      id: 'stats' as const,
      label: 'Estadísticas',
      icon: 'stats',
      description: 'Métricas y análisis de reservaciones'
    },
    {
      id: 'list' as const,
      label: 'Lista',
      icon: 'list',
      description: 'Todas las reservaciones en formato tabla'
    },
    {
      id: 'calendar' as const,
      label: 'Calendario',
      icon: 'calendar',
      description: 'Vista de calendario de eventos'
    }
  ];

  return (
    <DashboardLayout
      sidebar={<AdminSidebar />}
      title="Gestión de Reservaciones"
      subtitle="Administra todas las reservas y eventos del salón"
    >
      <div className="space-y-6">
        {/* Header with Tabs and Actions */}
        <Card variant="elevated" className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Tab Navigation */}
            <div className="flex flex-col sm:flex-row gap-2">
              {tabs.map((tab) => {
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      activeTab === tab.id
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                    }`}
                  >
                    {getIcon(tab.icon)}
                    <div className="text-left">
                      <p className="font-medium">{tab.label}</p>
                      <p className={`text-xs ${
                        activeTab === tab.id ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {tab.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                variant="secondary"
                size="sm"
                className="flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Exportar
              </Button>
              <Button
                variant="gradient"
                size="sm"
                className="flex items-center gap-2"
              >
                {getIcon('plus', 'w-4 h-4')}
                Nueva Reservación
              </Button>
            </div>
          </div>
        </Card>

        {/* Content based on active tab */}
        <div className="transition-all duration-300">
          {activeTab === 'stats' && <ReservationStats />}
          {activeTab === 'list' && <ReservationsList />}
          {activeTab === 'calendar' && <ReservationsCalendar />}
        </div>

        {/* Quick Actions Footer */}
        {activeTab === 'stats' && (
          <Card variant="elevated" className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Acciones Recomendadas
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Basado en el análisis de tus datos actuales
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setActiveTab('list')}
                  className="flex items-center gap-2"
                >
                  {getIcon('list', 'w-4 h-4')}
                  Revisar Pendientes
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setActiveTab('calendar')}
                  className="flex items-center gap-2"
                >
                  {getIcon('calendar', 'w-4 h-4')}
                  Ver Próximos Eventos
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Additional Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card variant="elevated" className="p-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                {getIcon('calendar', 'w-5 h-5 text-blue-600 dark:text-blue-400')}
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-white">Próximos Eventos</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  Mantente al día con los eventos programados para esta semana.
                </p>
                <button
                  onClick={() => setActiveTab('calendar')}
                  className="text-blue-600 dark:text-blue-400 text-sm font-medium mt-2 hover:underline"
                >
                  Ver calendario →
                </button>
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
                <h3 className="font-semibold text-gray-800 dark:text-white">Confirmaciones Pendientes</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  Revisa y confirma las reservaciones que están pendientes.
                </p>
                <button
                  onClick={() => setActiveTab('list')}
                  className="text-yellow-600 dark:text-yellow-400 text-sm font-medium mt-2 hover:underline"
                >
                  Revisar pendientes →
                </button>
              </div>
            </div>
          </Card>

          <Card variant="elevated" className="p-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                {getIcon('stats', 'w-5 h-5 text-green-600 dark:text-green-400')}
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-white">Análisis de Rendimiento</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  Consulta métricas detalladas sobre tus reservaciones.
                </p>
                <button
                  onClick={() => setActiveTab('stats')}
                  className="text-green-600 dark:text-green-400 text-sm font-medium mt-2 hover:underline"
                >
                  Ver estadísticas →
                </button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}