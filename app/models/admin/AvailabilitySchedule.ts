import mongoose, { Schema, Document } from 'mongoose';

export interface IAvailabilitySchedule extends Document {
  dayOfWeek: number;
  timeSlots: mongoose.Types.ObjectId[];
  isRestDay: boolean;
  restDayFee?: number;
  specialDates: {
    date: Date;
    timeSlots: mongoose.Types.ObjectId[];
    isBlocked: boolean;
    blockReason?: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const AvailabilityScheduleSchema = new Schema<IAvailabilitySchedule>({
  dayOfWeek: {
    type: Number,
    required: [true, 'El día de la semana es requerido'],
    min: [0, 'El día debe ser entre 0 (Domingo) y 6 (Sábado)'],
    max: [6, 'El día debe ser entre 0 (Domingo) y 6 (Sábado)'],
    unique: true
  },
  timeSlots: [{
    type: Schema.Types.ObjectId,
    ref: 'TimeSlot'
  }],
  isRestDay: {
    type: Boolean,
    default: false
  },
  restDayFee: {
    type: Number,
    min: [0, 'La tarifa no puede ser negativa']
  },
  specialDates: [{
    date: {
      type: Date,
      required: true
    },
    timeSlots: [{
      type: Schema.Types.ObjectId,
      ref: 'TimeSlot'
    }],
    isBlocked: {
      type: Boolean,
      default: false
    },
    blockReason: String
  }]
}, {
  timestamps: true
});

AvailabilityScheduleSchema.index({ dayOfWeek: 1 });
AvailabilityScheduleSchema.index({ 'specialDates.date': 1 });

export default mongoose.models.AvailabilitySchedule || mongoose.model<IAvailabilitySchedule>('AvailabilitySchedule', AvailabilityScheduleSchema);