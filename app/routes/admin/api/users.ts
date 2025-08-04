import { data, type LoaderFunctionArgs } from "react-router";
import { UserRole, AdminRole, type BaseUser } from "@/shared/types/user";

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const secretKey = process.env.CLERK_SECRET_KEY;
    if (!secretKey) {
      throw new Error('CLERK_SECRET_KEY environment variable is required');
    }

    const response = await fetch('https://api.clerk.com/v1/users', {
      headers: {
        'Authorization': `Bearer ${secretKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch users: ${response.statusText}`);
    }

    const clerkUsers = await response.json();
    
    const users: BaseUser[] = clerkUsers.data.map((clerkUser: any) => {
      const role = clerkUser.public_metadata?.role || 
                  clerkUser.unsafe_metadata?.role || 
                  UserRole.CUSTOMER;
      
      return {
        id: clerkUser.id,
        email: clerkUser.email_addresses[0]?.email_address || '',
        name: `${clerkUser.first_name || ''} ${clerkUser.last_name || ''}`.trim(),
        avatar: clerkUser.profile_image_url,
        role,
        isActive: !clerkUser.banned,
        createdAt: new Date(clerkUser.created_at).toISOString(),
        adminRole: role === UserRole.ADMIN ? (
          clerkUser.public_metadata?.adminRole || 
          clerkUser.unsafe_metadata?.adminRole
        ) : undefined,
        permissions: role === UserRole.ADMIN ? (
          clerkUser.public_metadata?.permissions || 
          clerkUser.unsafe_metadata?.permissions || []
        ) : undefined,
      };
    });

    return data(users);
  } catch (error) {
    console.error('Error fetching users from Clerk:', error);
    return data({ error: 'Failed to fetch users' }, { status: 500 });
  }
}