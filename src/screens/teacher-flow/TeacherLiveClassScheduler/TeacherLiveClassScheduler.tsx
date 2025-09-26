import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  PlusIcon,
  UsersIcon,
  VideoIcon,
} from "lucide-react";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";

const calendarData = [
  { day: 27, isCurrentMonth: false, classes: [] },
  { day: 28, isCurrentMonth: false, classes: [] },
  { day: 29, isCurrentMonth: false, classes: [] },
  { day: 30, isCurrentMonth: false, classes: [] },
  { day: 31, isCurrentMonth: false, classes: [] },
  { day: 1, isCurrentMonth: true, classes: [] },
  { day: 2, isCurrentMonth: true, classes: [] },
  { day: 3, isCurrentMonth: true, classes: [] },
  { day: 4, isCurrentMonth: true, classes: [] },
  { day: 5, isCurrentMonth: true, classes: [] },
  { day: 6, isCurrentMonth: true, classes: [] },
  { day: 7, isCurrentMonth: true, classes: [] },
  { day: 8, isCurrentMonth: true, classes: [] },
  { day: 9, isCurrentMonth: true, classes: [] },
  { day: 10, isCurrentMonth: true, classes: [] },
  {
    day: 11,
    isCurrentMonth: true,
    isSelected: true,
    classes: [
      {
        title: "React Hoo…",
        gradient: "bg-gradient-to-r from-[#2b7fff] to-[#9810fa]",
      },
      {
        title: "Design Sy…",
        gradient: "bg-gradient-to-r from-[#f6339a] to-[#ff6900]",
      },
      { count: "+2" },
    ],
  },
  {
    day: 12,
    isCurrentMonth: true,
    classes: [
      {
        title: "Node.js M…",
        gradient: "bg-gradient-to-r from-[#2b7fff] to-[#9810fa]",
      },
      {
        title: "UX Resear…",
        gradient: "bg-gradient-to-r from-[#f6339a] to-[#ff6900]",
      },
      { count: "+1" },
    ],
  },
  {
    day: 13,
    isCurrentMonth: true,
    classes: [
      {
        title: "Python Da…",
        gradient: "bg-gradient-to-r from-[#2b7fff] to-[#9810fa]",
      },
      {
        title: "Figma Adv…",
        gradient: "bg-gradient-to-r from-[#f6339a] to-[#ff6900]",
      },
      { count: "+1" },
    ],
  },
  {
    day: 14,
    isCurrentMonth: true,
    classes: [
      {
        title: "French Gr…",
        gradient: "bg-gradient-to-r from-[#f0b100] to-[#fb2c36]",
      },
      {
        title: "React Nati…",
        gradient: "bg-gradient-to-r from-[#2b7fff] to-[#9810fa]",
      },
    ],
  },
  {
    day: 15,
    isCurrentMonth: true,
    classes: [
      {
        title: "Brand Ide…",
        gradient: "bg-gradient-to-r from-[#f6339a] to-[#ff6900]",
      },
      {
        title: "Financial P…",
        gradient: "bg-gradient-to-r from-[#00c950] to-[#009689]",
      },
    ],
  },
  {
    day: 16,
    isCurrentMonth: true,
    classes: [
      {
        title: "German B…",
        gradient: "bg-gradient-to-r from-[#f0b100] to-[#fb2c36]",
      },
    ],
  },
  {
    day: 17,
    isCurrentMonth: true,
    classes: [
      {
        title: "Full-Stack …",
        gradient: "bg-gradient-to-r from-[#2b7fff] to-[#9810fa]",
      },
    ],
  },
  {
    day: 18,
    isCurrentMonth: true,
    classes: [
      {
        title: "Machine L…",
        gradient: "bg-gradient-to-r from-[#2b7fff] to-[#9810fa]",
      },
    ],
  },
  {
    day: 19,
    isCurrentMonth: true,
    classes: [
      {
        title: "UI Animati…",
        gradient: "bg-gradient-to-r from-[#f6339a] to-[#ff6900]",
      },
    ],
  },
  {
    day: 20,
    isCurrentMonth: true,
    classes: [
      {
        title: "E-commer…",
        gradient: "bg-gradient-to-r from-[#00c950] to-[#009689]",
      },
    ],
  },
  {
    day: 21,
    isCurrentMonth: true,
    classes: [
      {
        title: "Japanese …",
        gradient: "bg-gradient-to-r from-[#f0b100] to-[#fb2c36]",
      },
    ],
  },
  {
    day: 22,
    isCurrentMonth: true,
    classes: [
      {
        title: "DevOps &…",
        gradient: "bg-gradient-to-r from-[#2b7fff] to-[#9810fa]",
      },
    ],
  },
  {
    day: 23,
    isCurrentMonth: true,
    classes: [
      {
        title: "Sustainabl…",
        gradient: "bg-gradient-to-r from-[#f6339a] to-[#ff6900]",
      },
    ],
  },
  {
    day: 24,
    isCurrentMonth: true,
    classes: [
      {
        title: "Project M…",
        gradient: "bg-gradient-to-r from-[#00c950] to-[#009689]",
      },
    ],
  },
  {
    day: 25,
    isCurrentMonth: true,
    classes: [
      {
        title: "Advanced …",
        gradient: "bg-gradient-to-r from-[#2b7fff] to-[#9810fa]",
      },
    ],
  },
  {
    day: 26,
    isCurrentMonth: true,
    classes: [
      {
        title: "User Exper…",
        gradient: "bg-gradient-to-r from-[#f6339a] to-[#ff6900]",
      },
    ],
  },
  {
    day: 27,
    isCurrentMonth: true,
    classes: [
      {
        title: "Content M…",
        gradient: "bg-gradient-to-r from-[#00c950] to-[#009689]",
      },
    ],
  },
  {
    day: 28,
    isCurrentMonth: true,
    classes: [
      {
        title: "Mandarin …",
        gradient: "bg-gradient-to-r from-[#f0b100] to-[#fb2c36]",
      },
    ],
  },
  {
    day: 29,
    isCurrentMonth: true,
    classes: [
      {
        title: "Database …",
        gradient: "bg-gradient-to-r from-[#2b7fff] to-[#9810fa]",
      },
    ],
  },
  {
    day: 30,
    isCurrentMonth: true,
    classes: [
      {
        title: "Digital Illu…",
        gradient: "bg-gradient-to-r from-[#f6339a] to-[#ff6900]",
      },
    ],
  },
  {
    day: 31,
    isCurrentMonth: true,
    classes: [
      {
        title: "Sales Funn…",
        gradient: "bg-gradient-to-r from-[#00c950] to-[#009689]",
      },
    ],
  },
  {
    day: 1,
    isCurrentMonth: false,
    classes: [
      {
        title: "Vue.js Co…",
        gradient: "bg-gradient-to-r from-[#2b7fff] to-[#9810fa]",
      },
    ],
  },
  {
    day: 2,
    isCurrentMonth: false,
    classes: [
      {
        title: "Typograp…",
        gradient: "bg-gradient-to-r from-[#f6339a] to-[#ff6900]",
      },
    ],
  },
  {
    day: 3,
    isCurrentMonth: false,
    classes: [
      {
        title: "Leadershi…",
        gradient: "bg-gradient-to-r from-[#00c950] to-[#009689]",
      },
    ],
  },
  {
    day: 4,
    isCurrentMonth: false,
    classes: [
      {
        title: "Italian Con…",
        gradient: "bg-gradient-to-r from-[#f0b100] to-[#fb2c36]",
      },
    ],
  },
  {
    day: 5,
    isCurrentMonth: false,
    classes: [
      {
        title: "Cybersecu…",
        gradient: "bg-gradient-to-r from-[#2b7fff] to-[#9810fa]",
      },
    ],
  },
  {
    day: 6,
    isCurrentMonth: false,
    classes: [
      {
        title: "Product D…",
        gradient: "bg-gradient-to-r from-[#f6339a] to-[#ff6900]",
      },
    ],
  },
];

const weeklySchedule = [
  {
    day: "Mon",
    date: 11,
    isToday: true,
    classes: [
      {
        title: "React …",
        time: "9:00 AM",
        gradient: "bg-gradient-to-r from-[#2b7fff] to-[#9810fa]",
      },
      {
        title: "Desig…",
        time: "11:30 AM",
        gradient: "bg-gradient-to-r from-[#f6339a] to-[#ff6900]",
        duration: "long",
      },
      {
        title: "Busine…",
        time: "2:00 PM",
        gradient: "bg-gradient-to-r from-[#00c950] to-[#009689]",
      },
    ],
    moreCount: "+1 more",
  },
  {
    day: "Tue",
    date: 12,
    classes: [
      {
        title: "Node.j…",
        time: "9:30 AM",
        gradient: "bg-gradient-to-r from-[#2b7fff] to-[#9810fa]",
      },
      {
        title: "UX Re…",
        time: "1:00 PM",
        gradient: "bg-gradient-to-r from-[#f6339a] to-[#ff6900]",
      },
      {
        title: "Digital…",
        time: "3:30 PM",
        gradient: "bg-gradient-to-r from-[#00c950] to-[#009689]",
      },
    ],
  },
  {
    day: "Wed",
    date: 13,
    classes: [
      {
        title: "Pytho…",
        time: "10:00 AM",
        gradient: "bg-gradient-to-r from-[#2b7fff] to-[#9810fa]",
        duration: "long",
      },
      {
        title: "Figma…",
        time: "2:30 PM",
        gradient: "bg-gradient-to-r from-[#f6339a] to-[#ff6900]",
      },
      {
        title: "Startu…",
        time: "6:00 PM",
        gradient: "bg-gradient-to-r from-[#00c950] to-[#009689]",
      },
    ],
  },
  {
    day: "Thu",
    date: 14,
    classes: [
      {
        title: "Frenc…",
        time: "11:00 AM",
        gradient: "bg-gradient-to-r from-[#f0b100] to-[#fb2c36]",
        duration: "long",
      },
      {
        title: "React …",
        time: "1:30 PM",
        gradient: "bg-gradient-to-r from-[#2b7fff] to-[#9810fa]",
      },
    ],
  },
  {
    day: "Fri",
    date: 15,
    classes: [
      {
        title: "Brand …",
        time: "10:30 AM",
        gradient: "bg-gradient-to-r from-[#f6339a] to-[#ff6900]",
        duration: "long",
      },
      {
        title: "Financ…",
        time: "3:00 PM",
        gradient: "bg-gradient-to-r from-[#00c950] to-[#009689]",
      },
    ],
  },
  {
    day: "Sat",
    date: 16,
    classes: [
      {
        title: "Germa…",
        time: "4:00 PM",
        gradient: "bg-gradient-to-r from-[#f0b100] to-[#fb2c36]",
      },
    ],
  },
];

const todaySchedule = [
  {
    title: "React Hooks Deep Dive",
    category: "Frontend Development",
    time: "9:00 AM • 2h",
    instructor: "Sarah Johnson",
    students: 28,
    tags: [
      { label: "coding", color: "bg-[#2b7fff]" },
      {
        label: "Advanced",
        color: "bg-[#fee1e1] text-[#c10007] border-[#ffc9c9]",
      },
    ],
    gradient: "bg-[#485cfc]",
  },
  {
    title: "Design System Fundamentals",
    category: "Design Systems",
    time: "11:30 AM • 1.5h",
    instructor: "Emma Chen",
    students: 22,
    tags: [
      { label: "design", color: "bg-[#f6329a]" },
      {
        label: "Intermediate",
        color: "bg-[#fef9c1] text-[#a65f00] border-[#feef85]",
      },
    ],
    gradient: "bg-gradient-to-r from-[#f6339a] to-[#ff6900]",
  },
  {
    title: "Business Analytics Workshop",
    category: "Business Analytics",
    time: "2:00 PM • 2.5h",
    instructor: "Michael Rodriguez",
    students: 25,
    tags: [
      { label: "business", color: "bg-[#00c850]" },
      {
        label: "Advanced",
        color: "bg-[#fee1e1] text-[#c10007] border-[#ffc9c9]",
      },
    ],
    gradient: "bg-gradient-to-r from-[#00c950] to-[#009689]",
  },
  {
    title: "Spanish Conversation Practice",
    category: "Spanish Intermediate",
    time: "4:30 PM • 1h",
    instructor: "Maria González",
    students: 15,
    tags: [
      { label: "language", color: "bg-[#f0b000]" },
      {
        label: "Intermediate",
        color: "bg-[#fef9c1] text-[#a65f00] border-[#feef85]",
      },
    ],
    gradient: "bg-gradient-to-r from-[#f0b100] to-[#fb2c36]",
  },
];

const upcomingClasses = [
  {
    emoji: "💻",
    title: "Node.js Microservice…",
    category: "Backend Development",
    time: "Tomorrow • 9:30 AM",
    duration: "3h",
    timeUntil: "in about 16 hours",
    tag: { label: "coding", color: "bg-[#3479ff]" },
    frequency: "weekly",
    gradient: "bg-[#3479ff]",
  },
  {
    emoji: "🎨",
    title: "UX Research Methods",
    category: "UX Research",
    time: "Tomorrow • 1:00 PM",
    duration: "2h",
    timeUntil: "in about 20 hours",
    tag: {
      label: "design",
      color: "bg-gradient-to-r from-[#f6339a] to-[#ff6900]",
    },
    gradient: "bg-gradient-to-r from-[#f6339a] to-[#ff6900]",
  },
  {
    emoji: "💼",
    title: "Digital Marketing Str…",
    category: "Digital Marketing",
    time: "Tomorrow • 3:30 PM",
    duration: "2h",
    timeUntil: "in about 22 hours",
    tag: {
      label: "business",
      color: "bg-gradient-to-r from-[#00c950] to-[#009689]",
    },
    frequency: "weekly",
    gradient: "bg-gradient-to-r from-[#00c950] to-[#009689]",
  },
  {
    emoji: "💻",
    title: "Python Data Science …",
    category: "Data Science",
    time: "Aug 13 • 10:00 AM",
    duration: "4h",
    timeUntil: "in 1 day",
    tag: { label: "coding", color: "bg-[#3479ff]" },
    frequency: "weekly",
    gradient: "bg-[#3479ff]",
  },
  {
    emoji: "🎨",
    title: "Figma Advanced Pro…",
    category: "Design Tools",
    time: "Aug 13 • 2:30 PM",
    duration: "2h",
    timeUntil: "in 2 days",
    tag: {
      label: "design",
      color: "bg-gradient-to-r from-[#f6339a] to-[#ff6900]",
    },
    gradient: "bg-gradient-to-r from-[#f6339a] to-[#ff6900]",
  },
];

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const TeaacherLiveClassScheduler = (): JSX.Element => {
  return (
    <div className="w-full h-full bg-[#3479ff] relative">
      <div className="w-full max-w-[1605px] mx-auto h-full bg-white shadow-[0px_0px_29px_#00000075] relative">
        <img
          className="absolute top-[102px] left-[-300px] w-[1905px] h-[930px]"
          alt="Group"
          src="/group-1321317804-8.png"
        />

        <header className="flex w-full max-w-[1503px] items-center justify-between px-8 py-0 mx-auto mt-[46px]">
          <div className="flex items-center gap-[57px]">
            <img
              className="w-[25px] h-[25px]"
              alt="Component"
              src="/component-1.svg"
            />
            <div className="text-primaryone font-bold text-2xl [font-family:'Nunito',Helvetica] tracking-[0] leading-[normal]">
              Live class Scheduler
            </div>
          </div>

          <img className="flex-shrink-0" alt="Frame" src="/frame-33600.svg" />
        </header>

        <main className="flex gap-10 mt-[111px] mx-[82px]">
          <section className="flex w-[1128px] flex-col items-center justify-center gap-[15px]">
            <Card className="w-full bg-[#ffffff40] border-[#ffffff33] shadow-[0px_8px_32px_#1f268726] backdrop-blur-[10px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(10px)_brightness(100%)]">
              <CardContent className="flex items-center justify-between p-[25px]">
                <div className="flex items-center gap-[17px]">
                  <div className="flex items-center gap-[7px]">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-10 h-10 p-0"
                    >
                      <ChevronLeftIcon className="w-6 h-6" />
                    </Button>

                    <div className="flex items-center justify-center w-[153.62px] h-8 [font-family:'Inter',Helvetica] font-bold text-gray-900 text-2xl tracking-[0] leading-8 whitespace-nowrap">
                      August 2025
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-10 h-10 p-0"
                    >
                      <ChevronRightIcon className="w-6 h-6" />
                    </Button>
                  </div>

                  <Button
                    variant="outline"
                    className="h-10 bg-[#ffffff80] border-[#ffffff4c] text-zinc-950"
                  >
                    Today
                  </Button>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-11 bg-[#ffffff4c] rounded-xl p-1">
                    <Button className="h-9 bg-[#3479ff] text-white shadow-[0px_4px_6px_-4px_#0000001a,0px_10px_15px_-3px_#0000001a]">
                      Month
                    </Button>
                    <Button variant="ghost" className="h-9 text-gray-600">
                      Week
                    </Button>
                    <Button variant="ghost" className="h-9 text-gray-600">
                      Day
                    </Button>
                  </div>

                  <Button className="h-10 bg-[#3479ff] text-white shadow-[0px_4px_6px_-4px_#0000001a,0px_10px_15px_-3px_#0000001a]">
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Schedule Class
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col items-start gap-6 w-full">
              <div className="flex items-center gap-[46px] w-full">
                <Card className="w-[574.4px] h-[594.64px] bg-[#fffefe99] border-[#fffefe4c] shadow-[0px_0px_20px_#3479ff40] overflow-hidden">
                  <CardContent className="p-0 h-full">
                    <div className="p-[22px] pb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <CalendarIcon className="w-[21px] h-[21px]" />
                        <div className="[font-family:'Segoe_UI-Bold',Helvetica] font-bold text-[#1d2838] text-[15.8px] tracking-[0] leading-[24.5px]">
                          Month View
                        </div>
                      </div>
                      <div className="[font-family:'Segoe_UI-Regular',Helvetica] text-[#495565] text-[12.3px] leading-[17.5px] font-normal tracking-[0]">
                        August 2025 • 30 classes
                      </div>
                    </div>

                    <div className="grid grid-cols-7 gap-0 px-[22px] mb-4">
                      {weekDays.map((day) => (
                        <div key={day} className="text-center py-2">
                          <div className="[font-family:'Segoe_UI-Semibold',Helvetica] text-[#697282] text-[10.5px] leading-[14px] font-normal tracking-[0]">
                            {day}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1 px-[22px]">
                      {calendarData.map((date, index) => (
                        <div
                          key={index}
                          className={`h-[70px] flex flex-col rounded-[6.75px] border ${
                            date.isCurrentMonth
                              ? date.isSelected
                                ? "bg-[#fffefe80] border-[#7c86ff] shadow-[0px_0px_0px_1px_#7c86ff]"
                                : "bg-[#fffefe80] border-[#f2f4f6]"
                              : "bg-[#f8fafb4c] border-[#f8fafb]"
                          } ${date.classes.length > 1 ? "h-[79px]" : ""}`}
                        >
                          <div className="flex items-center justify-center mt-[4.3px] mb-1">
                            <div
                              className={`text-[10.5px] leading-[14px] text-center tracking-[0] whitespace-nowrap [font-family:'Segoe_UI-Regular',Helvetica] ${
                                date.isCurrentMonth
                                  ? date.isSelected
                                    ? "font-bold text-[#4f39f6] [font-family:'Segoe_UI-Bold',Helvetica]"
                                    : "font-normal text-[#1d2838]"
                                  : "font-normal text-[#99a1ae]"
                              }`}
                            >
                              {date.day}
                            </div>
                          </div>

                          <div className="flex-1 px-[4.3px] space-y-[1.7px]">
                            {date.classes.map((classItem, classIndex) => (
                              <div key={classIndex}>
                                {classItem.count ? (
                                  <div className="text-center text-[#697282] text-[10.5px] leading-[14px] [font-family:'Segoe_UI-Regular',Helvetica] font-normal tracking-[0]">
                                    {classItem.count}
                                  </div>
                                ) : (
                                  <div
                                    className={`h-[17.49px] rounded-[3.5px] overflow-hidden ${classItem.gradient} flex items-center justify-center px-[3.5px]`}
                                  >
                                    <div className="text-white text-[10.5px] leading-[14px] [font-family:'Segoe_UI-Regular',Helvetica] font-normal tracking-[0] whitespace-nowrap">
                                      {classItem.title}
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <div className="flex flex-col w-[494px] items-start gap-8">
                  <Card className="w-full h-[354px] bg-[#fffefe] shadow-[0px_0px_20px_#3479ff33] overflow-hidden">
                    <CardContent className="p-0 h-full">
                      <div className="flex flex-col w-[458px] items-start gap-[22px] mx-auto mt-[39px]">
                        <div className="flex items-center gap-[11px]">
                          <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center">
                            <CalendarIcon className="w-4 h-4 text-blue-600" />
                          </div>
                          <div className="flex flex-col">
                            <div className="[font-family:'Segoe_UI-Bold',Helvetica] font-bold text-[#1d2838] text-[15.8px] tracking-[0] leading-[24.5px]">
                              This Week
                            </div>
                            <div className="[font-family:'Segoe_UI-Regular',Helvetica] font-normal text-[#495565] text-[12.3px] tracking-[0] leading-[17.5px]">
                              Aug 10 - Aug 16 • 16 classes
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 w-full">
                          {weeklySchedule.map((day, index) => (
                            <div
                              key={index}
                              className={`w-[77px] h-[212px] rounded-[8.75px] overflow-hidden border shadow-[0px_1px_2px_-1px_#0000001a,0px_1px_3px_#0000001a] ${
                                day.isToday
                                  ? "bg-[#eef2ff80] border-[#a2b3ff]"
                                  : "bg-[#fffefe4c] border-gray-200"
                              }`}
                            >
                              <div className="text-center p-2">
                                <div
                                  className={`text-[10.5px] leading-[14px] [font-family:'Segoe_UI-Semibold',Helvetica] font-normal tracking-[0] ${
                                    day.isToday
                                      ? "text-[#4f39f6]"
                                      : "text-[#495565]"
                                  }`}
                                >
                                  {day.day}
                                </div>
                                <div
                                  className={`text-[15.8px] leading-[24.5px] [font-family:'Segoe_UI-Bold',Helvetica] tracking-[0] ${
                                    day.isToday
                                      ? "font-bold text-[#4f39f6]"
                                      : "font-normal text-[#495565]"
                                  }`}
                                >
                                  {day.date}
                                </div>
                              </div>

                              <div className="px-[11px] space-y-[3px]">
                                {day.classes.map((classItem, classIndex) => (
                                  <div
                                    key={classIndex}
                                    className={`rounded-[3.5px] overflow-hidden ${classItem.gradient} ${
                                      classItem.duration === "long"
                                        ? "h-[49px]"
                                        : "h-[35px]"
                                    }`}
                                  >
                                    <div className="p-1">
                                      <div
                                        className="text-white text-[10.5px] leading-[14px] [font-family:'Segoe_UI-Semibold',Helvetica] font-normal tracking-[0] whitespace
-nowrap"
                                      >
                                        {classItem.title}
                                      </div>
                                      {classItem.duration === "long" && (
                                        <div className="text-white text-[10.5px] leading-[14px] [font-family:'Segoe_UI-Regular',Helvetica] font-normal tracking-[0] opacity-90 mt-1">
                                          {classItem.time}
                                        </div>
                                      )}
                                      {classItem.duration !== "long" && (
                                        <div className="text-white text-[10.5px] leading-[14px] [font-family:'Segoe_UI-Regular',Helvetica] font-normal tracking-[0] opacity-90">
                                          {classItem.time}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                ))}
                                {day.moreCount && (
                                  <div className="text-center text-[#697282] text-[10.5px] leading-[14px] [font-family:'Segoe_UI-Regular',Helvetica] font-normal tracking-[0] mt-2">
                                    {day.moreCount}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="flex items-center gap-[25px] w-full">
                    <Card className="w-[494px] bg-white shadow-[0px_0px_20px_#3479ff40]">
                      <CardContent className="flex items-center justify-center gap-[35px] p-5">
                        <div className="flex flex-col w-[218px] items-center justify-center gap-2.5 px-[17px] py-3.5 rounded-[14px] overflow-hidden shadow-[0px_8px_10px_-6px_#0000001a,0px_20px_25px_-5px_#0000001a] bg-gradient-to-r from-[#5c5fff] to-[#0359ff]">
                          <div className="flex flex-col items-start gap-3.5 w-full">
                            <div className="[font-family:'Segoe_UI-Semibold',Helvetica] font-normal text-white text-sm tracking-[0] leading-[21px] whitespace-nowrap">
                              This Week
                            </div>
                            <div className="flex items-center justify-between w-full">
                              <div className="flex flex-col items-center">
                                <div className="[font-family:'Segoe_UI-Bold',Helvetica] font-bold text-white text-[21px] text-center tracking-[0] leading-7 whitespace-nowrap">
                                  10
                                </div>
                                <div className="[font-family:'Segoe_UI-Regular',Helvetica] font-normal text-white text-[12.3px] text-center tracking-[0] leading-[17.5px] opacity-90 whitespace-nowrap">
                                  Classes
                                </div>
                              </div>
                              <div className="flex flex-col items-center">
                                <div className="[font-family:'Segoe_UI-Bold',Helvetica] font-bold text-white text-[21px] text-center tracking-[0] leading-7 whitespace-nowrap">
                                  24.0h
                                </div>
                                <div className="[font-family:'Segoe_UI-Regular',Helvetica] font-normal text-white text-[12.3px] text-center tracking-[0] leading-[17.5px] opacity-90 whitespace-nowrap">
                                  Total Hours
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col w-[218px] items-center justify-center gap-2.5 px-[17px] py-3.5 rounded-[14px] overflow-hidden shadow-[0px_8px_10px_-6px_#0000001a,0px_20px_25px_-5px_#0000001a] bg-gradient-to-r from-[#615fff] to-[#0355f3]">
                          <div className="flex flex-col items-start gap-3.5 w-full">
                            <div className="[font-family:'Segoe_UI-Semibold',Helvetica] font-normal text-white text-sm tracking-[0] leading-[21px] whitespace-nowrap">
                              Total Student
                            </div>
                            <div className="flex items-center justify-between w-full">
                              <div className="flex flex-col items-center">
                                <div className="[font-family:'Segoe_UI-Bold',Helvetica] font-bold text-white text-[21px] text-center tracking-[0] leading-7 whitespace-nowrap">
                                  10
                                </div>
                                <div className="[font-family:'Segoe_UI-Regular',Helvetica] font-normal text-white text-[12.3px] text-center tracking-[0] leading-[17.5px] opacity-90 whitespace-nowrap">
                                  Classes
                                </div>
                              </div>
                              <div className="flex flex-col items-center gap-[5px]">
                                <div className="[font-family:'Segoe_UI-Bold',Helvetica] font-bold text-white text-[21px] text-center tracking-[0] leading-7">
                                  1200
                                </div>
                                <div className="[font-family:'Segoe_UI-Regular',Helvetica] font-normal text-white text-[12.3px] text-center leading-[8px] opacity-90 tracking-[0]">
                                  Student Count
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>

              <Card className="w-full h-[737px] bg-[#fffefe] border-[#fffefe4c] shadow-[0px_0px_20px_#3479ff40] overflow-hidden">
                <CardContent className="p-0 h-full">
                  <div className="p-[22px] pb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CalendarIcon className="w-7 h-7" />
                      <div className="[font-family:'Segoe_UI-Bold',Helvetica] font-bold text-[#1d2838] text-[15.8px] tracking-[0] leading-[24.5px]">
                        Today's Schedule
                      </div>
                    </div>
                    <div className="[font-family:'Segoe_UI-Regular',Helvetica] font-normal text-[#495565] text-[12.3px] tracking-[0] leading-[17.5px]">
                      Monday, August 11 • 4 classes
                    </div>
                  </div>

                  <div className="flex flex-col gap-3.5 px-[22px]">
                    {todaySchedule.map((classItem, index) => (
                      <Card
                        key={index}
                        className={`h-[147px] ${classItem.gradient} border-0 overflow-hidden shadow-[0px_1px_2px_-1px_#0000001a,0px_1px_3px_#0000001a]`}
                      >
                        <CardContent className="p-3.5 h-full relative">
                          <div className="flex items-start gap-2 mb-4">
                            {classItem.tags.map((tag, tagIndex) => (
                              <Badge
                                key={tagIndex}
                                className={`h-[19px] ${tag.color} text-white border-[#fffefe4c] text-[10.5px] [font-family:'Segoe_UI-Semibold',Helvetica] font-normal tracking-[0] leading-[14px]`}
                              >
                                {tag.label}
                              </Badge>
                            ))}
                          </div>

                          <div className="mb-2">
                            <div className="[font-family:'Segoe_UI-Semibold',Helvetica] font-normal text-white text-[12.3px] tracking-[0] leading-[17.5px] mb-1">
                              {classItem.title}
                            </div>
                            <div className="flex items-center gap-2 text-white opacity-90 text-[12.3px] [font-family:'Segoe_UI-Regular',Helvetica] font-normal tracking-[0] leading-[17.5px]">
                              <ClockIcon className="w-2.5 h-2.5" />
                              {classItem.time}
                            </div>
                          </div>

                          <div className="mb-4">
                            <div className="text-white opacity-80 text-[12.3px] [font-family:'Segoe_UI-Regular',Helvetica] font-normal tracking-[0] leading-[17.5px]">
                              {classItem.category}
                            </div>
                          </div>

                          <div className="flex items-center gap-4 text-white opacity-90 text-[10.5px] [font-family:'Segoe_UI-Regular',Helvetica] font-normal tracking-[0] leading-[14px]">
                            <div className="flex items-center gap-1">
                              <UsersIcon className="w-2.5 h-2.5" />
                              {classItem.instructor}
                            </div>
                            <div className="flex items-center gap-1">
                              <UsersIcon className="w-2.5 h-2.5" />
                              {classItem.students}
                            </div>
                          </div>

                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-4 right-4 w-[45px] h-[27px] text-white hover:bg-white/20"
                          >
                            <VideoIcon className="w-4 h-4" />
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          <aside className="flex w-[273.2px] h-[1086.85px] flex-col items-start gap-[13px] shadow-[0px_0px_20px_#3479ff40]">
            <Card className="w-full h-[92.6px] bg-[#fffefe99] border-[#fffefe4c] shadow-[0px_8px_10px_-6px_#0000001a,0px_20px_25px_-5px_#0000001a] backdrop-blur backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(8px)_brightness(100%)]">
              <CardContent className="p-[22px]">
                <div className="[font-family:'Segoe_UI-Bold',Helvetica] font-bold text-[#3479ff] text-[17.5px] tracking-[0] leading-[24.5px] mb-2">
                  Upcoming Classes
                </div>
                <div className="[font-family:'Segoe_UI-Regular',Helvetica] font-normal text-[#495565] text-[12.3px] leading-[17.5px] tracking-[0]">
                  10 classes scheduled
                </div>
              </CardContent>
            </Card>

            {upcomingClasses.map((classItem, index) => (
              <Card
                key={index}
                className="w-full bg-[#fffefeb2] border-[#fffefe66] shadow-[0px_4px_6px_-4px_#0000001a,0px_10px_15px_-3px_#0000001a] backdrop-blur backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(8px)_brightness(100%)] overflow-hidden"
              >
                <div
                  className={`w-full h-1 ${classItem.gradient} rounded-t-[12.75px]`}
                />
                <CardContent className="p-[18px]">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="text-[21px] leading-7 [font-family:'Segoe_UI_Emoji-Regular',Helvetica] font-normal">
                      {classItem.emoji}
                    </div>
                    <div className="flex-1">
                      <div className="[font-family:'Segoe_UI-Semibold',Helvetica] font-normal text-[#1d2838] text-[12.3px] leading-[17.5px] tracking-[0] mb-1">
                        {classItem.title}
                      </div>
                      <div className="[font-family:'Segoe_UI-Regular',Helvetica] font-normal text-[#495565] text-[10.5px] tracking-[0] leading-[14px]">
                        {classItem.category}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-1 text-[#495565] text-[10.5px] [font-family:'Segoe_UI-Semibold',Helvetica] font-normal tracking-[0] leading-[14px]">
                      <ClockIcon className="w-2.5 h-2.5" />
                      <span>{classItem.time}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[#495565] text-[10.5px] [font-family:'Segoe_UI-Regular',Helvetica] font-normal tracking-[0] leading-[14px]">
                      <ClockIcon className="w-2.5 h-2.5" />
                      <span>{classItem.duration}</span>
                      <span>•</span>
                      <span className="text-[#4f39f6] [font-family:'Segoe_UI-Semibold',Helvetica]">
                        {classItem.timeUntil}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <Badge
                      className={`h-[17px] ${classItem.tag.color} text-white text-[10.5px] [font-family:'Segoe_UI-Semibold',Helvetica] font-normal tracking-[0] leading-[14px]`}
                    >
                      {classItem.tag.label}
                    </Badge>
                    {classItem.frequency && (
                      <Badge
                        variant="outline"
                        className="h-[19px] border-[#d0d5db] text-[#495565] text-[10.5px] [font-family:'Segoe_UI-Semibold',Helvetica] font-normal tracking-[0] leading-[14px]"
                      >
                        {classItem.frequency}
                      </Badge>
                    )}
                  </div>

                  <div className="border-t border-gray-200 pt-3">
                    <Button className="w-full h-7 bg-gradient-to-r from-[#eef2ff] to-[#faf5ff] border border-[#c6d1ff] text-neutral-950 text-[10.5px] [font-family:'Segoe_UI-Semibold',Helvetica] font-normal tracking-[0] leading-[14px] hover:bg-gradient-to-r hover:from-[#eef2ff] hover:to-[#faf5ff]">
                      <VideoIcon className="w-3.5 h-3.5 mr-2" />
                      Join Meeting
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </aside>
        </main>
      </div>

      <img
        className="absolute top-[35px] left-[19px] w-[262px] h-[68px]"
        alt="Group"
        src="/group-1321317802-4.png"
      />

      <nav className="absolute top-[137px] left-[59px] flex flex-col items-start gap-[42px]">
        <div className="flex flex-col items-start gap-[43px] w-full">
          <div className="flex items-center gap-[17px] w-full">
            <img className="w-[26px] h-[26px]" alt="Home" src="/home.svg" />
            <div className="font-extrabold text-white text-lg whitespace-nowrap [font-family:'Nunito',Helvetica] tracking-[0] leading-[19.6px]">
              Dashboard
            </div>
          </div>

          <div className="flex items-center gap-[17px] w-full">
            <img
              className="w-[26px] h-[26px]"
              alt="Profile"
              src="/profile-7.svg"
            />
            <div className="font-extrabold text-white text-lg whitespace-nowrap [font-family:'Nunito',Helvetica] tracking-[0] leading-[19.6px]">
              Profile Settings
            </div>
          </div>

          <div className="flex items-center gap-[17px] w-full">
            <img className="w-[26px] h-[26px]" alt="Folder" src="/folder.svg" />
            <div className="font-extrabold text-white text-lg whitespace-nowrap [font-family:'Nunito',Helvetica] tracking-[0] leading-[19.6px]">
              My Course
            </div>
          </div>

          <div className="flex items-center gap-[17px] w-full">
            <img
              className="w-[26px] h-[26px]"
              alt="Recommended"
              src="/recommended.svg"
            />
            <div className="font-extrabold text-[#13377c] text-lg [font-family:'Nunito',Helvetica] tracking-[0] leading-[19.6px]">
              Upload Content
            </div>
          </div>

          <div className="flex items-center gap-[17px] w-full">
            <img
              className="w-[26px] h-[26px]"
              alt="Presentation"
              src="/presentation-10.png"
            />
            <div className="font-extrabold text-white text-lg [font-family:'Nunito',Helvetica] tracking-[0] leading-[19.6px]">
              Live Classes <br />
              Scheduler
            </div>
          </div>

          <div className="flex items-center gap-[17px] w-full">
            <img
              className="w-[26px] h-[26px]"
              alt="Test paper"
              src="/test-paper.svg"
            />
            <div className="font-extrabold text-white text-lg [font-family:'Nunito',Helvetica] tracking-[0] leading-[19.6px]">
              Test & Assessment
              <br />
              Manager
            </div>
          </div>

          <div className="flex items-center gap-[17px] w-full">
            <img
              className="w-[26px] h-[26px]"
              alt="Certificate"
              src="/certificate-3.png"
            />
            <div className="font-extrabold text-white text-lg whitespace-nowrap [font-family:'Nunito',Helvetica] tracking-[0] leading-[19.6px]">
              FDP & Certificates
            </div>
          </div>

          <div className="flex items-center gap-[17px] w-full">
            <img className="w-6 h-6" alt="Leaderboard" src="/leaderboard.svg" />
            <div className="font-extrabold text-white text-lg [font-family:'Nunito',Helvetica] tracking-[0] leading-[19.6px]">
              Student <br />
              Performance
            </div>
          </div>

          <div className="flex items-center gap-[17px] w-full">
            <img
              className="w-[26px] h-[26px]"
              alt="Rewards"
              src="/rewards.svg"
            />
            <div className="font-extrabold text-white text-lg whitespace-nowrap [font-family:'Nunito',Helvetica] tracking-[0] leading-[19.6px]">
              Badges & Rewards
            </div>
          </div>

          <div className="flex items-center gap-[17px] w-full">
            <img className="w-[26px] h-[26px]" alt="Home" src="/home-2.svg" />
            <div className="font-extrabold text-white text-lg whitespace-nowrap [font-family:'Nunito',Helvetica] tracking-[0] leading-[19.6px]">
              Clubs & Community
            </div>
          </div>

          <div className="flex items-center gap-[17px] w-full">
            <div className="w-[26px] h-[26px] relative">
              <div className="absolute top-0.5 left-1 w-[18px] h-[22px]">
                <img
                  className="absolute w-full h-full top-[-2.31%] left-[-2.71%]"
                  alt="Notification"
                  src="/notification.svg"
                />
              </div>
            </div>
            <div className="font-extrabold text-white text-lg whitespace-nowrap [font-family:'Nunito',Helvetica] tracking-[0] leading-[19.6px]">
              Notifications
            </div>
          </div>

          <div className="flex items-center gap-[17px] w-full">
            <img
              className="w-[26px] h-[26px]"
              alt="Referral"
              src="/referral.svg"
            />
            <div className="font-extrabold text-white text-lg whitespace-nowrap [font-family:'Nunito',Helvetica] tracking-[0] leading-[19.6px]">
              Referrals Program
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <img className="w-7 h-7" alt="Sign out" src="/signout.svg" />
          <div className="[font-family:'Poppins',Helvetica] font-semibold text-white text-xl tracking-[0.40px] leading-[normal]">
            Log Out
          </div>
        </div>
      </nav>
    </div>
  );
};
