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

// ------------------ NAVIGATION ITEMS ------------------ //
const navigationItems = [
  { icon: "/icons/home.png", label: "Dashboard", active: false },
  { icon: "/icons/profile.png", label: "Profile Settings", active: false },
  { icon: "/icons/folder.png", label: "My Course", active: false },
  { icon: "/icons/presentation.png", label: "Live Classes", active: false },
  { icon: "/icons/test-paper.png", label: "Test & Assessment", active: false },
  { icon: "/icons/certificate.png", label: "Certificates", active: false },
  { icon: "/icons/leaderboard.png", label: "Leaderboard", active: true },
  { icon: "/icons/rewards.png", label: "Badges & Rewards", active: false },
  { icon: "/icons/community.png", label: "Clubs & Community", active: false },
  { icon: "/icons/user.png", label: "Raise a Doubt", active: false },
  { icon: "/icons/referral.png", label: "Referrals Program", active: false },
];

// ------------------ LEADERBOARD DATA ------------------ //
const leaderboardData = [
  {
    rank: 1,
    name: "Emma Thompson",
    points: "2,400",
    avatar: "/image (45).jpg",
    badges: ["Streak Master", "Top Performer"],
    rankColor: "#fcc601",
    icon: "/Cup.png",
    isCurrentUser: false,
  },
  {
    rank: 2,
    name: "Emma Thompson",
    points: "2,380",
    avatar: "/image (45).jpg",
    badges: ["Streak Master", "Top Performer"],
    rankColor: "#8c8e95",
    icon: "/second.png",
    isCurrentUser: false,
  },
  {
    rank: 3,
    name: "Emma Thompson",
    points: "2,300",
    avatar: "/image (45).jpg",
    badges: ["Streak Master", "Best Performer"],
    rankColor: "#df860a",
    icon: "/badge.png",
    isCurrentUser: false,
  },
  {
    rank: 4,
    name: "Emma Thompson",
    points: "2,250",
    avatar: "/image (126).png",
    badges: ["Streak Master", "Good Performer"],
    rankColor: null,
    icon: null,
    isCurrentUser: true,
  },
];

export const PropertySubsection = (): JSX.Element => {
  return (
    <div className="w-full h-full bg-[#3479ff] relative">
      <div className="w-full max-w-[1605px] h-full mx-auto bg-white shadow-[0px_0px_29px_#00000075] relative">
        <div className="relative w-full h-full pt-[46px]">
          {/* ---------------- HEADER ---------------- */}
          {/* <header className="flex w-full items-center justify-between px-8 py-0 mb-[71px]">
            <div className="flex items-center gap-[57px]">
              <img
                className="w-[30px] h-[30px]"
                src="/icons/leaderboard.png"
                alt="Leaderboard Icon"
              />
              <h1 className="font-bold text-[#13377c] text-2xl leading-normal">
                Leaderboard
              </h1>
            </div>

            <div className="flex items-center gap-[23px]">
              <img
                className="w-6 h-6"
                src="/icons/notification.png"
                alt="Notification"
              />
              <div className="w-14 h-14">
                <img
                  className="h-14 w-14 rounded-full border-4 border-solid border-[#3479ff99]"
                  src="/profile.png"
                  alt="Profile"
                />
              </div>
            </div>
          </header> */}

          {/* ---------------- MAIN CONTENT ---------------- */}
          <main className="flex flex-col w-full max-w-[1419px] items-center gap-[29px] mx-auto px-4">
            {/* ----------- TITLE + FILTER ----------- */}
            <Card className="w-full rounded-[25px] border-0 shadow-none">
              <CardContent className="flex flex-col items-center justify-center gap-2.5 p-[25px]">
                <div className="flex items-center justify-between w-full">
                  <div className="w-[588px]">
                    <h2 className="font-bold text-[#13377c] text-4xl leading-[40px] mb-6">
                      Leaderboards
                    </h2>
                    <p className="text-[20px] text-[#6b7280]">
                      Track Your Progress and Compete with others
                    </p>
                  </div>

                  <Select defaultValue="weekly">
                    <SelectTrigger className="w-[267px] h-[60px] px-[18px] py-2.5 rounded-[3px] border-2 border-[#eaeaea]">
                      <SelectValue className="text-[20px] font-medium" />
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

            {/* ----------- TABS SECTION ----------- */}
            <div className="flex flex-col w-full max-w-[1381px] items-start gap-10">
              <Tabs defaultValue="global" className="w-full">
                <TabsList className="w-[661px] h-[60px] p-2.5 bg-white rounded-[21px] shadow-[0px_0px_20px_#3479ff40] gap-[100px]">
                  <TabsTrigger
                    value="global"
                    className="w-[186px] p-2.5 rounded-[20px] data-[state=active]:bg-[#007fff59] data-[state=active]:text-[#083a50]"
                  >
                    <span className="font-bold text-[#083a50] text-2xl">
                      Global
                    </span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="friends"
                    className="p-2.5 data-[state=active]:bg-[#007fff59]"
                  >
                    <span className="font-bold text-[#888888] text-2xl">
                      Friends
                    </span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="club"
                    className="p-2.5 data-[state=active]:bg-[#007fff59]"
                  >
                    <span className="font-bold text-[#888888] text-2xl">
                      Club
                    </span>
                  </TabsTrigger>
                </TabsList>

                {/* ----------- GLOBAL TAB CONTENT ----------- */}
                <TabsContent value="global" className="mt-10">
                  <div className="flex flex-col gap-[33px] w-full">
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
                              className="absolute w-[18px] h-full top-0 left-0 rounded-[20px_0_0_25px]"
                              style={{ backgroundColor: entry.rankColor }}
                            />
                          )}

                          <div className="flex w-full items-center justify-between px-[18px] py-[22px] h-full">
                            <div className="flex items-center gap-[89px]">
                              <div className="flex items-center gap-7">
                                {entry.icon ? (
                                  <img
                                    className="w-[50px] h-[50px]"
                                    src={entry.icon}
                                    alt="Rank Icon"
                                  />
                                ) : (
                                  <div className="w-[50px] h-[50px] flex items-center justify-center">
                                    <span className="font-extrabold text-[#51565e] text-[40px]">
                                      #{entry.rank}
                                    </span>
                                  </div>
                                )}

                                <img
                                  className="w-[79px] h-[79px] object-cover rounded-full"
                                  src={entry.avatar}
                                  alt="User Avatar"
                                />

                                <span className="font-bold text-black text-[25px]">
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
                                    <span className="font-semibold text-[#13377c] text-xs">
                                      {badge}
                                    </span>
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            <div className="flex flex-col items-end">
                              <span className="font-bold text-black text-[25px]">
                                {entry.points}
                              </span>
                              <span className="font-medium text-[#5f5f5f] text-sm">
                                Points
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                {/* ----------- FRIENDS TAB ----------- */}
                <TabsContent value="friends" className="mt-10">
                  <div className="flex flex-col items-center justify-center p-8">
                    <p className="text-gray-500">Friends leaderboard content</p>
                  </div>
                </TabsContent>

                {/* ----------- CLUB TAB ----------- */}
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

      {/* ---------------- SIDEBAR ---------------- */}
      

     
    </div>
  );
};

export default PropertySubsection;
