import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../../../../components/ui/input-otp";
import { supabase } from "../../../../lib/supabase";

export const PropertyOtpSubsection = (): JSX.Element => {
  const navigate = useNavigate();
  const otpSlots = Array.from({ length: 6 }, (_, i) => i);

  const [otp, setOtp] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [timer, setTimer] = useState(120);
  const [canResend, setCanResend] = useState(false);

  // Load email for OTP verification (reset or signup)
  useEffect(() => {
    const resetEmail = localStorage.getItem("resetEmail");
    const pendingUser = localStorage.getItem("pendingUser");
    if (resetEmail) {
      setUserEmail(resetEmail);
    } else if (pendingUser) {
      const userData = JSON.parse(pendingUser);
      setUserEmail(userData.email);
    } else {
      navigate("/login"); // no context, send back
    }
  }, [navigate]);

  // Timer countdown
  useEffect(() => {
    if (timer <= 0) {
      setCanResend(true);
      return;
    }
    const interval = setInterval(() => {
      setTimer(prev => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Submit OTP
  const handleSubmit = async () => {
    if (otp.length !== 6) return setError("Please enter a valid 6-digit OTP");
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      // Check if this is a reset password flow
      const resetEmail = localStorage.getItem("resetEmail");
      const email = resetEmail || userEmail;
      const type = resetEmail ? "recovery" : "signup";
      const { data, error: otpError } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type,
      });

      if (otpError) {
        setError(otpError.message || "Invalid or expired OTP");
        return;
      }
      

      if (data?.user) {
        if (resetEmail) {
          // Go to reset-password page
          localStorage.setItem("resetUserId", data.user.id);
          navigate("/reset-password");
        } else {
          localStorage.setItem("currentUser", JSON.stringify(data.user));
          navigate("/component/dashboard");
        }
      }
    } catch (err: any) {
      console.error("OTP verification failed:", err);
      setError(err.message || "OTP verification failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResend = async () => {
    if (!canResend) return;

    setResendLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const { error: resendError } = await supabase.auth.signInWithOtp({ email: userEmail });

      if (resendError) {
        setError(resendError.message || "Failed to resend OTP");
        return;
      }

      setSuccessMessage("OTP resent successfully! Check your inbox/spam.");
      setTimer(120);
      setCanResend(false);
    } catch (err: any) {
      console.error("Resend OTP failed:", err);
      setError(err.message || "Resend OTP failed");
    } finally {
      setResendLoading(false);
    }
  };

  const maskedEmail = userEmail ? userEmail.replace(/(.{2})(.*)(@.*)/, "$1****$3") : "user@example.com";

  return (
    <div className="relative min-h-screen flex justify-center items-center bg-white">
      {/* Background Circles */}
      <div className="absolute w-[900px] h-[900px] top-[-200px] left-[-200px] bg-[#007fff59] rounded-full blur-[200px]" />
      <div className="absolute w-[900px] h-[900px] bottom-[-200px] right-[-200px] bg-[#0011ff59] rounded-full blur-[200px]" />

      <div className="relative w-full max-w-8xl rounded-[30px] overflow-hidden flex flex-col lg:flex-row z-10">
        {/* OTP Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-10 py-12">
          <Card className="w-full max-w-md shadow-md rounded-3xl bg-white">
            <CardContent className="p-8 text-center">
              <img src="/simplifying_skills_logo.png" alt="Logo" className="w-full mx-auto" />
              <h1 className="mt-6 text-3xl font-bold text-[#0062ff]">OTP VERIFICATION</h1>
              <p className="mt-2 text-gray-600 text-sm">
                Enter the OTP sent to <span className="text-[#007fff]">{maskedEmail}</span>
              </p>

              <div className="mt-6 flex justify-center">
                <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                  <InputOTPGroup className="gap-3.5">
                    {otpSlots.map(i => (
                      <InputOTPSlot key={i} index={i} className="w-[50px] h-[50px] rounded-xl border border-gray-300 text-xl" />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </div>

              <div className="mt-4 text-gray-700 font-medium">{formatTime(timer)} Sec</div>

              <p className="mt-2 text-sm text-gray-600">
                Didn’t receive code?{" "}
                <button
                  onClick={handleResend}
                  disabled={!canResend || resendLoading}
                  className="text-[#007fff] hover:underline disabled:opacity-50"
                >
                  {resendLoading ? "Resending..." : canResend ? "Re-send" : `Resend in ${formatTime(timer)}`}
                </button>
              </p>

              {error && <div className="mt-3 text-red-500 text-sm">{error}</div>}
              {successMessage && <div className="mt-3 text-green-500 text-sm">{successMessage}</div>}

              <Button
                onClick={handleSubmit}
                disabled={loading || otp.length !== 6}
                className="mt-6 w-full h-[50px] bg-[#0062ff] rounded-3xl text-white font-semibold"
              >
                {loading ? "Verifying..." : "Submit"}
              </Button>

              <p className="mt-2 text-sm text-gray-600">
                Remembered your password?{" "}
                <button onClick={() => navigate("/login")} className="text-[#007fff] hover:underline">
                  Login
                </button>
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Illustration */}
        <div className="w-full lg:w-1/2 relative hidden lg:block">
          <img src="/Mask group.png" alt="Illustration" className="w-full h-full object-cover rounded-br-[30px] rounded-tr-[30px]" />
          <img src="/bot.png" alt="bot" className="absolute top-[35%] right-[70%]" />
          <img src="/code.png" alt="code" className="absolute top-[45%] right-[48%]" />
          <img src="/messenger.png" alt="messenger" className="absolute top-[35%] right-[25%]" />
          <img src="/money.png" alt="money" className="absolute top-[15%] right-[47%]" />
        </div>
      </div>
    </div>
  );
};
