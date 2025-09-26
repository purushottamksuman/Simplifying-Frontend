// src/pages/AuthCallback.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuth = async () => {
      try {
        // Parse tokens from hash fragment
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);

        const access_token = params.get("access_token");
        const refresh_token = params.get("refresh_token");

        if (!access_token || !refresh_token) {
          console.error("No access or refresh token found");
          navigate("/login", { replace: true });
          return;
        }

        // ✅ Clean URL immediately
        window.history.replaceState({}, document.title, "/auth/callback");

        // Restore Supabase session
        const { error: sessionError } = await supabase.auth.setSession({
          access_token,
          refresh_token,
        });

        if (sessionError) {
          console.error("Error setting session:", sessionError.message);
          navigate("/login", { replace: true });
          return;
        }

        // Get current session
        const { data, error } = await supabase.auth.getSession();
        if (error || !data.session?.user) {
          console.error("Auth error:", error?.message);
          navigate("/login", { replace: true });
          return;
        }

        const session = data.session;
        const user = session.user;

        // Store session info
        localStorage.setItem("currentUser", JSON.stringify(user));
        localStorage.setItem("accessToken", session.access_token);
        localStorage.setItem("refreshToken", session.refresh_token);

        // Fetch user profile
        const { data: profile } = await supabase
          .from("user_profiles")
          .select("user_type")
          .eq("id", user.id)
          .single();

        // Redirect based on user type
        const userType = profile?.user_type?.toLowerCase();
        if (userType === "teacher") {
          navigate("/teacher/dashboard", { replace: true });
        } else if (userType === "parent") {
          navigate("/parent/dashboard", { replace: true });
        } else {
          navigate("/component/dashboard", { replace: true });
        }
      } catch (err) {
        console.error("Authentication failed:", err);
        navigate("/login", { replace: true });
      }
    };

    handleAuth();
  }, [navigate]);

  // Just a temporary loader while redirecting
  return (
    <div style={{ display: "flex", height: "100vh", alignItems: "center", justifyContent: "center" }}>
      <p>🔄 Signing you in...</p>
    </div>
  );
}
