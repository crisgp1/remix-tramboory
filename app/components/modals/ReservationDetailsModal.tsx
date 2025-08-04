import { Modal, ModalContent, ModalFooter } from '@/shared/components/ui/Modal';

interface Reservation {
  _id: string;
  eventDate: Date;
  eventTime: string;
  eventBlock?: {
    name: string;
    startTime: string;
    endTime: string;
  };
  customer: {
    name: string;
    phone: string;
    email: string;
  };
  child: {
    name: string;
    age: number;
  };
  package: {
    name: string;
    maxGuests: number;
    basePrice: number;
  };
  pricing: {
    total: number;
    packagePrice: number;
    foodPrice: number;
    extrasPrice: number;
    themePrice: number;
    restDayFee: number;
  };
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'pending' | 'paid' | 'partial' | 'overdue';
  specialComments?: string;
  createdAt: Date;
}

interface ReservationDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  reservation: Reservation | null;
  onEdit?: (reservation: Reservation) => void;
  onCancel?: (reservationId: string) => void;
  onConfirm?: (reservationId: string) => void;
}

export default function ReservationDetailsModal({
  isOpen,
  onClose,
  reservation,
  onEdit,
  onCancel,
  onConfirm
}: ReservationDetailsModalProps) {
  if (!reservation) return null;

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'bg-yellow-100 text-yellow-800 border border-yellow-300',
      confirmed: 'bg-green-100 text-green-800 border border-green-300',
      cancelled: 'bg-red-100 text-red-800 border border-red-300',
      completed: 'bg-blue-100 text-blue-800 border border-blue-300'
    };

    const labels = {
      pending: 'Pendiente',
      confirmed: 'Confirmada',
      cancelled: 'Cancelada',
      completed: 'Completada'
    };

    return (
      <span className={`px-3 py-1 text-sm font-medium rounded-full ${variants[status as keyof typeof variants]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const getPaymentStatusBadge = (status: string) => {
    const variants = {
      pending: 'bg-gray-100 text-gray-800',
      paid: 'bg-green-100 text-green-800',
      partial: 'bg-orange-100 text-orange-800',
      overdue: 'bg-red-100 text-red-800'
    };

    const labels = {
      pending: 'Pendiente',
      paid: 'Pagado',
      partial: 'Parcial',
      overdue: 'Vencido'
    };

    return (
      <span className={`px-3 py-1 text-sm font-medium rounded-full ${variants[status as keyof typeof variants]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Detalles de la Reservación"
      subtitle={`Reservación #${reservation._id.slice(-8)}`}
      size="lg"
    >
      <ModalContent>
        <div className="space-y-6">
          {/* Estado y fecha */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {reservation.child.name} - {reservation.child.age} años
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {reservation.eventDate.toLocaleDateString('es-MX', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {reservation.eventBlock?.name} ({reservation.eventBlock?.startTime} - {reservation.eventBlock?.endTime})
              </p>
            </div>
            <div className="flex flex-col gap-2">
              {getStatusBadge(reservation.status)}
              {getPaymentStatusBadge(reservation.paymentStatus)}
            </div>
          </div>

          {/* Información del cliente */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Información del Cliente
              </h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="text-gray-700 dark:text-gray-300">{reservation.customer.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-gray-700 dark:text-gray-300">{reservation.customer.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-gray-700 dark:text-gray-300">{reservation.customer.email}</span>
                </div>
              </div>
            </div>

            {/* Información del paquete */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Paquete Seleccionado
              </h4>
              <div className="space-y-3">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {reservation.package.name}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Hasta {reservation.package.maxGuests} invitados
                  </p>
                </div>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  ${reservation.pricing.packagePrice.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* Desglose de precios */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Desglose de Precios
            </h4>
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Paquete base:</span>
                <span className="font-medium">${reservation.pricing.packagePrice.toLocaleString()}</span>
              </div>
              {reservation.pricing.foodPrice > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Alimentos:</span>
                  <span className="font-medium">${reservation.pricing.foodPrice.toLocaleString()}</span>
                </div>
              )}
              {reservation.pricing.extrasPrice > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Servicios extra:</span>
                  <span className="font-medium">${reservation.pricing.extrasPrice.toLocaleString()}</span>
                </div>
              )}
              {reservation.pricing.themePrice > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Tema del evento:</span>
                  <span className="font-medium">${reservation.pricing.themePrice.toLocaleString()}</span>
                </div>
              )}
              {reservation.pricing.restDayFee > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Cargo día de descanso:</span>
                  <span className="font-medium">${reservation.pricing.restDayFee.toLocaleString()}</span>
                </div>
              )}
              <div className="border-t pt-2 flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span>${reservation.pricing.total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Comentarios especiales */}
          {reservation.specialComments && (
            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Comentarios Especiales
              </h4>
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <p className="text-gray-700 dark:text-gray-300">
                  {reservation.specialComments}
                </p>
              </div>
            </div>
          )}

          {/* Información adicional */}
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <p>
              Reservación creada el {reservation.createdAt.toLocaleDateString('es-MX', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        </div>
      </ModalContent>

      <ModalFooter>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cerrar
          </button>
          
          {onEdit && (
            <button
              onClick={() => onEdit(reservation)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Editar
            </button>
          )}

          {reservation.status === 'pending' && onConfirm && (
            <button
              onClick={() => onConfirm(reservation._id)}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              Confirmar
            </button>
          )}

          {(reservation.status === 'pending' || reservation.status === 'confirmed') && onCancel && (
            <button
              onClick={() => onCancel(reservation._id)}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              Cancelar
            </button>
          )}
        </div>
      </ModalFooter>
    </Modal>
  );
}