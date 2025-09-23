import { PlusIcon, X, Info } from "lucide-react";
import React, { useState } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../components/ui/avatar";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import { authHelpers } from "../../../lib/supabase";
import toast from "react-hot-toast";
import { supabase } from "../../../lib/supabase";
const instructionSteps = [
  {
    number: "1",
    title: "Enter Student ID",
    description: "Provide your child's unique student identification\nnumber",
    bgColor: "bg-[#daeafe]",
    textColor: "text-[#155cfb]",
  },
  {
    number: "2",
    title: "Confirm Details",
    description: "Verify your child's information and date of birth",
    bgColor: "bg-[#dbfbe6]",
    textColor: "text-[#00a63d]",
  },
  {
    number: "3",
    title: "Start Tracking",
    description: "Begin monitoring progress, attendance, and\nachievements",
    bgColor: "bg-[#f2e7fe]",
    textColor: "text-[#980ffa]",
  },
];

const linkedStudents = [
  {
    name: "Emma Johnson",
    grade: "7th Grade",
    avatar: "/emma-johnson.png",
    status: "Top Performer",
    statusBg: "bg-[#dbfbe6]",
    statusText: "text-[#016630]",
    activity: "Completed Math Assignment",
    timeAgo: "2 hours ago",
  },
  {
    name: "Michael Chen",
    grade: "9th Grade",
    avatar: "/michael-chen.png",
    status: "Regular Attendee",
    statusBg: "bg-[#daeafe]",
    statusText: "text-[#193bb8]",
    activity: "Attended Chemistry Lab",
    timeAgo: "4 hours ago",
  },
  {
    name: "Sophia Rodriguez",
    grade: "5th Grade",
    avatar: "/sophia-rodriguez.png",
    status: "Improving",
    statusBg: "bg-[#fef3c6]",
    statusText: "text-[#963b00]",
    activity: "Submitted Reading Report",
    timeAgo: "1 day ago",
  },
];

export const PropertyManageChild = (): JSX.Element => {

  const [isOpen, setIsOpen] = useState(true);
  const [step, setStep] = useState<null | "choice" | "form">(null);
const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState(""); // OTP input
const [otpSent, setOtpSent] = useState(false); // OTP sent flag
const [tempUserId, setTempUserId] = useState<string | null>(null); // store ID until OTP verified


  const [form, setForm] = useState({
    full_name: "",
    email: "",
    edu_level: "",
    dob: "",
    career_domain: "",
    hobbies: "",
    goals: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setNotification(null);

  try {
    const emailTrimmed = form.email.trim().toLowerCase();

    // If OTP is already sent, verify it
    if (otpSent && tempUserId) {
      const { data, error } = await authHelpers.verifyOTP(form.email, otp, 'signup');
if (error) throw error;

      // ✅ OTP verified, insert profile
      const { error: profileError } = await supabase
        .from("user_profiles")
        .upsert({
          id: tempUserId,
          full_name: form.full_name,
          email: emailTrimmed,
          edu_level: form.edu_level,
          dob: form.dob,
          career_domain: form.career_domain,
          hobbies: form.hobbies ? [form.hobbies] : [],
          goals: form.goals,
          user_type: "student",
           onboarded: true,
          
        }, { onConflict: "id" });
      if (profileError) throw profileError;

      toast.success("Child account created successfully!");
      setStep(null);
      setIsOpen(false);
      setOtpSent(false);
      setTempUserId(null);
      setOtp("");
      setForm({
        full_name: "",
        email: "",
        edu_level: "",
        dob: "",
        career_domain: "",
        hobbies: "",
        goals: "",
      });
      return;
    }

    // Check if email already exists
    const { data: existingProfile, error: emailCheckError } = await supabase
      .from("user_profiles")
      .select("id")
      .eq("email", emailTrimmed)
      .maybeSingle();
    if (emailCheckError) throw emailCheckError;
    if (existingProfile) {
      toast.error("This email is already registered.");
      setLoading(false);
      return;
    }

    // Sign up new user (triggers OTP email)
    const { data: signUpData, error: signUpError } = await authHelpers.signUp(
      emailTrimmed,
      "TempPassword123!",
      { user_type: "student", full_name: form.full_name }
    );
    if (signUpError) throw signUpError;

    setTempUserId(signUpData.user?.id || null);
    setOtpSent(true);
    toast.success("OTP sent to student's email. Please verify.");
  } catch (err: any) {
    console.error("Error creating student:", err);
    toast.error(err.message || "Failed to create student account.");
  } finally {
    setLoading(false);
  }
};



  if (!isOpen) return null;


  return (
    <div className="flex flex-col items-center gap-12 px-6 py-8">
      {/* Instructions */}
      <Card className="w-full max-w-6xl rounded-xl overflow-hidden shadow-md bg-gradient-to-r from-blue-500 via-blue-400 to-purple-600 border-0">
        <CardContent className="p-8 relative">
          <h2 className="flex items-center gap-2 text-white text-2xl font-bold mb-8">
            How to Link a Student
            <img className="w-6 h-6" alt="Svg" src="/svg-88.svg" />
          </h2>

          <div className="flex justify-between gap-6">
            {instructionSteps.map((step, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center gap-2"
              >
                <div
                  className={`w-12 h-12 ${step.bgColor} rounded-full flex items-center justify-center`}
                >
                  <span className={`font-bold ${step.textColor} text-sm`}>
                    {step.number}
                  </span>
                </div>
                <h3 className="font-bold text-white text-sm">{step.title}</h3>
                <p className="text-white text-xs whitespace-pre-line">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Linked Children */}
      <section className="w-full max-w-6xl text-center">
        <img
          className="w-12 h-12 mx-auto mb-4"
          alt="Background"
          src="/background-31.svg"
        />
        <h2 className="text-[#13377c] text-3xl font-semibold mb-2">
          My Linked Children
        </h2>
        <p className="text-[#13377c] text-base mb-8">
          Manage and view all your linked students in one place.
        </p>

        <div className="flex flex-wrap justify-center gap-6">
          {linkedStudents.map((student, index) => (
            <Card
              key={index}
              className="w-64 h-[345px] bg-white rounded-lg overflow-hidden shadow border-0"
            >
              <CardContent className="p-5 flex flex-col items-center gap-3">
                <Avatar className="w-16 h-16 shadow">
                  <AvatarImage src={student.avatar} />
                  <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                </Avatar>

                <h3 className="text-[#101727] text-lg font-medium">
                  {student.name}
                </h3>
                <p className="text-[#495565] text-sm">{student.grade}</p>

                <Badge
                  className={`${student.statusBg} ${student.statusText} rounded-md px-3 py-1 text-xs border-0`}
                >
                  {student.status}
                </Badge>

                <p className="text-[#354152] text-sm">{student.activity}</p>

                <div className="flex items-center gap-2 text-xs text-gray-500">
                  {student.timeAgo}
                  <img className="w-3 h-3" alt="Svg" src="/svg-4.svg" />
                </div>

                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm">
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}

          {/* Trigger Card */}
          <Card
            onClick={() => setStep("choice")}
            className="w-64 h-[345px] bg-gray-50 border border-dashed border-gray-300 cursor-pointer hover:shadow-md transition"
          >
            <CardContent className="flex flex-col items-center justify-center h-full gap-3">
              <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center border-2 border-dashed border-gray-300">
                <PlusIcon className="w-6 h-6 text-gray-400" />
              </div>
              <h3 className="text-[#101727] text-lg font-medium">
                Add New Student
              </h3>
              <p className="text-[#495565] text-sm max-w-[160px]">
                Link your child's account using their student ID
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Step 1: Choice Modal */}
      {step === "choice" && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6 relative">
            <button
              onClick={() => setStep(null)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <PlusIcon className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-blue-900">
                Link New Student
              </h2>
            </div>

            <p className="text-sm text-gray-500 mb-6">
              Link your child's account using their student ID or create a new
              account.
            </p>

            <div className="space-y-3">
              <Button className="w-full bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg">
                Link Existing Student Account
              </Button>
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                onClick={() => setStep("form")}
              >
                Create New Student Account For Your Child
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Form Modal */}
      {notification && (
  <div
    className={`mb-4 px-4 py-2 rounded ${
      notification.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
    }`}
  >
    {notification.message}
  </div>
)}
      {step === "form" && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 relative">
            <button
              onClick={() => setStep(null)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <PlusIcon className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-blue-900">
                Create Student Account
              </h2>
            </div>
            <p className="text-sm text-gray-500 flex items-center gap-1 mb-6">
              <Info className="w-4 h-4 text-blue-500" />
              You&apos;ll need their student ID and date of birth to verify.
            </p>

            <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Full Name</label>
            <input
              type="text"
              name="full_name"
              value={form.full_name}
              onChange={handleChange}
              placeholder="Full Name"
              required
              className="w-full border rounded-lg px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Current Education</label>
            <select
              name="edu_level"
              value={form.edu_level}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-3 py-2 text-sm"
            >
              <option value="">Select Level</option>
              <option value="Primary">Primary</option>
              <option value="Middle">Middle</option>
              <option value="High School">High School</option>
              <option value="College">College</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={form.dob}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Career Domain</label>
            <input
              type="text"
              name="career_domain"
              value={form.career_domain}
              onChange={handleChange}
              placeholder="E.g. Science, Arts, Sports"
              className="w-full border rounded-lg px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Hobbies & Interests</label>
            <input
              type="text"
              name="hobbies"
              value={form.hobbies}
              onChange={handleChange}
              placeholder="E.g. Reading, Music"
              className="w-full border rounded-lg px-3 py-2 text-sm"
            />
          </div>

          {otpSent && (
  <div>
    <label className="block text-sm text-gray-600 mb-1">Enter OTP</label>
    <input
      type="text"
      name="otp"
      value={otp}
      onChange={(e) => setOtp(e.target.value)}
      placeholder="Enter OTP sent to email"
      className="w-full border rounded-lg px-3 py-2 text-sm"
      required
    />
  </div>
)}


          <div>
            <label className="block text-sm text-gray-600 mb-1">Child Goals</label>
            <input
              type="text"
              name="goals"
              value={form.goals}
              onChange={handleChange}
              placeholder="E.g. Become an Engineer"
              className="w-full border rounded-lg px-3 py-2 text-sm"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              onClick={() => setIsOpen(false)}
              className="bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              {loading ? "Creating..." : "Create Student"}
            </Button>
          </div>
        </form>
          </div>
        </div>
      )}
    </div>
  );
};
