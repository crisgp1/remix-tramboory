import { useUser } from "@clerk/clerk-react";
import { UserRole, AdminRole, type BaseUser } from "@/shared/types/user";

// Single Responsibility Principle - Hook only handles authentication logic
export function useAuth() {
  const { user, isLoaded, isSignedIn } = useUser();

  const getUserRole = (): UserRole | null => {
    if (!user) return null;
    // Check both publicMetadata and unsafeMetadata for role
    return (user.publicMetadata?.role as UserRole) || 
           (user.unsafeMetadata?.role as UserRole) || 
           UserRole.CUSTOMER;
  };

  const getAdminRole = (): AdminRole | null => {
    if (!user || getUserRole() !== UserRole.ADMIN) return null;
    // Check both publicMetadata and unsafeMetadata for adminRole
    return (user.publicMetadata?.adminRole as AdminRole) || 
           (user.unsafeMetadata?.adminRole as AdminRole) || 
           null;
  };

  const isCustomer = (): boolean => getUserRole() === UserRole.CUSTOMER;
  const isAdmin = (): boolean => getUserRole() === UserRole.ADMIN;
  const isSupplier = (): boolean => getUserRole() === UserRole.SUPPLIER;

  const isSuperAdmin = (): boolean => 
    isAdmin() && getAdminRole() === AdminRole.SUPER_ADMIN;

  const hasPermission = (permission: string): boolean => {
    if (!user || !isAdmin()) return false;
    // Check both publicMetadata and unsafeMetadata for permissions
    const permissions = (user.publicMetadata?.permissions as string[]) || 
                       (user.unsafeMetadata?.permissions as string[]) || 
                       [];
    return permissions.includes(permission) || isSuperAdmin();
  };

  const getCurrentUser = (): BaseUser | null => {
    if (!user) return null;

    const baseUser: BaseUser = {
      id: user.id,
      email: user.emailAddresses[0]?.emailAddress || '',
      name: user.fullName || '',
      avatar: user.imageUrl,
      role: getUserRole()!,
      isActive: true,
      createdAt: user.createdAt?.toISOString() || new Date().toISOString()
    };

    return baseUser;
  };

  return {
    user,
    isLoaded,
    isSignedIn,
    getUserRole,
    getAdminRole,
    isCustomer,
    isAdmin,
    isSupplier,
    isSuperAdmin,
    hasPermission,
    getCurrentUser
  };
}