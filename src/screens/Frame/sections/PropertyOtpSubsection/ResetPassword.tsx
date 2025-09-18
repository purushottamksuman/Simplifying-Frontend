import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../../lib/supabase"; // adjust path if needed
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleReset = async () => {
    if (!password || !confirm) {
      setError("Please fill out both fields.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setError("");
    setMessage("");
    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        setError(error.message);
      } else {
        setMessage("✅ Password updated successfully. Please login again.");
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (err) {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
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
              <h1 className="mt-4 text-3xl font-bold text-center text-[#0062ff]">
                Reset Password
              </h1>
              <p className="mt-2 text-center text-gray-700 text-sm">
                Enter and confirm your new password to continue.
              </p>

              {/* Inputs */}
              <div className="mt-8 space-y-5">
                <Input
                  type="password"
                  className="h-[53px] rounded-3xl border border-gray-300 pl-4 pr-10 font-roboto text-sm"
                  placeholder="New Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <Input
                  type="password"
                  className="h-[53px] rounded-3xl border border-gray-300 pl-4 pr-10 font-roboto text-sm"
                  placeholder="Confirm New Password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                />

                {/* Error / Success */}
                {error && <div className="text-red-500 text-sm text-center">{error}</div>}
                {message && <div className="text-green-500 text-sm text-center">{message}</div>}

                {/* Reset Button */}
                <Button
                  onClick={handleReset}
                  disabled={loading}
                  className="w-full h-[50px] bg-[#007fff] hover:bg-[#0066cc] rounded-3xl text-white font-semibold text-lg"
                >
                  {loading ? "Updating..." : "Update Password"}
                </Button>
              </div>

              {/* Back to Login */}
              <p className="mt-6 text-center text-sm text-gray-600">
                Remembered your password?{" "}
                <span
                  onClick={() => navigate("/login")}
                  className="text-[#0062ff] cursor-pointer hover:underline"
                >
                  Log In
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
}
