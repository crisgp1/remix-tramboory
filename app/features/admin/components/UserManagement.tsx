import { useState, useEffect } from 'react';
import { useClerkAdmin } from '@/shared/hooks/useClerkAdmin';
import { UserRole, AdminRole, type BaseUser } from '@/shared/types/user';
import { ConfigSection } from '@/shared/components/ui/ConfigSection';
import { Button } from '@/shared/components/ui/Button';
import { Select } from '@/shared/components/ui/Select';
import { Card } from '@/shared/components/ui/Card';

interface UserRowProps {
  user: BaseUser;
  onUpdateRole: (userId: string, role: UserRole, adminRole?: AdminRole) => Promise<void>;
  onBanUser: (userId: string) => Promise<void>;
  onUnbanUser: (userId: string) => Promise<void>;
  isUpdating: boolean;
}

function UserRow({ user, onUpdateRole, onBanUser, onUnbanUser, isUpdating }: UserRowProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole>(user.role);
  const [selectedAdminRole, setSelectedAdminRole] = useState<AdminRole | ''>((user as any).adminRole || '');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleRoleUpdate = async () => {
    if (selectedRole === user.role && selectedAdminRole === (user as any).adminRole) {
      return; // No changes
    }

    setIsProcessing(true);
    try {
      await onUpdateRole(
        user.id, 
        selectedRole, 
        selectedRole === UserRole.ADMIN && selectedAdminRole ? selectedAdminRole : undefined
      );
    } catch (error) {
      console.error('Failed to update role:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBanToggle = async () => {
    setIsProcessing(true);
    try {
      if (user.isActive) {
        await onBanUser(user.id);
      } else {
        await onUnbanUser(user.id);
      }
    } catch (error) {
      console.error('Failed to toggle ban status:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case UserRole.SUPPLIER:
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
    }
  };

  return (
    <Card className="p-4">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div className="flex items-center space-x-4">
          {user.avatar ? (
            <img 
              src={user.avatar} 
              alt={user.name}
              className="w-10 h-10 rounded-full ring-2 ring-gray-200 dark:ring-gray-700"
            />
          ) : (
            <div className="w-10 h-10 bg-gray-300 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          
          <div>
            <h3 className="font-medium text-gray-900 dark:text-gray-100">{user.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
            <div className="flex items-center space-x-2 mt-1">
              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded ${getRoleBadgeColor(user.role)}`}>
                {user.role}
              </span>
              {(user as any).adminRole && (
                <span className="inline-flex px-2 py-1 text-xs font-medium rounded bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400">
                  {(user as any).adminRole.replace('_', ' ')}
                </span>
              )}
              {!user.isActive && (
                <span className="inline-flex px-2 py-1 text-xs font-medium rounded bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
                  Banned
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
          <div className="flex items-center space-x-2">
            <Select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as UserRole)}
              disabled={isProcessing || isUpdating}
              className="min-w-32"
            >
              <option value={UserRole.CUSTOMER}>Customer</option>
              <option value={UserRole.ADMIN}>Admin</option>
              <option value={UserRole.SUPPLIER}>Supplier</option>
            </Select>

            {selectedRole === UserRole.ADMIN && (
              <Select
                value={selectedAdminRole}
                onChange={(e) => setSelectedAdminRole(e.target.value as AdminRole | '')}
                disabled={isProcessing || isUpdating}
                className="min-w-40"
              >
                <option value="">Select Admin Role</option>
                <option value={AdminRole.SUPER_ADMIN}>Super Admin</option>
                <option value={AdminRole.OPERATIONS_MANAGER}>Operations Manager</option>
                <option value={AdminRole.EVENT_COORDINATOR}>Event Coordinator</option>
                <option value={AdminRole.FINANCE_MANAGER}>Finance Manager</option>
                <option value={AdminRole.MARKETING_MANAGER}>Marketing Manager</option>
              </Select>
            )}
          </div>

          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="primary"
              onClick={handleRoleUpdate}
              disabled={
                isProcessing || 
                isUpdating || 
                (selectedRole === user.role && selectedAdminRole === (user as any).adminRole) ||
                (selectedRole === UserRole.ADMIN && !selectedAdminRole)
              }
            >
              {isProcessing ? 'Updating...' : 'Update Role'}
            </Button>

            <Button
              size="sm"
              variant={user.isActive ? 'danger' : 'secondary'}
              onClick={handleBanToggle}
              disabled={isProcessing || isUpdating}
            >
              {isProcessing ? 'Processing...' : user.isActive ? 'Ban' : 'Unban'}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

export function UserManagement() {
  const { users, loading, error, fetchAllUsers, updateUserRole, banUser, unbanUser } = useClerkAdmin();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const handleUpdateRole = async (userId: string, role: UserRole, adminRole?: AdminRole) => {
    setIsUpdating(true);
    try {
      await updateUserRole(userId, role, adminRole);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleBanUser = async (userId: string) => {
    setIsUpdating(true);
    try {
      await banUser(userId);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUnbanUser = async (userId: string) => {
    setIsUpdating(true);
    try {
      await unbanUser(userId);
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  return (
    <ConfigSection
      title="Gestión de Usuarios"
      description="Administra todos los usuarios del sistema y sus roles"
      icon={
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
        </svg>
      }
    >
      <div className="space-y-6">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Buscar por nombre o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <Select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as UserRole | 'all')}
            className="min-w-40"
          >
            <option value="all">Todos los roles</option>
            <option value={UserRole.CUSTOMER}>Customers</option>
            <option value={UserRole.ADMIN}>Admins</option>
            <option value={UserRole.SUPPLIER}>Suppliers</option>
          </Select>

          <Button
            variant="secondary"
            onClick={fetchAllUsers}
            disabled={loading}
          >
            {loading ? 'Cargando...' : 'Actualizar'}
          </Button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-800 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && !users.length && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Cargando usuarios...</p>
          </div>
        )}

        {/* Users List */}
        {!loading && users.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-400">No se encontraron usuarios.</p>
          </div>
        )}

        {filteredUsers.length === 0 && users.length > 0 && !loading && (
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-400">No hay usuarios que coincidan con los filtros.</p>
          </div>
        )}

        <div className="space-y-3">
          {filteredUsers.map(user => (
            <UserRow
              key={user.id}
              user={user}
              onUpdateRole={handleUpdateRole}
              onBanUser={handleBanUser}
              onUnbanUser={handleUnbanUser}
              isUpdating={isUpdating}
            />
          ))}
        </div>

        {/* Summary */}
        {users.length > 0 && (
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{users.length}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Usuarios</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">{users.filter(u => u.role === UserRole.CUSTOMER).length}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Customers</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-red-600">{users.filter(u => u.role === UserRole.ADMIN).length}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Admins</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">{users.filter(u => u.role === UserRole.SUPPLIER).length}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Suppliers</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </ConfigSection>
  );
}