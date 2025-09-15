import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Separator } from "../../../components/ui/separator";
import { supabase } from "../../../lib/supabase";

const sidebarMenuItems = [
  { label: "Edit Profile", active: true },
  { label: "Notifications", active: false },
  { label: "Choose Plan", active: false },
  { label: "Password & Security", active: false },
];

export const DivWrapperSubsection = (): JSX.Element => {
const [isSaving, setIsSaving] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>({
    full_name: "",
    email: "",
    phone: "",
    user_type: "",
    hobbies: [],
    institution_name: "",
    goals: "",
    expertise: "",
    updated_at: "",
  });

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
      ? profileData.hobbies[0] // take the single hobby string
      : profileData.hobbies,   // just string if it's already a string
  });
}
    };

    fetchUser();
  }, []);


const handleSave = async () => {
  if (!userId || !profile) return;

  try {
    setIsSaving(true); // 🔹 show "Saving..."

    const updateData: any = {
      id: userId,
      full_name: profile.full_name || null,
      phone: profile.phone || null,
      email: profile.email || null,
      user_type: profile.user_type || null,
      hobbies: profile.hobbies ? [profile.hobbies] : null,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from("user_profiles")
      .upsert([updateData], { onConflict: "id" });

    if (error) {
      console.error("Failed to save profile:", error);
      return;
    }

    // Refresh UI
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
  } catch (err) {
    console.error("Unexpected error:", err);
  } finally {
    // 🔹 revert button text back
    setIsSaving(false);
  }
};






  const formatDate = (dateStr: string) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "long", day: "numeric" });
  };

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
                        item.active ? "bg-[#007fff59] text-[#083a50]" : "text-[#caced8] hover:bg-gray-100"
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
                  <div className="grid grid-cols-2 gap-10">
                    {/* Editable Fields */}
                    <div>
                      <Label className="font-bold text-[#083a50]">Full Name</Label>
                      <Input
                        value={profile?.full_name || ""}
                        onChange={(e) => handleChange("full_name", e.target.value)}
                        className="h-11 px-3 bg-white rounded-3xl border-[#caced8]"
                      />
                    </div>

                    <div>
                      <Label className="font-bold text-[#083a50]">Phone Number</Label>
                      <Input
                        value={profile?.phone || ""}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        className="h-11 px-3 bg-white rounded-3xl border-[#caced8]"
                      />
                    </div>

                    {/* Static/Read-only Fields */}
                    <div>
                      <Label className="font-bold text-[#083a50]">Email</Label>
                      <Input
                        value={profile?.email || ""}
                        disabled
                        className="h-11 px-3 bg-white rounded-3xl border-[#caced8]"
                      />
                    </div>

                    <div>
                      <Label className="font-bold text-[#083a50]">You Are A?</Label>
                      <Input
                        value={profile?.user_type || ""}
                        disabled
                        className="h-11 px-3 bg-white rounded-3xl border-[#caced8]"
                      />
                    </div>

<div>
  <Label className="font-bold text-[#083a50]">Hobby</Label>
  <Input
    value={profile?.hobbies || ""}
    onChange={(e) => handleChange("hobbies", e.target.value)}
    className="h-11 px-3 bg-white rounded-3xl border-[#caced8]"
  />
</div>


                    <div>
                      <Label className="font-bold text-[#083a50]">Institution Name</Label>
                      <Input
                        value={profile?.institution_name || ""}
                        disabled
                        className="h-11 px-3 bg-white rounded-3xl border-[#caced8]"
                      />
                    </div>

                    <div>
                      <Label className="font-bold text-[#083a50]">Your Goals</Label>
                      <Input
                        value={profile?.goals || ""}
                        disabled
                        className="h-11 px-3 bg-white rounded-3xl border-[#caced8]"
                      />
                    </div>

                    <div>
                      <Label className="font-bold text-[#083a50]">Subject Taught / Expertise (optional)</Label>
                      <Input
                        value={profile?.expertise || ""}
                        disabled
                        className="h-11 px-3 bg-white rounded-3xl border-[#caced8]"
                      />
                    </div>
                  </div>

                  <Button
  className="w-32 h-[42px] bg-[#3479ff] hover:bg-[#2968e6] rounded-lg font-bold text-white"
  onClick={handleSave}
  disabled={isSaving}
>
  {isSaving ? "Saving..." : "Save"}
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
