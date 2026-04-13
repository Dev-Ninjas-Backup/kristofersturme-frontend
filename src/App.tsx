import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate, Outlet } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { getUserData, seedIfEmpty, seedSuperAdmin } from '@/lib/db';
import { useAuthStore } from "@/store/authStore";
import { useNotificationStore } from '@/store/notificationStore';

import PortalLayout from "@/components/layout/PortalLayout";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Members from "@/pages/Members";
import MemberProfile from "@/pages/MemberProfile";
import GranadaBookings from "@/pages/GranadaBookings";
import GranadaRoomDetail from "@/pages/GranadaRoomDetail";
import BarcelonaBookings from "@/pages/BarcelonaBookings";
import BarcelonaMatchDetail from "@/pages/BarcelonaMatchDetail";
import MyBookings from "@/pages/MyBookings";
import Profile from "@/pages/Profile";
import Notifications from "@/pages/Notifications";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminMembers from "@/pages/admin/AdminMembers";
import AdminGranada from "@/pages/admin/AdminGranada";
import AdminBarcelona from "@/pages/admin/AdminBarcelona";
import AdminRules from "@/pages/admin/AdminRules";
import JoinInvite from "@/pages/JoinInvite";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const AdminRoute = () => {
  const user = useAuthStore(s => s.user);
  if (user?.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return <Outlet />;
};

const AppInit = () => {
  const { _setAuth } = useAuthStore();
  const initNotifications = useNotificationStore(s => s.init);

  useEffect(() => {
    // Seed superadmin on every cold start (idempotent — skips if already done)
    seedSuperAdmin();

    let unsubNotif: (() => void) | null = null;

    const unsubAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userData = await getUserData(firebaseUser.uid);
        const role = userData?.role ?? 'member';
        const isActive = userData?.is_active ?? true;

        if (role === 'admin') await seedIfEmpty();

        _setAuth(
          { id: firebaseUser.uid, email: firebaseUser.email!, role, is_active: isActive },
          false
        );

        unsubNotif?.();
        unsubNotif = initNotifications(firebaseUser.uid);
      } else {
        _setAuth(null, false);
        unsubNotif?.();
        unsubNotif = null;
      }
    });

    return () => { unsubAuth(); unsubNotif?.(); };
  }, []);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppInit />
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/join/:token" element={<JoinInvite />} />

          {/* User panel */}
          <Route element={<PortalLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/members" element={<Members />} />
            <Route path="/members/:id" element={<MemberProfile />} />
            <Route path="/bookings/granada" element={<GranadaBookings />} />
            <Route path="/bookings/granada/:roomId" element={<GranadaRoomDetail />} />
            <Route path="/bookings/barcelona" element={<BarcelonaBookings />} />
            <Route path="/bookings/barcelona/:matchId" element={<BarcelonaMatchDetail />} />
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/notifications" element={<Notifications />} />

            {/* Admin panel */}
            <Route element={<AdminRoute />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/members" element={<AdminMembers />} />
              <Route path="/admin/granada" element={<AdminGranada />} />
              <Route path="/admin/barcelona" element={<AdminBarcelona />} />
              {/* Legacy routes redirect to combined pages */}
              <Route path="/admin/bookings/granada" element={<Navigate to="/admin/granada" replace />} />
              <Route path="/admin/bookings/barcelona" element={<Navigate to="/admin/barcelona" replace />} />
              <Route path="/admin/matches" element={<Navigate to="/admin/barcelona" replace />} />
              <Route path="/admin/rooms" element={<Navigate to="/admin/granada" replace />} />
              <Route path="/admin/rules" element={<AdminRules />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
