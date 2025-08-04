import Reservation, { IReservation } from '@/models/Reservation';
import AvailabilityService from '@/services/admin/AvailabilityService';

export class ReservationService {
  async checkAvailability(date: Date, timeSlotId?: string): Promise<{
    available: boolean;
    availableSlots: any[];
    isRestDay: boolean;
    restDayFee: number;
  }> {
    const { timeSlots, isRestDay, restDayFee } = await AvailabilityService.getAvailableTimeSlots(date);
    
    if (timeSlotId) {
      const slotAvailable = timeSlots.some(slot => slot._id.toString() === timeSlotId);
      return {
        available: slotAvailable,
        availableSlots: slotAvailable ? timeSlots.filter(s => s._id.toString() === timeSlotId) : [],
        isRestDay,
        restDayFee
      };
    }

    return {
      available: timeSlots.length > 0,
      availableSlots: timeSlots,
      isRestDay,
      restDayFee
    };
  }

  async createReservation(data: Partial<IReservation>): Promise<IReservation> {
    // Verify availability before creating
    const { available } = await this.checkAvailability(
      new Date(data.eventDate!),
      data.eventBlock?.name
    );

    if (!available) {
      throw new Error('El horario seleccionado no está disponible');
    }

    const reservation = new Reservation(data);
    return await reservation.save();
  }

  async getCustomerReservations(email: string): Promise<IReservation[]> {
    return await Reservation.find({ 'customer.email': email })
      .sort({ eventDate: -1 });
  }

  async getReservationById(id: string): Promise<IReservation | null> {
    return await Reservation.findById(id);
  }

  async cancelReservation(id: string, email: string): Promise<IReservation | null> {
    const reservation = await Reservation.findOne({
      _id: id,
      'customer.email': email
    });

    if (!reservation) {
      throw new Error('Reservación no encontrada');
    }

    if (reservation.status === 'cancelled') {
      throw new Error('La reservación ya está cancelada');
    }

    // Check cancellation policy (e.g., 24 hours before)
    const hoursBeforeEvent = (new Date(reservation.eventDate).getTime() - Date.now()) / (1000 * 60 * 60);
    if (hoursBeforeEvent < 24) {
      throw new Error('No se puede cancelar con menos de 24 horas de anticipación');
    }

    reservation.status = 'cancelled';
    return await reservation.save();
  }

  async getAvailabilityCalendar(startDate: Date, endDate: Date): Promise<{
    [date: string]: {
      available: boolean;
      slots: any[];
      isRestDay: boolean;
    }
  }> {
    const calendar: any = {};
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const { availableSlots, isRestDay } = await AvailabilityService.getAvailableTimeSlots(currentDate);
      
      calendar[currentDate.toISOString().split('T')[0]] = {
        available: availableSlots.length > 0,
        slots: availableSlots,
        isRestDay
      };

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return calendar;
  }
}

export default new ReservationService();