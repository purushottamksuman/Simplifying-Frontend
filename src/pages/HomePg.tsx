import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

// dashboards
import { PropertyDasboardSubsection } from "../screens/Frame/sections/PropertyDasboardSubsection/PropertyDasboardSubsection";
import PropertyTeacherDashboard from "../screens/teacher-flow/PropertyTeacherDashboard/PropertyTeacherDashboard";
import PropertyParentDashboard from "../screens/parent-flow/PropertyParentDashboard/PropertyParentDashboard";

// layouts with sidebars
import DashboardLayout from "../layouts/DashboardLayout";
import TeacherLayout from "../layouts/TeacherLayout";
import ParentLayout from "../layouts/ParentLayout";

export const HomePg: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<"student" | "teacher" | "parent" | "admin" | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      try {
        // Get user from Supabase auth
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error || !user) {
          navigate("/login");
          return;
        }

        // Fetch user profile to check role
        const { data: profile, error: profileError } = await supabase
          .from("user_profiles")
          .select("user_type")
          .eq("id", user.id)
          .single();

        if (profileError || !profile) {
          console.error("Profile fetch error:", profileError);
          navigate("/login");
          return;
        }

        const userRole = profile.user_type?.toLowerCase();
        setRole(userRole);

        // Redirect admin to /admin
        if (userRole === "admin") {
          navigate("/admin", { replace: true });
        }

      } catch (err) {
        console.error("HomePage checkUser error:", err);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, [navigate]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  // Student dashboard
  if (role === "student") {
    return (
      <DashboardLayout>
        <PropertyDasboardSubsection />
      </DashboardLayout>
    );
  }

  // Teacher dashboard
  if (role === "teacher") {
    return (
      <TeacherLayout>
        <PropertyTeacherDashboard />
      </TeacherLayout>
    );
  }

  // Parent dashboard
  if (role === "parent") {
    return (
      <ParentLayout>
        <PropertyParentDashboard />
      </ParentLayout>
    );
  }

  // Fallback if no dashboard
  return (
    <div className="flex justify-center items-center h-screen">
      <p>No dashboard found for this role. Please contact support.</p>
    </div>
  );
};
