import { Outlet, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const PortalLayout = () => {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default PortalLayout;
