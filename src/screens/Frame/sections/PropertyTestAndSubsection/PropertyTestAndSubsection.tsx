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

const statsCards = [
  {
    title: "Total Tests",
    value: "8",
    icon: BookOpenIcon,
    progress: 26,
    total: 100,
    achievements: "26 Achievements unlocked",
  },
  {
    title: "Complete",
    value: "4",
    icon: FileTextIcon,
    progressPercent: 50,
    remaining: "4 tests remaining",
  },
  {
    title: "Average Score",
    value: "86%",
    icon: TrophyIcon,
    hasChart: true,
  },
];

const chartData = [
  { name: "Figma", value: 78 },
  { name: "Sketch", value: 86 },
  { name: "XD", value: 95 },
  { name: "Photoshop", value: 98 },
  { name: "Illustrator", value: 92 },
  { name: "AfterEffect", value: 59 },
];

const testCards = [
  {
    title: "Advanced Javascript Concepts",
    category: "Programming",
    duration: "90 Minutes",
    questions: "30 Questions",
    dueDate: "Due: Aug 15, 07:30 Pm",
    status: "upcoming",
    buttonText: "Start Test",
  },
  {
    title: "Advanced Javascript Concepts",
    category: "Programming",
    duration: "90 Minutes",
    questions: "30 Questions",
    dueDate: "Due: Aug 15, 07:30 Pm",
    status: "upcoming",
    buttonText: "Start Test",
  },
  {
    title: "Advanced Javascript Concepts",
    category: "Programming",
    duration: "90 Minutes",
    questions: "30 Questions",
    status: "completed",
    score: "85/100",
    percentage: "85%",
    buttonText: "View Result",
  },
  {
    title: "Advanced Javascript Concepts",
    category: "Programming",
    duration: "90 Minutes",
    questions: "30 Questions",
    dueDate: "Due: Aug 15, 07:30 Pm",
    status: "upcoming",
    buttonText: "Start Test",
  },
  {
    title: "Advanced Javascript Concepts",
    category: "Programming",
    duration: "90 Minutes",
    questions: "30 Questions",
    dueDate: "Due: Aug 15, 07:30 Pm",
    status: "upcoming",
    buttonText: "Start Test",
  },
  {
    title: "Advanced Javascript Concepts",
    category: "Programming",
    duration: "90 Minutes",
    questions: "30 Questions",
    dueDate: "Due: Aug 15, 07:30 Pm",
    status: "upcoming",
    buttonText: "Start Test",
  },
];

const navigationItems = [
  { icon: HomeIcon, label: "Dashboard", active: false },
  { icon: UserIcon, label: "Profile Settings", active: false },
  { icon: FolderIcon, label: "My Course", active: false },
  { icon: PresentationIcon, label: "Live Classes", active: false },
  { icon: FileTextIcon, label: "Test & Assessment", active: true },
  { icon: AwardIcon, label: "Certificates", active: false },
  { icon: TrophyIcon, label: "Leaderboard", active: false },
  { icon: AwardIcon, label: "Badges & Rewards", active: false },
  { icon: UsersIcon, label: "Clubs & Community", active: false },
  { icon: HelpCircleIcon, label: "Raise a Doubt", active: false },
  { icon: ShareIcon, label: "Referrals Program", active: false },
];

export const PropertyTestAndSubsection = (): JSX.Element => {
  return (
    <div className="w-full h-full bg-[#3479ff] relative">
      <div className="w-full max-w-[1605px] h-full mx-auto bg-white shadow-[0px_0px_29px_#00000075] relative">
        <div className="w-full h-full relative">
          <header className="flex w-full items-center justify-between px-8 py-6">
            <div className="flex items-center gap-[57px]">
              <div className="w-[25px] h-[25px] bg-gray-200 rounded" />
              <div className="[font-family:'Nunito',Helvetica] font-bold text-[#13377c] text-2xl tracking-[0] leading-[normal]">
                My Course
              </div>
            </div>

            <div className="flex items-center gap-[23px]">
              <div className="w-6 h-6 bg-gray-200 rounded" />
              <div className="w-14 h-14 rounded-[28px] border-4 border-solid border-[#3479ff99] bg-gray-200" />
              <div className="w-6 h-6 bg-gray-200 rounded" />
            </div>
          </header>

          <main className="flex flex-col w-full items-center justify-center gap-9 px-8 pb-8">
            <div className="flex w-full items-center gap-7">
              {statsCards.map((card, index) => (
                <Card
                  key={index}
                  className="flex-1 h-[253px] bg-white rounded-[25px] shadow-[0px_0px_20px_#3d57cf40] border-0"
                >
                  <CardContent className="p-0 h-full relative">
                    {card.hasChart ? (
                      <>
                        <div className="flex flex-col items-start gap-3 absolute top-5 left-[27px]">
                          <div className="flex items-center gap-[194px]">
                            <div className="[font-family:'Nunito',Helvetica] font-bold text-[#13377c] text-[25px] tracking-[0] leading-[normal]">
                              {card.title}
                            </div>
                            <card.icon className="w-[25px] h-[25px] text-[#3479ff]" />
                          </div>
                          <div className="[font-family:'Nunito',Helvetica] font-bold text-[#3479ff] text-[25px] tracking-[0] leading-[normal]">
                            {card.value}
                          </div>
                        </div>

                        <div className="absolute top-28 left-[47px] w-[358px]">
                          <div className="flex items-center h-[113px]">
                            <div className="flex flex-col items-end justify-between px-1 py-0 h-full">
                              {[100, 80, 60, 40, 20, 0].map((value) => (
                                <div
                                  key={value}
                                  className="[font-family:'Inter',Helvetica] font-normal text-[#000000b2] text-xs leading-[normal] tracking-[0]"
                                >
                                  {value}
                                </div>
                              ))}
                            </div>

                            <div className="flex-1 h-[113px] relative ml-4">
                              <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 gap-0">
                                {Array.from({ length: 36 }).map((_, i) => (
                                  <div
                                    key={i}
                                    className="border-r border-b border-gray-200"
                                  />
                                ))}
                              </div>

                              <div className="absolute inset-0 flex items-end justify-between px-7 pb-2">
                                {chartData.map((point, i) => (
                                  <div key={i} className="relative">
                                    <div className="w-4 h-4 bg-[#3479ff] rounded-lg opacity-25 absolute -top-2 -left-2" />
                                    <div className="w-2 h-2 bg-[#3479ff] rounded border border-solid border-white absolute -top-1 -left-1" />
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-start justify-between mt-2 px-7">
                            {chartData.map((item) => (
                              <div
                                key={item.name}
                                className="flex-1 text-center"
                              >
                                <div className="[font-family:'Inter',Helvetica] font-semibold text-[#000000b2] text-[8px] tracking-[0] leading-[normal]">
                                  {item.name}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    ) : card.progress ? (
                      <>
                        <div className="absolute w-[139px] h-[139px] top-[85px] left-[280px]">
                          <div className="relative w-[158px] h-[158px] -top-7 -left-7 rounded-[79px] border-[19px] border-solid border-[#ccd5ff]">
                            <div className="absolute top-11 left-[18px] [font-family:'Nunito',Helvetica] font-bold text-[#3479ff] text-[25px] tracking-[0] leading-[normal]">
                              {card.progress}/{card.total}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col items-start gap-[60px] absolute top-5 left-[27px]">
                          <div className="flex flex-col items-start gap-3">
                            <div className="flex items-center gap-[238px]">
                              <div className="[font-family:'Nunito',Helvetica] font-bold text-[#13377c] text-[25px] tracking-[0] leading-[normal]">
                                {card.title}
                              </div>
                              <card.icon className="w-6 h-6 text-[#3479ff]" />
                            </div>
                            <div className="[font-family:'Nunito',Helvetica] font-bold text-[#3479ff] text-[25px] leading-[normal] tracking-[0]">
                              {card.value}
                            </div>
                          </div>

                          <div className="flex items-center gap-[9px]">
                            <div className="[font-family:'Poppins',Helvetica] font-bold text-[#5f5f5f] text-[25px] leading-[9.7px] tracking-[0]">
                              {card.progress}
                            </div>
                            <div className="[font-family:'Poppins',Helvetica] font-normal text-river-bed text-xl tracking-[0] leading-[23px]">
                              {card.achievements}
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex flex-col items-start gap-3 absolute top-5 left-[27px]">
                          <div className="flex items-center gap-[254px]">
                            <div className="[font-family:'Nunito',Helvetica] font-bold text-[#13377c] text-[25px] tracking-[0] leading-[normal]">
                              {card.title}
                            </div>
                            <card.icon className="w-6 h-6 text-[#3479ff]" />
                          </div>
                          <div className="[font-family:'Nunito',Helvetica] font-bold text-[#3479ff] text-[25px] leading-[normal] tracking-[0]">
                            {card.value}
                          </div>
                        </div>

                        <div className="flex flex-col items-start gap-[7px] absolute top-[124px] left-[27px] w-[399px]">
                          <div className="flex items-center justify-between w-full">
                            <div className="[font-family:'Nunito',Helvetica] font-medium text-[#9e9e9e] text-base tracking-[0] leading-[normal]">
                              Progress
                            </div>
                            <div className="[font-family:'Nunito',Helvetica] font-medium text-[#9e9e9e] text-base tracking-[0] leading-[normal]">
                              {card.progressPercent}%
                            </div>
                          </div>
                          <Progress
                            value={card.progressPercent}
                            className="w-full h-3.5 bg-[#d9d9d9]"
                          />
                          <div className="[font-family:'Nunito',Helvetica] font-medium text-[#9e9e9e] text-base tracking-[0] leading-[normal]">
                            {card.remaining}
                          </div>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="w-full bg-white rounded-[21px] shadow-[0px_0px_20px_#3479ff40] border-0">
              <CardContent className="flex items-center gap-[337px] p-2.5">
                <div className="w-[278px] flex items-center justify-center gap-2.5 p-2.5 bg-[#007fff59] rounded-[20px]">
                  <div className="flex items-center gap-4">
                    <div className="font-bold text-[#083a50] text-2xl [font-family:'Nunito',Helvetica] tracking-[0] leading-[19.6px]">
                      All
                    </div>
                    <Badge className="bg-[#fff8f8] text-[#083a50] font-bold text-[15px] [font-family:'Nunito',Helvetica] rounded-[100px] px-0.5 py-0 h-5 w-[19px] flex items-center justify-center">
                      8
                    </Badge>
                  </div>
                </div>
                <div className="font-bold text-[#888888] text-2xl [font-family:'Nunito',Helvetica] tracking-[0] leading-[19.6px]">
                  Completed&nbsp;&nbsp;4
                </div>
                <div className="font-bold text-[#888888] text-2xl [font-family:'Nunito',Helvetica] tracking-[0] leading-[19.6px]">
                  Upcoming&nbsp;&nbsp;4
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col items-center gap-[34px] w-full">
              <div className="grid grid-cols-3 gap-10 w-full">
                {testCards.slice(0, 3).map((test, index) => (
                  <Card
                    key={index}
                    className="w-[430px] h-80 bg-white rounded-[25px] shadow-[0px_0px_20px_#3479ff40] border-0"
                  >
                    <CardContent className="flex flex-col items-center justify-center gap-[34px] p-0 h-full relative top-7">
                      <div className="flex flex-col items-start gap-9 w-[343px]">
                        <div className="flex flex-col items-start gap-[15px] w-full">
                          {test.status === "completed" ? (
                            <div className="flex items-center justify-center gap-[29px] w-full">
                              <div className="w-[258px] [font-family:'Inter',Helvetica] font-medium text-[#202020] text-[25px] tracking-[0] leading-[normal]">
                                {test.title}
                              </div>
                              <div className="text-right">
                                <div className="[font-family:'Inter',Helvetica] font-semibold text-[#007246] text-base tracking-[0] leading-[normal]">
                                  {test.score}
                                </div>
                                <div className="[font-family:'Inter',Helvetica] font-medium text-[#7e7e7e] text-sm tracking-[0] leading-[normal]">
                                  {test.percentage}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="[font-family:'Inter',Helvetica] font-medium text-[#202020] text-[25px] tracking-[0] leading-[normal]">
                              {test.title}
                            </div>
                          )}

                          <div className="flex items-start gap-[15px]">
                            <Badge className="bg-[#75a4ff87] text-[#083a50] font-semibold text-[10px] [font-family:'Inter',Helvetica] rounded-[25px] h-[18px] px-1 py-3">
                              {test.category}
                            </Badge>
                            {test.status === "completed" && (
                              <Badge className="bg-[#99ffc854] text-[#007246] font-semibold text-[10px] [font-family:'Inter',Helvetica] rounded-[25px] h-[18px] px-1 py-3 flex items-center gap-0.5">
                                <FileTextIcon className="w-3 h-3" />
                                Completed
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col items-start gap-2.5 w-[326px]">
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-[3px]">
                              <ClockIcon className="w-6 h-6 text-[#7e7e7e]" />
                              <div className="[font-family:'Inter',Helvetica] font-medium text-[#7e7e7e] text-sm tracking-[0] leading-[normal]">
                                {test.duration}
                              </div>
                            </div>
                            <div className="flex items-center gap-[7px]">
                              <BookOpenIcon className="w-[15px] h-[15px] text-[#7e7e7e]" />
                              <div className="[font-family:'Inter',Helvetica] font-medium text-[#7e7e7e] text-sm tracking-[0] leading-[normal]">
                                {test.questions}
                              </div>
                            </div>
                          </div>
                          {test.dueDate && (
                            <div className="flex items-center gap-1.5">
                              <CalendarIcon className="w-5 h-5 text-[#7e7e7e]" />
                              <div className="[font-family:'Inter',Helvetica] font-medium text-[#7e7e7e] text-sm tracking-[0] leading-[normal]">
                                {test.dueDate}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <Button
                        className={`w-[333px] h-[37px] font-bold text-base [font-family:'Inter',Helvetica] tracking-[0] leading-[normal] ${
                          test.status === "completed"
                            ? "bg-transparent border border-solid border-[#0072469c] text-[#007246b2] hover:bg-[#007246]/10"
                            : "bg-[#3479ff] text-white hover:bg-[#3479ff]/90"
                        } rounded-lg h-auto`}
                      >
                        {test.buttonText}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-10 w-full">
                {testCards.slice(3, 6).map((test, index) => (
                  <Card
                    key={index + 3}
                    className="w-[430px] h-80 bg-white rounded-[25px] shadow-[0px_0px_20px_#3479ff40] border-0"
                  >
                    <CardContent className="flex flex-col items-center justify-center gap-[34px] p-0 h-full relative top-7">
                      <div className="flex flex-col items-start gap-9 w-[343px]">
                        <div className="flex flex-col items-start gap-[15px] w-full">
                          <div className="[font-family:'Inter',Helvetica] font-medium text-[#202020] text-[25px] tracking-[0] leading-[normal]">
                            {test.title}
                          </div>

                          <Badge className="bg-[#75a4ff87] text-[#083a50] font-semibold text-[10px] [font-family:'Inter',Helvetica] rounded-[25px] h-[18px] px-1 py-3">
                            {test.category}
                          </Badge>
                        </div>

                        <div className="flex flex-col items-start gap-2.5 w-[326px]">
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-[3px]">
                              <ClockIcon className="w-6 h-6 text-[#7e7e7e]" />
                              <div className="[font-family:'Inter',Helvetica] font-medium text-[#7e7e7e] text-sm tracking-[0] leading-[normal]">
                                {test.duration}
                              </div>
                            </div>
                            <div className="flex items-center gap-[7px]">
                              <BookOpenIcon className="w-[15px] h-[15px] text-[#7e7e7e]" />
                              <div className="[font-family:'Inter',Helvetica] font-medium text-[#7e7e7e] text-sm tracking-[0] leading-[normal]">
                                {test.questions}
                              </div>
                            </div>
                          </div>
                          {test.dueDate && (
                            <div className="flex items-center gap-1.5">
                              <CalendarIcon className="w-5 h-5 text-[#7e7e7e]" />
                              <div className="[font-family:'Inter',Helvetica] font-medium text-[#7e7e7e] text-sm tracking-[0] leading-[normal]">
                                {test.dueDate}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <Button className="w-[333px] h-[37px] bg-[#3479ff] text-white font-bold text-base [font-family:'Inter',Helvetica] tracking-[0] leading-[normal] hover:bg-[#3479ff]/90 rounded-[25px] h-auto">
                        {test.buttonText}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>

      <div className="absolute w-[262px] h-[68px] top-[35px] left-[19px] bg-gray-200 rounded" />

      <nav className="flex flex-col items-start gap-[90px] absolute top-[137px] left-[59px]">
        <div className="flex flex-col items-start gap-[43px]">
          {navigationItems.map((item, index) => (
            <div key={index} className="flex items-center gap-[17px]">
              <item.icon className="w-[26px] h-[26px] text-white" />
              <div
                className={`font-extrabold text-lg [font-family:'Nunito',Helvetica] tracking-[0] leading-[19.6px] whitespace-nowrap ${
                  item.active ? "text-[#13377c]" : "text-white"
                }`}
              >
                {item.label}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <LogOutIcon className="w-7 h-7 text-white" />
          <div className="[font-family:'Poppins',Helvetica] font-semibold text-white text-xl tracking-[0.40px] leading-[normal]">
            Log Out
          </div>
        </div>
      </nav>
    </div>
  );
};
