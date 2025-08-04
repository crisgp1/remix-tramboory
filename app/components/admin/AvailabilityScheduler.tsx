import { useState, useEffect } from 'react';
import { Calendar, Settings, AlertCircle } from 'lucide-react';

interface TimeSlot {
  _id: string;
  name: string;
  startTime: string;
  endTime: string;
  duration: number;
  isActive: boolean;
}

interface DaySchedule {
  dayOfWeek: number;
  timeSlots: string[];
  isRestDay: boolean;
  restDayFee?: number;
}

const DAYS_OF_WEEK = [
  'Domingo',
  'Lunes', 
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado'
];

export default function AvailabilityScheduler() {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [schedules, setSchedules] = useState<DaySchedule[]>([]);
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [isRestDay, setIsRestDay] = useState(false);
  const [restDayFee, setRestDayFee] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTimeSlots();
    fetchSchedules();
  }, []);

  useEffect(() => {
    if (schedules.length > 0) {
      const daySchedule = schedules.find(s => s.dayOfWeek === selectedDay);
      if (daySchedule) {
        setSelectedSlots(daySchedule.timeSlots);
        setIsRestDay(daySchedule.isRestDay);
        setRestDayFee(daySchedule.restDayFee || 0);
      } else {
        setSelectedSlots([]);
        setIsRestDay(false);
        setRestDayFee(0);
      }
    }
  }, [selectedDay, schedules]);

  const fetchTimeSlots = async () => {
    try {
      const response = await fetch('/api/admin/time-slots');
      const data = await response.json();
      setTimeSlots(data.filter((slot: TimeSlot) => slot.isActive));
    } catch (error) {
      console.error('Error fetching time slots:', error);
    }
  };

  const fetchSchedules = async () => {
    try {
      const response = await fetch('/api/admin/availability-schedules');
      const data = await response.json();
      setSchedules(data);
    } catch (error) {
      console.error('Error fetching schedules:', error);
    }
  };

  const handleSlotToggle = (slotId: string) => {
    setSelectedSlots(prev => {
      if (prev.includes(slotId)) {
        return prev.filter(id => id !== slotId);
      } else {
        return [...prev, slotId];
      }
    });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/availability-schedules/${selectedDay}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          timeSlots: selectedSlots,
          isRestDay,
          restDayFee: isRestDay ? restDayFee : undefined
        })
      });

      if (response.ok) {
        fetchSchedules();
        alert('Horario actualizado correctamente');
      }
    } catch (error) {
      console.error('Error saving schedule:', error);
      alert('Error al guardar el horario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-6">
        <Calendar className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Configuración de Disponibilidad
        </h2>
      </div>

      {/* Day selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Seleccionar día de la semana
        </label>
        <div className="grid grid-cols-7 gap-2">
          {DAYS_OF_WEEK.map((day, index) => (
            <button
              key={index}
              onClick={() => setSelectedDay(index)}
              className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                selectedDay === index
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      {/* Rest day configuration */}
      <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
        <div className="flex items-center mb-3">
          <input
            type="checkbox"
            id="restDay"
            checked={isRestDay}
            onChange={(e) => setIsRestDay(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="restDay" className="text-gray-700 dark:text-gray-300 font-medium">
            Día de descanso (Se aplicará cargo extra)
          </label>
        </div>
        
        {isRestDay && (
          <div className="ml-6">
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
              Cargo extra por día de descanso
            </label>
            <input
              type="number"
              value={restDayFee}
              onChange={(e) => setRestDayFee(Number(e.target.value))}
              className="w-32 px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              min="0"
              step="50"
            />
          </div>
        )}
      </div>

      {/* Time slots selection */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
          Horarios disponibles para {DAYS_OF_WEEK[selectedDay]}
        </h3>
        
        {isRestDay && (
          <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-500 mt-0.5" />
            <p className="text-sm text-yellow-800 dark:text-yellow-300">
              Este día está marcado como día de descanso. Los clientes podrán reservar pero se aplicará un cargo extra de ${restDayFee}.
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {timeSlots.map((slot) => (
            <label
              key={slot._id}
              className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                selectedSlots.includes(slot._id)
                  ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500'
                  : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <input
                type="checkbox"
                checked={selectedSlots.includes(slot._id)}
                onChange={() => handleSlotToggle(slot._id)}
                className="mr-3"
              />
              <div>
                <p className="font-medium text-gray-800 dark:text-white">{slot.name}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {slot.startTime} - {slot.endTime}
                </p>
              </div>
            </label>
          ))}
        </div>

        {timeSlots.length === 0 && (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
            No hay horarios configurados. Por favor, crea horarios primero.
          </p>
        )}
      </div>

      {/* Save button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={loading}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <Settings className="w-5 h-5" />
          {loading ? 'Guardando...' : 'Guardar Configuración'}
        </button>
      </div>
    </div>
  );
}