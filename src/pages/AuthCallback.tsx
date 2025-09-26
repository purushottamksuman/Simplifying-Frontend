// src/pages/AuthCallback.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function AuthCallback() {
  const navigate = useNavigate();

useEffect(() => {
  if (typeof window === "undefined") return;

  const { data: listener } = supabase.auth.onAuthStateChange(
    (event, session) => {
      if (event === "SIGNED_IN" && session) {
        localStorage.setItem("currentUser", JSON.stringify(session.user));
        localStorage.setItem("accessToken", session.access_token);
        localStorage.setItem("refreshToken", session.refresh_token);

        // fetch profile and redirect
        supabase
          .from("user_profiles")
          .select("user_type")
          .eq("id", session.user.id)
          .single()
          .then(({ data: profile }) => {
            if (profile?.user_type === "teacher")
              navigate("/teacher/dashboard", { replace: true });
            else if (profile?.user_type === "parent")
              navigate("/parent/dashboard", { replace: true });
            else navigate("/component/dashboard", { replace: true });
          });
      } else if (event === "SIGNED_OUT") {
        navigate("/login", { replace: true });
      }
    }
  );

  return () => listener.subscription.unsubscribe();
}, [navigate]);



  return (
    <div style={{ display: "flex", height: "100vh", alignItems: "center", justifyContent: "center" }}>
      <p>🔄 Signing you in...</p>
    </div>
  );
}
