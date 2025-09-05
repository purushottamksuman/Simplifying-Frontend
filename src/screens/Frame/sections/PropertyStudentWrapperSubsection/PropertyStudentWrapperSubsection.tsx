import { CameraIcon, ChevronDownIcon, LogOutIcon } from "lucide-react";
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

export const PropertyStudentWrapperSubsection = (): JSX.Element => {
  const sidebarMenuItems = [
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

  const formFields = [
    { label: "School Name", placeholder: "eg xyz shool", type: "input" },
    {
      label: "Proffered language",
      placeholder: "Select Language",
      type: "select",
    },
    { label: "Guardian Name", placeholder: "Enter", type: "input" },
  ];

  const rightFormFields = [
    { label: "Class", placeholder: "Enter Class", type: "input" },
    {
      label: "Guardian Contact Number",
      placeholder: "9120000000",
      type: "phone",
    },
    { label: "Guardian Relationship", placeholder: "Enter", type: "select" },
  ];

  return (
    <div className="w-full h-full bg-[#3479ff] relative">
      <div className="flex h-full">
        <aside className="w-[315px] bg-[#3479ff] flex flex-col">
          <div className="p-[19px] mb-[69px]">
            <img className="w-[262px] h-[68px]" alt="Group" />
          </div>

          <nav className="px-[59px] flex-1">
            <div className="flex flex-col gap-[43px]">
              {sidebarMenuItems.map((item, index) => (
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

            <div className="flex items-center gap-[17px] mt-[90px]">
              <LogOutIcon className="w-7 h-7 text-white" />
              <span className="[font-family:'Poppins',Helvetica] font-semibold text-white text-xl tracking-[0.40px] leading-[normal]">
                Log Out
              </span>
            </div>
          </nav>
        </aside>

        <main className="flex-1 bg-white shadow-[0px_0px_29px_#00000075] relative">
          <header className="flex items-center justify-between px-8 py-[46px]">
            <div className="flex items-center gap-[57px]">
              <img className="w-[25px] h-[25px]" alt="Component" />
              <h1 className="[font-family:'Nunito',Helvetica] font-bold text-primaryone text-2xl tracking-[0] leading-[normal]">
                Profile
              </h1>
            </div>

            <div className="flex items-center gap-[23px]">
              <div className="w-6 h-6">
                <div className="w-[17px] h-5 mt-0.5 ml-1 bg-[100%_100%]" />
              </div>
              <Avatar className="w-14 h-14 border-4 border-[#3479ff99]">
                <AvatarFallback className="bg-cover bg-[50%_50%]" />
              </Avatar>
              <img className="w-6 h-6" alt="Iconly light outline" />
            </div>
          </header>

          <div className="px-[383px] pb-[58px]">
            <Card className="w-full bg-white rounded-[50px] shadow-[0px_0px_38px_5px_#3d57cf40] border-0">
              <CardContent className="p-0">
                <div className="flex flex-col">
                  <div className="relative">
                    <img className="w-full h-[153px]" alt="Header setting" />

                    <div className="flex items-end gap-10 px-[72px] -mt-14 relative">
                      <div className="relative">
                        <Avatar className="w-[180px] h-[180px] border-8 border-[#3479ff99] shadow-[0px_4px_4px_#00000040]">
                          <AvatarFallback className="bg-cover bg-[50%_50%]" />
                        </Avatar>
                        <Button
                          size="icon"
                          className="absolute bottom-10 right-[13px] w-10 h-10 bg-[#3479ff] rounded-[20px] hover:bg-[#3479ff]/90 h-auto"
                        >
                          <CameraIcon className="w-5 h-[18px]" />
                        </Button>
                      </div>

                      <div className="flex items-end justify-between flex-1 pb-10">
                        <div className="flex flex-col gap-2">
                          <h2 className="[font-family:'Nunito',Helvetica] font-bold text-[#13377c] text-2xl tracking-[0] leading-[normal]">
                            Mobina Mirbagheri
                          </h2>
                          <p className="[font-family:'Nunito',Helvetica] font-bold text-[#13377c] text-xl tracking-[0] leading-[19.6px] whitespace-nowrap">
                            Your account is ready, you can now apply for advice.
                          </p>
                        </div>
                        <img className="w-12 h-12" alt="Frame" />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-16 px-16 mt-[40px]">
                    <div className="w-[217px]">
                      <nav className="flex flex-col gap-6 mt-[37px]">
                        {profileMenuItems.map((item, index) => (
                          <Button
                            key={index}
                            variant="ghost"
                            className={`w-[185px] h-11 justify-start px-3 rounded-lg font-bold text-base [font-family:'Nunito',Helvetica] tracking-[0] leading-[19.6px] h-auto ${
                              item.active
                                ? "bg-[#007fff59] text-[#083a50] hover:bg-[#007fff59]"
                                : "text-[#caced8] hover:bg-transparent"
                            }`}
                          >
                            {item.label}
                          </Button>
                        ))}
                      </nav>
                      <div className="w-0.5 h-[461px] bg-gray-300 ml-[215px] -mt-[461px]" />
                    </div>

                    <div className="flex-1">
                      <div className="flex flex-col gap-10">
                        <div className="flex items-center justify-between">
                          <h3 className="text-2xl [font-family:'Nunito',Helvetica] font-bold text-[#caced8] tracking-[0] leading-[normal]">
                            Edit Profile
                          </h3>
                          <p className="text-base text-right [font-family:'Nunito',Helvetica] font-bold text-[#caced8] tracking-[0] leading-[normal]">
                            last update August 1
                          </p>
                        </div>

                        <div className="flex gap-[61px]">
                          <div className="flex-1 flex flex-col gap-6">
                            {formFields.map((field, index) => (
                              <div key={index} className="flex flex-col gap-1">
                                <Label className="font-bold text-[#083a50] tracking-[0] leading-[19.6px] [font-family:'Nunito',Helvetica] text-base">
                                  {field.label}
                                </Label>
                                {field.type === "select" ? (
                                  <Select>
                                    <SelectTrigger className="h-11 px-3 bg-white rounded-3xl border-[#caced8] border">
                                      <SelectValue
                                        placeholder={field.placeholder}
                                        className="font-normal text-[#caced8] tracking-[0] leading-[19.6px] [font-family:'Nunito',Helvetica] text-base"
                                      />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="english">
                                        English
                                      </SelectItem>
                                      <SelectItem value="spanish">
                                        Spanish
                                      </SelectItem>
                                      <SelectItem value="french">
                                        French
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                ) : (
                                  <Input
                                    placeholder={field.placeholder}
                                    className="h-11 px-3 bg-white rounded-3xl border-[#caced8] border font-normal text-[#caced8] tracking-[0] leading-[19.6px] [font-family:'Nunito',Helvetica] text-base placeholder:text-[#caced8]"
                                  />
                                )}
                              </div>
                            ))}
                          </div>

                          <div className="flex-1 flex flex-col gap-6">
                            {rightFormFields.map((field, index) => (
                              <div key={index} className="flex flex-col gap-1">
                                <Label className="font-bold text-[#083a50] tracking-[0] leading-[19.6px] [font-family:'Nunito',Helvetica] text-base">
                                  {field.label}
                                </Label>
                                {field.type === "phone" ? (
                                  <div className="flex gap-2">
                                    <div className="w-[76px] h-11 flex items-center justify-between px-3 bg-white rounded-3xl border-[#caced8] border">
                                      <span className="font-normal text-[#083a50] tracking-[0] leading-[19.6px] [font-family:'Nunito',Helvetica] text-base">
                                        +98
                                      </span>
                                      <ChevronDownIcon className="w-4 h-4" />
                                    </div>
                                    <Input
                                      placeholder={field.placeholder}
                                      className="flex-1 h-11 px-3 bg-white rounded-3xl border-[#caced8] border font-normal text-[#caced8] tracking-[0] leading-[19.6px] [font-family:'Nunito',Helvetica] text-base placeholder:text-[#caced8]"
                                    />
                                  </div>
                                ) : field.type === "select" ? (
                                  <Select>
                                    <SelectTrigger className="h-11 px-3 bg-white rounded-3xl border-[#caced8] border">
                                      <SelectValue
                                        placeholder={field.placeholder}
                                        className="font-normal text-[#caced8] tracking-[0.10px] leading-[normal] [font-family:'Nunito',Helvetica] text-base"
                                      />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="father">
                                        Father
                                      </SelectItem>
                                      <SelectItem value="mother">
                                        Mother
                                      </SelectItem>
                                      <SelectItem value="guardian">
                                        Guardian
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                ) : (
                                  <Input
                                    placeholder={field.placeholder}
                                    className="h-11 px-3 bg-white rounded-3xl border-[#caced8] border font-normal text-[#caced8] tracking-[0] leading-[19.6px] [font-family:'Nunito',Helvetica] text-base placeholder:text-[#caced8]"
                                  />
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        <Button className="w-32 h-[42px] bg-[#3479ff] hover:bg-[#3479ff]/90 rounded-lg font-bold text-white text-base text-center [font-family:'Nunito',Helvetica] tracking-[0] leading-[19.6px] h-auto">
                          Save
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};
