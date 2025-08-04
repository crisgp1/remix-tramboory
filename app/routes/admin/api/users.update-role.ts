import { data, type ActionFunctionArgs } from "react-router";
import { UserRole, AdminRole } from "@/shared/types/user";

export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== 'POST') {
    return data({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    const { userId, role, adminRole } = await request.json();

    if (!userId || !role) {
      return data({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate role
    if (!Object.values(UserRole).includes(role)) {
      return data({ error: 'Invalid role' }, { status: 400 });
    }

    // Validate adminRole if provided
    if (adminRole && !Object.values(AdminRole).includes(adminRole)) {
      return data({ error: 'Invalid admin role' }, { status: 400 });
    }

    const secretKey = process.env.CLERK_SECRET_KEY;
    if (!secretKey) {
      throw new Error('CLERK_SECRET_KEY environment variable is required');
    }

    const metadata: any = { role };
    
    if (role === UserRole.ADMIN && adminRole) {
      metadata.adminRole = adminRole;
      // Add default permissions based on admin role
      switch (adminRole) {
        case AdminRole.SUPER_ADMIN:
          metadata.permissions = ['*']; // All permissions
          break;
        case AdminRole.OPERATIONS_MANAGER:
          metadata.permissions = ['create_event', 'edit_event', 'view_all_events', 'manage_suppliers'];
          break;
        case AdminRole.EVENT_COORDINATOR:
          metadata.permissions = ['create_event', 'edit_event', 'view_all_events'];
          break;
        case AdminRole.FINANCE_MANAGER:
          metadata.permissions = ['view_financial_reports', 'manage_pricing', 'process_payments'];
          break;
        case AdminRole.MARKETING_MANAGER:
          metadata.permissions = ['view_all_users', 'manage_suppliers'];
          break;
      }
    } else if (role !== UserRole.ADMIN) {
      // Clear admin-specific metadata for non-admin roles
      metadata.adminRole = null;
      metadata.permissions = [];
    }

    const response = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${secretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        public_metadata: metadata,
        unsafe_metadata: metadata,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update user role: ${response.statusText}`);
    }
    
    return data({ success: true });
  } catch (error) {
    console.error('Error updating user role:', error);
    return data({ error: 'Failed to update user role' }, { status: 500 });
  }
}