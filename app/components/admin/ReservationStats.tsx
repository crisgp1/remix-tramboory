import { useState, useEffect } from 'react';

interface StatsData {
  totalReservations: number;
  confirmedReservations: number;
  pendingReservations: number;
  totalRevenue: number;
  averageEventValue: number;
  monthlyGrowth: number;
  occupancyRate: number;
  upcomingEvents: number;
}

export default function ReservationStats() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'year'>('month');

  // Mock data - replace with API call
  useEffect(() => {
    const mockStats: StatsData = {
      totalReservations: 127,
      confirmedReservations: 89,
      pendingReservations: 23,
      totalRevenue: 1250000,
      averageEventValue: 9842,
      monthlyGrowth: 15.4,
      occupancyRate: 78.5,
      upcomingEvents: 12
    };

    setTimeout(() => {
      setStats(mockStats);
      setLoading(false);
    }, 1000);
  }, [timeframe]);

  if (loading || !stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          </div>
        ))}
      </div>
    );
  }

  const statsCards = [
    {
      title: 'Total Reservaciones',
      value: stats.totalReservations,
      change: stats.monthlyGrowth,
      icon: 'calendar',
      color: 'blue',
      prefix: ''
    },
    {
      title: 'Ingresos Totales',
      value: stats.totalRevenue,
      change: stats.monthlyGrowth,
      icon: 'dollar',
      color: 'green',
      prefix: '$'
    },
    {
      title: 'Confirmadas',
      value: stats.confirmedReservations,
      change: 8.2,
      icon: 'users',
      color: 'emerald',
      prefix: ''
    },
    {
      title: 'Pendientes',
      value: stats.pendingReservations,
      change: -12.1,
      icon: 'clock',
      color: 'yellow',
      prefix: ''
    }
  ];

  const additionalStats = [
    {
      title: 'Valor Promedio por Evento',
      value: `$${stats.averageEventValue.toLocaleString()}`,
      description: 'Basado en eventos confirmados',
      icon: 'trending-up',
      color: 'purple'
    },
    {
      title: 'Tasa de Ocupación',
      value: `${stats.occupancyRate}%`,
      description: 'Disponibilidad utilizada',
      icon: 'calendar',
      color: 'indigo'
    },
    {
      title: 'Eventos Próximos',
      value: stats.upcomingEvents,
      description: 'En los próximos 7 días',
      icon: 'clock',
      color: 'orange'
    },
    {
      title: 'Crecimiento Mensual',
      value: `${stats.monthlyGrowth > 0 ? '+' : ''}${stats.monthlyGrowth}%`,
      description: 'Comparado con mes anterior',
      icon: stats.monthlyGrowth > 0 ? 'trending-up' : 'trending-down',
      color: stats.monthlyGrowth > 0 ? 'green' : 'red'
    }
  ];

  const getIcon = (iconName: string, className: string = "w-6 h-6") => {
    const icons = {
      'calendar': (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v16a2 2 0 002 2z" />
        </svg>
      ),
      'dollar': (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      'users': (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
        </svg>
      ),
      'clock': (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      'trending-up': (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      'trending-down': (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
        </svg>
      )
    };
    return icons[iconName as keyof typeof icons] || icons.calendar;
  };

  return (
    <div className="space-y-6">
      {/* Timeframe Selector */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
          Estadísticas de Reservaciones
        </h2>
        <div className="flex rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden">
          {(['week', 'month', 'year'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setTimeframe(period)}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                timeframe === period
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              {period === 'week' ? 'Semana' : period === 'month' ? 'Mes' : 'Año'}
            </button>
          ))}
        </div>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => {
          const isPositive = stat.change > 0;
          
          return (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-l-4 border-blue-500"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {stat.prefix}{typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                  </p>
                  <div className="flex items-center mt-2">
                    {isPositive ? (
                      getIcon('trending-up', 'w-4 h-4 text-green-500 mr-1')
                    ) : (
                      getIcon('trending-down', 'w-4 h-4 text-red-500 mr-1')
                    )}
                    <span className={`text-sm font-medium ${
                      isPositive ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {isPositive ? '+' : ''}{stat.change}%
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                      vs período anterior
                    </span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg bg-${stat.color}-100 dark:bg-${stat.color}-900/20`}>
                  {getIcon(stat.icon, `w-8 h-8 text-${stat.color}-600 dark:text-${stat.color}-400`)}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {additionalStats.map((stat, index) => {
          return (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg bg-${stat.color}-100 dark:bg-${stat.color}-900/20`}>
                  {getIcon(stat.icon, `w-6 h-6 text-${stat.color}-600 dark:text-${stat.color}-400`)}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {stat.value}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {stat.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          Acciones Rápidas
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left">
            {getIcon('calendar', 'w-6 h-6 text-blue-600 mb-2')}
            <p className="font-medium text-gray-900 dark:text-white">Ver Calendario</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Consultar eventos programados</p>
          </button>
          <button className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left">
            {getIcon('users', 'w-6 h-6 text-green-600 mb-2')}
            <p className="font-medium text-gray-900 dark:text-white">Confirmar Pendientes</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{stats.pendingReservations} por confirmar</p>
          </button>
          <button className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left">
            {getIcon('dollar', 'w-6 h-6 text-purple-600 mb-2')}
            <p className="font-medium text-gray-900 dark:text-white">Reporte Financiero</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Generar reporte del período</p>
          </button>
        </div>
      </div>
    </div>
  );
}