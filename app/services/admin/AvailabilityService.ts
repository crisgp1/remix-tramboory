import AvailabilitySchedule, { IAvailabilitySchedule } from '@/models/admin/AvailabilitySchedule';
import TimeSlot from '@/models/admin/TimeSlot';
import Reservation from '@/models/Reservation';
import mongoose from 'mongoose';

export class AvailabilityService {
  async getScheduleForDay(dayOfWeek: number): Promise<IAvailabilitySchedule | null> {
    return await AvailabilitySchedule.findOne({ dayOfWeek }).populate('timeSlots');
  }

  async updateDaySchedule(dayOfWeek: number, timeSlotIds: string[], isRestDay: boolean, restDayFee?: number): Promise<IAvailabilitySchedule> {
    const schedule = await AvailabilitySchedule.findOneAndUpdate(
      { dayOfWeek },
      {
        dayOfWeek,
        timeSlots: timeSlotIds,
        isRestDay,
        restDayFee: isRestDay ? restDayFee : undefined
      },
      { new: true, upsert: true }
    ).populate('timeSlots');

    return schedule!;
  }

  async addSpecialDate(date: Date, timeSlotIds: string[], isBlocked: boolean, blockReason?: string): Promise<IAvailabilitySchedule | null> {
    const dayOfWeek = date.getDay();
    const schedule = await AvailabilitySchedule.findOne({ dayOfWeek });

    if (!schedule) {
      return null;
    }

    const specialDateIndex = schedule.specialDates.findIndex(
      sd => sd.date.toDateString() === date.toDateString()
    );

    if (specialDateIndex >= 0) {
      schedule.specialDates[specialDateIndex] = {
        date,
        timeSlots: timeSlotIds.map(id => new mongoose.Types.ObjectId(id)),
        isBlocked,
        blockReason
      };
    } else {
      schedule.specialDates.push({
        date,
        timeSlots: timeSlotIds.map(id => new mongoose.Types.ObjectId(id)),
        isBlocked,
        blockReason
      });
    }

    return await schedule.save();
  }

  async getAvailableTimeSlots(date: Date): Promise<{
    timeSlots: any[];
    isRestDay: boolean;
    restDayFee: number;
  }> {
    const dayOfWeek = date.getDay();
    const schedule = await AvailabilitySchedule.findOne({ dayOfWeek }).populate('timeSlots');

    if (!schedule) {
      return { timeSlots: [], isRestDay: false, restDayFee: 0 };
    }

    // Check for special date configuration
    const specialDate = schedule.specialDates.find(
      sd => sd.date.toDateString() === date.toDateString()
    );

    if (specialDate) {
      if (specialDate.isBlocked) {
        return { timeSlots: [], isRestDay: schedule.isRestDay, restDayFee: schedule.restDayFee || 0 };
      }
      
      const specialTimeSlots = await TimeSlot.find({
        _id: { $in: specialDate.timeSlots },
        isActive: true
      });

      // Check existing reservations
      const availableSlots = await this.filterAvailableSlots(specialTimeSlots, date);
      return { 
        timeSlots: availableSlots, 
        isRestDay: schedule.isRestDay, 
        restDayFee: schedule.restDayFee || 0 
      };
    }

    // Regular schedule
    const availableSlots = await this.filterAvailableSlots(schedule.timeSlots, date);
    return { 
      timeSlots: availableSlots, 
      isRestDay: schedule.isRestDay, 
      restDayFee: schedule.restDayFee || 0 
    };
  }

  private async filterAvailableSlots(timeSlots: any[], date: Date): Promise<any[]> {
    const dateString = date.toISOString().split('T')[0];
    
    // Get all reservations for the date
    const reservations = await Reservation.find({
      eventDate: {
        $gte: new Date(dateString),
        $lt: new Date(new Date(dateString).getTime() + 24 * 60 * 60 * 1000)
      },
      status: { $ne: 'cancelled' }
    });

    // Filter out booked time slots
    const bookedSlotIds = reservations.map(r => r.eventBlock?.name || r.eventTime);
    
    return timeSlots.filter(slot => {
      const isBooked = bookedSlotIds.includes(slot.name) || 
                      bookedSlotIds.includes(slot.startTime);
      return !isBooked && slot.isActive;
    });
  }

  async getAllSchedules(): Promise<IAvailabilitySchedule[]> {
    return await AvailabilitySchedule.find({})
      .populate('timeSlots')
      .sort({ dayOfWeek: 1 });
  }
}

export default new AvailabilityService();