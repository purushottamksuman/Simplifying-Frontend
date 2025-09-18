import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Separator } from "../../../components/ui/separator";
import { supabase } from "../../../lib/supabase";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { 
  FaBrain, 
  FaChartLine, 
  FaLaptopCode, 
  FaBook, 
  FaUserMd, 
  FaChalkboardTeacher, 
  FaGavel, 
  FaGraduationCap,
} from "react-icons/fa";
import { IoSchoolSharp } from "react-icons/io5";
import { GiGearHammer } from "react-icons/gi";

// ---------------- Dropdown Options ----------------
const educationOptions = [
  { id: "school", label: "School", icon: <IoSchoolSharp size={20} className="text-[#007fff]" /> },
  { id: "university", label: "University", icon: <FaGraduationCap size={20} className="text-[#007fff]" /> },
];

const careerOptions = [
  { id: "doctor", label: "Doctor", icon: <FaUserMd size={20} className="text-[#007fff]" /> },
  { id: "engineer", label: "Engineer", icon: <GiGearHammer size={20} className="text-[#007fff]" /> },
  { id: "teacher", label: "Teacher", icon: <FaChalkboardTeacher size={20} className="text-[#007fff]" /> },
  { id: "lawyer", label: "Lawyer", icon: <FaGavel size={20} className="text-[#007fff]" /> },
];

const goalOptions = [
  { id: "learning_skills", label: "Learning Skills", icon: <FaBrain className="w-5 h-5 text-[#007fff]" /> },
  { id: "exam_prep", label: "Exam Preparation", icon: <FaChartLine className="w-5 h-5 text-[#007fff]" /> },
  { id: "coding", label: "Learn Coding", icon: <FaLaptopCode className="w-5 h-5 text-[#007fff]" /> },
  { id: "extra_knowledge", label: "Gain Extra Knowledge", icon: <FaBook className="w-5 h-5 text-[#007fff]" /> },
];

const sidebarMenuItems = [
  { label: "Edit Profile", active: true },
  { label: "Notifications", active: false },
  { label: "Choose Plan", active: false },
  { label: "Password & Security", active: false },
];

export const DivWrapperSubsection = (): JSX.Element => {
  const [isSaving, setIsSaving] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
const [profile, setProfile] = useState<any>({
  full_name: "",
  email: "",
  phone: "",
  dob: "",
  edu_level: "",
  career_domain: "",
  hobbies: "",
  goals: "",
  country: "",
  city: "",
  updated_at: "",
});

  // ---------------- Handle field change ----------------
const handleChange = (field: string, value: string) => {
  setProfile((prev: any) => ({
    ...prev,
    [field]: value,
  }));
};


  // ---------------- Fetch user + profile ----------------
  useEffect(() => {
    const fetchUser = async () => {
      const { data: authData } = await supabase.auth.getUser();
      const user = authData?.user;

      if (!user) return;

      setUserId(user.id);

      const { data: profileData } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileData) {
        setProfile({
          ...profileData,
          hobbies: Array.isArray(profileData.hobbies)
            ? profileData.hobbies[0]
            : profileData.hobbies,
        });
      }
    };

    fetchUser();
  }, []);

  // ---------------- Save profile ----------------
  const handleSave = async () => {
    
    if (!userId || !profile) return;

    try {
      setIsSaving(true);

    const updateData: any = {
  id: userId,
  full_name: profile.full_name || null,
  phone: profile.phone || null,
  email: profile.email || null,
  dob: profile.dob || null,
  edu_level: profile.edu_level || null,
  career_domain: profile.career_domain || null,
  hobbies: profile.hobbies ? [profile.hobbies] : [],
  goals: profile.goals || null,
    user_type: profile.user_type,
  updated_at: new Date().toISOString(),
};

      const { error } = await supabase
        .from("user_profiles")
        .upsert([updateData], { onConflict: "id" });

      if (error) {
        console.error("Failed to save profile:", error);
        return;
      }

      const { data: updatedProfile, error: fetchError } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (fetchError) console.error("Fetch updated profile error:", fetchError);

      if (updatedProfile) {
        setProfile({
          ...updatedProfile,
          hobbies: Array.isArray(updatedProfile.hobbies)
            ? updatedProfile.hobbies[0]
            : updatedProfile.hobbies,
        });
      }

         setIsSaved(true);
    setTimeout(() => setIsSaved(false), 5000);
    } catch (err) {
      console.error("Unexpected error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  // ---------------- Format Date ----------------
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "long", day: "numeric" });
  };

  // ---------------- UI ----------------
  return (
    <div className="w-full h-full relative">
      <main className="flex-1 p-8">
        <Card className="w-full h-full bg-white shadow-[0px_0px_10px_#00000075] rounded-[50px] overflow-hidden">
          <CardContent className="p-0 h-full">
            {/* Profile Section */}
            <section className="relative">
              <div className="w-full h-[153px]">
                <img
                  src="/header.png"
                  alt="Header Background"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex items-end gap-10 px-[72px] -mt-14 pb-10">
                <div className="relative">
                  <Avatar className="w-[180px] h-[180px] border-8 border-[#3479ff99] bg-slate-400 shadow-[0px_4px_4px_#00000040]">
                    <AvatarImage src="/image (93).png" />
                    <AvatarFallback />
                  </Avatar>
                </div>

                <div className="flex items-end justify-between flex-1 pb-10">
                  <div className="flex flex-col gap-2">
                    <h2 className="font-bold text-[#13377c] text-2xl">
                      {profile?.full_name || "Loading..."}
                    </h2>
                    <p className="font-bold text-[#13377c] text-xl">
                      Your account is ready, you can now apply for advice.
                    </p>
                  </div>
                  <p className="text-sm text-gray-500 font-bold">
                    last update {formatDate(profile?.updated_at)}
                  </p>
                </div>
              </div>
            </section>

            {/* Content Section */}
            <section className="flex gap-16 px-16 pb-16">
              {/* Sidebar Menu */}
              <aside className="w-[217px]">
                <nav className="flex flex-col gap-6 mt-[37px]">
                  {sidebarMenuItems.map((item, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      className={`w-[185px] h-11 justify-start px-3 rounded-lg font-bold text-base ${
                        item.active
                          ? "bg-[#007fff59] text-[#083a50]"
                          : "text-[#caced8] hover:bg-gray-100"
                      }`}
                    >
                      {item.label}
                    </Button>
                  ))}
                </nav>
                <Separator orientation="vertical" className="absolute right-0 top-0 h-[461px] w-0.5" />
              </aside>

              {/* Form Content */}
              <div className="flex-1">
                <div className="flex flex-col gap-10">
                  <h3 className="text-2xl font-bold text-[#caced8]">Edit Profile</h3>

                  {/* Form Fields */}
                  <div className="flex flex-col gap-8">
                    {/* First Row */}
                    <div className="grid grid-cols-4 gap-12">
                      <div>
                        <Label className="font-bold text-[#083a50]">Full Name</Label>
                        <Input
                          value={profile?.full_name || ""}
                          onChange={(e) => handleChange("full_name", e.target.value)}
                          className="h-11 w-[190px] px-3 bg-white rounded-3xl border-[#caced8]"
                        />
                      </div>

                      <div>
                        <Label className="font-bold text-[#083a50]">Child’s Date of Birth</Label>
                        <Input
                          type="date"
                          value={profile?.dob || ""}
                          onChange={(e) => handleChange("dob", e.target.value)}
                          className="h-11 px-3 bg-white rounded-3xl border border-gray-300 ml-[-6px]"
                        />
                      </div>

                      <div>
                        <Label className="font-bold text-[#083a50]">Email</Label>
                        <Input
                          value={profile?.email || ""}
                          disabled
                          className="h-11 w-[380px] px-3 ml-[-6px] bg-white rounded-3xl border-[#caced8]"
                        />
                      </div>
                    </div>

                    {/* Second Row */}
                    <div className="grid grid-cols-2 gap-10">
                      <div>
                        <Label className="font-bold text-[#083a50]">Is your Kid in?</Label>
                        <Select
                          onValueChange={(val) => handleChange("edu_level", val)}
                          value={profile?.edu_level || ""}
                        >
                          <SelectTrigger className="h-11 px-3 bg-white rounded-3xl border-[#caced8]">
                            <SelectValue placeholder="Select level" />
                          </SelectTrigger>
                          <SelectContent>
                            {educationOptions.map((option) => (
                              <SelectItem key={option.id} value={option.label}>
                                <div className="flex items-center gap-2">
                                  {option.icon} {option.label}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="font-bold text-[#083a50]">Preferred Domain</Label>
                        <Select
                          onValueChange={(val) => handleChange("career_domain", val)}
                          value={profile?.career_domain || ""}
                        >
                          <SelectTrigger className="h-11 px-3 bg-white rounded-3xl border-[#caced8]">
                            <SelectValue placeholder="Select Preferred Domain" />
                          </SelectTrigger>
                          <SelectContent>
                            {careerOptions.map((option) => (
                              <SelectItem key={option.id} value={option.label}>
                                <div className="flex items-center gap-2">
                                  {option.icon} {option.label}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Third Row */}
                    <div className="grid grid-cols-2 gap-10">
                      <div>
                        <Label className="font-bold text-[#083a50]">Phone Number</Label>
                        <Input
                          value={profile?.phone || ""}
                          onChange={(e) => handleChange("phone", e.target.value)}
                          className="h-11 px-3 bg-white rounded-3xl border-[#caced8]"
                        />
                      </div>

                      <div>
                        <Label className="font-bold text-[#083a50]">Country</Label>
                        <Input
                          value={profile?.country || ""}
                          onChange={(e) => handleChange("country", e.target.value)}
                          className="h-11 px-3 bg-white rounded-3xl border-[#caced8]"
                        />
                      </div>
                    </div>

                    {/* Fourth Row */}
                    <div className="grid grid-cols-2 gap-10">
                      <div>
                        <Label className="font-bold text-[#083a50]">Child's Goals</Label>
                        <Select
                          onValueChange={(val) => handleChange("hobbies", val)}
                          value={profile?.hobbies || ""}
                        >
                          <SelectTrigger className="h-11 px-3 bg-white rounded-3xl border-[#caced8]">
                            <SelectValue placeholder="Select Goal" />
                          </SelectTrigger>
                          <SelectContent>
                            {goalOptions.map((option) => (
                              <SelectItem key={option.id} value={option.label}>
                                <div className="flex items-center gap-2">
                                  {option.icon} {option.label}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="font-bold text-[#083a50]">City</Label>
                        <Input
                          value={profile?.city || ""}
                          onChange={(e) => handleChange("city", e.target.value)}
                          className="h-11 px-3 bg-white rounded-3xl border-[#caced8]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Save Button */}
                  <Button
  className="w-32 h-[42px] bg-[#3479ff] hover:bg-[#2968e6] rounded-lg font-bold text-white"
  onClick={handleSave}
  disabled={isSaving}
>
  {isSaving ? "Saving..." : isSaved ? "Saved" : "Save"}
</Button>
                </div>
              </div>
            </section>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};
