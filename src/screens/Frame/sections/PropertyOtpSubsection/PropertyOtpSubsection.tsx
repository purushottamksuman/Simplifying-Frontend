import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "../../../../components/ui/input-otp";
import { authHelpers } from "../../../../lib/supabase";

export const PropertyOtpSubsection = (): JSX.Element => {
  const otpSlots = Array.from({ length: 6 }, (_, index) => ({ id: index }));
  const navigate = useNavigate();

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [isLoginFlow, setIsLoginFlow] = useState(false);
  const [timer, setTimer] = useState(120);
  const [canResend, setCanResend] = useState(false);

  // Load user data + start timer
  useEffect(() => {
    const pendingUser = localStorage.getItem("pendingUser");
    if (pendingUser) {
      const userData = JSON.parse(pendingUser);
      setUserEmail(userData.email);
      setIsLoginFlow(userData.isLogin || false);
    } else {
      navigate("/login");
    }

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [navigate]);

  const handleSubmit = async () => {
    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const pendingUser = localStorage.getItem("pendingUser");
      const userData = pendingUser ? JSON.parse(pendingUser) : null;

      if (!userData) {
        setError("Session expired. Please start over.");
        navigate("/login");
        return;
      }

      const { data, error } = await authHelpers.verifyOTP(
  userEmail,
  otp,
  "signup"
);

if (error) {
  setError("Invalid or expired OTP. Please try again.");
  return;
}

if (data?.user) {
  const user_type = data.user.user_metadata?.user_type;

  localStorage.setItem(
    "currentUser",
    JSON.stringify({
      id: data.user.id,
      email: data.user.email,
      user_metadata: data.user.user_metadata,
    })
  );

  if (isLoginFlow) {
    navigate("/login");
  } else {
    if (user_type === "student") {
      navigate("/component/dashboard");
    } else if (user_type === "teacher") {
      navigate("/teacher/dashboard");
    } else if (user_type === "parent") {
      navigate("/parent/dashboard");
    } else {
      navigate("/component/dashboard"); // fallback
    }
  }
} 
}catch (err) {
      setError("Failed to verify OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;

    setResendLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const pendingUser = localStorage.getItem("pendingUser");
      if (!pendingUser) {
        setError("Session expired. Please start over.");
        return;
      }
      const userData = JSON.parse(pendingUser);

      const { error } = await authHelpers.resendConfirmation(userData.email);
      if (error) {
        setError("Failed to resend email. Try again.");
        return;
      }

      setSuccessMessage("OTP resent successfully!");
      setTimer(120);
      setCanResend(false);
    } catch (err) {
      setError("Error resending OTP");
    } finally {
      setResendLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const maskedEmail = userEmail
    ? userEmail.replace(/(.{2})(.*)(@.*)/, "$1****$3")
    : "user@example.com";

  return (
    <div className="relative min-h-screen w-full flex justify-center items-center bg-white overflow-hidden">
      {/* Background Blur Circles */}
      <div className="absolute w-[900px] h-[900px] top-[-200px] left-[-200px] bg-[#007fff59] rounded-full blur-[200px]" />
      <div className="absolute w-[900px] h-[900px] bottom-[-200px] right-[-200px] bg-[#0011ff59] rounded-full blur-[200px]" />

      {/* Main Wrapper */}
      <div className="relative w-full max-w-8xl rounded-[30px] overflow-hidden flex flex-col lg:flex-row z-10">
        {/* Left Section - OTP Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-10 py-12">
          <Card className="w-full max-w-md h-[604px] shadow-md rounded-3xl bg-white">
            <CardContent className="p-8 text-center">
              {/* Logo */}
              <img
                src="/simplifying_skills_logo.png"
                alt="Simplifying SKILLS"
                className="w-full mx-auto"
              />

              <h1 className="mt-6 text-3xl font-bold text-[#0062ff]">
                OTP VERIFICATION
              </h1>
              <p className="mt-2 text-gray-600 text-sm">
                Enter the OTP sent to{" "}
                <span className="text-[#007fff]">{maskedEmail}</span>
              </p>

              {/* OTP Inputs */}
              <div className="mt-6 flex justify-center">
                <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                  <InputOTPGroup className="gap-3.5">
                    {otpSlots.map((slot) => (
                      <InputOTPSlot
                        key={slot.id}
                        index={slot.id}
                        className="w-[50px] h-[50px] rounded-xl border border-gray-300 text-xl"
                      />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </div>

              {/* Timer */}
              <div className="mt-4 text-gray-700 font-medium">
                {formatTime(timer)} Sec
              </div>

              {/* Resend */}
              <p className="mt-2 text-sm text-gray-600">
                Didn’t Receive code?{" "}
                <button
                  onClick={handleResend}
                  disabled={!canResend || resendLoading}
                  className="text-[#007fff] hover:underline disabled:opacity-50"
                >
                  {resendLoading
                    ? "Resending..."
                    : canResend
                    ? "Re-send"
                    : `Resend in ${formatTime(timer)}`}
                </button>
              </p>

              {/* Error/Success */}
              {error && <div className="mt-3 text-red-500 text-sm">{error}</div>}
              {successMessage && (
                <div className="mt-3 text-green-500 text-sm">
                  {successMessage}
                </div>
              )}

              {/* Submit */}
              <Button
                onClick={handleSubmit}
                disabled={loading || otp.length !== 6}
                className="mt-6 w-full h-[50px] bg-[#0062ff] rounded-3xl text-white font-semibold"
              >
                {loading ? "Verifying..." : "Submit"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Section - Illustration */}
        <div className="w-full lg:w-1/2 relative hidden lg:block">
          <img
            src="/Mask group.png"
            alt="Illustration"
            className="w-full h-full object-cover rounded-br-[30px] rounded-tr-[30px]"
          />
          <img
            src="/bot.png"
            alt="bot"
            className="absolute top-[35%] right-[70%]"
          />
          <img
            src="/code.png"
            alt="code"
            className="absolute top-[45%] right-[48%]"
          />
          <img
            src="/messenger.png"
            alt="messenger"
            className="absolute top-[35%] right-[25%]"
          />
          <img
            src="/money.png"
            alt="money"
            className="absolute top-[15%] right-[47%]"
          />
        </div>
      </div>
    </div>
  );
};
