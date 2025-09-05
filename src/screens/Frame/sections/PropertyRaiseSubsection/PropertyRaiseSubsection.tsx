import { CalendarIcon, MessageCircleIcon } from "lucide-react";
import React from "react";
import { Badge } from "../../../../components/ui/badge";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "../../../../components/ui/tabs";

const navigationItems = [
  { icon: "home", label: "Dashboard", active: false },
  { icon: "profile", label: "Profile Settings", active: false },
  { icon: "folder", label: "My Course", active: false },
  { icon: "presentation", label: "Live Classes", active: false },
  { icon: "test-paper", label: "Test & Assessment", active: false },
  { icon: "certificate", label: "Certificates", active: false },
  { icon: "leaderboard", label: "Leaderboard", active: false },
  { icon: "rewards", label: "Badges & Rewards", active: false },
  { icon: "home", label: "Clubs & Community", active: false },
  { icon: "user", label: "Raise a Doubt", active: true },
  { icon: "referral", label: "Referrals Program", active: false },
];

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
];

export const PropertyRaiseSubsection = (): JSX.Element => {
  return (
    <div className="w-full h-full bg-[#3479ff] relative">
      <div className="w-full max-w-[1605px] mx-auto h-full bg-white shadow-[0px_0px_29px_#00000075] relative">
        <div className="w-full h-full relative">
          <img
            className="w-full h-[886px] absolute top-[55px] left-0"
            alt="Group"
          />

          <header className="flex w-full items-center justify-between px-8 py-0 absolute top-0 left-0 z-10">
            <div className="flex items-center gap-[57px]">
              <img className="w-[25px] h-[25px]" alt="Component" />
              <div className="[font-family:'Nunito',Helvetica] font-bold text-[#13377c] text-2xl">
                Raise a doubt
              </div>
            </div>

            <div className="flex items-center gap-[23px]">
              <div className="w-6 h-6">
                <div className="w-[17px] h-5 bg-[100%_100%]" />
              </div>
              <div className="w-14 h-14 rounded-[28px] border-4 border-solid border-[#3479ff99]" />
              <img className="w-6 h-6" alt="Iconly light outline" />
            </div>
          </header>

          <main className="flex flex-col w-full max-w-[1411px] items-start gap-10 absolute top-[130px] left-1/2 transform -translate-x-1/2 px-4">
            <div className="flex flex-col items-start gap-[22px] w-full">
              <div className="flex items-center gap-32 w-full">
                <div className="flex flex-col items-start gap-6">
                  <h1 className="text-4xl [font-family:'Nunito',Helvetica] font-bold text-[#13377c]">
                    My Doubts
                  </h1>
                  <p className="w-full max-w-[1046px] text-xl [font-family:'Poppins',Helvetica] font-normal text-object-black-60">
                    Track your submitted questions and view responses from
                    mentors and peers.
                  </p>
                </div>

                <Button className="w-[230px] h-[49px] bg-[#3479ff] rounded-lg border border-solid h-auto">
                  <span className="font-bold text-white text-[21px] [font-family:'Nunito',Helvetica]">
                    Raise Doubts
                  </span>
                </Button>
              </div>

              <Tabs defaultValue="all" className="w-[692px]">
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
            </div>

            <div className="flex flex-col w-full items-start gap-[23px]">
              {doubtsData.map((doubt) => (
                <Card
                  key={doubt.id}
                  className="w-full bg-white rounded-[12.75px] border border-solid border-[#0000001a] shadow-[0px_0px_20px_#3479ff40]"
                >
                  <CardContent className="p-[22.6px]">
                    <div className="flex flex-col items-start gap-3.5 w-full">
                      <div className="flex items-start gap-3.5 w-full">
                        <div className="flex flex-col items-start gap-[2.5px] flex-1">
                          <h3 className="[font-family:'Segoe_UI-Semibold',Helvetica] font-normal text-neutral-950 text-base">
                            {doubt.title}
                          </h3>
                          <div className="flex items-center gap-[7px] w-full">
                            <span className="[font-family:'Segoe_UI-Regular',Helvetica] text-[#494956] text-[12.3px]">
                              {doubt.category}
                            </span>
                            <span className="[font-family:'Segoe_UI-Regular',Helvetica] font-normal text-[#494956] text-[12.3px]">
                              •
                            </span>
                            <span className="[font-family:'Segoe_UI-Regular',Helvetica] font-normal text-[#494956] text-[12.3px]">
                              {doubt.subcategory}
                            </span>
                          </div>
                        </div>

                        <Badge
                          className={`w-[92px] h-[23px] px-[8.6px] py-[3.35px] rounded-[6.75px] border ${
                            doubt.status === "resolved"
                              ? "bg-[#dbfbe6] border-[#7af1a7] text-[#016630]"
                              : "bg-[#fef9c1] border-[#ffdf20] text-[#884a00]"
                          }`}
                        >
                          <img
                            className="w-3.5 h-[10.5px] mr-1"
                            alt="Status icon"
                          />
                          <span className="font-www-figma-com-segoe-UI-semibold text-center">
                            {doubt.status === "resolved"
                              ? "Resolved"
                              : "Pending"}
                          </span>
                        </Badge>
                      </div>

                      <p className="[font-family:'Segoe_UI-Regular',Helvetica] text-[#494956] text-[12.3px] leading-[17.5px] w-full">
                        {doubt.description}
                      </p>

                      <div className="flex items-center justify-between pt-[7.6px] w-full border-t-[1.6px] border-[#0000001a]">
                        <div className="flex items-center gap-[13.99px]">
                          <div className="flex items-center gap-[3.5px]">
                            <CalendarIcon className="w-3.5 h-3.5" />
                            <span className="[font-family:'Segoe_UI-Regular',Helvetica] font-normal text-[#494956] text-[12.3px]">
                              {doubt.date}
                            </span>
                          </div>
                          {doubt.responses && (
                            <div className="flex items-center gap-[3.5px]">
                              <MessageCircleIcon className="w-3.5 h-3.5" />
                              <span className="[font-family:'Segoe_UI-Regular',Helvetica] font-normal text-[#494956] text-[12.3px]">
                                {doubt.responses}
                              </span>
                            </div>
                          )}
                        </div>
                        {doubt.estimatedResponse && (
                          <span className="[font-family:'Segoe_UI-Regular',Helvetica] font-normal text-[#494956] text-[12.3px]">
                            {doubt.estimatedResponse}
                          </span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
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
            <div key={index} className="flex items-center gap-[17px] w-full">
              <img className="w-[26px] h-[26px]" alt={item.icon} />
              <span
                className={`font-extrabold text-lg [font-family:'Nunito',Helvetica] whitespace-nowrap ${
                  item.active ? "text-[#13377c]" : "text-white"
                }`}
              >
                {item.label}
              </span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <img className="w-7 h-7" alt="Sign out" />
          <span className="[font-family:'Poppins',Helvetica] font-semibold text-white text-xl tracking-[0.40px]">
            Log Out
          </span>
        </div>
      </nav>
    </div>
  );
};
