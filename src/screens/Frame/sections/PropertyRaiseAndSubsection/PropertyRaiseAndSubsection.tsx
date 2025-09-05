import { ClockIcon, MessageCircleIcon, UploadIcon } from "lucide-react";
import React, { useState } from "react";
import { Badge } from "../../../../components/ui/badge";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../../components/ui/dialog";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "../../../../components/ui/tabs";
import { Textarea } from "../../../../components/ui/textarea";

const doubtsData = [
  {
    id: 1,
    title: "Understanding React Hooks",
    category: "React Development",
    topic: "Hooks",
    description:
      "I'm having trouble understanding when to use useEffect vs useLayoutEffect. Can someone explain the difference?",
    status: "resolved",
    date: "Jan 10, 05:30 AM",
    responses: "1 response",
  },
  {
    id: 2,
    title: "JavaScript Async/Await",
    category: "JavaScript Fundamentals",
    topic: "Asynchronous Programming",
    description:
      "How do I handle multiple async operations that depend on each other?",
    status: "pending",
    date: "Jan 11, 05:30 AM",
    estimatedResponse: "Est. response: 1-2 hours",
  },
  {
    id: 3,
    title: "Understanding React Hooks",
    category: "React Development",
    topic: "Hooks",
    description:
      "I'm having trouble understanding when to use useEffect vs useLayoutEffect. Can someone explain the difference?",
    status: "resolved",
    date: "Jan 10, 05:30 AM",
    responses: "1 response",
  },
  {
    id: 4,
    title: "JavaScript Async/Await",
    category: "JavaScript Fundamentals",
    topic: "Asynchronous Programming",
    description:
      "How do I handle multiple async operations that depend on each other?",
    status: "pending",
    date: "Jan 11, 05:30 AM",
    estimatedResponse: "Est. response: 1-2 hours",
  },
];

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

export const PropertyRaiseAndSubsection = (): JSX.Element => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  return (
    <div className="w-full h-full bg-[#3479ff] relative">
      <div className="w-full max-w-[1605px] h-full mx-auto bg-white shadow-[0px_0px_29px_#00000075] relative">
        <div className="w-full h-full relative">
          <img
            className="w-full h-[886px] absolute top-[55px] left-0"
            alt="Group"
          />

          <header className="flex w-full items-center justify-between px-8 py-0 absolute top-0 left-0 z-10">
            <div className="flex items-center gap-[57px]">
              <img className="w-[25px] h-[25px]" alt="Component" />
              <div className="[font-family:'Nunito',Helvetica] font-bold text-[#13377c] text-2xl tracking-[0] leading-[normal]">
                Raise a doubt
              </div>
            </div>

            <div className="flex items-center gap-[23px]">
              <div className="w-6 h-6">
                <div className="w-[17px] h-5 bg-[100%_100%] mt-0.5 ml-1" />
              </div>
              <div className="w-14 h-14 bg-cover bg-[50%_50%]">
                <div className="h-14 rounded-[28px] border-4 border-solid border-[#3479ff99]" />
              </div>
              <img className="w-6 h-6" alt="Iconly light outline" />
            </div>
          </header>

          <main className="flex flex-col w-full max-w-[1411px] items-center gap-[172px] absolute top-[130px] left-1/2 transform -translate-x-1/2">
            <div className="flex items-center gap-32 w-full">
              <div className="flex flex-col items-start gap-6 flex-1">
                <h1 className="[font-family:'Nunito',Helvetica] font-bold text-[#13377c] text-4xl tracking-[0] leading-[26px]">
                  My Doubts
                </h1>
                <p className="w-full max-w-[1046px] [font-family:'Poppins',Helvetica] font-normal text-object-black-60 text-[25px] tracking-[0] leading-6">
                  Track your submitted questions and view responses from mentors
                  and peers.
                </p>
              </div>
              <Button
                className="w-[230px] h-[49px] bg-[#3479ff] rounded-lg border border-solid h-auto"
                onClick={() => setIsModalOpen(true)}
              >
                <span className="font-bold text-white text-[21px] text-center [font-family:'Nunito',Helvetica] tracking-[0] leading-[19.6px]">
                  Raise Doubts
                </span>
              </Button>
            </div>

            <div className="flex flex-col w-full items-start gap-2.5">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <div className="w-[692px] mx-auto mb-8">
                  <TabsList className="flex h-[60px] items-center p-2.5 bg-white rounded-[21px] shadow-[0px_0px_20px_#3479ff40] gap-[100px]">
                    <TabsTrigger
                      value="all"
                      className="w-[186px] flex flex-col items-center justify-center gap-2.5 p-2.5 bg-[#007fff59] rounded-[20px] data-[state=active]:bg-[#007fff59]"
                    >
                      <span className="font-bold text-[#083a50] text-2xl [font-family:'Nunito',Helvetica] tracking-[0] leading-[19.6px]">
                        ALL 1
                      </span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="pending"
                      className="font-bold text-[#888888] text-2xl [font-family:'Nunito',Helvetica] tracking-[0] leading-[19.6px] data-[state=active]:text-[#083a50]"
                    >
                      Pending 4
                    </TabsTrigger>
                    <TabsTrigger
                      value="resolved"
                      className="font-bold text-[#888888] text-2xl [font-family:'Nunito',Helvetica] tracking-[0] leading-[19.6px] data-[state=active]:text-[#083a50]"
                    >
                      Resolve 2
                    </TabsTrigger>
                  </TabsList>
                </div>

                <div className="flex flex-col w-full items-start gap-[23px]">
                  {doubtsData.map((doubt) => (
                    <Card
                      key={doubt.id}
                      className="w-full bg-white rounded-[12.75px] border border-solid border-[#0000001a] shadow-[0px_0px_20px_#3479ff40]"
                    >
                      <CardContent className="p-[22.6px]">
                        <div className="flex flex-col items-start gap-3.5">
                          <div className="flex items-start gap-3.5 w-full">
                            <div className="flex flex-col items-start gap-[2.5px] flex-1">
                              <h3 className="[font-family:'Segoe_UI-Semibold',Helvetica] font-normal text-neutral-950 text-base tracking-[0] leading-[21px]">
                                {doubt.title}
                              </h3>
                              <div className="flex items-center gap-[7px]">
                                <span className="[font-family:'Segoe_UI-Regular',Helvetica] font-normal text-[#494956] text-[12.3px] tracking-[0] leading-[17.5px]">
                                  {doubt.category}
                                </span>
                                <span className="[font-family:'Segoe_UI-Regular',Helvetica] font-normal text-[#494956] text-[12.3px] tracking-[0] leading-[17.5px]">
                                  •
                                </span>
                                <span className="[font-family:'Segoe_UI-Regular',Helvetica] font-normal text-[#494956] text-[12.3px] tracking-[0] leading-[17.5px]">
                                  {doubt.topic}
                                </span>
                              </div>
                            </div>
                            <Badge
                              className={`w-[92px] h-[23px] flex items-center justify-center gap-[3.5px] px-[8.6px] py-[3.35px] rounded-[6.75px] border ${
                                doubt.status === "resolved"
                                  ? "bg-[#dbfbe6] border-[#7af1a7] text-[#016630]"
                                  : "bg-[#fef9c1] border-[#ffdf20] text-[#884a00]"
                              }`}
                            >
                              <img
                                className="w-3.5 h-[10.5px]"
                                alt="Svg margin"
                              />
                              <span className="font-www-figma-com-segoe-UI-semibold font-[number:var(--www-figma-com-segoe-UI-semibold-font-weight)] text-[length:var(--www-figma-com-segoe-UI-semibold-font-size)] text-center tracking-[var(--www-figma-com-segoe-UI-semibold-letter-spacing)] leading-[var(--www-figma-com-segoe-UI-semibold-line-height)] [font-style:var(--www-figma-com-segoe-UI-semibold-font-style)]">
                                {doubt.status === "resolved"
                                  ? "Resolved"
                                  : "Pending"}
                              </span>
                            </Badge>
                          </div>

                          <p className="font-www-figma-com-segoe-UI-regular font-[number:var(--www-figma-com-segoe-UI-regular-font-weight)] text-[#494956] text-[length:var(--www-figma-com-segoe-UI-regular-font-size)] tracking-[var(--www-figma-com-segoe-UI-regular-letter-spacing)] leading-[var(--www-figma-com-segoe-UI-regular-line-height)] overflow-hidden text-ellipsis [display:-webkit-box] [-webkit-line-clamp:0] [-webkit-box-orient:vertical] [font-style:var(--www-figma-com-segoe-UI-regular-font-style)]">
                            {doubt.description}
                          </p>

                          <div
                            className={`flex items-center ${doubt.responses ? "gap-[13.99px]" : "justify-between"} pt-[7.6px] pb-0 px-0 w-full border-t-[1.6px] border-solid border-[#0000001a]`}
                          >
                            <div className="flex items-center gap-[3.5px]">
                              <ClockIcon className="w-3.5 h-3.5" />
                              <span className="[font-family:'Segoe_UI-Regular',Helvetica] font-normal text-[#494956] text-[12.3px] tracking-[0] leading-[17.5px]">
                                {doubt.date}
                              </span>
                            </div>
                            {doubt.responses && (
                              <div className="flex items-center gap-[3.5px]">
                                <MessageCircleIcon className="w-3.5 h-3.5" />
                                <span className="[font-family:'Segoe_UI-Regular',Helvetica] font-normal text-[#494956] text-[12.3px] tracking-[0] leading-[17.5px]">
                                  {doubt.responses}
                                </span>
                              </div>
                            )}
                            {doubt.estimatedResponse && (
                              <span className="[font-family:'Segoe_UI-Regular',Helvetica] font-normal text-[#494956] text-[12.3px] tracking-[0] leading-[17.5px]">
                                {doubt.estimatedResponse}
                              </span>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </Tabs>
            </div>
          </main>

          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent className="w-[733px] h-[525px] bg-white rounded-[12.75px] border border-solid border-[#0000001a] shadow-[0px_0px_20px_#3479ff40] p-[1.6px]">
              <DialogHeader className="px-[21px] pt-[19.6px] pb-0">
                <DialogTitle className="font-www-figma-com-semantic-heading-4 font-[number:var(--www-figma-com-semantic-heading-4-font-weight)] text-[#083a50] text-[length:var(--www-figma-com-semantic-heading-4-font-size)] tracking-[var(--www-figma-com-semantic-heading-4-letter-spacing)] leading-[var(--www-figma-com-semantic-heading-4-line-height)] [font-style:var(--www-figma-com-semantic-heading-4-font-style)]">
                  Raise a Doubt
                </DialogTitle>
                <p className="[font-family:'Segoe_UI-Regular',Helvetica] font-normal text-[#717182] text-sm tracking-[0] leading-[21px] mt-[5.25px]">
                  Submit your questions and get help from mentors or peers.
                </p>
              </DialogHeader>

              <div className="flex flex-col items-start pt-0 pb-[21px] px-[21px] flex-1">
                <div className="flex flex-col items-start gap-[19.3px] w-full">
                  <div className="flex items-start justify-center gap-3.5 w-full">
                    <div className="flex flex-col items-start gap-[7px] flex-1">
                      <Label className="[font-family:'Segoe_UI-Semibold',Helvetica] font-normal text-[#083a50] text-[12.3px] tracking-[0] leading-[12.2px]">
                        Course/Subject *
                      </Label>
                      <Select>
                        <SelectTrigger className="h-[31.5px] px-[12.1px] py-[8.6px] rounded-[25px] border border-solid border-[#9e9e9e]">
                          <SelectValue
                            placeholder="Select a course"
                            className="[font-family:'Segoe_UI-Regular',Helvetica] font-normal text-[#717182] text-[12.3px] text-center tracking-[0] leading-[17.5px]"
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="react">
                            React Development
                          </SelectItem>
                          <SelectItem value="javascript">
                            JavaScript Fundamentals
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex flex-col items-start gap-[7px] flex-1">
                      <Label className="[font-family:'Segoe_UI-Semibold',Helvetica] font-normal text-[#083a50] text-[12.3px] tracking-[0] leading-[12.2px]">
                        Topic *
                      </Label>
                      <Select>
                        <SelectTrigger className="h-[31.5px] px-[12.1px] py-[8.6px] rounded-[25px] border border-solid border-[#9e9e9e]">
                          <SelectValue
                            placeholder="Select a course"
                            className="[font-family:'Segoe_UI-Regular',Helvetica] font-normal text-[#717182] text-[12.3px] text-center tracking-[0] leading-[17.5px]"
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hooks">Hooks</SelectItem>
                          <SelectItem value="async">
                            Asynchronous Programming
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex flex-col items-start gap-[7px] w-full">
                    <Label className="[font-family:'Segoe_UI-Semibold',Helvetica] font-normal text-[#083a50] text-[12.3px] tracking-[0] leading-[12.2px]">
                      Doubt Title *
                    </Label>
                    <Input
                      placeholder="Brief title for your doubt"
                      className="h-[31.5px] rounded-[25px] border border-solid border-[#7e7e7e] px-3 font-www-figma-com-semantic-input font-[number:var(--www-figma-com-semantic-input-font-weight)] text-[#717182] text-[length:var(--www-figma-com-semantic-input-font-size)] tracking-[var(--www-figma-com-semantic-input-letter-spacing)] leading-[var(--www-figma-com-semantic-input-line-height)] [font-style:var(--www-figma-com-semantic-input-font-style)]"
                    />
                  </div>

                  <div className="flex flex-col items-start gap-[7px] w-full">
                    <Label className="[font-family:'Segoe_UI-Semibold',Helvetica] font-normal text-[#083a50] text-[12.3px] tracking-[0] leading-[12.2px]">
                      Doubt Description *
                    </Label>
                    <Textarea
                      placeholder="Describe your doubt in detail. You can use formatting like **bold** and *italic*."
                      className="h-14 rounded-[10px] border border-solid border-[#7e7e7e] p-3 font-www-figma-com-semantic-textarea font-[number:var(--www-figma-com-semantic-textarea-font-weight)] text-[#717182] text-[length:var(--www-figma-com-semantic-textarea-font-size)] tracking-[var(--www-figma-com-semantic-textarea-letter-spacing)] leading-[var(--www-figma-com-semantic-textarea-line-height)] [font-style:var(--www-figma-com-semantic-textarea-font-style)]"
                    />
                  </div>

                  <div className="flex flex-col items-start gap-3.5 w-full">
                    <Label className="[font-family:'Segoe_UI-Semibold',Helvetica] font-normal text-[#083a50] text-[12.3px] tracking-[0] leading-[12.2px]">
                      Attach Images (Optional)
                    </Label>
                    <div className="flex flex-col items-start p-[22.6px] w-full rounded-[8.75px] border border-dashed border-[#0000001a]">
                      <div className="flex flex-col items-center gap-[7px] w-full">
                        <UploadIcon className="w-7 h-7" />
                        <p className="font-www-figma-com-semantic-label font-[number:var(--www-figma-com-semantic-label-font-weight)] text-[#717182] text-[length:var(--www-figma-com-semantic-label-font-size)] text-center tracking-[var(--www-figma-com-semantic-label-letter-spacing)] leading-[var(--www-figma-com-semantic-label-line-height)] [font-style:var(--www-figma-com-semantic-label-font-style)]">
                          Click to upload images or drag and drop
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button className="min-w-[120px] h-[33.2px] bg-[#3479ff] rounded-[6.75px] px-[20.98px] py-[7px] h-auto">
                    <span className="font-www-figma-com-semantic-button font-[number:var(--www-figma-com-semantic-button-font-weight)] text-white text-[length:var(--www-figma-com-semantic-button-font-size)] text-center tracking-[var(--www-figma-com-semantic-button-letter-spacing)] leading-[var(--www-figma-com-semantic-button-line-height)] [font-style:var(--www-figma-com-semantic-button-font-style)]">
                      Submit Doubt
                    </span>
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
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
                className={`font-extrabold text-lg [font-family:'Nunito',Helvetica] tracking-[0] leading-[19.6px] ${
                  item.active ? "text-[#13377c]" : "text-white"
                }`}
              >
                {item.label}
              </span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 w-[122px] h-[30px]">
          <img className="w-7 h-7" alt="Sign out" />
          <span className="[font-family:'Poppins',Helvetica] font-semibold text-white text-xl tracking-[0.40px] leading-[normal]">
            Log Out
          </span>
        </div>
      </nav>
    </div>
  );
};
