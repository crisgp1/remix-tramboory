import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock, AlertCircle } from 'lucide-react';

interface TimeSlot {
  _id: string;
  name: string;
  startTime: string;
  endTime: string;
  duration: number;
}

interface DayAvailability {
  available: boolean;
  slots: TimeSlot[];
  isRestDay: boolean;
}

interface AvailabilityCalendarProps {
  onSelectDateTime: (date: Date, timeSlot: TimeSlot, isRestDay: boolean, restDayFee: number) => void;
}

export default function AvailabilityCalendar({ onSelectDateTime }: AvailabilityCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [availability, setAvailability] = useState<{ [date: string]: DayAvailability }>({});
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [loading, setLoading] = useState(false);
  const [restDayFee, setRestDayFee] = useState(0);

  useEffect(() => {
    fetchAvailability();
  }, [currentMonth]);

  const fetchAvailability = async () => {
    setLoading(true);
    try {
      const startDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
      const endDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

      const response = await fetch(
        `/api/customer/availability?start=${startDate.toISOString()}&end=${endDate.toISOString()}`
      );
      const data = await response.json();
      setAvailability(data.calendar);
      setRestDayFee(data.restDayFee || 0);
    } catch (error) {
      console.error('Error fetching availability:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const navigateMonth = (direction: number) => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(prev.getMonth() + direction);
      return newMonth;
    });
    setSelectedDate(null);
    setSelectedSlot(null);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isPastDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const getDayAvailability = (date: Date): DayAvailability | null => {
    const dateStr = date.toISOString().split('T')[0];
    return availability[dateStr] || null;
  };

  const handleDateClick = (date: Date) => {
    if (isPastDate(date)) return;
    
    const dayAvail = getDayAvailability(date);
    if (!dayAvail || !dayAvail.available) return;

    setSelectedDate(date);
    setSelectedSlot(null);
  };

  const handleSlotSelect = (slot: TimeSlot) => {
    setSelectedSlot(slot);
    if (selectedDate) {
      const dayAvail = getDayAvailability(selectedDate);
      onSelectDateTime(selectedDate, slot, dayAvail?.isRestDay || false, restDayFee);
    }
  };

  const formatMonth = (date: Date) => {
    return date.toLocaleDateString('es-MX', { month: 'long', year: 'numeric' });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
          <Calendar className="w-6 h-6" />
          Selecciona Fecha y Hora
        </h2>
      </div>

      {/* Calendar Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigateMonth(-1)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          disabled={loading}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h3 className="text-lg font-semibold capitalize text-gray-800 dark:text-white">
          {formatMonth(currentMonth)}
        </h3>
        <button
          onClick={() => navigateMonth(1)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          disabled={loading}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="mb-6">
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
            <div key={day} className="text-center text-sm font-medium text-gray-600 dark:text-gray-400 py-2">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {getDaysInMonth().map((date, index) => {
            if (!date) {
              return <div key={`empty-${index}`} />;
            }

            const dayAvail = getDayAvailability(date);
            const isPast = isPastDate(date);
            const isSelected = selectedDate?.toDateString() === date.toDateString();
            const hasAvailability = dayAvail?.available && !isPast;

            return (
              <button
                key={date.toISOString()}
                onClick={() => handleDateClick(date)}
                disabled={!hasAvailability}
                className={`
                  aspect-square p-2 rounded-lg border transition-all relative
                  ${isSelected 
                    ? 'bg-blue-600 text-white border-blue-600' 
                    : hasAvailability
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700 hover:bg-green-100 dark:hover:bg-green-900/30 cursor-pointer'
                      : isPast
                        ? 'bg-gray-100 dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-400 cursor-not-allowed'
                        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 cursor-not-allowed'
                  }
                  ${isToday(date) ? 'ring-2 ring-blue-400' : ''}
                `}
              >
                <div className="text-sm font-medium">{date.getDate()}</div>
                {dayAvail?.isRestDay && hasAvailability && (
                  <div className="absolute top-1 right-1">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full" title="Día de descanso - cargo extra" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Time Slots */}
      {selectedDate && (
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Horarios disponibles para {formatDate(selectedDate)}
          </h3>

          {(() => {
            const dayAvail = getDayAvailability(selectedDate);
            
            if (dayAvail?.isRestDay) {
              return (
                <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                      Día de descanso - Cargo adicional
                    </p>
                    <p className="text-sm text-yellow-700 dark:text-yellow-400">
                      Se aplicará un cargo extra de ${restDayFee} por reservar en día de descanso.
                    </p>
                  </div>
                </div>
              );
            }
            return null;
          })()}

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {getDayAvailability(selectedDate)?.slots.map(slot => (
              <button
                key={slot._id}
                onClick={() => handleSlotSelect(slot)}
                className={`
                  p-4 rounded-lg border transition-all
                  ${selectedSlot?._id === slot._id
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }
                `}
              >
                <p className="font-medium">{slot.name}</p>
                <p className="text-sm opacity-80">
                  {slot.startTime} - {slot.endTime}
                </p>
                <p className="text-xs opacity-60 mt-1">
                  {slot.duration} horas
                </p>
              </button>
            ))}
          </div>

          {getDayAvailability(selectedDate)?.slots.length === 0 && (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              No hay horarios disponibles para esta fecha.
            </p>
          )}
        </div>
      )}

      {loading && (
        <div className="absolute inset-0 bg-white/80 dark:bg-gray-800/80 flex items-center justify-center rounded-lg">
          <div className="text-gray-600 dark:text-gray-400">Cargando disponibilidad...</div>
        </div>
      )}
    </div>
  );
}