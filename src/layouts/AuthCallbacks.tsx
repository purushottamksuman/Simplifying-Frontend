import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase"; // adjust path if needed

export const AuthCallback = (): JSX.Element => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const handleAuth = async () => {
      try {
        // Get session after redirect
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error || !session) {
          console.error("No session found:", error);
          setError("Authentication failed. Please try logging in again.");
          setLoading(false);
          return;
        }

        const user = session.user;

        // Save user in localStorage
        localStorage.setItem(
          "currentUser",
          JSON.stringify({
            id: user.id,
            email: user.email,
            user_metadata: user.user_metadata,
          })
        );

        // Fetch role from user_profiles
        const { data: profile, error: profileError } = await supabase
          .from("user_profiles")
          .select("user_type")
          .eq("id", user.id)
          .single();

        if (profileError || !profile) {
          console.warn("Profile not found, defaulting to student dashboard");
          navigate("/component/dashboard"); // fallback
          return;
        }

        if (profile.user_type === "teacher") {
          navigate("/teacher/dashboard");
        } else if (profile.user_type === "parent") {
          navigate("/parent/dashboard");
        } else {
          navigate("/component/dashboard");
        }
      } catch (err) {
        console.error(err);
        setError("Unexpected error during login");
      } finally {
        setLoading(false);
      }
    };

    handleAuth();
  }, [navigate]);

  return (
    <div className="w-full h-screen flex items-center justify-center">
      {loading ? (
        <p className="text-lg text-gray-600">Finishing login...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : null}
    </div>
  );
};
