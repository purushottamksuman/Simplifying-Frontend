import { ChevronDownIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../../components/ui/avatar";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import { Separator } from "../../../../components/ui/separator";
import { supabase } from "../../../../lib/supabase";

const sidebarMenuItems = [
  { label: "Edit Profile", active: true },
  { label: "Notifications", active: false },
  { label: "Choose Plan", active: false },
  { label: "Password & Security", active: false },
];

export const DivWrapperSubsection = (): JSX.Element => {
  const [userId, setUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>({
    full_name: "",
    university_name: "",
    language: "",
    gpa: "",
    stream: "",
    guardian_contact: "",
    guardian_relationship: "",
    updated_at: "",
  });

  // ✅ Fetch user & profile
  useEffect(() => {
    const fetchUser = async () => {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError) {
        console.log("Error fetching user: ", authError);
        return;
      }

      const user = authData?.user;
      if (!user) {
        console.log("No User Found!");
        return;
      }

      setUserId(user.id);

      const { data: profileData, error: profileError } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileError) {
        console.log("Error fetching profile: ", profileError);
      } else {
        setProfile(profileData);
      }
    };

    fetchUser();
  }, []);

  // ✅ Update state on input change
  const handleChange = (field: string, value: string) => {
    setProfile((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  // ✅ Save to DB
  const handleSave = async () => {
    if (!userId) return;

    const { error } = await supabase.from("user_profiles").upsert({
      id: userId,
      ...profile,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      console.log("Error saving profile: ", error);
    } else {
      console.log("Profile saved successfully!");
    }
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
                  <Button
                    size="icon"
                    className="absolute bottom-3 right-[1px] w-10 h-10 bg-[#3479ff] rounded-[20px] hover:bg-[#2968e6]"
                  >
                    <img className="w-5 h-[18px]" alt="Camera" src="/Camera.png" />
                  </Button>
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
                <Separator
                  orientation="vertical"
                  className="absolute right-0 top-0 h-[461px] w-0.5"
                />
              </aside>

              {/* Form Content */}
              <div className="flex-1">
                <div className="flex flex-col gap-10">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-[#caced8]">
                      Edit Profile
                    </h3>
                    <p className="text-base font-bold text-[#caced8]">
                      last update {profile?.updated_at || "N/A"}
                    </p>
                  </div>

                  {/* Form Fields */}
                  <div className="flex gap-[61px]">
                    {/* Left Column */}
                    <div className="flex-1 flex flex-col gap-6">
                      <div>
                        <Label className="font-bold text-[#083a50]">University Name</Label>
                        <Input
                          value={profile?.university_name || ""}
                          onChange={(e) =>
                            handleChange("university_name", e.target.value)
                          }
                          className="h-11 px-3 bg-white rounded-3xl border-[#caced8]"
                        />
                      </div>

                      <div>
                        <Label className="font-bold text-[#083a50]">Preferred language</Label>
                        <Select
                          value={profile?.language || ""}
                          onValueChange={(val) => handleChange("language", val)}
                        >
                          <SelectTrigger className="h-11 px-3 bg-white rounded-3xl border-[#caced8]">
                            <SelectValue placeholder="Select Language" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="english">English</SelectItem>
                            <SelectItem value="spanish">Spanish</SelectItem>
                            <SelectItem value="french">French</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="font-bold text-[#083a50]">Percentage or GPA</Label>
                        <Input
                          value={profile?.gpa || ""}
                          onChange={(e) => handleChange("gpa", e.target.value)}
                          className="h-11 px-3 bg-white rounded-3xl border-[#caced8]"
                        />
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="flex-1 flex flex-col gap-6">
                      <div>
                        <Label className="font-bold text-[#083a50]">Stream</Label>
                        <Input
                          value={profile?.stream || ""}
                          onChange={(e) => handleChange("stream", e.target.value)}
                          className="h-11 px-3 bg-white rounded-3xl border-[#caced8]"
                        />
                      </div>

                      <div>
                        <Label className="font-bold text-[#083a50]">
                          Guardian Contact No. (Optional)
                        </Label>
                        <Input
                          value={profile?.guardian_contact || ""}
                          onChange={(e) =>
                            handleChange("guardian_contact", e.target.value)
                          }
                          className="h-11 px-3 bg-white rounded-3xl border-[#caced8]"
                        />
                      </div>

                      <div>
                        <Label className="font-bold text-[#083a50]">
                          Guardian Relationship (Optional)
                        </Label>
                        <Select
                          value={profile?.guardian_relationship || ""}
                          onValueChange={(val) =>
                            handleChange("guardian_relationship", val)
                          }
                        >
                          <SelectTrigger className="h-11 px-3 bg-white rounded-3xl border-[#caced8]">
                            <SelectValue placeholder="Enter" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="parent">Parent</SelectItem>
                            <SelectItem value="guardian">Guardian</SelectItem>
                            <SelectItem value="relative">Relative</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Save Button */}
                  <Button
                    onClick={handleSave}
                    className="w-32 h-[42px] bg-[#3479ff] hover:bg-[#2968e6] rounded-lg font-bold text-white"
                  >
                    Save
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
