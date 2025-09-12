import { ChevronDownIcon } from "lucide-react";
import React from "react";
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

const sidebarMenuItems = [
  { label: "Edit Profile", active: true },
  { label: "Notifications", active: false },
  { label: "Choose Plan", active: false },
  { label: "Password & Security", active: false },
];

export const DivWrapperSubsection = (): JSX.Element => {
  return (
    <div className="w-full h-full relative">
      {/* Main Content */}
      <main className="flex-1 p-8">
        <Card className="w-full h-full bg-white shadow-[0px_0px_10px_#00000075] rounded-[50px] overflow-hidden">
          <CardContent className="p-0 h-full">
            {/* Profile Section */}
            <section className="relative">
              {/* Header Image */}
              <div className="w-full h-[153px]">
                <img
                  src="/header.png" // <-- Place header.png in your public folder
                  alt="Header Background"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Profile Info */}
              <div className="flex items-end gap-10 px-[72px] -mt-14 pb-10">
                <div className="relative">
                  <Avatar className="w-[180px] h-[180px] border-8 border-[#3479ff99] bg-slate-400 shadow-[0px_4px_4px_#00000040]">
                    <AvatarImage src="/image (93).png" />
                    <AvatarFallback />
                  </Avatar>
                  <Button
                    size="icon"
                    className="absolute bottom-3 right-[1px]  w-10 h-10 bg-[#3479ff] rounded-[20px] hover:bg-[#2968e6]"
                  >
                    <img className="w-5 h-[18px]" alt="Camera" src="/Camera.png" />
                  </Button>
                </div>

                <div className="flex items-end justify-between flex-1 pb-10">
                  <div className="flex flex-col gap-2">
                    <h2 className="[font-family:'Nunito',Helvetica] font-bold text-[#13377c] text-2xl tracking-[0] leading-[normal]">
                      Mobina Mirbagheri
                    </h2>
                    <p className="[font-family:'Nunito',Helvetica] font-bold text-[#13377c] text-xl tracking-[0] leading-[19.6px]">
                      Your account is ready, you can now apply for advice.
                    </p>
                  </div>
                  <img className="w-12 h-12" alt="Frame" />
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
                      className={`w-[185px] h-11 justify-start px-3 rounded-lg [font-family:'Nunito',Helvetica] font-bold text-base tracking-[0] leading-[19.6px] ${
                        item.active
                          ? "bg-[#007fff59] text-[#083a50] hover:bg-[#007fff59]"
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
                    <h3 className="text-2xl [font-family:'Nunito',Helvetica] font-bold text-[#caced8] tracking-[0] leading-[normal]">
                      Edit Profile
                    </h3>
                    <p className="text-base text-right [font-family:'Nunito',Helvetica] font-bold text-[#caced8] tracking-[0] leading-[normal]">
                      last update August 1
                    </p>
                  </div>

                  {/* Form Fields */}
                  <div className="flex gap-[61px]">
                    {/* Left Column */}
                    <div className="flex-1 flex flex-col gap-6">
                      <div className="flex flex-col gap-1">
                        <Label className="font-bold text-[#083a50] [font-family:'Nunito',Helvetica] text-base tracking-[0] leading-[19.6px]">
                          University Name
                        </Label>
                        <Input
                          placeholder="eg xyz shool"
                          className="h-11 px-3 bg-white rounded-3xl border-[#caced8] [font-family:'Nunito',Helvetica] text-base"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <Label className="font-bold text-[#083a50] [font-family:'Nunito',Helvetica] text-base tracking-[0] leading-[19.6px]">
                          Preferred language
                        </Label>
                        <Select>
                          <SelectTrigger className="h-11 px-3 bg-white rounded-3xl border-[#caced8] [font-family:'Nunito',Helvetica] text-base">
                            <SelectValue placeholder="Select Language" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="english">English</SelectItem>
                            <SelectItem value="spanish">Spanish</SelectItem>
                            <SelectItem value="french">French</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex flex-col gap-1">
                        <Label className="font-bold text-[#083a50] [font-family:'Nunito',Helvetica] text-base tracking-[0] leading-[19.6px]">
                          Percentage or GPA
                        </Label>
                        <Input
                          placeholder="Enter"
                          className="h-11 px-3 bg-white rounded-3xl border-[#caced8] [font-family:'Nunito',Helvetica] text-base"
                        />
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="flex-1 flex flex-col gap-6">
                      <div className="flex flex-col gap-1">
                        <Label className="font-bold text-[#083a50] [font-family:'Nunito',Helvetica] text-base tracking-[0] leading-[19.6px]">
                          Stream
                        </Label>
                        <Input
                          placeholder="Enter Stream"
                          className="h-11 px-3 bg-white rounded-3xl border-[#caced8] [font-family:'Nunito',Helvetica] text-base"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <Label className="font-normal text-[#083a50] [font-family:'Nunito',Helvetica] text-base tracking-[0] leading-[19.6px]">
                          <span className="font-bold">Guardian Contact No.</span>
                          <span className="text-xs"> (Optional)</span>
                        </Label>
                        <div className="flex gap-2">
                          <div className="w-[76px] h-11 flex items-center justify-between px-3 bg-white rounded-3xl border border-[#caced8]">
                            <span className="font-normal text-[#083a50] [font-family:'Nunito',Helvetica] text-base tracking-[0] leading-[19.6px]">
                              +98
                            </span>
                            <ChevronDownIcon className="w-4 h-4" />
                          </div>
                          <Input
                            placeholder="9120000000"
                            className="flex-1 h-11 px-3 bg-white rounded-3xl border-[#caced8] [font-family:'Nunito',Helvetica] text-base"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-1">
                        <Label className="font-normal text-[#083a50] [font-family:'Nunito',Helvetica] text-base tracking-[0] leading-[19.6px]">
                          <span className="font-bold">
                            Guardian Relationship{" "}
                          </span>
                          <span className="text-xs">(Optional)</span>
                        </Label>
                        <Select>
                          <SelectTrigger className="h-11 px-3 bg-white rounded-3xl border-[#caced8] [font-family:'Nunito',Helvetica] text-base">
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
                  <Button className="w-32 h-[42px] bg-[#3479ff] hover:bg-[#2968e6] rounded-lg font-bold text-white text-base text-center [font-family:'Nunito',Helvetica] tracking-[0] leading-[19.6px]">
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
