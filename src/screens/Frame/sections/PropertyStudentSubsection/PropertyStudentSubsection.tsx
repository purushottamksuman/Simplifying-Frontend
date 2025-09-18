import { CalendarIcon } from "lucide-react";
import React from "react";
import { Avatar, AvatarFallback } from "../../../../components/ui/avatar";
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

export const PropertyStudentSubsection = (): JSX.Element => {
  const navigationItems = [
    {
      icon: "Home",
      label: "Dashboard",
      active: false,
      textColor: "text-white",
    },
    {
      icon: "Profile",
      label: "Profile Settings",
      active: true,
      textColor: "text-[#13377c]",
    },
    {
      icon: "Folder",
      label: "My Course",
      active: false,
      textColor: "text-white",
    },
    {
      icon: "Presentation",
      label: "Live Classes",
      active: false,
      textColor: "text-white",
    },
    {
      icon: "Test paper",
      label: "Test & Assessment",
      active: false,
      textColor: "text-white",
    },
    {
      icon: "Certificate",
      label: "Certificates",
      active: false,
      textColor: "text-white",
    },
    {
      icon: "Leaderboard",
      label: "Leaderboard",
      active: false,
      textColor: "text-white",
    },
    {
      icon: "Rewards",
      label: "Badges & Rewards",
      active: false,
      textColor: "text-white",
    },
    {
      icon: "Home",
      label: "Clubs & Community",
      active: false,
      textColor: "text-white",
    },
    {
      icon: "User",
      label: "Raise a Doubt",
      active: false,
      textColor: "text-white",
    },
    {
      icon: "Referral",
      label: "Referrals Program",
      active: false,
      textColor: "text-white",
    },
  ];

  const profileMenuItems = [
    { label: "Edit Profile", active: true },
    { label: "Notifications", active: false },
    { label: "Choose Plan", active: false },
    { label: "Password & Security", active: false },
  ];

  return (
    <div className="w-full h-full bg-[#3479ff] relative">
      <div className="flex w-full h-full">
        <aside className="w-[300px] bg-[#3479ff] p-4 flex flex-col">
          <div className="mb-8">
            <img className="w-[262px] h-[68px]" alt="Group" />
          </div>

          <nav className="flex-1">
            <div className="flex flex-col gap-[43px]">
              {navigationItems.map((item, index) => (
                <div key={index} className="flex items-center gap-[17px]">
                  <img className="w-[26px] h-[26px]" alt={item.icon} />
                  <span
                    className={`font-extrabold text-lg [font-family:'Nunito',Helvetica] tracking-[0] leading-[19.6px] whitespace-nowrap ${item.textColor}`}
                  >
                    {item.label}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-[90px] flex items-center gap-4">
              <img className="w-7 h-7" alt="Sign out" />
              <span className="[font-family:'Poppins',Helvetica] font-semibold text-white text-xl tracking-[0.40px] leading-[normal]">
                Log Out
              </span>
            </div>
          </nav>
        </aside>

        <main className="flex-1 p-8">
          <Card className="w-full h-full bg-white rounded-[50px] shadow-[0px_0px_38px_5px_#3d57cf40] border-0">
            <CardContent className="p-0">
              <header className="relative">
                <div className="flex items-center justify-between px-8 py-4">
                  <div className="flex items-center gap-[57px]">
                    <img className="w-[25px] h-[25px]" alt="Component" src="/"/>
                    <h1 className="[font-family:'Nunito',Helvetica] font-bold text-primaryone text-2xl tracking-[0] leading-[normal]">
                      Profile
                    </h1>
                  </div>

                  <div className="flex items-center gap-[23px]">
                    <div className="w-6 h-6">
                      <div className="w-[17px] h-5 bg-[100%_100%] mt-0.5 ml-1" />
                    </div>
                    <Avatar className="w-14 h-14">
                      <AvatarFallback className="border-4 border-[#3479ff99]" />
                    </Avatar>
                    <img className="w-6 h-6" alt="Iconly light outline"/>
                  </div>
                </div>

                <img className="w-full h-[153px]" alt="Header setting" src="/header.png" />

                <div className="flex items-end gap-10 px-[72px] -mt-14">
  <div className="relative">
    {/* Profile Avatar */}
    <Avatar className="w-[180px] h-[180px] bg-gray-400 border-8 border-[#3479ff99] shadow-[0px_4px_4px_#00000040] overflow-hidden">
      <img src="/image (93).png" alt="Profile" className="object-cover w-full h-full" />
      <AvatarFallback />
    </Avatar>

    {/* Camera Button */}
    <Button
      className="absolute bottom-1 right-1 w-[42px] h-[42px] bg-[#3479ff] rounded-full flex items-center justify-center shadow-lg hover:bg-[#2563eb] transition"
    >
      {/* Camera Icon */}
      <img
        src="/Camera.png" // <-- your camera icon path
        alt="Camera"
        className="w-[30px] h-[30px] object-contain"
      />
    </Button>
  </div>
</div>

              </header>

              <div className="flex gap-16 px-16 py-8">
                <aside className="w-[217px]">
                  <nav className="flex flex-col gap-6 mt-[37px]">
                    {profileMenuItems.map((item, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        className={`w-[185px] h-11 justify-start px-3 rounded-lg font-bold text-base [font-family:'Nunito',Helvetica] tracking-[0] leading-[19.6px] h-auto ${
                          item.active
                            ? "bg-[#007fff59] text-[#083a50]"
                            : "text-[#caced8] hover:bg-transparent"
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

                <main className="flex-1">
                  <div className="flex flex-col gap-10">
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl [font-family:'Nunito',Helvetica] font-bold text-[#caced8] tracking-[0] leading-[normal]">
                        Edit Profile
                      </h3>
                      <p className="text-base text-right [font-family:'Nunito',Helvetica] font-bold text-[#caced8] tracking-[0] leading-[normal]">
                        last update August 1
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-[61px]">
                      <div className="flex flex-col gap-6">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="flex flex-col gap-1">
                            <Label className="font-bold text-[#083a50] text-base [font-family:'Nunito',Helvetica] tracking-[0] leading-[19.6px]">
                              Full Name
                            </Label>
                            <div className="flex h-11 items-center gap-2.5 px-3 bg-white rounded-3xl border border-[#caced8]">
                              <div className="flex items-center gap-px">
                                <span className="font-normal text-[#083a50] tracking-[0] leading-[19.6px] [font-family:'Nunito',Helvetica] text-base">
                                  Mir
                                </span>
                                <img
                                  className="w-px h-[18px] object-cover"
                                  alt="Line"
                                />
                              </div>
                            </div>
                          </div>

                            <div className="flex flex-col gap-1">
  <Label className="font-bold text-[#083a50] tracking-[0] leading-[19.6px] [font-family:'Nunito',Helvetica] text-base">
    Date of birth
  </Label>
  <input
    type="date"
    
    className="flex h-11 w-full px-3 bg-white rounded-3xl border border-[#3479ff] shadow-[2px_2px_4px_#26b8931a,-1px_-1px_4px_#26b89333] text-[#083a50] text-base font-normal [font-family:'Nunito',Helvetica]"
  />
</div>

                        </div>

                        <div className="flex flex-col gap-1">
                          <Label className="font-bold text-[#083a50] tracking-[0] leading-[19.6px] [font-family:'Nunito',Helvetica] text-base">
                            Current Education
                          </Label>
                          <Select>
                            <SelectTrigger className="h-11 bg-white rounded-3xl border-[#caced8] px-3">
                              <SelectValue
                                placeholder="Select Level"
                                className="font-normal text-[#caced8] tracking-[0] leading-[19.6px] [font-family:'Nunito',Helvetica] text-base"
                              />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="level1">Level 1</SelectItem>
                              <SelectItem value="level2">Level 2</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex flex-col gap-1">
                          <Label className="font-bold text-[#083a50] tracking-[0] leading-[19.6px] [font-family:'Nunito',Helvetica] text-base">
                            Career Domain
                          </Label>
                          <Select>
                            <SelectTrigger className="h-11 bg-white rounded-3xl border-[#caced8] px-3">
                              <SelectValue
                                placeholder="Select Preferred Domain"
                                className="font-normal text-[#caced8] tracking-[0] leading-[19.6px] [font-family:'Nunito',Helvetica] text-base"
                              />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="domain1">Domain 1</SelectItem>
                              <SelectItem value="domain2">Domain 2</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex flex-col gap-1">
                          <Label className="font-bold text-[#083a50] tracking-[0] leading-[19.6px] [font-family:'Nunito',Helvetica] text-base">
                            Your Goals
                          </Label>
                          <Select>
                            <SelectTrigger className="h-11 bg-white rounded-3xl border-[#caced8] px-3">
                              <SelectValue
                                placeholder="Select Learning Skills, Exam Prep etc."
                                className="font-normal text-[#caced8] tracking-[0.10px] leading-[normal] [font-family:'Nunito',Helvetica] text-base"
                              />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="goal1">Goal 1</SelectItem>
                              <SelectItem value="goal2">Goal 2</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="flex flex-col gap-6">
                        <div className="flex flex-col gap-1">
                          <Label className="font-bold text-[#083a50] tracking-[0] leading-[19.6px] [font-family:'Nunito',Helvetica] text-base">
                            Email
                          </Label>
                          <Input
                            placeholder="Enter Value"
                            className="h-11 bg-white rounded-3xl border-[#caced8] px-3 font-normal text-[#caced8] tracking-[0] leading-[19.6px] [font-family:'Nunito',Helvetica] text-base"
                          />
                        </div>

                        <div className="flex flex-col gap-1">
                          <Label className="font-bold text-[#083a50] tracking-[0] leading-[19.6px] [font-family:'Nunito',Helvetica] text-base">
                            Phone Number
                          </Label>
                          <div className="flex gap-2">
                            <div className="w-[76px] flex h-11 items-center justify-between px-3 bg-white rounded-3xl border border-[#caced8]">
                              <span className="font-normal text-[#083a50] tracking-[0] leading-[19.6px] [font-family:'Nunito',Helvetica] text-base">
                                +98
                              </span>
                              <div className="w-4 h-4 bg-[100%_100%]" />
                            </div>
                            <Input
                              defaultValue="9120000000"
                              className="flex-1 h-11 bg-white rounded-3xl border-[#caced8] px-3 font-normal text-[#caced8] tracking-[0] leading-[19.6px] [font-family:'Nunito',Helvetica] text-base"
                            />
                          </div>
                        </div>

                        <div className="flex flex-col gap-1">
                          <Label className="font-bold text-[#083a50] tracking-[0] leading-[19.6px] [font-family:'Nunito',Helvetica] text-base">
                            Country
                          </Label>
                          <Select>
                            <SelectTrigger className="h-11 bg-white rounded-3xl border-[#caced8] px-3">
                              <SelectValue
                                placeholder="Select"
                                className="font-normal text-[#caced8] tracking-[0] leading-[19.6px] [font-family:'Nunito',Helvetica] text-base"
                              />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="country1">
                                Country 1
                              </SelectItem>
                              <SelectItem value="country2">
                                Country 2
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex flex-col gap-1">
                          <Label className="font-bold text-[#083a50] tracking-[0] leading-[19.6px] [font-family:'Nunito',Helvetica] text-base">
                            City
                          </Label>
                          <Select>
                            <SelectTrigger className="h-11 bg-white rounded-3xl border-[#caced8] px-3">
                              <SelectValue
                                placeholder="Noida"
                                className="font-normal text-[#caced8] tracking-[0] leading-[19.6px] [font-family:'Nunito',Helvetica] text-base"
                              />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="noida">Noida</SelectItem>
                              <SelectItem value="delhi">Delhi</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    <Button className="w-32 h-[42px] bg-[#3479ff] rounded-lg font-bold text-white text-base text-center [font-family:'Nunito',Helvetica] tracking-[0] leading-[19.6px] h-auto">
                      Next
                    </Button>
                  </div>
                </main>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};
