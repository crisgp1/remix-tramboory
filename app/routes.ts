import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("dashboard", "routes/dashboard.tsx"),
  route("role-selector", "routes/role-selector.tsx"),
  route("debug-role", "routes/debug-role.tsx"),
  
  // Customer routes
  route("customer/dashboard", "routes/customer/customer.dashboard.tsx"),
  
  // Admin routes  
  route("admin/dashboard", "routes/admin/admin.dashboard.tsx"),
  route("admin/reservations", "routes/admin/admin.reservations.tsx"),
  route("admin/inventory", "routes/admin/admin.inventory.tsx"),
  route("admin/suppliers", "routes/admin/admin.suppliers.tsx"),
  route("admin/settings", "routes/admin/admin.settings.tsx"),
  
  // Admin API routes
  route("admin/api/users", "routes/admin/api/users.ts"),
  route("admin/api/users/update-role", "routes/admin/api/users.update-role.ts"),
  route("admin/api/users/ban", "routes/admin/api/users.ban.ts"),
  route("admin/api/users/unban", "routes/admin/api/users.unban.ts"),
  
  // Supplier routes
  route("supplier/dashboard", "routes/supplier.dashboard.tsx"),
] satisfies RouteConfig;
