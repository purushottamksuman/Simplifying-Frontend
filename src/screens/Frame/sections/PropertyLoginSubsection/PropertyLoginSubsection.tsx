import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";
import { Input } from "../../../../components/ui/input";
import { supabase, authHelpers } from "../../../../lib/supabase"; // 👈 include supabase

export const PropertyLoginSubsection = (): JSX.Element => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 📌 Standard email/password login
  const handleLogin = async () => {
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { data, error } = await authHelpers.signIn(
        formData.email,
        formData.password
      );

      if (error) {
        if (
          error.message === "Email not confirmed" ||
          error.message.includes("email_not_confirmed")
        ) {
          const { error: resendError } = await authHelpers.resendConfirmation(
            formData.email
          );

          if (resendError) {
            setError("Failed to send confirmation email. Please try again.");
            return;
          }

          localStorage.setItem(
            "pendingUser",
            JSON.stringify({
              email: formData.email,
              password: formData.password,
              isLogin: true,
            })
          );

          navigate("/component/otp");
          return;
        }

        setError(error.message);
        return;
      }

      if (data.user) {
        // Save user in localStorage
        localStorage.setItem(
          "currentUser",
          JSON.stringify({
            id: data.user.id,
            email: data.user.email,
            user_metadata: data.user.user_metadata,
          })
        );

        // Fetch role from user_profiles
        const { data: profile, error: profileError } = await supabase
          .from("user_profiles")
          .select("user_type")
          .eq("id", data.user.id)
          .single();

        if (profileError || !profile) {
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
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  // 📌 Dynamic OAuth login
  const handleOAuthLogin = async (provider: "google" | "apple" | "linkedin_oidc") => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin + "/auth/callback", // 👈 handle callback
        },
      });

      if (error) {
        console.error("OAuth error:", error.message);
        setError("Failed to login with " + provider);
      }
    } catch (err) {
      console.error(err);
      setError("Unexpected error. Try again.");
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="relative min-h-screen w-full flex justify-center items-center bg-white overflow-hidden">
      {/* Background Blur Circles */}
      <div className="absolute w-[900px] h-[900px] top-[-200px] left-[-200px] bg-[#007fff59] rounded-full blur-[200px] z-0" />
      <div className="absolute w-[900px] h-[900px] bottom-[-200px] right-[-200px] bg-[#0011ff59] rounded-full blur-[200px] z-0" />

      <div className="relative w-full max-w-8xl rounded-[30px] overflow-hidden flex flex-col lg:flex-row shadow-xl z-10">
        {/* Left Section - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-10 py-12 relative z-10">
          <Card className="w-full max-w-lg shadow-md rounded-3xl bg-white">
            <CardContent className="p-8">
              {/* Logo */}
              <div className="flex justify-center">
                <img
                  src="/simplifying_skills_logo.png"
                  alt="Simplifying SKILLS"
                  className="w-72 object-contain"
                />
              </div>

              {/* Title */}
              <h1 className="mt-4 text-3xl font-bold text-center text-[#0062ff]">Login</h1>
              <p className="mt-2 text-center text-gray-700 text-sm">
                Log in to your personal account <br /> and begin your journey with us!
              </p>

              {/* Inputs */}
              <div className="mt-8 space-y-5">
                {/* Email */}
                <div className="relative">
                  <Input
                    className="h-[53px] rounded-3xl border border-gray-300 pl-4 pr-24 font-roboto text-sm"
                    placeholder="Mail Address"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    type="email"
                  />
                  <div className="absolute top-[15px] right-4 text-gray-500 text-sm">@gmail.com</div>
                </div>

                {/* Password */}
                <div className="relative">
                  <Input
                    type="password"
                    className="h-[53px] rounded-3xl border border-gray-300 pl-4 pr-10 font-roboto text-sm"
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                  />
                  <img
                    className="absolute w-[19px] h-[18px] top-[18px] right-[20px]"
                    alt="password icon"
                    src="/eyes.png"
                  />
                </div>

                {/* Forgot Password */}
                <div className="text-right">
                  <button className="text-xs text-gray-500 hover:text-[#0062ff]">
                    Forgot Password?
                  </button>
                </div>

                {/* Error */}
                {error && <div className="text-red-500 text-sm text-center">{error}</div>}

                {/* Login Button */}
                <Button
                  onClick={handleLogin}
                  disabled={loading}
                  className="w-full h-[50px] bg-[#007fff] hover:bg-[#0066cc] rounded-3xl text-white font-semibold text-lg"
                >
                  {loading ? "Logging In..." : "Log In"}
                </Button>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-4 mt-8">
                <div className="flex-grow h-px bg-gray-300" />
                <span className="text-sm text-gray-400">or</span>
                <div className="flex-grow h-px bg-gray-300" />
              </div>

              {/* Social Logins */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                <Button
                  variant="outline"
                  onClick={() => handleOAuthLogin("google")}
                  className="h-[48px] rounded-xl border border-gray-300 hover:bg-gray-50 flex items-center justify-center gap-2"
                >
                  <img className="w-5 h-5" src="/google.png" alt="Google" />
                  <span className="text-sm">Google</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleOAuthLogin("apple")}
                  className="h-[48px] rounded-xl border border-gray-300 hover:bg-gray-50 flex items-center justify-center gap-2"
                >
                  <img className="w-5 h-5" src="/apple.png" alt="Apple" />
                  <span className="text-sm">Apple</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleOAuthLogin("linkedin_oidc")}
                  className="col-span-2 h-[48px] rounded-xl border border-gray-300 hover:bg-gray-50 flex items-center justify-center gap-2"
                >
                  <img className="w-5 h-5" src="/linkedin.png" alt="LinkedIn" />
                  <span className="text-sm">LinkedIn</span>
                </Button>
              </div>

              {/* Sign Up */}
              <p className="mt-6 text-center text-sm text-gray-600">
                Create a new account?{" "}
                <span
                  onClick={() => navigate("/signup")}
                  className="text-[#0062ff] cursor-pointer hover:underline"
                >
                  Sign Up
                </span>
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Right Section - Illustration */}
        <div className="w-full lg:w-1/2 relative">
          <img
            src="/Mask group.png"
            alt="Illustration"
            className="w-full h-full object-cover rounded-br-[30px] rounded-tr-[30px]"
          />

          <img src="/bot.png" alt="bot" className="absolute top-[40%] right-[67%]" />
          <img src="/code.png" alt="code" className="absolute top-[45%] right-[43%]" />
          <img src="/messenger.png" alt="messenger" className="absolute top-[40%] right-[15%]" />
          <img src="/money.png" alt="money" className="absolute top-[20%] right-[46%]" />
        </div>
      </div>
    </div>
  );
};
