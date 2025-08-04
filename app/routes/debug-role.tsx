import { useAuth } from "@/shared/hooks/useAuth";
import { UserRole, AdminRole } from "@/shared/types/user";

export default function DebugRole() {
  const { user, getUserRole, getAdminRole, isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return <div className="p-8">Loading...</div>;
  }

  if (!isSignedIn) {
    return <div className="p-8">Not signed in</div>;
  }

  const userRole = getUserRole();
  const adminRole = getAdminRole();

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold mb-6">Debug Role Information</h1>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-gray-900">User Info:</h3>
            <p>Email: {user?.emailAddresses[0]?.emailAddress}</p>
            <p>Name: {user?.fullName}</p>
            <p>ID: {user?.id}</p>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900">Public Metadata:</h3>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(user?.publicMetadata, null, 2)}
            </pre>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900">Unsafe Metadata:</h3>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(user?.unsafeMetadata, null, 2)}
            </pre>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900">Detected Roles:</h3>
            <p>User Role: <span className="font-mono bg-blue-100 px-2 py-1 rounded">{userRole || 'null'}</span></p>
            <p>Admin Role: <span className="font-mono bg-green-100 px-2 py-1 rounded">{adminRole || 'null'}</span></p>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900">Role Checks:</h3>
            <p>Is Customer: {userRole === UserRole.CUSTOMER ? '✅' : '❌'}</p>
            <p>Is Admin: {userRole === UserRole.ADMIN ? '✅' : '❌'}</p>
            <p>Is Supplier: {userRole === UserRole.SUPPLIER ? '✅' : '❌'}</p>
            <p>Is Super Admin: {userRole === UserRole.ADMIN && adminRole === AdminRole.SUPER_ADMIN ? '✅' : '❌'}</p>
          </div>
          
          <div className="flex space-x-4 mt-6">
            <a href="/customer/dashboard" className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600">
              Test Customer Dashboard
            </a>
            <a href="/admin/dashboard" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Test Admin Dashboard
            </a>
            <a href="/supplier/dashboard" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
              Test Supplier Dashboard
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}