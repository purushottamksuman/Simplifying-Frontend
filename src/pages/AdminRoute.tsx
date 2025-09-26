// components/AdminRoute.tsx
import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { supabase } from "../lib/supabase";

const ADMIN_EMAIL = "admin@gmail.com";

const AdminRoute: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };
    fetchUser();
  }, []);

  if (loading) return null; // or a loader

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.email !== ADMIN_EMAIL) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />; // <-- important for nested routes
};

export default AdminRoute;
