import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";
import { Input } from "../../../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import { authHelpers } from "../../../../lib/supabase";
import { useState } from "react";

export const PropertyCommanSubsection = (): JSX.Element => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userType: "",
    email: "",
    phone: "",
    countryCode: "+91",
    password: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignUp = async () => {
    console.log("🚀 Starting registration process...");
    
    // Validate required fields
    if (!formData.email.trim()) {
      setError("Please enter your email address");
      return;
    }
    
    if (!formData.phone.trim()) {
      setError("Please enter your phone number");
      return;
    }
    
    if (!formData.userType.trim()) {
      setError("Please select your user type (Student/Parent/Teacher)");
      return;
    }

    if (!formData.password.trim()) {
      setError("Please enter a password");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Sign up with Supabase - this will send your custom confirmation email with {{.Token}}
      const { data, error } = await authHelpers.signUp(
        formData.email.trim(),
        formData.password,
        {
          user_type: formData.userType,
          phone: `${formData.countryCode}${formData.phone.trim()}`,
          full_name: "",
          country_code: formData.countryCode
        }
      );

      if (error) {
        console.error("❌ Registration failed:", error);
        setError(error.message || "Registration failed. Please try again.");
        return;
      }

      console.log("✅ Registration successful! Confirmation email sent with OTP token.");
      
      // Store user data for OTP verification page
      localStorage.setItem('pendingUser', JSON.stringify({
        email: formData.email,
        phone: formData.phone,
        userType: formData.userType,
        countryCode: formData.countryCode,
        isRegistration: true,
        userId: data.user?.id
      }));

      // Navigate to OTP verification page
      navigate('/component/otp');
      
    } catch (err) {
      console.error('❌ Registration error:', err);
      setError(`Registration failed: ${err.message || 'Unknown error'}. Please try again.`);
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
    <div className="w-full min-h-screen bg-white relative overflow-hidden">
      <div className="relative w-full min-h-screen mx-auto">
        {/* Background Container */}
        <div className="absolute inset-0 bg-[#edf0fa] rounded-[101px]" />

        {/* Mask Image */}
        <img
          className="absolute w-[1040px] h-[970px] top-0 right-0 rounded-tr-[100px] rounded-br-[100px] object-cover"
          alt="Mask group"
          src="/Mask group.png"
        />

        {/* Blur circles */}
        <div className="absolute w-[598px] h-[535px] top-[30%] left-[25%] bg-[#007fff59] rounded-[299px/267.5px] blur-[125px]" />
        <div className="absolute w-[568px] h-[535px] top-[15%] left-[5%] bg-[#0011ff59] rounded-[284px/267.5px] blur-[125px]" />

        {/* Decorative images */}
        <img
          className="absolute w-[300px] h-[170px] top-[40%] right-[15%]"
          alt="bot"
          src="/bot.png"
        />
        <img
          className="absolute w-[300px] h-[230px] top-[50%] right-[5%]"
          alt="code"
          src="/code.png"
        />
        <img
          className="absolute w-[350px] h-[260px] top-[42%] right-[-5%]"
          alt="messenger"
          src="/messenger.png"
        />
        <img
          className="absolute w-[350px] h-[250px] top-[25%] right-[5%]"
          alt="money"
          src="/money.png"
        />

        {/* Card Section */}
        <div className="flex items-center justify-center min-h-screen relative z-10">
          <Card className="w-[600px] bg-white rounded-[20px] shadow-[3px_-5px_40px_#cdcdd31a] mx-4">
            <CardContent className="p-8">
              {/* Logo */}
              <div className="flex justify-center mb-6">
                <img
                  className="w-[300px] h-[75px] object-contain"
                  alt="Simplifying SKILLS"
                  src="/simplifying_skills_logo.png"
                />
              </div>

              {/* Heading */}
              <div className="text-center mb-6">
                <h1 className="[font-family:'Poppins',Helvetica] font-semibold text-[#0062ff] text-4xl tracking-[0.10px] leading-normal">
                  Register
                </h1>
              </div>

              {/* Subtitle */}
              <div className="text-center mb-8">
                <p className="[font-family:'Poppins',Helvetica] font-medium text-black text-[15px] tracking-[0.10px] leading-[25px]">
                  Let's get you set up so you can verify your personal account
                  <br />
                  and begin your journey with us!
                </p>
              </div>

              {/* Form Fields */}
              <div className="space-y-6">
                {/* User Type Selection */}
                <div className="relative">
                  <Label className="absolute -top-2 left-4 bg-white px-2 z-10 [font-family:'Roboto',Helvetica] font-normal text-[#7f7f7f] text-xs">
                    You Are
                  </Label>
                  <Select onValueChange={(value) => handleInputChange('userType', value)}>
                    <SelectTrigger className="w-full h-[54px] bg-white rounded-3xl border border-solid border-[#e2e2ea]">
                      <SelectValue
                        placeholder="Select Student / Parent / Teacher"
                        className="[font-family:'Roboto',Helvetica] font-normal text-[#7f7f7f] text-sm tracking-[0.10px] leading-[normal]"
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="parent">Parent</SelectItem>
                      <SelectItem value="teacher">Teacher</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Email Field */}
                <div className="relative">
                  <Input
                    className="h-[53px] bg-white rounded-3xl border border-solid border-[#e2e2ea] pl-3.5 pr-24"
                    placeholder="Mail Address"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    type="email"
                  />
                  <div className="absolute top-[17px] right-[24px] [font-family:'Roboto',Helvetica] font-normal text-[#7f7f7f] text-sm tracking-[0.10px] leading-normal">
                    @gmail.com
                  </div>
                </div>

                {/* Phone Field */}
                <div className="flex gap-2">
                  <Input
                    className="w-16 h-[53px] bg-white rounded-3xl border border-solid border-[#e2e2ea] px-[13px] text-center"
                    value={formData.countryCode}
                    onChange={(e) => handleInputChange('countryCode', e.target.value)}
                  />
                  <Input
                    className="flex-1 h-[53px] bg-white rounded-3xl border border-solid border-[#e2e2ea] px-[15px]"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    type="tel"
                  />
                </div>

                {/* Password Field */}
                <Input
                  type="password"
                  className="h-[53px] bg-white rounded-3xl border border-solid border-[#e2e2ea] px-3.5"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                />

                {/* Confirm Password Field */}
                <Input
                  type="password"
                  className="h-[53px] bg-white rounded-3xl border border-solid border-[#e2e2ea] px-3.5"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                />

                {/* Error Message */}
                {error && (
                  <div className="text-red-500 text-sm text-center">
                    {error}
                  </div>
                )}

                {/* Sign Up Button */}
                <div className="flex justify-center">
                  <Button 
                    onClick={handleSignUp}
                    disabled={loading}
                    className="w-[340px] h-[53px] bg-[#007fff] rounded-3xl hover:bg-[#0066cc]"
                  >
                    <span className="[font-family:'Poppins',Helvetica] font-semibold text-[#fafafb] text-2xl text-center tracking-[0] leading-[normal]">
                      {loading ? "Signing Up..." : "Sign Up"}
                    </span>
                  </Button>
                </div>

                {/* Social Login Section */}
                <div className="space-y-4">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="bg-white px-2 text-gray-500">Or</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Google */}
                    <Button
                      variant="outline"
                      className="h-[50px] rounded-xl border border-[#d9d9d9] hover:bg-gray-50 flex items-center justify-center px-3"
                    >
                      <div className="flex items-center gap-2">
                        <img className="w-5 h-5" src="/google.png" alt="Google" />
                        <span className="font-poppins font-medium text-black text-xs">
                          Google
                        </span>
                      </div>
                    </Button>

                    {/* Apple */}
                    <Button
                      variant="outline"
                      className="h-[50px] rounded-xl border border-[#d9d9d9] hover:bg-gray-50 flex items-center justify-center px-3"
                    >
                      <div className="flex items-center gap-2">
                        <img className="w-5 h-5" src="/apple.png" alt="Apple" />
                        <span className="font-poppins font-medium text-black text-xs">
                          Apple
                        </span>
                      </div>
                    </Button>
                  </div>

                  {/* LinkedIn */}
                  <Button
                    variant="outline"
                    className="w-full h-[50px] rounded-xl border border-[#d9d9d9] hover:bg-gray-50 flex items-center justify-center px-5"
                  >
                    <div className="flex items-center gap-3">
                      <img className="w-5 h-5" src="/linkedin.png" alt="LinkedIn" />
                      <span className="font-poppins font-medium text-black text-sm">
                        Sign up with LinkedIn
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