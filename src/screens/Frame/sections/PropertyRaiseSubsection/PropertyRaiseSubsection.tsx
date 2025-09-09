import { CalendarIcon, MessageCircleIcon } from "lucide-react";
import React from "react";
import { Badge } from "../../../../components/ui/badge";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "../../../../components/ui/tabs";

// Sidebar navigation items
const navigationItems = [
  { icon: "/icons/dashboard.svg", label: "Dashboard", active: false },
  { icon: "/icons/profile.svg", label: "Profile Settings", active: false },
  { icon: "/icons/course.svg", label: "My Course", active: false },
  { icon: "/icons/live.svg", label: "Live Classes", active: false },
  { icon: "/icons/test.svg", label: "Test & Assessment", active: false },
  { icon: "/icons/certificates.svg", label: "Certificates", active: false },
  { icon: "/icons/leaderboard.svg", label: "Leaderboard", active: false },
  { icon: "/icons/rewards.svg", label: "Badges & Rewards", active: false },
  { icon: "/icons/community.svg", label: "Clubs & Community", active: false },
  { icon: "/icons/doubt.svg", label: "Raise a Doubt", active: true },
  { icon: "/icons/referral.svg", label: "Referrals Program", active: false },
];

// Doubts data
const doubtsData = [
  {
    id: 1,
    title: "Understanding React Hooks",
    category: "React Development",
    subcategory: "Hooks",
    status: "resolved",
    description:
      "I'm having trouble understanding when to use useEffect vs useLayoutEffect. Can someone explain the difference?",
    date: "Jan 10, 05:30 AM",
    responses: "1 response",
  },
  {
    id: 2,
    title: "JavaScript Async/Await",
    category: "JavaScript Fundamentals",
    subcategory: "Asynchronous Programming",
    status: "pending",
    description:
      "How do I handle multiple async operations that depend on each other?",
    date: "Jan 11, 05:30 AM",
    estimatedResponse: "Est. response: 1-2 hours",
  },
   {
    id: 1,
    title: "Understanding React Hooks",
    category: "React Development",
    subcategory: "Hooks",
    status: "resolved",
    description:
      "I'm having trouble understanding when to use useEffect vs useLayoutEffect. Can someone explain the difference?",
    date: "Jan 10, 05:30 AM",
    responses: "1 response",
  },
  {
    id: 2,
    title: "JavaScript Async/Await",
    category: "JavaScript Fundamentals",
    subcategory: "Asynchronous Programming",
    status: "pending",
    description:
      "How do I handle multiple async operations that depend on each other?",
    date: "Jan 11, 05:30 AM",
    estimatedResponse: "Est. response: 1-2 hours",
  },
];

export const PropertyRaiseSubsection = (): JSX.Element => {
  return (
    <div className="flex w-full h-screen bg-[#f8faff]">
      {/* Sidebar */}
      <aside className="w-[250px] h-full bg-[#3479ff] flex flex-col justify-between py-6">
        <div className="flex flex-col gap-6 px-6">
          <img src="/logo.svg" alt="Logo" className="w-44 mb-8" />
          {navigationItems.map((item, index) => (
            <div
              key={index}
              className={`flex items-center gap-3 cursor-pointer px-3 py-2 rounded-xl transition ${
                item.active ? "bg-white shadow text-[#13377c]" : "text-white"
              }`}
            >
              <img src={item.icon} alt={item.label} className="w-6 h-6" />
              <span className="font-semibold text-base">{item.label}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-3 px-6 cursor-pointer">
          <img src="/icons/logout.svg" alt="Logout" className="w-6 h-6" />
          <span className="text-white font-semibold text-lg">Log Out</span>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col bg-white shadow-inner rounded-tl-[40px] p-14 overflow-y-auto">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-[24px] font-bold text-[#13377c]">Raise a doubt</h1>
          <div className="flex items-center gap-5">
            <img src="/icons/bell.svg" alt="Notifications" className="w-6 h-6" />
            <img
              src="/images/profile.jpg"
              alt="Profile"
              className="w-10 h-10 rounded-full border-2 border-[#3479ff]"
            />
          </div>
        </header>

        {/* Page title */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-[28px] font-bold text-[#13377c]">My Doubts</h2>
            <p className="text-[#7a7a7a] text-base">
              Track your submitted questions and view responses from mentors and peers.
            </p>
          </div>
          <Button className="bg-[#3479ff] hover:bg-[#2764db] text-white rounded-lg px-6 py-3 text-lg">
            Raise Doubts
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" className="w-[692px] mb-8">
          <TabsList className="h-[60px] bg-white rounded-[21px] shadow-[0px_0px_20px_#3479ff40] p-2.5 gap-[100px]">
            <TabsTrigger
              value="all"
              className="w-[186px] bg-[#007fff59] rounded-[20px] p-2.5 data-[state=active]:bg-[#007fff59]"
            >
              <span className="font-bold text-[#083a50] text-2xl [font-family:'Nunito',Helvetica]">
                ALL 1
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="pending"
              className="data-[state=active]:bg-transparent"
            >
              <span className="font-bold text-[#888888] text-2xl [font-family:'Nunito',Helvetica]">
                Pending 4
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="resolved"
              className="data-[state=active]:bg-transparent"
            >
              <span className="font-bold text-[#888888] text-2xl [font-family:'Nunito',Helvetica]">
                Resolve 2
              </span>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Doubts cards */}
        <div className="flex flex-col gap-6">
          {doubtsData.map((doubt) => (
            <Card
              key={doubt.id}
              className="bg-white rounded-xl border border-[#00000010] shadow-[0px_4px_20px_#3479ff20]"
            >
              <CardContent className="p-6">
                <div className="flex flex-col gap-3">
                  {/* Title and status */}
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-[#2d2d2d]">
                        {doubt.title}
                      </h3>
                      <p className="text-[#494956] text-sm">
                        {doubt.category} • {doubt.subcategory}
                      </p>
                    </div>
                    <Badge
                      className={`px-3 py-1 rounded-md text-xs font-semibold ${
                        doubt.status === "resolved"
                          ? "bg-[#dbfbe6] text-[#016630] border border-[#7af1a7]"
                          : "bg-[#fef9c1] text-[#884a00] border border-[#ffdf20]"
                      }`}
                    >
                      {doubt.status === "resolved" ? "Resolved" : "Pending"}
                    </Badge>
                  </div>

                  {/* Description */}
                  <p className="text-[#494956] text-sm leading-relaxed">
                    {doubt.description}
                  </p>

                  {/* Footer */}
                  <div className="flex justify-between items-center pt-3 border-t border-[#0000001a]">
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2 text-[#494956] text-sm">
                        <CalendarIcon className="w-4 h-4" />
                        {doubt.date}
                      </div>
                      {doubt.responses && (
                        <div className="flex items-center gap-2 text-[#494956] text-sm">
                          <MessageCircleIcon className="w-4 h-4" />
                          {doubt.responses}
                        </div>
                      )}
                    </div>
                    {doubt.estimatedResponse && (
                      <span className="text-[#888888] text-sm">
                        {doubt.estimatedResponse}
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
