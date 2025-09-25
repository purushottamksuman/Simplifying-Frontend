import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuth = async () => {
      // Parse tokens from URL hash
      const hash = window.location.hash.substring(1); // remove #
      const params = new URLSearchParams(hash);

      const access_token = params.get("access_token");
      const refresh_token = params.get("refresh_token");

      if (!access_token || !refresh_token) {
        console.error("No access or refresh token found");
        navigate("/login");
        return;
      }

      // Restore session manually
      const { error: sessionError } = await supabase.auth.setSession({
        access_token,
        refresh_token,
      });

      if (sessionError) {
        console.error("Error setting session:", sessionError.message);
        navigate("/login");
        return;
      }

      // Now get the session
      const { data, error } = await supabase.auth.getSession();
      if (error || !data.session?.user) {
        console.error("Auth error:", error?.message);
        navigate("/login");
        return;
      }

      const session = data.session;
      const user = session.user;

      // Store tokens locally
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
