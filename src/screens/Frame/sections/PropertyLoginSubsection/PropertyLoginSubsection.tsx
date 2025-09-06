import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";
import { Input } from "../../../../components/ui/input";
import { Separator } from "../../../../components/ui/separator";
import { authHelpers } from "../../../../lib/supabase";
import { useState } from "react";

export const PropertyLoginSubsection = (): JSX.Element => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { data, error } = await authHelpers.signIn(formData.email, formData.password);
      
      if (error) {
        // Check if email is not confirmed
        if (error.message === "Email not confirmed" || error.message.includes("email_not_confirmed")) {
          console.log("📧 Email not confirmed, sending magic link...");
          
          // Send magic link for email verification
          const { data: magicData, error: magicError } = await authHelpers.signInWithMagicLink(
            formData.email,
            { email: formData.email }
          );
          
          if (magicError) {
            setError("Failed to send verification email. Please try again.");
            return;
          }
          
          // Store user data for OTP verification
          localStorage.setItem('pendingUser', JSON.stringify({
            email: formData.email,
            userType: 'existing_user',
            isLogin: true
          }));
          
          console.log("✅ Magic link sent, redirecting to OTP verification...");
          navigate('/component/otp');
          return;
        }
        
        setError(error.message);
        return;
      }

      if (data.user) {
        // Store user session info
        localStorage.setItem('currentUser', JSON.stringify({
          id: data.user.id,
          email: data.user.email,
          user_metadata: data.user.user_metadata
        }));
        
        navigate('/component/dashboard');
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="w-full bg-white relative">
      <div className="relative w-full max-w-[1884px] top-[54px] left-9 mx-auto">
        {/* Background Container */}
        <div className="w-full max-w-[1831px] bg-[#edf0fa] rounded-[101px]" />

        {/* Mask Image */}
        <img
          className="absolute w-full max-w-[1040px] top-0 right-0 lg:right-[-40px] rounded-tr-[100px] rounded-br-[100px]"
          alt="Mask group"
          src="/Mask group.png"
        />

        {/* Blur circles */}
        <div className="absolute w-[598px] h-[535px] top-[338px] left-[352px] bg-[#007fff59] rounded-[299px/267.5px] blur-[125px]" />
        <div className="absolute w-[568px] h-[535px] top-[157px] left-[83px] bg-[#0011ff59] rounded-[284px/267.5px] blur-[125px]" />

        {/* Decorative images */}
        <img
          className="absolute w-[370px] h-[209px] top-[434px] left-[800px]"
          alt="bot"
          src="/bot.png"
        />
        <img
          className="absolute w-[370px] h-[289px] top-[510px] left-[940px]"
          alt="code"
          src="/code.png"
        />
        <img
          className="absolute w-[420px] h-[328px] top-[439px] left-[1090px]"
          alt="messenger"
          src="/messenger.png"
        />
        <img
          className="absolute w-[417px] h-[315px] top-[250px] left-[940px]"
          alt="money"
          src="/money.png"
        />

        {/* Card Section */}
        <div className="absolute w-[623px] h-[858px] top-[57px] left-36 shadow-[0px_4px_4px_#00000040]">
          <Card className="w-[625px] h-[860px] bg-white rounded-[20px] shadow-[3px_-5px_40px_#cdcdd31a]">
            <CardContent className="p-0 relative w-full h-full">
              <div className="flex flex-col items-center pt-[15px]">
                {/* Logo + Heading */}
                <div className="w-[366px] h-[139px] flex flex-col items-center">
                  <img
                    className="w-[366px] h-[91px] object-cover"
                    src="/simplifying_skills_logo.png"
                    alt="Simplifying SKILLS"
                  />
                  <h1 className="mt-2 font-semibold text-[#0062ff] text-[40px] tracking-[0.10px] leading-normal font-poppins">
                    Login
                  </h1>
                </div>

                {/* Subtitle */}
                <div className="mt-[24px] text-center font-medium text-black text-[15px] tracking-[0.10px] leading-[25px] font-poppins">
                  Log in to your personal account
                  <br />
                  and begin your journey with us!
                </div>

                {/* Inputs */}
                <div className="flex flex-col gap-6 mt-[55px] w-[448px]">
                  {/* Email */}
                  <div className="relative">
                    <Input
                      className="h-[53px] bg-white rounded-3xl border border-[#e2e2ea] pl-3.5 pr-24 font-roboto font-normal text-sm tracking-[0.10px]"
                      placeholder="Mail Address"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      type="email"
                    />
                    <div className="absolute top-[17px] right-3.5 font-roboto font-normal text-[#7f7f7f] text-sm tracking-[0.10px] leading-normal">
                      @gmail.com
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-1">
                    <div className="relative">
                      <Input
                        type="password"
                        className="h-[54px] bg-white rounded-3xl border border-[#e2e2ea] pl-3.5 pr-12 font-roboto font-normal text-sm tracking-[0.10px]"
                        placeholder="Password"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                      />
                      <img
                        className="absolute w-[19px] h-[18px] top-[17px] right-[26px]"
                        alt="password icon"
                      />
                    </div>
                    <div className="text-right">
                      <button className="font-poppins font-medium text-place-holder text-xs">
                        Forgot Password ?
                      </button>
                    </div>
                  </div>

                  {error && (
                    <div className="text-red-500 text-sm text-center">
                      {error}
                    </div>
                  )}

                  {/* Login Button */}
                  <div className="flex justify-center mt-8">
                    <Button 
                      onClick={handleLogin}
                      disabled={loading}
                      className="w-[340px] h-[53px] bg-[#007fff] hover:bg-[#0066cc] rounded-3xl font-poppins font-semibold text-[#fafafb] text-2xl"
                    >
                      {loading ? "Logging In..." : "Log In"}
                    </Button>
                  </div>
                </div>

                {/* Social logins */}
                <div className="grid grid-cols-2 gap-4 mt-10 w-[448px]">
                  {/* Google */}
                  <Button
                    variant="outline"
                    className="h-[50px] rounded-xl border border-[#d9d9d9] hover:bg-gray-50 flex items-center justify-center px-5"
                  >
                    <div className="flex items-center gap-3">
                      <img className="w-6 h-6" src="/google.png" alt="Google" />
                      <span className="font-poppins font-medium text-black text-sm">
                        Sign in with Google
                      </span>
                    </div>
                  </Button>

                  {/* Apple */}
                  <Button
                    variant="outline"
                    className="h-[50px] rounded-xl border border-[#d9d9d9] hover:bg-gray-50 flex items-center justify-center px-5"
                  >
                    <div className="flex items-center gap-3">
                      <img className="w-6 h-6" src="/apple.png" alt="Apple" />
                      <span className="font-poppins font-medium text-black text-sm">
                        Sign in with Apple
                      </span>
                    </div>
                  </Button>

                  {/* LinkedIn → spans both columns */}
                  <Button
                    variant="outline"
                    className="col-span-2 h-[50px] rounded-xl border border-[#d9d9d9] hover:bg-gray-50 flex items-center justify-center px-5"
                  >
                    <div className="flex items-center gap-3">
                      <img className="w-6 h-6" src="/linkedin.png" alt="LinkedIn" />
                      <span className="font-poppins font-medium text-black text-sm">
                        Sign in with LinkedIn
                      </span>
                    </div>
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

