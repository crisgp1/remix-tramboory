import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@/shared/hooks/useAuth";
import { UserRole } from "@/shared/types/user";

// Single Responsibility Principle - Component only handles role-based dashboard routing
export default function DashboardRoute() {
  const navigate = useNavigate();
  const { isLoaded, isSignedIn, getUserRole } = useAuth();

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      navigate('/');
      return;
    }

    const userRole = getUserRole();
    
    // Redirect to appropriate dashboard based on user role
    switch (userRole) {
      case UserRole.CUSTOMER:
        navigate('/customer/dashboard');
        break;
      case UserRole.ADMIN:
        navigate('/admin/dashboard');
        break;
      case UserRole.SUPPLIER:
        navigate('/supplier/dashboard');
        break;
      default:
        // Default to customer dashboard for new users
        navigate('/customer/dashboard');
    }
  }, [isLoaded, isSignedIn, getUserRole, navigate]);

  // Show loading while determining redirect
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirigiendo a tu panel...</p>
      </div>
    </div>
  );
}