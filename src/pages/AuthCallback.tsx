import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuth = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        navigate("/login");
        return;
      }

      // Fetch user profile to get user_type
      const { data: profile, error: profileError } = await supabase
        .from("user_profiles")
        .select("user_type")
        .eq("id", user.id)
        .single();

      // Set user in localStorage or context if needed
      localStorage.setItem("currentUser", JSON.stringify(user));

      // Redirect based on user_type
      if (profileError || !profile) {
        // fallback to student dashboard if profile missing
        navigate("/component/dashboard");
        return;
      }

      const userType = profile.user_type?.toLowerCase();
      if (userType === "teacher") {
        navigate("/teacher/dashboard");
      } else if (userType === "parent") {
        navigate("/parent/dashboard");
      } else {
        navigate("/component/dashboard");
      }
    };
    handleAuth();
  }, [navigate]);

  return <div>Signing you in...</div>;
}
