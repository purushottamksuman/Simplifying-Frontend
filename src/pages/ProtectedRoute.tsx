import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { supabase } from "../lib/supabase";

interface ProtectedRouteProps {
  allowedRoles: string[];
  children?: React.ReactNode;
}

const roleToDashboard: Record<string, string> = {
  student: "/component/dashboard",
  teacher: "/teacher/dashboard",
  parent: "/parent/dashboard",
  admin: "/admin",
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, children }) => {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        setUser(null);
        setUserRole(null);
        setLoading(false);
        return;
      }
      setUser(user);
      const { data: profile, error: profileError } = await supabase
        .from("user_profiles")
        .select("user_type")
        .eq("id", user.id)
        .single();
      if (profileError || !profile) {
        setUserRole(null);
        setLoading(false);
        return;
      }
      setUserRole(profile.user_type?.toLowerCase());
      setLoading(false);
    };
    checkUser();
  }, []);

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (!userRole || !allowedRoles.includes(userRole)) {
    // Redirect to their dashboard if not allowed
    const dash = userRole ? roleToDashboard[userRole] : "/login";
    return <Navigate to={dash} replace />;
  }
  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
