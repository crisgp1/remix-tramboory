import { useState, useEffect } from 'react';
import { UserRole, AdminRole, type BaseUser } from '@/shared/types/user';

// Client-side hook for Clerk admin operations
export function useClerkAdmin() {
  const [users, setUsers] = useState<BaseUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAllUsers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/admin/api/users');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      
      const userData = await response.json();
      setUsers(userData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, role: UserRole, adminRole?: AdminRole) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/admin/api/users/update-role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, role, adminRole }),
      });

      if (!response.ok) {
        throw new Error('Failed to update user role');
      }

      // Refresh users list after successful update
      await fetchAllUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      console.error('Error updating user role:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const banUser = async (userId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/admin/api/users/ban', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error('Failed to ban user');
      }

      // Refresh users list after successful ban
      await fetchAllUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      console.error('Error banning user:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const unbanUser = async (userId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/admin/api/users/unban', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error('Failed to unban user');
      }

      // Refresh users list after successful unban
      await fetchAllUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      console.error('Error unbanning user:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    users,
    loading,
    error,
    fetchAllUsers,
    updateUserRole,
    banUser,
    unbanUser,
  };
}