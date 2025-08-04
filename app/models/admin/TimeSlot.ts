import mongoose, { Schema, Document } from 'mongoose';

export interface ITimeSlot extends Document {
  name: string;
  startTime: string;
  endTime: string;
  duration: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TimeSlotSchema = new Schema<ITimeSlot>({
  name: {
    type: String,
    required: [true, 'El nombre del bloque horario es requerido'],
    trim: true,
    maxlength: [50, 'El nombre no puede exceder 50 caracteres']
  },
  startTime: {
    type: String,
    required: [true, 'La hora de inicio es requerida'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de hora inválido (HH:MM)']
  },
  endTime: {
    type: String,
    required: [true, 'La hora de fin es requerida'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de hora inválido (HH:MM)']
  },
  duration: {
    type: Number,
    required: [true, 'La duración es requerida'],
    min: [0.5, 'La duración mínima es 0.5 horas'],
    max: [12, 'La duración máxima es 12 horas']
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

TimeSlotSchema.index({ isActive: 1 });
TimeSlotSchema.index({ startTime: 1 });

export default mongoose.models.TimeSlot || mongoose.model<ITimeSlot>('TimeSlot', TimeSlotSchema);