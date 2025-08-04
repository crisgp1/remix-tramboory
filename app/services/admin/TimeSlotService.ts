import TimeSlot, { ITimeSlot } from '@/models/admin/TimeSlot';

export class TimeSlotService {
  async createTimeSlot(data: Partial<ITimeSlot>): Promise<ITimeSlot> {
    const timeSlot = new TimeSlot(data);
    return await timeSlot.save();
  }

  async getAllTimeSlots(includeInactive = false): Promise<ITimeSlot[]> {
    const query = includeInactive ? {} : { isActive: true };
    return await TimeSlot.find(query).sort({ startTime: 1 });
  }

  async getTimeSlotById(id: string): Promise<ITimeSlot | null> {
    return await TimeSlot.findById(id);
  }

  async updateTimeSlot(id: string, data: Partial<ITimeSlot>): Promise<ITimeSlot | null> {
    return await TimeSlot.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteTimeSlot(id: string): Promise<boolean> {
    const result = await TimeSlot.findByIdAndUpdate(id, { isActive: false }, { new: true });
    return !!result;
  }

  async validateTimeSlotOverlap(startTime: string, endTime: string, excludeId?: string): Promise<boolean> {
    const query: any = {
      isActive: true,
      $or: [
        { startTime: { $lt: endTime }, endTime: { $gt: startTime } }
      ]
    };

    if (excludeId) {
      query._id = { $ne: excludeId };
    }

    const overlapping = await TimeSlot.findOne(query);
    return !overlapping;
  }
}

export default new TimeSlotService();