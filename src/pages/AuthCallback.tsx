import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuth = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Auth error:", error.message);
        navigate("/login");
        return;
      }

      const session = data.session;

      if (!session?.user) {
        navigate("/login");
        return;
      }

      const user = session.user;

      // Store session info
      localStorage.setItem("currentUser", JSON.stringify(user));
      localStorage.setItem("accessToken", session.access_token);
      localStorage.setItem("refreshToken", session.refresh_token);

      // Fetch user profile
      const { data: profile, error: profileError } = await supabase
        .from("user_profiles")
        .select("user_type")
        .eq("id", user.id)
        .single();

      if (profileError || !profile) {
        navigate("/component/dashboard");
        return;
      }

      const userType = profile.user_type?.toLowerCase();
      if (userType === "teacher") navigate("/teacher/dashboard");
      else if (userType === "parent") navigate("/parent/dashboard");
      else navigate("/component/dashboard");
    };

    handleAuth();
  }, [navigate]);

  return <div>Signing you in...</div>;
}
