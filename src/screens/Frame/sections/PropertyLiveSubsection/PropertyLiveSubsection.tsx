import { CalendarIcon, ClockIcon, SearchIcon } from "lucide-react";
import React from "react";
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

const liveClassesData = [
  {
    id: 1,
    title: "Advanced Javascript Concepts",
    batch: "Batch 3CO - JVY",
    date: "03 Jan 2023",
    time: "12:40 P:M",
    status: "ongoing",
    statusText: "Status : Ongoing",
    background:
      "bg-[linear-gradient(180deg,rgba(255,224,224,1)_0%,rgba(255,255,255,1)_100%)]",
    statusBg: "bg-[#ffdddd]",
    statusColor: "text-[#f12121]",
  },
  {
    id: 2,
    title: "Advanced Javascript Concepts",
    batch: "Batch 3MY - JVY",
    date: "03 Jan 2023",
    time: "01:40 P:M",
    status: "starting",
    statusText: "Status : Starting in 60 Minutes",
    background:
      "bg-[linear-gradient(180deg,rgba(223,255,238,1)_0%,rgba(255,255,255,1)_100%)]",
    statusBg: "bg-[#ddffe6]",
    statusColor: "text-[#0bc640]",
  },
  {
    id: 3,
    title: "Advanced Javascript Concepts",
    batch: "Batch 3MY - JVY",
    date: "03 Jan 2023",
    time: "01:40 P:M",
    status: "not-started",
    statusText: "Status : Not Started",
    background: "bg-white",
    statusBg: "bg-[#f1f1f1]",
    statusColor: "text-[#9e9e9e]",
  },
  {
    id: 4,
    title: "Advanced Javascript Concepts",
    batch: "Batch 3MY - JVY",
    date: "03 Jan 2023",
    time: "01:40 P:M",
    status: "not-started",
    statusText: "Status : Not Started",
    background: "bg-white",
    statusBg: "bg-[#f1f1f1]",
    statusColor: "text-[#9e9e9e]",
  },
  {
    id: 5,
    title: "Advanced Javascript Concepts",
    batch: "Batch 3CO - JVY",
    date: "03 Jan 2023",
    time: "12:40 P:M",
    status: "ongoing",
    statusText: "Status : Ongoing",
    background:
      "bg-[linear-gradient(180deg,rgba(255,224,224,1)_0%,rgba(255,255,255,1)_100%)]",
    statusBg: "bg-[#ffdddd]",
    statusColor: "text-[#f12121]",
  },
  {
    id: 6,
    title: "Advanced Javascript Concepts",
    batch: "Batch 3MY - JVY",
    date: "03 Jan 2023",
    time: "01:40 P:M",
    status: "starting",
    statusText: "Status : Starting in 60 Minutes",
    background:
      "bg-[linear-gradient(180deg,rgba(223,255,238,1)_0%,rgba(255,255,255,1)_100%)]",
    statusBg: "bg-[#ddffe6]",
    statusColor: "text-[#0bc640]",
  },
  {
    id: 7,
    title: "Advanced Javascript Concepts",
    batch: "Batch 3MY - JVY",
    date: "03 Jan 2023",
    time: "01:40 P:M",
    status: "not-started",
    statusText: "Status : Not Started",
    background: "bg-white",
    statusBg: "bg-[#f1f1f1]",
    statusColor: "text-[#9e9e9e]",
  },
  {
    id: 8,
    title: "Advanced Javascript Concepts",
    batch: "Batch 3CO - JVY",
    date: "03 Jan 2023",
    time: "12:40 P:M",
    status: "ongoing",
    statusText: "Status : Ongoing",
    background:
      "bg-[linear-gradient(180deg,rgba(255,224,224,1)_0%,rgba(255,255,255,1)_100%)]",
    statusBg: "bg-[#ffdddd]",
    statusColor: "text-[#f12121]",
  },
  {
    id: 9,
    title: "Advanced Javascript Concepts",
    batch: "Batch 3MY - JVY",
    date: "03 Jan 2023",
    time: "01:40 P:M",
    status: "starting",
    statusText: "Status : Starting in 60 Minutes",
    background:
      "bg-[linear-gradient(180deg,rgba(223,255,238,1)_0%,rgba(255,255,255,1)_100%)]",
    statusBg: "bg-[#ddffe6]",
    statusColor: "text-[#0bc640]",
  },
];

export const PropertyLiveSubsection = (): JSX.Element => {
  return (
    <section className="w-full bg-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-[60px]">
          <header className="flex items-center justify-between">
            <div className="flex-1">
              <h1 className="[font-family:'Nunito',Helvetica] font-bold text-[#13377c] text-xl tracking-[0] leading-[26px]">
                Live Classes
              </h1>
              <p className="[font-family:'Poppins',Helvetica] font-normal text-object-black-60 text-base tracking-[0] leading-6 mt-1">
                List of your Live Classes
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-[603px]">
                <div className="relative">
                  <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#9e9e9e]" />
                  <Input
                    placeholder="SearchIcon your class here...."
                    className="pl-10 h-14 rounded-xl border-[#cccccccc] [font-family:'Inter',Helvetica] font-medium text-[#9e9e9e] text-xs"
                  />
                </div>
              </div>

              <Select defaultValue="all-classes">
                <SelectTrigger className="w-[217px] h-[41px] rounded-[3px] border-2 border-[#eaeaea] px-[18px] py-2.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-classes">
                    <span className="[font-family:'Poppins',Helvetica] font-normal text-object-black-90 text-base">
                      All Classes
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue="recently-added">
                <SelectTrigger className="w-[217px] h-[41px] rounded-[3px] border-2 border-[#eaeaea] px-[18px] py-2.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recently-added">
                    <span className="[font-family:'Poppins',Helvetica] font-normal text-object-black-90 text-base">
                      Recently added
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </header>

          <main className="grid grid-cols-3 gap-10">
            {liveClassesData.map((classItem) => (
              <Card
                key={classItem.id}
                className={`w-full h-80 rounded-[25px] shadow-[0px_0px_20px_#3479ff40] border-0 ${classItem.background}`}
              >
                <CardContent className="p-0 h-full">
                  <div className="flex flex-col justify-center items-center gap-[34px] p-[33px] h-full">
                    <div className="flex flex-col gap-3 w-full">
                      <div className="flex flex-col gap-[15px] w-full">
                        <h3 className="font-bold [font-family:'Inter',Helvetica] text-[#202020] text-[25px] tracking-[0] leading-[normal]">
                          {classItem.title}
                        </h3>
                      </div>

                      <div className="flex flex-col gap-3 w-full">
                        <div className="w-[152px] h-[33px] rounded-[5px] border border-solid border-[#d3d3d3] flex items-center px-[9px]">
                          <span className="[font-family:'Inter',Helvetica] font-medium text-[#979797] text-base tracking-[0] leading-[normal]">
                            {classItem.batch}
                          </span>
                        </div>

                        <div className="flex items-center gap-8">
                          <div className="flex items-center gap-[7px]">
                            <ClockIcon className="w-[19px] h-[19px] text-[#979797]" />
                            <span className="[font-family:'Inter',Helvetica] font-medium text-[#979797] text-base tracking-[0] leading-[normal]">
                              {classItem.time}
                            </span>
                          </div>

                          <div className="flex items-center gap-[7px]">
                            <CalendarIcon className="w-[18px] h-[19px] text-[#979797]" />
                            <span className="[font-family:'Inter',Helvetica] font-medium text-[#979797] text-base tracking-[0] leading-[normal]">
                              {classItem.date}
                            </span>
                          </div>
                        </div>

                        <div
                          className={`h-[33px] rounded-[5px] flex items-center px-[19px] ${classItem.statusBg} ${classItem.status === "starting" ? "w-[269px]" : classItem.status === "ongoing" ? "w-44" : "w-[194px]"}`}
                        >
                          <span
                            className={`[font-family:'Inter',Helvetica] font-normal text-base tracking-[0] leading-[normal] ${classItem.statusColor}`}
                          >
                            {classItem.statusText}
                          </span>
                        </div>
                      </div>
                    </div>

                    <Button className="w-[333px] h-[37px] bg-[#3479ff] hover:bg-[#2968e6] rounded-lg h-auto">
                      <span className="font-bold text-white text-base [font-family:'Inter',Helvetica] tracking-[0] leading-[normal]">
                        Join Now
                      </span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </main>
        </div>
      </div>
    </section>
  );
};
