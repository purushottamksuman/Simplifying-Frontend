import {
  AwardIcon,
  FileTextIcon,
  FolderIcon,
  GiftIcon,
  HelpCircleIcon,
  HomeIcon,
  LockIcon,
  LogOutIcon,
  PresentationIcon,
  SunIcon,
  TrophyIcon,
  UserIcon,
  UserPlusIcon,
  UsersIcon,
} from "lucide-react";
import React from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../../components/ui/avatar";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";


const navigationItems = [
  { icon: HomeIcon, label: "Dashboard", active: true },
  { icon: UserIcon, label: "Profile Settings", active: false },
  { icon: FolderIcon, label: "My Course", active: false },
  { icon: PresentationIcon, label: "Live Classes", active: false },
  { icon: FileTextIcon, label: "Test & Assessment", active: false },
  { icon: AwardIcon, label: "Certificates", active: false },
  { icon: TrophyIcon, label: "Leaderboard", active: false },
  { icon: GiftIcon, label: "Badges & Rewards", active: false },
  { icon: UsersIcon, label: "Clubs & Community", active: false },
  { icon: HelpCircleIcon, label: "Raise a Doubt", active: false },
  { icon: UserPlusIcon, label: "Referrals Program", active: false },
];

export const PropertyDasboardSubsection = (): JSX.Element => {
  return (
    <div className="flex w-full h-full bg-[#3479ff] relative rounded-tl-[40px] rounded-bl-[40px] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-[315px] h-full bg-[#3479ff] flex flex-col shadow-[0px_4px_25px_rgba(0,0,0,0.2)] relative">

        {/* Logo */}
        <div className="p-[35px_19px_0_19px]">
          <img
            className="w-[262px] h-[68px]"
            alt="Simplifying Skills Logo"
            src="/Simplifying.png"
          />
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-[90px] p-[70px_30px_0_30px]">
          <div className="flex flex-col gap-[20px]">
            {navigationItems.map((item, index) => (
              <div
                key={index}
                className={`flex items-center gap-[15px] z-10 cursor-pointer transition-all duration-300 relative`}
              >
                {/* Active Background */}
                {item.active && (
                  <div
                    className="absolute inset-0 bg-white transition-all duration-300"
                    style={{
                      left: "-20px", // bleed into sidebar padding
                      right: "-40px", // extend a bit into main content
                      borderTopLeftRadius: "40px",
                      borderBottomLeftRadius: "40px",
                      
                    }}
                  ></div>
                )}

                {/* Icon + Label */}
                <div className="flex items-center gap-[15px] px-6 py-4 relative z-10">
                  <item.icon
                    className={`w-[24px] h-[24px] transition-colors ${
                      item.active ? "text-[#3479ff]" : "text-white"
                    }`}
                  />
                  <span
                    className={`font-semibold text-base [font-family:'Nunito',Helvetica] tracking-[0] leading-[19.6px] ${
                      item.active ? "text-[#3479ff]" : "text-white"
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Logout Button */}
          <div className="flex items-center gap-[15px] cursor-pointer px-6 py-3 rounded-[15px] hover:bg-[#ffffff1a] transition-all duration-300">
            <LogOutIcon className="w-6 h-6 text-white" />
            <span className="[font-family:'Poppins',Helvetica] font-medium text-white text-lg tracking-[0.40px] leading-[normal]">
              Log Out
            </span>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
     <main
  className="flex-1 bg-white relative"
  style={{
    borderTopLeftRadius: "80px",   // big smooth top-left curve
    borderBottomLeftRadius: "80px", // big smooth bottom-left curve
  }}
>

        <div className="p-[46px_0_0_0] relative">
          {/* Header */}
          <header className="flex items-center justify-between px-8 py-0 mb-[46px]">
            <div className="flex items-center gap-[57px]">
              <img
                className="w-[158px] h-[30px]"
                alt="Component"
                src="/NavbarArrow.png"
              />
            </div>

            <div className="flex items-center gap-[23px]">
              <div className="w-6 h-6">
                <div className="w-[17px] h-5 mt-0.5 ml-1 bg-[100%_100%]" />
              </div>
              <Avatar className="w-14 h-14">
                <AvatarImage src="/Profile.png" />
                <AvatarFallback className="bg-cover bg-[50%_50%] border-4 border-solid border-[#3479ff99]" />
              </Avatar>
              <img className="w-6 h-6" alt="Iconly light outline" />
            </div>
          </header>

          {/* Dashboard Content */}
          <div className="flex gap-[62px] px-8">
            {/* Left Content */}
            <div className="flex-1 max-w-[887px]">
              {/* Welcome Card */}
              <Card className="mb-[29px] rounded-[25px] shadow-[0px_0px_30px_#3479ff40] border-[#e0e6ed]">
                <CardContent className="p-0">
                  <div className="h-[287px] bg-[#3479ff] rounded-[25px] border border-solid border-[#e0e6ed] relative overflow-hidden">
                    <div className="p-[21px_31px] relative z-10">
                      <h2 className="[font-family:'Poppins',Helvetica] font-bold text-white text-5xl tracking-[0] leading-[55px] whitespace-nowrap mb-[38px]">
                        Good Morning Sid
                      </h2>
                      <p className="[font-family:'Poppins',Helvetica] font-normal text-white text-xl tracking-[0] leading-[30px] max-w-[555px]">
                        Don't miss out! Your child's future starts with one smart step complete the payment today.
                      </p>
                    </div>
                    <div className="absolute w-[264px] h-[264px] top-0 right-[31px] bg-[#697ffc] rounded-[132px]" />
                    <SunIcon className="absolute w-[57px] h-[57px] top-[25px] right-[88px] text-white" />
                    <img
                      className="absolute w-[268px] h-80 top-0 right-0"
                      alt="Gradient purple"
                      src="/GradientPurple.png"
                    />
                  </div>
                </CardContent>
              </Card>
              {/* Summary Card */}
              <Card className="rounded-[25px] border border-solid border-[#e0e6ed] shadow-[0px_0px_30px_#3479ff40]">
                <CardContent className="p-6">
                  <h3 className="[font-family:'Poppins',Helvetica] font-bold text-[#13377c] text-2xl tracking-[0] leading-[55px] whitespace-nowrap mb-6">
                    Summary
                  </h3>

                  {/* Payment Section */}
                  <div className="bg-[#e9efff] rounded-[10px] p-3 mb-4 relative">
                    <div className="max-w-[480px]">
                      <h4 className="[font-family:'Poppins',Helvetica] font-semibold text-black text-[32px] tracking-[0] leading-[55px] whitespace-nowrap mb-2">
                        Complete Your Payment
                      </h4>
                      <p className="[font-family:'Poppins',Helvetica] font-normal text-black text-base tracking-[0] leading-[25px] mb-6">
                        Please select a plan that suits you best and complete
                        your payment to unlock the assessment.
                      </p>
                      <Button className="bg-[#3479ff] rounded-[5px] h-auto px-[25px] py-[5px]">
                        <span className="[font-family:'Montserrat',Helvetica] font-medium text-white text-base tracking-[1.00px] leading-[22.5px]">
                          Pay Now
                        </span>
                      </Button>
                    </div>
                    <img
                      className="absolute w-[157px] h-[184px] top-[7px] right-[40px]"
                      alt="Element hand making"
                      src="/CashlessPayment.png"
                    />
                  </div>

                  {/* Cashback Section */}
                  <div className="bg-[#fff4fb] rounded-[10px] p-[22px_17px] relative">
                    <h4 className="[font-family:'Poppins',Helvetica] font-semibold text-black text-[32px] tracking-[0] leading-[45px] mb-1">
                      You Have ₹200 Cashback
                    </h4>
                    <p className="[font-family:'Poppins',Helvetica] font-normal text-[#6f6d6d] text-xs tracking-[0] leading-[30px] mb-[25px]">
                      T&C Apply
                    </p>
                    <Button className="bg-[#3479ff] rounded-[5px] h-auto px-[18px] py-[5px]">
                      <span className="[font-family:'Montserrat',Helvetica] font-medium text-white text-base tracking-[1.00px] leading-[22.5px]">
                        Refer & Earn
                      </span>
                    </Button>
                    <img
                      className="absolute w-[205px] h-[171px] top-3.5 right-[40px]"
                      alt="Gradient purple"
                      src="/Wallet.png"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Sidebar */}
            <div className="w-[521px]">
              <Card className="rounded-[25px] shadow-[0px_0px_30px_5px_#3479ff40] border-0">
                <CardContent className="p-[42px_37px]">
                  <h3 className="[font-family:'Poppins',Helvetica] font-bold text-[#13377c] text-[26px] tracking-[1.00px] leading-[22.5px] whitespace-nowrap mb-[66px]">
                    Unlock Premium Features
                  </h3>

                  <div className="space-y-[42px]">
                    {/* Expert Guidance Card */}
                    <div className="rounded-[40px] bg-[linear-gradient(180deg,rgba(123,88,242,1)_0%,rgba(164,147,255,1)_100%)] p-[17px_29px_0_29px] h-[331px] relative overflow-hidden">
                      <h4 className="[font-family:'Inter',Helvetica] font-semibold text-white text-4xl tracking-[0] leading-[normal] mb-4">
                        Get Expert Guidance
                      </h4>
                      <p className="[font-family:'Inter',Helvetica] font-light text-white text-base tracking-[0] leading-[normal] mb-[35px] max-w-[360px]">
                        Unlock your test results with a 1:1 counselling call and
                        get a personalized growth plan.
                      </p>
                      <Button className="bg-white rounded-[25px] h-auto px-9 py-[18px] flex items-center gap-2">
                        <LockIcon className="w-4 h-[19px] text-black" />
                        <span className="[font-family:'Montserrat',Helvetica] font-bold text-black text-base tracking-[1.00px] leading-[22.5px]">
                          Unlock Session
                        </span>
                      </Button>
                      <img
                        className="absolute w-[244px] h-[183px] top-[87px] right-[50px]"
                        alt="Ellipse"
                        src="/Ellipse.png"
                      />
                      <img
                        className="absolute w-[364px] h-[235px] top-[95px] right-[6px]"
                        alt="Untitled design"
                        src="/GoodKid.png"
                      />
                    </div>

                    {/* Join Clubs Card */}
                    <div className="rounded-[40px] bg-[linear-gradient(180deg,rgba(254,200,84,1)_0%,rgba(255,223,153,1)_100%)] p-[17px_28px_0_28px] h-[331px] relative overflow-hidden">
                      <h4 className="[font-family:'Inter',Helvetica] font-semibold text-black text-4xl tracking-[0] leading-[normal] mb-4">
                        Join Our Clubs
                      </h4>
                      <p className="[font-family:'Inter',Helvetica] font-light text-black text-base tracking-[0] leading-[normal] mb-[52px] max-w-[397px]">
                        Discover your interests, learn new skills, and connect
                        with like-minded students by joining a club that fits
                        your passion.
                      </p>
                      <Button className="bg-white rounded-[25px] h-auto px-[23px] py-[10px]">
                        <span className="[font-family:'Montserrat',Helvetica] font-bold text-black text-base tracking-[1.00px] leading-[22.5px]">
                          Explore Now
                        </span>
                      </Button>
                      <img
                        className="absolute w-[244px] h-[183px] top-[123px] right-[50px]"
                        alt="Ellipse"
                        src="/Ellipse.png"
                      />
                      <img
                        className="absolute w-[353px] h-[206px] top-[125px] right-0"
                        alt="Untitled design"
                        src="/SorryMother.png"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
