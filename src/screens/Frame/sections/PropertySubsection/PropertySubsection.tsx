import { StarIcon, TargetIcon } from "lucide-react";
import React from "react";
import { Badge } from "../../../../components/ui/badge";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../../components/ui/tabs";

const navigationItems = [
  { icon: "home", label: "Dashboard", active: false },
  { icon: "profile", label: "Profile Settings", active: false },
  { icon: "folder", label: "My Course", active: false },
  { icon: "presentation", label: "Live Classes", active: false },
  { icon: "test-paper", label: "Test & Assessment", active: false },
  { icon: "certificate", label: "Certificates", active: false },
  { icon: "leaderboard", label: "Leaderboard", active: true },
  { icon: "rewards", label: "Badges & Rewards", active: false },
  { icon: "home", label: "Clubs & Community", active: false },
  { icon: "user", label: "Raise a Doubt", active: false },
  { icon: "referral", label: "Referrals Program", active: false },
];

const leaderboardData = [
  {
    rank: 1,
    name: "Emma Thompson",
    points: "2,400",
    avatar: "",
    badges: ["Streak Master", "Top Performer"],
    rankColor: "#fcc601",
    icon: "cup",
    isCurrentUser: false,
  },
  {
    rank: 2,
    name: "Emma Thompson",
    points: "2,380",
    avatar: "",
    badges: ["Streak Master", "Top Performer"],
    rankColor: "#8c8e95",
    icon: "medal",
    isCurrentUser: false,
  },
  {
    rank: 3,
    name: "Emma Thompson",
    points: "2,300",
    avatar: "",
    badges: ["Streak Master", "Best Performer"],
    rankColor: "#df860a",
    icon: "badge",
    isCurrentUser: false,
  },
  {
    rank: 4,
    name: "Emma Thompson",
    points: "2,250",
    avatar: "",
    badges: ["Streak Master", "Good Performer"],
    rankColor: null,
    icon: null,
    isCurrentUser: true,
  },
  {
    rank: 5,
    name: "Emma Thompson",
    points: "2,400",
    avatar: "",
    badges: ["Streak Master", "Top Performer"],
    rankColor: null,
    icon: "cup",
    isCurrentUser: false,
  },
  {
    rank: 6,
    name: "Emma Thompson",
    points: "2,400",
    avatar: "",
    badges: ["Streak Master", "Top Performer"],
    rankColor: "#fcc601",
    icon: "cup",
    isCurrentUser: false,
  },
  {
    rank: 7,
    name: "Emma Thompson",
    points: "2,400",
    avatar: "",
    badges: ["Streak Master", "Top Performer"],
    rankColor: "#fcc601",
    icon: "cup",
    isCurrentUser: false,
  },
];

export const PropertySubsection = (): JSX.Element => {
  return (
    <div className="w-full h-full bg-[#3479ff] relative">
      <div className="w-full max-w-[1605px] h-full mx-auto bg-white shadow-[0px_0px_29px_#00000075] relative">
        <div className="relative w-full h-full pt-[46px]">
          <header className="flex w-full items-center justify-between px-8 py-0 mb-[71px]">
            <div className="flex items-center gap-[57px]">
              <img className="w-[25px] h-[25px]" alt="Component" />
              <h1 className="[font-family:'Nunito',Helvetica] font-bold text-[#13377c] text-2xl tracking-[0] leading-[normal]">
                Leaderboard
              </h1>
            </div>

            <div className="flex items-center gap-[23px]">
              <div className="w-6 h-6">
                <div className="w-[17px] h-5 mt-0.5 ml-1 bg-[100%_100%]" />
              </div>
              <div className="w-14 h-14 bg-cover bg-[50%_50%]">
                <div className="h-14 rounded-[28px] border-4 border-solid border-[#3479ff99]" />
              </div>
              <img className="w-6 h-6" alt="Iconly light outline" />
            </div>
          </header>

          <main className="flex flex-col w-full max-w-[1419px] items-center gap-[29px] mx-auto px-4">
            <Card className="w-full rounded-[25px] border-0 shadow-none">
              <CardContent className="flex flex-col items-center justify-center gap-2.5 p-[25px]">
                <div className="flex items-center justify-between w-full">
                  <div className="w-[588px]">
                    <h2 className="[font-family:'Nunito',Helvetica] font-bold text-[#13377c] text-4xl tracking-[0] leading-[26px] whitespace-nowrap mb-6">
                      Leaderboards
                    </h2>
                    <p className="text-[25px] [font-family:'Poppins',Helvetica] font-normal text-object-black-60 tracking-[0] leading-6">
                      Track Your Progress and Compete with others
                    </p>
                  </div>

                  <Select defaultValue="weekly">
                    <SelectTrigger className="w-[267px] h-[60px] px-[18px] py-2.5 rounded-[3px] border-2 border-[#eaeaea]">
                      <SelectValue className="[font-family:'Poppins',Helvetica] font-normal text-object-black-90 text-[25px] tracking-[0] leading-[21px]" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col w-full max-w-[1381px] items-start gap-10">
              <Tabs defaultValue="global" className="w-full">
                <TabsList className="w-[661px] h-[60px] p-2.5 bg-white rounded-[21px] shadow-[0px_0px_20px_#3479ff40] gap-[100px]">
                  <TabsTrigger
                    value="global"
                    className="w-[186px] h-auto p-2.5 bg-[#007fff59] rounded-[20px] data-[state=active]:bg-[#007fff59] data-[state=active]:text-[#083a50]"
                  >
                    <span className="font-bold text-[#083a50] text-2xl [font-family:'Nunito',Helvetica] tracking-[0] leading-[19.6px]">
                      Global
                    </span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="friends"
                    className="h-auto p-2.5 bg-transparent data-[state=active]:bg-[#007fff59]"
                  >
                    <span className="font-bold text-[#888888] text-2xl [font-family:'Nunito',Helvetica] tracking-[0] leading-[19.6px]">
                      Friends
                    </span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="club"
                    className="h-auto p-2.5 bg-transparent data-[state=active]:bg-[#007fff59]"
                  >
                    <span className="font-bold text-[#888888] text-2xl [font-family:'Nunito',Helvetica] tracking-[0] leading-[19.6px]">
                      Club
                    </span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="global" className="mt-10">
                  <div className="flex flex-col items-start gap-2.5 p-2.5 w-full">
                    <div className="flex flex-col items-start gap-[33px] w-full">
                      {leaderboardData.map((entry, index) => (
                        <Card
                          key={index}
                          className={`w-full h-[123px] rounded-[25px] overflow-hidden shadow-[0px_0px_20px_#3d57cf40] border-0 ${
                            entry.isCurrentUser
                              ? "bg-[#3479ff14] border border-solid border-[#3479ff]"
                              : "bg-white"
                          }`}
                        >
                          <CardContent className="relative p-0 h-full">
                            {entry.rankColor && (
                              <div
                                className="absolute w-[18px] h-[123px] top-0 left-0 rounded-[20px_0px_0px_25px]"
                                style={{ backgroundColor: entry.rankColor }}
                              />
                            )}

                            <div className="flex w-full items-end justify-between px-[18px] py-[22px] h-full">
                              <div className="flex items-center gap-[89px]">
                                <div className="flex items-center gap-7">
                                  {entry.icon ? (
                                    <img
                                      className="w-[50px] h-[50px]"
                                      alt={entry.icon}
                                    />
                                  ) : (
                                    <div className="w-[50px] h-[50px] flex items-center justify-center">
                                      <span className="[font-family:'Nunito',Helvetica] font-extrabold text-[#51565e] text-[40px] tracking-[0] leading-[19.6px]">
                                        #{entry.rank}
                                      </span>
                                    </div>
                                  )}

                                  <img
                                    className="w-[79px] h-[79px] object-cover rounded-full"
                                    alt="User avatar"
                                  />

                                  <span className="[font-family:'Nunito',Helvetica] font-bold text-black text-[25px] tracking-[0] leading-[19.6px] whitespace-nowrap">
                                    {entry.name}
                                  </span>
                                </div>

                                <div className="flex items-start gap-[15px]">
                                  {entry.badges.map((badge, badgeIndex) => (
                                    <Badge
                                      key={badgeIndex}
                                      className="w-36 h-7 flex items-center justify-center gap-0.5 px-1 py-3 bg-[#007fff4c] rounded-[25px] hover:bg-[#007fff4c]"
                                    >
                                      {badgeIndex === 0 ? (
                                        <TargetIcon className="w-5 h-5" />
                                      ) : (
                                        <StarIcon className="w-5 h-5" />
                                      )}
                                      <span className="[font-family:'Inter',Helvetica] font-semibold text-[#13377c] text-xs tracking-[0] leading-[normal]">
                                        {badge}
                                      </span>
                                    </Badge>
                                  ))}
                                </div>
                              </div>

                              <div className="flex flex-col w-[67px] items-end justify-center gap-[9px]">
                                <span className="[font-family:'Nunito',Helvetica] font-bold text-black text-[25px] tracking-[0] leading-[19.6px]">
                                  {entry.points}
                                </span>
                                <span className="[font-family:'Nunito',Helvetica] font-medium text-[#5f5f5f] text-sm tracking-[0] leading-[19.6px] whitespace-nowrap">
                                  Points
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="friends" className="mt-10">
                  <div className="flex flex-col items-center justify-center p-8">
                    <p className="text-gray-500">Friends leaderboard content</p>
                  </div>
                </TabsContent>

                <TabsContent value="club" className="mt-10">
                  <div className="flex flex-col items-center justify-center p-8">
                    <p className="text-gray-500">Club leaderboard content</p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </div>

      <img
        className="absolute w-[262px] h-[68px] top-[35px] left-[19px]"
        alt="Frame"
      />

      <nav className="flex flex-col items-start gap-[90px] absolute top-[137px] left-[59px]">
        <div className="flex flex-col items-start gap-[43px] w-full">
          {navigationItems.map((item, index) => (
            <Button
              key={index}
              variant="ghost"
              className={`flex items-center gap-[17px] w-full justify-start p-0 h-auto ${
                item.active ? "text-[#13377c]" : "text-white"
              } hover:bg-transparent`}
            >
              <img className="w-[26px] h-[26px]" alt={item.icon} />
              <span className="font-extrabold text-lg [font-family:'Nunito',Helvetica] tracking-[0] leading-[19.6px] whitespace-nowrap">
                {item.label}
              </span>
            </Button>
          ))}
        </div>

        <Button
          variant="ghost"
          className="flex items-center gap-2 text-white hover:bg-transparent p-0 h-auto"
        >
          <img className="w-7 h-7" alt="Sign out" />
          <span className="[font-family:'Poppins',Helvetica] font-semibold text-xl tracking-[0.40px] leading-[normal]">
            Log Out
          </span>
        </Button>
      </nav>
    </div>
  );
};
