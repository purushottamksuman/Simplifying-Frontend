import React from "react";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";

export const OverlapWrapperSubsection = (): JSX.Element => {
  return (
    <div className="w-full h-[1080px] bg-white relative">
      <div className="relative w-full max-w-[1884px] h-[1026px] top-[54px] left-9 mx-auto">
        {/* Background Container */}
        <div className="w-full max-w-[1831px] h-[971px] bg-[#edf0fa] rounded-[101px]" />

        {/* Mask Image */}
        <img
          className="
            absolute
            w-full max-w-[1040px] h-[970px]
            top-0      /* Slight upward shift for better alignment */
            right-0             /* Stick fully to the right edge */
            lg:right-[-40px]    /* On large screens, overlap slightly for perfect Figma look */
                   rounded-tr-[100px]    /* ✅ Top-right radius */
            rounded-br-[100px]
          "
          alt="Mask group"
          src="/Mask group.png"
        />
      

        <div className="absolute w-[598px] h-[535px] top-[338px] left-[352px] bg-[#007fff59] rounded-[299px/267.5px] blur-[125px]" />

        <div className="absolute w-[568px] h-[535px] top-[157px] left-[83px] bg-[#0011ff59] rounded-[284px/267.5px] blur-[125px]" />
        

        <img
          className="absolute w-[370px] h-[209px] top-[434px] left-[800px]"
          alt="Add a heading"
          src="/bot.png"

        />

        <img
          className="absolute w-[370px] h-[289px] top-[510px] left-[940px]"
          alt="Add a heading"
          src="/code.png"

        />

        <img
          className="absolute w-[420px] h-[328px] top-[439px] left-[1090px]"
          alt="Add a heading"
          src="/messenger.png"

        />

        <img
          className="absolute w-[417px] h-[315px] top-[250px] left-[940px]"
          alt="Add a heading"
          src="/money.png"

        />

        

        <div className="absolute w-[623px] h-[858px] top-[57px] left-36 shadow-[0px_4px_4px_#00000040]">
          <Card className="relative w-[625px] h-[860px] -top-px -left-px bg-white rounded-[20px] shadow-[3px_-5px_40px_#cdcdd31a]">
            <CardContent className="p-0">
              <div className="flex flex-col w-[436px] items-center gap-[49px] absolute top-56 left-[95px]">
                <div className="flex flex-col items-center gap-[19px] relative self-stretch w-full flex-[0_0_auto]">
                  <img
                    className="relative w-[100px] h-[100px] object-cover"
                    alt="Instagram"
                    src="/image (125).png"
                  />

                  <img className="relative w-60 h-[52px]" alt="Otp heading" src="/image (62).png" />

                  <div className="relative self-stretch [font-family:'Poppins',Helvetica] font-medium text-black text-xl text-center tracking-[0] leading-[normal]">
                    🎉 Excellent! Congratulations on starting your journey
                    towards a successful career with Simplifying Skills.
                    Let&#39;s personalize your dashboard for the best
                    experience!&#34;
                  </div>
                </div>

                <div className="relative w-[340px] h-[53px]">
                  <div className="h-[53px]">
                    <div className="w-[340px] h-[53px] overflow-hidden">
                      <Button className="relative w-[342px] h-[55px] -top-px -left-px bg-[#007fff] rounded-3xl hover:bg-[#007fff]/90 h-auto">
                        <div className="[font-family:'Poppins',Helvetica] font-semibold text-[#fafafb] text-2xl text-center tracking-[0] leading-[normal]">
                          Continue
                        </div>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <img
                className="absolute w-[366px] h-[91px] top-[15px] left-[130px] object-cover"
                alt="Simplifying SKILLS"
                src="/simplifying_skills_logo.png"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
