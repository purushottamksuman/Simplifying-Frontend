// Clear OTP context on login page load
if (typeof window !== 'undefined') {
  localStorage.removeItem('resetEmail');
  localStorage.removeItem('pendingUser');
}
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";
import { Input } from "../../../../components/ui/input";
import { supabase, authHelpers } from "../../../../lib/supabase";
import { toast } from "react-hot-toast";
import { PhoneIcon } from "lucide-react";

export const PropertyLoginSubsection = (): JSX.Element => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // ---------------- Phone Login (OTP Step 1) ----------------
  const handlePhoneLogin = async () => {
    if (!formData.phone) {
      setError("Please enter your phone number");
      return;
    }

    setLoading(true);
    setError("");

    let phone = formData.phone.trim();
    if (!phone.startsWith("+")) {
      phone = "+91" + phone.replace(/^0+/, "");
    }

    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone,
        options: { channel: "sms" },
      });

      if (error) {
        setError(error.message);
      } else {
        localStorage.setItem(
          "pendingUser",
          JSON.stringify({ phone, isPhoneLogin: true })
        );

        toast.success("OTP sent! Check your phone.");
        navigate("/otp");
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- OAuth Login ----------------
  const handleOAuthLogin = async (
    provider: "google" | "apple" | "linkedin_oidc"
  ) => {
    try {
      const redirectTo =
        window.location.hostname === "localhost"
          ? "http://localhost:5173/auth/callback"
          : "https://simplifyingskills.live/auth/callback";

      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo },
      });

      if (error) throw error;
      toast.success(`Redirecting to ${provider} login...`);
    } catch (err: any) {
      console.error("OAuth login error:", err);
      toast.error(err.message || "Login failed");
    }
  };

  // ---------------- Standard Email Login ----------------
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
        setError(error.message);
        return;
      }

      if (data.user) {
        localStorage.setItem(
          "currentUser",
          JSON.stringify({
            id: data.user.id,
            email: data.user.email,
            user_metadata: data.user.user_metadata,
          })
        );

        const { data: profile, error: profileError } = await supabase
          .from("user_profiles")
          .select("user_type")
          .eq("id", data.user.id)
          .single();

        if (!profileError && profile) {
          if (profile.user_type === "teacher") navigate("/teacher/dashboard");
          else if (profile.user_type === "parent")
            navigate("/parent/dashboard");
          else if (profile.user_type === "admin") navigate("/admin");
          else navigate("/component/dashboard");
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

  // ---------------- Reset Password ----------------
const handleResetPassword = async () => {
  if (!formData.email) {
    setError("Please enter your email first");
    return;
  }

  setLoading(true);
  setError("");

  try {
    const { data, error } = await supabase.auth.resetPasswordForEmail(formData.email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) throw error;

    // Save the email for OTP verification page
    localStorage.setItem("resetEmail", formData.email);

    toast.success("OTP sent to your email!");

    setTimeout(() => {
      navigate("/otp"); // Navigate to OTP verification page
    }, 100);
  } catch (err: any) {
    console.error("Reset password error:", err);
    setError(err.message || "Failed to send reset OTP");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="relative min-h-screen w-full flex justify-center items-center bg-white overflow-hidden">
      {/* Background Blurs */}
      <div className="absolute w-[900px] h-[900px] top-[-200px] left-[-200px] bg-[#007fff59] rounded-full blur-[200px] z-0" />
      <div className="absolute w-[900px] h-[900px] bottom-[-200px] right-[-200px] bg-[#0011ff59] rounded-full blur-[200px] z-0" />

      <div className="relative w-full max-w-8xl rounded-[30px] overflow-hidden flex flex-col lg:flex-row shadow-xl z-10">
        <div className="w-full lg:w-1/2 flex items-center justify-center px-10 py-12 relative z-10">
          <Card className="w-full max-w-lg shadow-md rounded-3xl bg-white">
            <CardContent className="p-8">
              <div className="flex justify-center">
                <img
                  src="/simplifying_skills_logo.png"
                  alt="Logo"
                  className="w-72 object-contain"
                />
              </div>

              <h1 className="mt-4 text-3xl font-bold text-center text-[#0062ff]">
                Login
              </h1>
              <p className="mt-2 text-center text-gray-700 text-sm">
                Log in to your personal account and begin your journey with us!
              </p>

              <div className="mt-8 space-y-5">
                <Input
                  className="h-[53px] rounded-3xl border border-gray-300 pl-4 font-roboto text-sm"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  type="email"
                />

                <div className="relative">
  <Input
    className="h-[53px] rounded-3xl border border-gray-300 pl-4 pr-10 font-roboto text-sm"
    placeholder="Password"
    type={showPassword ? "text" : "password"}
    value={formData.password}
    onChange={(e) => handleInputChange("password", e.target.value)}
  />

  {/* Eye toggle button */}
  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="absolute right-3 top-1/2 transform -translate-y-1/2"
  >
    <img
      src={showPassword ? "/eyes.png" : "/eyes.png"} // Use your new eye/eye-off icons
      alt="Toggle visibility"
      className="w-5 h-5 mr-1"
    />
  </button>
</div>


                {/* Forgot Password */}
                <p
                  onClick={handleResetPassword}
                  className="text-sm text-[#0062ff] text-right cursor-pointer hover:underline"
                >
                  Forgot Password?
                </p>

                <Input
                  className="h-[53px] rounded-3xl border border-gray-300 pl-4 font-roboto text-sm mt-4"
                  placeholder="Phone (+91...)"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                />

                {error && (
                  <div className="text-red-500 text-sm text-center">{error}</div>
                )}

                <Button
                  onClick={handleLogin}
                  disabled={loading}
                  className="w-full h-[50px] bg-[#007fff] hover:bg-[#0066cc] rounded-3xl text-white font-semibold text-lg"
                >
                  {loading ? "Processing..." : "Log In"}
                </Button>
              </div>

              {/* OAuth + Phone Buttons */}
              <div className="flex items-center gap-4 mt-8">
                <div className="flex-grow h-px bg-gray-300" />
                <span className="text-sm text-gray-400">or</span>
                <div className="flex-grow h-px bg-gray-300" />
              </div>

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

                <Button
                  variant="outline"
                  onClick={handlePhoneLogin}
                  className="col-span-2 h-[48px] rounded-xl border border-gray-300 hover:bg-gray-50 flex items-center justify-center gap-2"
                >
                  <PhoneIcon className="w-5 h-5" />
                  <span className="text-sm">Phone (OTP)</span>
                </Button>
              </div>

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

        {/* Right Section */}
        <div className="w-full lg:w-1/2 relative">
          <img
            src="/Mask group.png"
            alt="Illustration"
            className="w-full h-full object-cover rounded-br-[30px] rounded-tr-[30px]"
          />
          <img
            src="/bot.png"
            alt="bot"
            className="absolute top-[40%] right-[67%]"
          />
          <img
            src="/code.png"
            alt="code"
            className="absolute top-[45%] right-[43%]"
          />
          <img
            src="/messenger.png"
            alt="messenger"
            className="absolute top-[40%] right-[15%]"
          />
          <img
            src="/money.png"
            alt="money"
            className="absolute top-[20%] right-[46%]"
          />
        </div>
      </div>
    </div>
  );
};
