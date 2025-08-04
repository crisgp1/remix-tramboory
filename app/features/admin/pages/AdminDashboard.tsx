import { useEffect, useRef } from "react";
import { Link } from "react-router";
import { DashboardLayout } from "@/shared/components/Layout/DashboardLayout";
import { AdminSidebar } from "@/features/admin/components/AdminSidebar";
import { useAuth } from "@/shared/hooks/useAuth";
import { AdminRole } from "@/shared/types/user";
import { Card, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/Card";
import { StatsCard } from "@/shared/components/ui/StatsCard";
import { Button } from "@/shared/components/ui/Button";
import { Badge } from "@/shared/components/ui/Badge";
import { IconButton } from "@/shared/components/ui/IconButton";
import { gsap } from "gsap";

// Single Responsibility Principle - Component only handles admin dashboard view
export function AdminDashboard() {
  const { getCurrentUser, getAdminRole } = useAuth();
  const user = getCurrentUser();
  const adminRole = getAdminRole();

  // Mock data - would come from API in real implementation
  const dashboardStats = {
    totalEvents: 45,
    activeBookings: 23,
    totalRevenue: 450000,
    pendingApprovals: 8,
    totalCustomers: 234,
    totalSuppliers: 89,
    monthlyGrowth: 12.5,
    customerSatisfaction: 4.8
  };

  const recentEvents = [
    {
      id: '1',
      name: 'Boda García-López',
      date: '2024-03-15',
      status: 'confirmed',
      guests: 150,
      coordinator: 'María González'
    },
    {
      id: '2',
      name: 'Evento Corporativo Tech Corp',
      date: '2024-03-20',
      status: 'planning',
      guests: 200,
      coordinator: 'Carlos Ruiz'
    },
    {
      id: '3',
      name: 'Quinceañera Martínez',
      date: '2024-03-25',
      status: 'pending',
      guests: 100,
      coordinator: 'Ana Flores'
    }
  ];

  const pendingTasks = [
    { id: '1', task: 'Aprobar proveedor de catering', priority: 'high', assignee: 'Operaciones' },
    { id: '2', task: 'Revisar presupuesto evento corporativo', priority: 'medium', assignee: 'Finanzas' },
    { id: '3', task: 'Confirmar disponibilidad salón principal', priority: 'high', assignee: 'Eventos' },
    { id: '4', task: 'Actualizar catálogo de servicios', priority: 'low', assignee: 'Marketing' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'planning': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleBasedStats = () => {
    // Liskov Substitution Principle - Different admin roles can substitute each other
    switch (adminRole) {
      case AdminRole.FINANCE_MANAGER:
        return [
          { label: 'Ingresos del Mes', value: `$${dashboardStats.totalRevenue.toLocaleString()}`, icon: '💰' },
          { label: 'Crecimiento Mensual', value: `+${dashboardStats.monthlyGrowth}%`, icon: '📈' },
          { label: 'Pagos Pendientes', value: '12', icon: '⏳' },
          { label: 'Facturas Emitidas', value: '89', icon: '📋' }
        ];
      case AdminRole.EVENT_COORDINATOR:
        return [
          { label: 'Eventos Activos', value: dashboardStats.totalEvents, icon: '🎉' },
          { label: 'Reservas Confirmadas', value: dashboardStats.activeBookings, icon: '✅' },
          { label: 'Eventos Esta Semana', value: '8', icon: '📅' },
          { label: 'Satisfacción Cliente', value: `${dashboardStats.customerSatisfaction}/5`, icon: '⭐' }
        ];
      case AdminRole.MARKETING_MANAGER:
        return [
          { label: 'Clientes Totales', value: dashboardStats.totalCustomers, icon: '👥' },
          { label: 'Nuevos Clientes', value: '+28', icon: '🆕' },
          { label: 'Campañas Activas', value: '5', icon: '📢' },
          { label: 'Tasa Conversión', value: '23.5%', icon: '🎯' }
        ];
      default:
        return [
          { label: 'Eventos Totales', value: dashboardStats.totalEvents, icon: '🎉' },
          { label: 'Reservas Activas', value: dashboardStats.activeBookings, icon: '📅' },
          { label: 'Clientes', value: dashboardStats.totalCustomers, icon: '👥' },
          { label: 'Proveedores', value: dashboardStats.totalSuppliers, icon: '🏢' }
        ];
    }
  };

  const roleStats = getRoleBasedStats();

  const statsContainerRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Subtle entrance animations
    gsap.fromTo(
      statsContainerRef.current?.children || [],
      { opacity: 0, y: 20 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.6, 
        stagger: 0.1,
        ease: "power2.out"
      }
    );

    gsap.fromTo(
      cardsContainerRef.current?.children || [],
      { opacity: 0, y: 30 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.8, 
        stagger: 0.15,
        delay: 0.3,
        ease: "power2.out"
      }
    );
  }, []);

  const statsIcons = {
    events: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v16a2 2 0 002 2z" />
      </svg>
    ),
    money: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    users: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
    chart: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    )
  };

  return (
    <DashboardLayout
      sidebar={<AdminSidebar />}
      title="Panel de Administración"
      subtitle={`Bienvenido, ${user?.name}`}
    >
      <div className="space-y-6">
        {/* Quick Actions - Small buttons at top */}
        <Card variant="elevated" className="mb-6">
          <CardHeader className="pb-4">
            <div>
              <CardTitle className="text-lg">Acciones Rápidas</CardTitle>
              <CardDescription>Accede rápidamente a las funciones principales</CardDescription>
            </div>
          </CardHeader>
          <div className="px-6 pb-6">
            <div className="flex flex-wrap gap-3">
              <Button
                variant="gradient"
                size="sm"
                className="group"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Nuevo Evento
              </Button>
              
              <Button
                variant="secondary"
                size="sm"
                className="group hover:border-purple-400 hover:text-purple-600 dark:hover:text-purple-400"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
                Gestionar Usuarios
              </Button>
              
              <Button
                variant="secondary"
                size="sm"
                className="group hover:border-green-400 hover:text-green-600 dark:hover:text-green-400"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Ver Reportes
              </Button>
              
              <Button
                variant="secondary"
                size="sm"
                className="group hover:border-orange-400 hover:text-orange-600 dark:hover:text-orange-400"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                Inventario
              </Button>
              
              <Button
                variant="secondary"
                size="sm"
                className="group hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Proveedores
              </Button>
              
              <Link to="/admin/schedule">
                <Button
                  variant="secondary"
                  size="sm"
                  className="group hover:border-pink-400 hover:text-pink-600 dark:hover:text-pink-400"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Gestionar Horarios
                </Button>
              </Link>
              
              <Button
                variant="secondary"
                size="sm"
                className="group hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Configuración
              </Button>
            </div>
          </div>
        </Card>

        {/* Professional Stats Cards */}
        <div ref={statsContainerRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Eventos Totales"
            value={dashboardStats.totalEvents}
            icon={statsIcons.events}
            trend={{ value: 12.5, isPositive: true }}
            color="blue"
          />
          <StatsCard
            title="Reservas Activas"
            value={dashboardStats.activeBookings}
            icon={statsIcons.events}
            trend={{ value: 8.3, isPositive: true }}
            color="green"
          />
          <StatsCard
            title="Ingresos del Mes"
            value={`$${dashboardStats.totalRevenue.toLocaleString()}`}
            icon={statsIcons.money}
            trend={{ value: dashboardStats.monthlyGrowth, isPositive: true }}
            color="purple"
          />
          <StatsCard
            title="Clientes Totales"
            value={dashboardStats.totalCustomers}
            icon={statsIcons.users}
            trend={{ value: 5.2, isPositive: true }}
            color="orange"
          />
        </div>

        <div ref={cardsContainerRef} className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Recent Events - Professional Design */}
          <Card className="xl:col-span-2" padding="none">
            <CardHeader className="px-6 py-4 border-b border-gray-100">
              <div>
                <CardTitle>Eventos Recientes</CardTitle>
                <CardDescription>Últimas reservas y actividades</CardDescription>
              </div>
              <Button variant="ghost" size="sm">
                Ver todos
              </Button>
            </CardHeader>
            <div className="p-6">
              <div className="space-y-4">
                {recentEvents.map((event) => (
                  <div 
                    key={event.id} 
                    className="group p-4 rounded-lg border border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 hover:shadow-sm transition-all duration-200 cursor-pointer bg-white dark:bg-gray-800/50"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-start space-x-3">
                          <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 dark:group-hover:bg-blue-800/50 transition-colors duration-200">
                            <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v16a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                              {event.name}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              Coordinador: {event.coordinator}
                            </p>
                            <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                              <span className="flex items-center">
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v16a2 2 0 002 2z" />
                                </svg>
                                {new Date(event.date).toLocaleDateString('es', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </span>
                              <span className="flex items-center">
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                                </svg>
                                {event.guests} invitados
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="ml-4 flex items-center space-x-2">
                        <Badge
                          variant={
                            event.status === 'confirmed' ? 'success' : 
                            event.status === 'planning' ? 'info' : 
                            'warning'
                          }
                        >
                          {event.status === 'confirmed' ? 'Confirmado' : 
                           event.status === 'planning' ? 'Planificando' : 
                           'Pendiente'}
                        </Badge>
                        <IconButton
                          size="sm"
                          variant="ghost"
                          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </IconButton>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Pending Tasks & Quick Actions */}
          <div className="space-y-6">
            {/* Pending Tasks */}
            <Card>
              <CardHeader>
                <div>
                  <CardTitle>Tareas Pendientes</CardTitle>
                  <CardDescription>Tareas que requieren atención</CardDescription>
                </div>
                <Badge variant="info" size="md">
                  {pendingTasks.length} pendientes
                </Badge>
              </CardHeader>
              <div className="space-y-3">
                {pendingTasks.map((task) => (
                  <div 
                    key={task.id} 
                    className="group p-4 rounded-lg border border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 hover:shadow-sm transition-all duration-200 bg-white dark:bg-gray-800/50"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${
                            task.priority === 'high' ? 'bg-red-500 dark:bg-red-400' : 
                            task.priority === 'medium' ? 'bg-yellow-500 dark:bg-yellow-400' : 
                            'bg-green-500 dark:bg-green-400'
                          }`} />
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                              {task.task}
                            </h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              Asignado a: {task.assignee}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="ml-4 flex items-center space-x-2">
                        <Badge
                          variant={
                            task.priority === 'high' ? 'danger' : 
                            task.priority === 'medium' ? 'warning' : 
                            'success'
                          }
                        >
                          {task.priority === 'high' ? 'Alta' : 
                           task.priority === 'medium' ? 'Media' : 
                           'Baja'}
                        </Badge>
                        <IconButton
                          size="sm"
                          variant="ghost"
                          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </IconButton>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Quick Stats Mini Cards */}
            <div className="grid grid-cols-1 gap-4">
              <Card className="border-green-200 dark:border-green-800/50 bg-green-50/50 dark:bg-green-900/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-700 dark:text-green-400">Satisfacción Cliente</p>
                    <div className="flex items-baseline mt-2">
                      <p className="text-3xl font-bold text-green-900 dark:text-green-100">4.8</p>
                      <span className="text-green-700 dark:text-green-300 ml-1">/5</span>
                    </div>
                    <div className="flex items-center mt-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          className={`w-4 h-4 ${star <= 4.8 ? 'text-green-500 dark:text-green-400' : 'text-green-200 dark:text-green-600'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 4.0a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.392 2.46a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.392-2.46a1 1 0 00-1.175 0l-3.392 2.46c-.784.57-1.838-.197-1.539-1.118l1.286-3.957a1 1 0 00-.364-1.118L2.93 8.876c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-4.0z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <div className="bg-green-100 dark:bg-green-800/50 p-3 rounded-lg">
                    <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </Card>
              
              <Card className="border-purple-200 dark:border-purple-800/50 bg-purple-50/50 dark:bg-purple-900/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-700 dark:text-purple-400">Ingresos del Mes</p>
                    <p className="text-3xl font-bold text-purple-900 dark:text-purple-100 mt-2">$450K</p>
                    <div className="flex items-center mt-2">
                      <span className="text-sm font-medium text-green-600 dark:text-green-400">↑ 12.5%</span>
                      <span className="text-sm text-purple-600 dark:text-purple-300 ml-2">vs mes anterior</span>
                    </div>
                  </div>
                  <div className="bg-purple-100 dark:bg-purple-800/50 p-3 rounded-lg">
                    <svg className="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}