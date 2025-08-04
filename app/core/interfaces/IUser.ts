// Interface Segregation Principle - Separate interfaces for different user capabilities
export interface IUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICustomer extends IUser {
  preferences: EventPreferences;
  bookingHistory: string[];
}

export interface IAdmin extends IUser {
  permissions: AdminPermission[];
  department: AdminDepartment;
  subordinates?: string[];
}

export interface ISupplier extends IUser {
  companyName: string;
  services: SupplierService[];
  rating: number;
  contracts: string[];
}

export enum UserRole {
  CUSTOMER = 'customer',
  ADMIN = 'admin',
  SUPPLIER = 'supplier'
}

export enum AdminDepartment {
  OPERATIONS = 'operations',
  EVENTS = 'events',
  FINANCE = 'finance',
  MARKETING = 'marketing',
  SUPER_ADMIN = 'super_admin'
}

export enum AdminPermission {
  // Event Management
  CREATE_EVENT = 'create_event',
  EDIT_EVENT = 'edit_event',
  DELETE_EVENT = 'delete_event',
  VIEW_ALL_EVENTS = 'view_all_events',
  
  // User Management
  CREATE_USER = 'create_user',
  EDIT_USER = 'edit_user',
  DELETE_USER = 'delete_user',
  VIEW_ALL_USERS = 'view_all_users',
  
  // Financial
  VIEW_FINANCIAL_REPORTS = 'view_financial_reports',
  MANAGE_PRICING = 'manage_pricing',
  PROCESS_PAYMENTS = 'process_payments',
  
  // Supplier Management
  MANAGE_SUPPLIERS = 'manage_suppliers',
  APPROVE_SUPPLIERS = 'approve_suppliers',
  
  // System
  SYSTEM_SETTINGS = 'system_settings',
  BACKUP_DATA = 'backup_data'
}

export interface EventPreferences {
  preferredEventTypes: string[];
  budgetRange: {
    min: number;
    max: number;
  };
  preferredDates: Date[];
  guestCountRange: {
    min: number;
    max: number;
  };
}

export interface SupplierService {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  availability: boolean;
}