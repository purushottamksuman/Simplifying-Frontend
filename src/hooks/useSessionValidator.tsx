// src/hooks/useSessionValidator.ts
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { toast } from "react-hot-toast";

export const useSessionValidator = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const validateSession = async () => {
      const storedUser = localStorage.getItem("currentUser");
      if (!storedUser) return;

      const currentUser = JSON.parse(storedUser);

      if (!currentUser?.id || !currentUser?.sessionId) {
        supabase.auth.signOut();
        localStorage.removeItem("currentUser");
        navigate("/login");
        return;
      }

      // Fetch latest session from DB
      const { data, error } = await supabase
        .from("user_profiles")
        .select("current_session_id")
        .eq("id", currentUser.id)
        .single();

      if (error || !data) {
        supabase.auth.signOut();
        localStorage.removeItem("currentUser");
        navigate("/login");
        return;
      }

      if (data.current_session_id !== currentUser.sessionId) {
        // Session mismatch → log out
        supabase.auth.signOut();
        localStorage.removeItem("currentUser");
        toast.error("Logged out because you signed in on another device");
        navigate("/login");
      }
    };

    validateSession();

    // Optional: recheck every 60 seconds
    const interval = setInterval(validateSession, 10000);
    return () => clearInterval(interval);
  }, [navigate]);
};
