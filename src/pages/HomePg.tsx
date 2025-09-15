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
  const [role, setRole] = useState<"student" | "teacher" | "parent" | null>(null);

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

        setRole(profile.user_type?.toLowerCase());
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

  if (role === "student") {
    return (
      <DashboardLayout>
        <PropertyDasboardSubsection />
      </DashboardLayout>
    );
  }

  if (role === "teacher") {
    return (
      <TeacherLayout>
        <PropertyTeacherDashboard />
      </TeacherLayout>
    );
  }

  if (role === "parent") {
    return (
      <ParentLayout>
        <PropertyParentDashboard />
      </ParentLayout>
    );
  }

  // fallback
  return (
    <div className="flex justify-center items-center h-screen">
      <p>No dashboard found for this role. Please contact support.</p>
    </div>
  );
};
