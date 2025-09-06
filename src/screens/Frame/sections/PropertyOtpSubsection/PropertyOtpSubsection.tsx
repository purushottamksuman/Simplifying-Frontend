import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "../../../../components/ui/input-otp";
import { authHelpers } from "../../../../lib/supabase";
import { useState, useEffect } from "react";

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

  useEffect(() => {
    // Get pending user data
    const pendingUser = localStorage.getItem('pendingUser');
    if (pendingUser) {
      const userData = JSON.parse(pendingUser);
      setUserEmail(userData.email);
      setIsLoginFlow(userData.isLogin || false);
      
      console.log("📧 OTP verification page loaded for:", userData.email);
      console.log("🔄 Flow type:", userData.isLogin ? "Login verification" : "Registration verification");
    } else {
      // If no pending user, redirect to login
      navigate('/component/login');
    }

    // Start timer
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
      const pendingUser = localStorage.getItem('pendingUser');
      const userData = pendingUser ? JSON.parse(pendingUser) : null;

      if (!userData) {
        setError("Session expired. Please start over.");
        navigate('/component/comman');
        return;
      }

      if (isLoginFlow) {
        // For login verification - verify OTP token
        const { data, error } = await authHelpers.verifyOTP(userEmail, otp, 'email');
        
        if (error) {
          setError("Invalid OTP. Please try again.");
          return;
        }

        console.log("✅ Login OTP verified, signing in user...");
        
        // Now sign in the user with their credentials
        const { data: loginData, error: loginError } = await authHelpers.signIn(userData.email, userData.password);
        
        if (loginError) {
          setError("Failed to complete login. Please try again.");
          return;
        }
        
        // Store user session info
        localStorage.setItem('currentUser', JSON.stringify({
          id: loginData.user.id,
          email: loginData.user.email,
          user_metadata: loginData.user.user_metadata
        }));
        
        // Clear pending user data
        localStorage.removeItem('pendingUser');
        navigate('/component/dashboard');
        
      } else {
        // For registration verification - verify OTP token
        const { data, error } = await authHelpers.verifyOTP(userEmail, otp, 'signup');
        
        if (error) {
          setError("Invalid OTP. Please try again.");
          return;
        }

        console.log("✅ Registration OTP verified successfully!");
        
        // Store user session info (user account was already created during signup)
        localStorage.setItem('currentUser', JSON.stringify({
          id: data.user.id,
          email: data.user.email,
          user_metadata: data.user.user_metadata
        }));
        
        // Clear pending user data
        localStorage.removeItem('pendingUser');
        navigate('/component/overlap-wrapper');
      }
      
    } catch (err) {
      console.error('OTP verification error:', err);
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
      const pendingUser = localStorage.getItem('pendingUser');
      if (!pendingUser) {
        setError("Session expired. Please start over.");
        return;
      }

      const userData = JSON.parse(pendingUser);
      
      console.log("🔄 Resending confirmation email to:", userData.email);
      
      // Resend confirmation email using Supabase's default system
      const { error } = await authHelpers.resendConfirmation(userData.email);
      
      if (error) {
        setError("Failed to resend confirmation email. Please try again.");
        return;
      }
      
      setSuccessMessage("Confirmation email resent successfully! Check your email.");
      
      // Reset timer
      setTimer(120);
      setCanResend(false);
      
      // Restart timer
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
      
    } catch (err) {
      console.error('Resend confirmation error:', err);
      setError("Failed to resend confirmation email");
    } finally {
      setResendLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const maskedEmail = userEmail ? 
    userEmail.replace(/(.{2})(.*)(@.*)/, '$1****$3') : 
    'user@example.com';

  return (
    <div className="w-full min-h-screen bg-white relative">
      <div className="relative w-full min-h-screen mx-auto">
        {/* Background Container */}
        <div className="absolute inset-0 bg-[#edf0fa] rounded-[101px]" />

        {/* Mask Image */}
        <img
          className="absolute w-[1250px] h-[970px] top-0 right-0 lg:right-[-40px] rounded-tr-[100px] rounded-br-[100px]"
          alt="Mask group"
          src="/Mask group.png"
        />

        {/* Blurred Background Circles */}
        <div className="absolute w-[598px] h-[535px] top-[338px] left-[352px] bg-[#007fff59] rounded-[299px/267.5px] blur-[125px]" />
        <div className="absolute w-[568px] h-[535px] top-[157px] left-[83px] bg-[#0011ff59] rounded-[284px/267.5px] blur-[125px]" />

        {/* Decorative Illustrations */}
        <img
          className="absolute w-[370px] h-[209px] top-[434px] left-[950px]"
          alt="Bot"
          src="/bot.png"
        />
        <img
          className="absolute w-[370px] h-[289px] top-[510px] left-[1080px]"
          alt="Code"
          src="/code.png"
        />
        <img
          className="absolute w-[420px] h-[328px] top-[439px] left-[1230px]"
          alt="Messenger"
          src="/messenger.png"
        />
        <img
          className="absolute w-[417px] h-[315px] top-[250px] left-[1080px]"
          alt="Money"
          src="/money.png"
        />

        {/* OTP Card */}
        <div className="absolute w-[623px] h-[858px] top-[57px] left-36 shadow-[0px_4px_4px_#00000040]">
          <Card className="relative w-[625px] h-[860px] bg-white rounded-[20px] shadow-[3px_-5px_40px_#cdcdd31a]">
            <CardContent className="p-0">
              <div className="flex flex-col w-[436px] items-center gap-[49px] absolute top-40 left-[95px]">
                {/* Logo */}
                <img
                  className="absolute w-[366px] h-[91px] top-[-100px] left-[35px] object-cover"
                  alt="Simplifying SKILLS"
                  src="/image34.png"
                />

                {/* Heading */}
                <h1 className="font-poppins font-semibold text-[#0062ff] text-[38px] tracking-[0.10px] leading-normal text-center">
                  OTP VERIFICATION
                </h1>

                {/* Subheading */}
                <p className="font-poppins font-medium text-xl text-center tracking-[0] leading-normal max-w-[340px]">
                  <span className="text-black">
                    Enter the 6-digit verification code sent to{" "}
                  </span>
                  <span className="text-[#007fff]">{maskedEmail}</span>
                </p>

                {/* OTP Inputs */}
                  <div className="flex items-center gap-3.5">
                    <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                      <InputOTPGroup className="gap-3.5">
                        {otpSlots.map((slot) => (
                          <InputOTPSlot
                            key={slot.id}
                            index={slot.id}
                            className="w-[68px] h-[68px] bg-white rounded-3xl border border-[#e2e2ea] font-roboto font-normal text-[#7f7f7f] text-xl tracking-[0.10px] leading-normal flex items-center justify-center"
                          />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  </div>

                {/* Timer */}
                <div className="font-poppins font-medium text-black text-xl text-center tracking-[0] leading-normal">
                  {formatTime(timer)} Sec
                </div>

                {successMessage && (
                  <div className="text-green-500 text-sm text-center max-w-[340px]">
                    {successMessage}
                  </div>
                )}
                {error && (
                  <div className="text-red-500 text-sm text-center">
                    {error}
                  </div>
                )}

                {/* Resend Button */}
                <div className="flex flex-col items-center gap-4">
                  <p className="font-poppins font-medium text-lg text-center tracking-[0] leading-normal">
                    <span className="text-black">Didn't receive the email? </span>
                  </p>
                  
                  <Button
                    variant="outline"
                    onClick={handleResend}
                    disabled={!canResend || resendLoading}
                    className="w-[280px] h-[45px] border-[#007fff] text-[#007fff] hover:bg-[#007fff] hover:text-white"
                  >
                    {resendLoading ? (
                      "Resending..."
                    ) : canResend ? (
                      "🔄 Resend Email"
                    ) : (
                      `Resend in ${formatTime(timer)}`
                    )}
                  </Button>
                </div>

                {/* Submit Button - Only for login flow */}
                  <div className="relative w-[340px] h-[53px]">
                    <Button 
                      onClick={handleSubmit}
                      disabled={loading || otp.length !== 6}
                      className="relative w-[342px] h-[55px] -top-px -left-px bg-[#007fff] rounded-3xl hover:bg-[#007fff]/90"
                    >
                      <span className="font-poppins font-semibold text-[#fafafb] text-2xl text-center tracking-[0] leading-normal">
                        {loading ? "Verifying..." : "Verify"}
                      </span>
                    </Button>
                  </div>

              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};