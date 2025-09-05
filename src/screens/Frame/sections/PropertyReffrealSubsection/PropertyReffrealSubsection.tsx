import {
  AwardIcon,
  CopyIcon,
  FileTextIcon,
  FolderIcon,
  HelpCircleIcon,
  HomeIcon,
  LogOutIcon,
  PresentationIcon,
  Share2Icon,
  TrophyIcon,
  UserIcon,
  UserPlusIcon,
  UsersIcon,
} from "lucide-react";
import React from "react";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";

const navigationItems = [
  { icon: HomeIcon, label: "Dashboard", active: false },
  { icon: UserIcon, label: "Profile Settings", active: false },
  { icon: FolderIcon, label: "My Course", active: false },
  { icon: PresentationIcon, label: "Live Classes", active: false },
  { icon: FileTextIcon, label: "Test & Assessment", active: false },
  { icon: AwardIcon, label: "Certificates", active: false },
  { icon: TrophyIcon, label: "Leaderboard", active: false },
  { icon: AwardIcon, label: "Badges & Rewards", active: false },
  { icon: UsersIcon, label: "Clubs & Community", active: false },
  { icon: HelpCircleIcon, label: "Raise a Doubt", active: false },
  { icon: UserPlusIcon, label: "Referrals Program", active: true },
];

const howItWorksSteps = [
  {
    title: "Invite A Friend",
    description:
      "Send your referral link to someone who'd love to try the assessment.",
  },
  {
    title: "Friend Enrolls",
    description: "Your friend uses your link to enroll and gets up to 20% off.",
  },
  {
    title: "Earn Rewards",
    description: "Once they join, you both receive awesome rewards!",
  },
];

export const PropertyReffrealSubsection = (): JSX.Element => {
  return (
    <div className="flex min-h-screen bg-[#3479ff]">
      {/* Sidebar Navigation */}
      <div className="w-80 bg-[#3479ff] p-8">
        <div className="mb-8">
          <img className="w-[262px] h-[68px]" alt="Group" />
        </div>

        <nav className="flex flex-col gap-11">
          <div className="flex flex-col gap-11">
            {navigationItems.map((item, index) => (
              <div key={index} className="flex items-center gap-4">
                <item.icon className="w-[26px] h-[26px] text-white" />
                <span
                  className={`font-extrabold text-lg [font-family:'Nunito',Helvetica] tracking-[0] leading-[19.6px] whitespace-nowrap ${
                    item.active ? "text-[#083a50]" : "text-white"
                  }`}
                >
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4 mt-[90px]">
            <LogOutIcon className="w-7 h-7 text-white" />
            <span className="[font-family:'Poppins',Helvetica] font-semibold text-white text-xl tracking-[0.40px] leading-[normal]">
              Log Out
            </span>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-white shadow-[0px_0px_29px_#00000075] m-5 ml-0 rounded-l-none">
        <div className="p-12">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-14">
              <img className="w-[25px] h-[25px]" alt="Component" />
              <h1 className="[font-family:'Nunito',Helvetica] font-bold text-[#13377c] text-2xl tracking-[0] leading-[normal]">
                Referrals Program
              </h1>
            </div>

            <div className="flex items-center gap-6">
              <div className="w-6 h-6">
                <div className="w-[17px] h-5 bg-[100%_100%] mt-0.5 ml-1" />
              </div>
              <div className="w-14 h-14 rounded-[28px] border-4 border-solid border-[#3479ff99] bg-cover bg-[50%_50%]" />
              <img className="w-6 h-6" alt="Iconly light outline" />
            </div>
          </div>

          {/* Content Cards */}
          <div className="flex flex-col gap-8 max-w-5xl">
            {/* Earnings Card */}
            <Card className="shadow-[0px_0px_29px_#3479ff40] border-0">
              <CardContent className="flex items-center gap-6 p-6">
                <img className="w-[86px] h-[86px] object-cover" alt="Image" />
                <div>
                  <div className="[font-family:'Roboto',Helvetica] font-medium text-[#13377c] text-xl tracking-[0] leading-[normal] mb-2">
                    Your total earnings
                  </div>
                  <div className="[font-family:'Roboto',Helvetica] font-medium text-[#3479ff] text-4xl tracking-[0] leading-[normal]">
                    ₹ 2,000
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Share Code Card */}
            <Card className="shadow-[0px_0px_30px_#3479ff40] border-0">
              <CardContent className="flex items-center gap-8 p-8">
                <div className="flex-1 max-w-[786px]">
                  <div className="mb-5">
                    <h2 className="[font-family:'Nunito',Helvetica] font-semibold text-[#13377c] text-2xl tracking-[0] leading-[normal] mb-2.5">
                      Share you unique code
                    </h2>
                    <p className="[font-family:'Nunito',Helvetica] font-bold text-[#13377c] text-[28px] tracking-[0] leading-[normal]">
                      Your friends get up to 20% off on their first assessment!
                    </p>
                  </div>

                  <div className="flex items-center gap-2 mb-5">
                    <div className="flex items-center justify-center p-2.5 rounded-lg border border-solid border-[#00000061] h-[87.3px]">
                      <span className="[font-family:'Roboto',Helvetica] font-medium text-[#848484] text-5xl tracking-[0] leading-[normal]">
                        BUDDY20
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="[font-family:'Roboto',Helvetica] font-normal text-[#3e3939] text-xl text-center tracking-[0] leading-[normal]">
                        Tap to copy
                      </span>
                      <CopyIcon className="w-[25px] h-[29px] text-[#3e3939]" />
                    </div>
                  </div>

                  <Button className="bg-[#3479ff] hover:bg-[#2968e6] text-white rounded-lg h-auto px-4 py-4 flex items-center gap-4">
                    <Share2Icon className="w-10 h-10" />
                    <span className="[font-family:'Nunito',Helvetica] font-bold text-xl tracking-[0] leading-[normal]">
                      SHARE NOW
                    </span>
                  </Button>
                </div>

                <div className="flex-shrink-0">
                  <img
                    className="w-[463px] h-[309px] object-cover"
                    alt="Image"
                  />
                </div>
              </CardContent>
            </Card>

            {/* How It Works Card */}
            <Card className="shadow-[0px_0px_30px_#3479ff40] border-0">
              <CardContent className="p-8">
                <h2 className="[font-family:'Nunito',Helvetica] font-bold text-[#13377c] text-[32px] text-center tracking-[0] leading-[normal] mb-6">
                  How it works
                </h2>

                <div className="w-full h-[5px] bg-[#d9d9d9] rounded-[25px] mb-8" />

                <div className="grid grid-cols-3 gap-8">
                  {howItWorksSteps.map((step, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center text-center"
                    >
                      <div className="w-[101px] h-20 mb-4 overflow-hidden rounded-[25px] flex items-center justify-center">
                        <div className="w-[101px] h-20 overflow-hidden">
                          <div className="relative w-[509px] h-[308px] -top-[129px] -left-12 overflow-hidden">
                            <img
                              className="absolute w-9 h-[17px] top-48 left-12"
                              alt="Vector"
                            />
                            <img
                              className="absolute w-[17px] h-[17px] top-[173px] left-[58px]"
                              alt="Vector"
                            />
                            <img
                              className="absolute w-9 h-[17px] top-48 left-28"
                              alt="Vector"
                            />
                            <img
                              className="absolute w-[17px] h-[17px] top-[173px] left-[122px]"
                              alt="Vector"
                            />
                            <img
                              className="absolute w-9 h-[17px] top-[148px] left-20"
                              alt="Vector"
                            />
                            <img
                              className="absolute w-[17px] h-[17px] top-[129px] left-[90px]"
                              alt="Vector"
                            />
                            <img
                              className="absolute w-5 h-[23px] top-[171px] left-[88px]"
                              alt="Vector"
                            />
                          </div>
                        </div>
                      </div>

                      <h3 className="[font-family:'Roboto',Helvetica] font-medium text-[#13377c] text-lg text-center tracking-[0.50px] leading-[21px] mb-2">
                        {step.title}
                      </h3>

                      <p className="font-www-simplilearn-com-semantic-label font-[number:var(--www-simplilearn-com-semantic-label-font-weight)] text-[#272c37] text-[length:var(--www-simplilearn-com-semantic-label-font-size)] text-center tracking-[var(--www-simplilearn-com-semantic-label-letter-spacing)] leading-[var(--www-simplilearn-com-semantic-label-line-height)] [font-style:var(--www-simplilearn-com-semantic-label-font-style)]">
                        {step.description}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
