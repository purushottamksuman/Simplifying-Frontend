
import React from "react";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";
import { Progress } from "../../../../components/ui/progress";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../../components/ui/tabs";

const rewardTiers = [
  {
    emoji: "🎯",
    points: "500 points",
    reward: "1 Month Premium",
    bgColor: "bg-[#e1eafc]",
    textColor: "text-[#3479ff]",
    active: true,
  },
  {
    emoji: "⭐",
    points: "1000 points",
    reward: "Custom Profile Badge",
    bgColor: "bg-[#e1eafc]",
    textColor: "text-[#3479ff]",
    active: true,
  },
  {
    emoji: "🎁",
    points: "2000 points",
    reward: "Course Discount 50%",
    bgColor: "bg-[#f2f6ff]",
    textColor: "text-[#495565]",
    active: false,
  },
  {
    emoji: "👑",
    points: "5000 points",
    reward: "VIP Access",
    bgColor: "bg-[#f2f6ff]",
    textColor: "text-[#495565]",
    active: false,
  },
  {
    emoji: "🎁",
    points: "2000 points",
    reward: "Course Discount 50%",
    bgColor: "bg-[#f2f6ff]",
    textColor: "text-[#495565]",
    active: false,
  },
  {
    emoji: "👑",
    points: "5000 points",
    reward: "VIP Access",
    bgColor: "bg-[#f2f6ff]",
    textColor: "text-[#495565]",
    active: false,
  },
  {
    emoji: "👑",
    points: "5000 points",
    reward: "VIP Access",
    bgColor: "bg-[#f2f6ff]",
    textColor: "text-[#495565]",
    active: false,
  },
];

export const PropertyRewardSubsection = (): JSX.Element => {
  return (
      

      
        <div className="p-[46px_0_0_34px]">
          

          <div className="flex gap-[50px] p-10px">
            <div className="flex-1 max-w-[1036px]">
              <div className="mb-6">
                <h1 className="[font-family:'Nunito',Helvetica] font-bold text-[#13377c] text-4xl tracking-[0] leading-[26px] mb-6">
                  Badges & Rewards
                </h1>
                <p className="[font-family:'Poppins',Helvetica] font-normal text-object-black-60 text-[25px] tracking-[0] leading-6 mb-6 max-w-[690px]">
                  Collect badges, earn points, unlock amazing rewards!
                </p>
                <p className="[font-family:'Poppins',Helvetica] font-normal text-object-black-60 text-[25px] tracking-[0] leading-6">
                  🏆 6 of 12 badges earned&nbsp;&nbsp; |&nbsp;&nbsp; ⭐ 1750
                  total points
                </p>
              </div>

              <Tabs defaultValue="course-completion" className="w-full mt-10">
                <TabsList className="h-[60px] bg-white rounded-[21px] shadow-[0px_0px_20px_#3479ff40] w-full justify-start gap-32">
                  <TabsTrigger
                    value="course-completion"
                    className="w-[254px] bg-[#007fff59] rounded-[20px] p-2.5 font-bold text-[#083a50] text-2xl [font-family:'Nunito',Helvetica] tracking-[0] leading-[19.6px] data-[state=active]:bg-[#007fff59] data-[state=active]:text-[#083a50]"
                  >
                    Course Completion
                  </TabsTrigger>
                  <TabsTrigger
                    value="achievements"
                    className="font-bold text-[#888888] text-2xl [font-family:'Nunito',Helvetica] tracking-[0] leading-[19.6px] data-[state=active]:bg-[#007fff59] data-[state=active]:text-[#083a50]"
                  >
                    Achievements
                  </TabsTrigger>
                  <TabsTrigger
                    value="special"
                    className="font-bold mr-14 text-[#888888] text-2xl [font-family:'Nunito',Helvetica] tracking-[0] leading-[19.6px] data-[state=active]:bg-[#007fff59] data-[state=active]:text-[#083a50]"
                  >
                    Special
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="course-completion" className="mt-[37px]">
                  <img className="w-[1051px] flex-[0_0_auto]" alt="Frame" src="/frame1.png" />
                </TabsContent>

                <TabsContent value="achievements" className="mt-[37px]">
                  <img className="w-[1051px] flex-[0_0_auto]" alt="Frame" />
                </TabsContent>

                <TabsContent value="special" className="mt-[37px]">
                  <img className="w-[1051px] flex-[0_0_auto]" alt="Frame" />
                </TabsContent>
              </Tabs>
            </div>

            <div className="w-[334px] mt-40 flex flex-col gap-[46px]">
              <Card className="h-[496px] p-[24px] bg-white rounded-[12.75px] shadow-[0px_0px_20px_#3479ff40] border-0">
                <CardContent className="p-0 flex flex-col gap-[10.4px]">
                  <div className="h-[87.43px] w-[300px]">
                    <div className="flex items-center justify-center mb-[7px]">
                      <img className="w-7 h-[21px] mr-2" alt="Svg margin" src="/trophy.png" />
                      <div className="font-www-figma-com-semantic-heading-3 font-[number:var(--www-figma-com-semantic-heading-3-font-weight)] text-wwwfigmacommirage text-[length:var(--www-figma-com-semantic-heading-3-font-size)] text-center tracking-[var(--www-figma-com-semantic-heading-3-letter-spacing)] leading-[var(--www-figma-com-semantic-heading-3-line-height)] [font-style:var(--www-figma-com-semantic-heading-3-font-style)]">
                        Your Points
                      </div>
                    </div>

                    <div className="flex flex-col items-center">
                      <div className="font-www-figma-com-segoe-UI-bold font-[number:var(--www-figma-com-segoe-UI-bold-font-weight)] text-[#3479ff] text-[length:var(--www-figma-com-segoe-UI-bold-font-size)] text-center tracking-[var(--www-figma-com-segoe-UI-bold-letter-spacing)] leading-[var(--www-figma-com-segoe-UI-bold-line-height)] [font-style:var(--www-figma-com-segoe-UI-bold-font-style)] mb-2">
                        1,750
                      </div>
                      <div className="[font-family:'Segoe_UI-Regular',Helvetica] font-normal text-wwwfigmacomriver-bed text-[12.3px] text-center tracking-[0] leading-[17.5px]">
                        Total Points Earned
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-[10.51px]">
                    <div className="flex items-center justify-between">
                      <div className="[font-family:'Segoe_UI-Regular',Helvetica] font-normal text-wwwfigmacomriver-bed text-[12.3px] tracking-[0] leading-[17.5px]">
                        Progress to 50% Course Discount
                      </div>
                      <div className="[font-family:'Segoe_UI-Semibold',Helvetica] font-normal text-wwwfigmacommirage text-[12.3px] tracking-[0] leading-[17.5px]">
                        250 points to go
                      </div>
                    </div>
                    <Progress
                      value={87.5}
                      className="h-[10.5px] bg-gray-200 rounded-[40265300px]"
                    />
                  </div>

                  <div className="flex flex-col gap-[10.5px]">
                    <div className="flex items-center">
                      <img
                        className="w-[20.99px] h-[13.99px] mr-2"
                        alt="Svg margin"
                        src="/gift1.png"
                      />
                      <div className="[font-family:'Segoe_UI-Semibold',Helvetica] font-normal text-wwwfigmacommirage text-sm tracking-[0] leading-[21px]">
                        Reward Tiers
                      </div>
                    </div>

                    <div className="flex flex-col gap-[7px]">
                      {rewardTiers.map((tier, index) => (
                        <div
                          key={index}
                          className={`flex items-center justify-between p-[6.39px_7px_7px_6.99px] ${tier.bgColor} rounded-[8.75px]`}
                        >
                          <div className="flex items-center">
                            <div className="pr-[7px]">
                              <div
                                className={`font-www-figma-com-segoe-UI-emoji-regular font-[number:var(--www-figma-com-segoe-UI-emoji-regular-font-weight)] ${tier.textColor} text-[length:var(--www-figma-com-segoe-UI-emoji-regular-font-size)] tracking-[var(--www-figma-com-segoe-UI-emoji-regular-letter-spacing)] leading-[var(--www-figma-com-segoe-UI-emoji-regular-line-height)] [font-style:var(--www-figma-com-segoe-UI-emoji-regular-font-style)]`}
                              >
                                {tier.emoji}
                              </div>
                            </div>
                            <div
                              className={`[font-family:'Segoe_UI-Regular',Helvetica] font-normal ${tier.textColor} text-[12.3px] tracking-[0] leading-[17.5px]`}
                            >
                              {tier.points}
                            </div>
                          </div>
                          <div
                            className={`[font-family:'Segoe_UI-Semibold',Helvetica] font-normal ${tier.textColor} text-[12.3px] tracking-[0] leading-[17.5px]`}
                          >
                            {tier.reward}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="h-[170.38px] p-[22.2px] rounded-[12.75px] border border-solid border-[#b8f7cf] bg-[linear-gradient(90deg,rgba(240,253,244,1)_0%,rgba(243,243,245,1)_100%)]">
                <CardContent className="p-0 flex flex-col items-center gap-[13.1px]">
                  <div className="h-[24.49px] flex items-center justify-center">
                    <img className="w-7 h-[21px] mr-2" alt="Svg margin" src="/gift.png" />
                    <div className="font-www-figma-com-semantic-heading-3 font-[number:var(--www-figma-com-semantic-heading-3-font-weight)] text-wwwfigmacommirage text-[length:var(--www-figma-com-semantic-heading-3-font-size)] text-center tracking-[var(--www-figma-com-semantic-heading-3-letter-spacing)] leading-[var(--www-figma-com-semantic-heading-3-line-height)] [font-style:var(--www-figma-com-semantic-heading-3-font-style)]">
                      Redeem Your Points
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="[font-family:'Segoe_UI-Regular',Helvetica] font-normal text-wwwfigmacomriver-bed text-sm text-center tracking-[0] leading-[21px]">
                      Turn your hard-earned points into amazing
                      <br />
                      rewards
                    </div>
                  </div>

                  <Button className="h-[32.39px] gap-[6.99px] p-[10.5px] rounded-[8.75px] shadow-[0px_4px_6px_-4px_#0000001a,0px_10px_15px_-3px_#0000001a] bg-[linear-gradient(90deg,rgba(0,201,80,1)_0%,rgba(0,153,102,1)_100%)] hover:bg-[linear-gradient(90deg,rgba(0,201,80,1)_0%,rgba(0,153,102,1)_100%)] h-auto">
                    <img className="w-[20.99px] h-[13.99px]" alt="Svg margin" src="/gift.png" />
                    <span className="font-www-figma-com-semantic-button font-[number:var(--www-figma-com-semantic-button-font-weight)] text-wwwfigmacomwhite text-[length:var(--www-figma-com-semantic-button-font-size)] text-center tracking-[var(--www-figma-com-semantic-button-letter-spacing)] leading-[var(--www-figma-com-semantic-button-line-height)] [font-style:var(--www-figma-com-semantic-button-font-style)]">
                      Redeem Points
                    </span>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
    // </div>
  );
};
