"use client";

import {
  AwardIcon,
  BookOpenIcon,
  CalendarIcon,
  ClockIcon,
  FileTextIcon,
  FolderIcon,
  HelpCircleIcon,
  HomeIcon,
  LogOutIcon,
  PresentationIcon,
  ShareIcon,
  TrophyIcon,
  UserIcon,
  UsersIcon,
} from "lucide-react";
import React from "react";
import { Badge } from "../../../../components/ui/badge";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";
import { Progress } from "../../../../components/ui/progress";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";

export function PropertyTestAndSubsection() {
  

  return (
    <div className="w-full min-h-screen flex">

      {/* Main Content */}
      <div className="flex-1 bg-white rounded-tl-[30px] shadow-[0px_0px_29px_#00000025] px-8 py-6">
        {/* Header */}
   

        {/* Cards */}
        <div className="grid grid-cols-3 gap-5 mb-8">
          {/* Total Tests */}
          <Card className="bg-white rounded-[20px] shadow-[0px_4px_20px_#3479ff20] border-0">
  <CardContent className="p-6 flex items-start justify-between relative">
    {/* Left Section */}
    <div className="flex flex-col gap-2">
      {/* Title with Icon Space */}
      <div className="flex items-center justify-between pr-6">
        <h2 className="text-[#1c2752] font-bold text-lg">Total Tests</h2>
      </div>

      {/* Total Count */}
      <p className="text-[#3479ff] font-extrabold text-2xl mb-14 leading-tight">8</p>

      {/* Achievements */}
      <p className="text-[#5f5f5f] text-[17px] font-extrabold">
        <span className="font-bold text-[17px]">26</span> Achievements unlocked
      </p>
    </div>

    {/* Progress Image */}
    <div className="flex flex-col items-center justify-start mt-14">
      <img
        src="/marks.png"
        alt="Marks Progress"
        className="w-[130px] h-[130px] object-contain mt-2"
      />
    </div>

    {/* Top Right Icon */}
    <img className="absolute top-5 right-5 w-5 h-5 text-[#3479ff]" src="/BOOK.png"/>
  </CardContent>
</Card>

{/* Complete */}
<Card className="bg-white rounded-[20px] shadow-[0px_4px_20px_#3479ff20] border-0">
  <CardContent className="p-6 flex flex-col gap-3">
    <div className="flex items-center justify-between">
      <h2 className="text-[#1c2752] font-bold text-lg">Complete</h2>
      <img className="w-5 h-5 text-[#3479ff]" src="/tick.png" />
    </div>

    {/* Count */}
    <p className="text-[#3479ff] font-extrabold text-2xl">4</p>

    {/* Progress Bar */}
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[#9e9e9e] text-sm">Progress</span>
        <span className="text-[#9e9e9e] text-sm">50%</span>
      </div>
      <div className="w-full bg-[#e0e0e0] rounded-full h-3">
        <div
          className="bg-[#3479ff] h-3 rounded-full transition-all duration-500"
          style={{ width: "50%" }}
        />
      </div>
      <p className="text-[#9e9e9e] text-sm mt-1">4 tests remaining</p>
    </div>
  </CardContent>
</Card>
          {/* Average Score */}
          <Card className="bg-white rounded-[25px] shadow-[0px_0px_20px_#3d57cf40] border-0">
            <CardContent className="p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="text-[#13377c] font-bold text-lg">
                  Average Score
                </h2>
                <img className="w-6 h-4 text-[#3479ff]" src="/vector.png" />
              </div>
              <p className="text-[#3479ff] font-bold text-xl">86%</p>
              <div className="h-[113px] bg-gradient-to-t from-[#dbe8ff] to-white rounded-xl border border-[#e4e4e4] flex items-end justify-around px-7 pb-4">
                {[78, 86, 95, 98, 92, 59].map((height, i) => (
                  <div
                    key={i}
                    className="w-3 bg-[#3479ff] rounded-t-lg opacity-70"
                    style={{ height: `${height}px` }}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      

        {/* Tabs */}
        <Card className="bg-white rounded-[21px] shadow-[0px_0px_20px_#3479ff40] border-0 mb-8">
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center gap-2 bg-[#007fff59] px-5 py-2 rounded-[20px]">
              <span className="font-bold text-[#083a50] text-lg">All</span>
              <Badge className="bg-[#fff8f8] text-[#083a50] font-bold text-sm rounded-full h-5 w-6 flex items-center justify-center">
                8
              </Badge>
            </div>
            <span className="font-bold text-[#888888] text-lg">Completed 4</span>
            <span className="font-bold text-[#888888] text-lg mr-14">Upcoming 4</span>
          </CardContent>
        </Card>

        {/* Test Cards */}
        <div className="grid grid-cols-3 gap-8">
          {[...Array(6)].map((_, index) => (
            <Card
              key={index}
              className="bg-white rounded-[25px] shadow-[0px_0px_20px_#3479ff40] border-0"
            >
              <CardContent className="flex flex-col items-start justify-between p-6 h-80">
                <div className="flex flex-col gap-4">
                  <h3 className="font-semibold text-[#202020] text-xl">
                    Advanced JavaScript Concepts
                  </h3>
                  <Badge className="bg-[#75a4ff87] text-[#083a50] font-semibold text-xs rounded-[25px] h-[18px] px-3 py-1">
                    Programming
                  </Badge>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between text-sm text-[#7e7e7e]">
                      <div className="flex items-center gap-2">
                        <ClockIcon className="w-5 h-5" />
                        90 Minutes
                      </div>
                      <div className="flex items-center gap-2">
                        <BookOpenIcon className="w-4 h-4" />
                        30 Questions
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#7e7e7e]">
                      <CalendarIcon className="w-4 h-4" />
                      Due: Aug 15, 07:30 PM
                    </div>
                  </div>
                </div>
                <Button className="w-full h-[37px] bg-[#3479ff] text-white font-bold rounded-lg hover:bg-[#3479ff]/90">
                  Start Test
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
