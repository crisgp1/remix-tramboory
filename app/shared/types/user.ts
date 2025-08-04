// Single Responsibility Principle - Each type has one clear purpose
export enum UserRole {
  CUSTOMER = 'customer',
  ADMIN = 'admin',
  SUPPLIER = 'supplier'
}

export enum AdminRole {
  SUPER_ADMIN = 'super_admin',
  OPERATIONS_MANAGER = 'operations_manager',
  EVENT_COORDINATOR = 'event_coordinator',
  FINANCE_MANAGER = 'finance_manager',
  MARKETING_MANAGER = 'marketing_manager'
}

export interface BaseUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
}

export interface Customer extends BaseUser {
  role: UserRole.CUSTOMER;
  phone?: string;
  preferences: {
    eventTypes: string[];
    budgetRange: [number, number];
    guestCountRange: [number, number];
  };
  bookings: Booking[];
}

export interface Admin extends BaseUser {
  role: UserRole.ADMIN;
  adminRole: AdminRole;
  department: string;
  permissions: string[];
  lastLogin?: string;
}

export interface Supplier extends BaseUser {
  role: UserRole.SUPPLIER;
  companyName: string;
  services: SupplierService[];
  rating: number;
  isVerified: boolean;
  contactInfo: {
    phone: string;
    address: string;
    website?: string;
  };
}

export interface Booking {
  id: string;
  customerId: string;
  eventType: string;
  eventDate: string;
  guestCount: number;
  status: BookingStatus;
  totalAmount: number;
  services: BookedService[];
  createdAt: string;
}

export interface BookedService {
  id: string;
  supplierId: string;
  serviceName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface SupplierService {
  id: string;
  name: string;
  category: ServiceCategory;
  description: string;
  basePrice: number;
  unit: string;
  availability: boolean;
  images: string[];
}

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum ServiceCategory {
  CATERING = 'catering',
  DECORATION = 'decoration',
  MUSIC = 'music',
  PHOTOGRAPHY = 'photography',
  TRANSPORTATION = 'transportation',
  FLOWERS = 'flowers',
  SECURITY = 'security',
  CLEANING = 'cleaning'
}