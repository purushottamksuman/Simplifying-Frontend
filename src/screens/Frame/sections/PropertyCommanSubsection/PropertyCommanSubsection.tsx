import React, { useState } from "react";
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

export const PropertyCommanSubsection = (): JSX.Element => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userType: "",
    email: "",
    phone: "",
    countryCode: "+91",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignUp = async () => {
    console.log("🚀 Starting registration process...");

    // ✅ validations
    if (!formData.email.trim()) return setError("Please enter your email address");
    if (!formData.phone.trim()) return setError("Please enter your phone number");
    if (!formData.userType.trim()) return setError("Please select your user type (Student/Parent/Teacher)");
    if (!formData.password.trim()) return setError("Please enter a password");
    if (formData.password.length < 6) return setError("Password must be at least 6 characters long");
    if (formData.password !== formData.confirmPassword) return setError("Passwords do not match");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) return setError("Please enter a valid email address");

    setLoading(true);
    setError("");

    try {
      // ✅ Sign up with Supabase and include role in user_metadata
    const { data, error } = await authHelpers.signUp(
  formData.email.trim(),
  formData.password,
  {
    user_type: formData.userType,   // ✅ unified naming
    phone: `${formData.countryCode}${formData.phone.trim()}`,
    full_name: "",
    country_code: formData.countryCode,
  }
);

if (!error) {
  localStorage.setItem(
    "pendingUser",
    JSON.stringify({
      email: formData.email,
      phone: formData.phone,
      user_type: formData.userType,  // ✅ store same key
      countryCode: formData.countryCode,
      isRegistration: true,
      userId: data.user?.id,
    })
  );

  navigate("/otp");
}
    } catch (err: any) {
      console.error("❌ Registration error:", err);
      setError(`Registration failed: ${err.message || "Unknown error"}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="relative min-h-screen w-full flex justify-center items-center bg-white overflow-hidden">
      {/* Background Blur Circles */}
      <div className="absolute w-[900px] h-[900px] top-[-200px] left-[-200px] bg-[#007fff59] rounded-full blur-[200px] z-0" />
      <div className="absolute w-[900px] h-[900px] bottom-[-200px] right-[-200px] bg-[#0011ff59] rounded-full blur-[200px] z-0" />

      {/* Main Wrapper */}
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
                Register
              </h1>
              <p className="mt-2 text-center text-gray-700 text-sm font-semibold">
                Let's get you set up so you can verify your personal account and begin your journey with us!
              </p>

              {/* Inputs */}
              <div className="mt-8 space-y-5">
                {/* User Type */}
                <Select onValueChange={(value) => handleInputChange("userType", value)}>
                  <SelectTrigger className="h-[53px] rounded-3xl border border-gray-300 pl-4">
                    <SelectValue placeholder="Select (Student / Parent / Teacher)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="parent">Parent</SelectItem>
                    <SelectItem value="teacher">Teacher</SelectItem>
                  </SelectContent>
                </Select>

                {/* Email */}
                <Input
                  className="h-[53px] rounded-3xl border border-gray-300 pl-4 font-roboto text-sm"
                  placeholder="Mail Address"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  type="email"
                />

                {/* Phone */}
                <div className="flex gap-2">
                  <Input
                    className="w-20 h-[53px] rounded-3xl border border-gray-300 text-center"
                    value={formData.countryCode}
                    onChange={(e) => handleInputChange("countryCode", e.target.value)}
                  />
                  <Input
                    className="flex-1 h-[53px] rounded-3xl border border-gray-300 pl-4"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    type="tel"
                  />
                </div>

                {/* Password */}
                <Input
                  type="password"
                  className="h-[53px] rounded-3xl border border-gray-300 pl-4"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                />

                {/* Confirm Password */}
                <Input
                  type="password"
                  className="h-[53px] rounded-3xl border border-gray-300 pl-4"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                />

                {/* Error */}
                {error && <div className="text-red-500 text-sm text-center">{error}</div>}

                {/* Register Button */}
                <Button
                  onClick={handleSignUp}
                  disabled={loading}
                  className="w-full h-[50px] bg-[#007fff] hover:bg-[#0066cc] rounded-3xl text-white font-semibold text-lg"
                >
                  {loading ? "Signing Up..." : "Sign Up"}
                </Button>
              </div>
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
          <img src="/bot.png" alt="bot" className="absolute top-[35%] right-[70%]" />
          <img src="/code.png" alt="code" className="absolute top-[45%] right-[48%]" />
          <img src="/messenger.png" alt="messenger" className="absolute top-[35%] right-[25%]" />
          <img src="/money.png" alt="money" className="absolute top-[15%] right-[51%]" />
        </div>
      </div>
    </div>
  );
};
