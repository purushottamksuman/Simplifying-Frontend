import { XIcon } from "lucide-react";
import React from "react";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";
import { Progress } from "../../../../components/ui/progress";

export const PropertyStudent3Subsection = (): JSX.Element => {
  const hobbies = [
    {
      id: "gaming",
      label: "Gamming",
      icon: "online-gaming",
      selected: false,
      className:
        "relative w-[420px] h-[54px] bg-white rounded-3xl border border-solid border-[#e2e2ea]",
      contentClassName:
        "gap-2 top-[5px] left-[23px] inline-flex items-center relative",
    },
    {
      id: "music",
      label: "Music",
      icon: "music",
      selected: true,
      className: "relative w-[420px] h-[54px] shadow-[0px_0px_20px_#007fff33]",
      contentClassName:
        "gap-[9px] top-[11px] left-6 bg-white inline-flex items-center relative",
      wrapperClassName:
        "relative w-[422px] h-14 -top-px -left-px bg-white rounded-3xl border border-solid border-[#007fff57]",
    },
    {
      id: "coding",
      label: "Coding",
      icon: "coding",
      selected: false,
      className:
        "relative w-[420px] h-[54px] bg-white rounded-3xl border border-solid border-[#e2e2ea]",
      contentClassName:
        "inline-flex items-center gap-2.5 relative top-[5px] left-[23px]",
    },
    {
      id: "reading",
      label: "Reading Books",
      icon: "reading",
      selected: false,
      className:
        "relative w-[420px] h-[54px] bg-white rounded-3xl border border-solid border-[#e2e2ea]",
      contentClassName:
        "gap-3 top-[5px] left-[23px] inline-flex items-center relative",
    },
  ];

  return (
    <div className="w-full h-full bg-white rounded-[37px] overflow-hidden relative">
      <div className="flex w-full h-full">
        <div className="w-[655px] h-full relative">
          <Card className="w-[655px] h-[810px] mt-[13px] bg-[#007fff] rounded-[23px] overflow-hidden shadow-[0px_0px_20px_#3479ff40] border-0">
            <CardContent className="p-0 relative w-full h-full">
              <div className="absolute w-[342px] top-[593px] left-[46px] [font-family:'Playfair_Display',Helvetica] font-black text-white text-[28.7px] tracking-[0] leading-[normal]">
                Learning Became Easy
              </div>

              <div className="absolute w-[508px] top-[679px] left-[46px] [font-family:'Poppins',Helvetica] font-medium text-white text-sm tracking-[0] leading-[normal]">
                Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit. Amet Ut
                Nec Vitae Gravida Ullamcorper .
              </div>

              <img
                className="absolute w-[555px] h-[405px] top-[127px] left-[47px]"
                alt="Chatgpt image aug"
              />
            </CardContent>
          </Card>

          <img
            className="w-[651px] h-[633px] left-px absolute top-0"
            alt="Frame"
          />
        </div>

        <div className="flex flex-col w-[450px] items-center gap-[51px] pt-[51px] pl-[64px]">
          <img
            className="w-[366px] h-[91px] object-cover"
            alt="Simplifying SKILLS"
          />

          <div className="flex flex-col w-[420px] items-center gap-8">
            <div className="w-[379px] [font-family:'Poppins',Helvetica] font-medium text-[#13377c] text-xl text-center tracking-[0] leading-[normal]">
              Dream it. Do it. Live it.
            </div>

            <div className="flex flex-col w-[410px] items-center gap-[18px]">
              <div className="relative w-[410px] h-[18px] bg-[#bddeff] rounded-[100px]">
                <Progress value={50} className="w-full h-full bg-[#bddeff]" />
                <div className="absolute top-0 left-0 w-[194px] h-[18px] bg-[#007fff] rounded-[100px]" />
              </div>

              <div className="[font-family:'DM_Sans',Helvetica] font-medium text-[#81b3ff] text-lg text-center tracking-[0] leading-[normal]">
                50% Completed
              </div>
            </div>

            <div className="flex flex-col w-[420px] items-start gap-[26px]">
              <div className="[font-family:'Roboto',Helvetica] font-semibold text-[#007fff] text-lg text-center tracking-[0.10px] leading-[normal] whitespace-nowrap">
                Select your Hobbies &amp; Interest
              </div>

              <div className="flex flex-col items-center gap-[53px] w-full">
                <div className="flex flex-col items-start gap-[23px] w-full">
                  {hobbies.map((hobby) => (
                    <div key={hobby.id} className={hobby.className}>
                      {hobby.wrapperClassName ? (
                        <div className={hobby.wrapperClassName}>
                          <div className={hobby.contentClassName}>
                            <img
                              className={
                                hobby.id === "music"
                                  ? "relative w-8 h-8"
                                  : "relative w-[42px] h-[42px]"
                              }
                              alt={hobby.icon}
                            />
                            <div className="relative w-fit [font-family:'Roboto',Helvetica] font-normal text-[#007fff] text-lg text-center tracking-[0.10px] leading-[normal] whitespace-nowrap">
                              {hobby.label}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className={hobby.contentClassName}>
                          <img
                            className="relative w-[42px] h-[42px]"
                            alt={hobby.icon}
                          />
                          <div className="relative w-fit [font-family:'Roboto',Helvetica] font-normal text-[#007fff] text-lg text-center tracking-[0.10px] leading-[normal] whitespace-nowrap">
                            {hobby.label}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="w-[340px] h-[53px]">
                  <div className="h-[53px]">
                    <div className="w-[340px] h-[53px] overflow-hidden">
                      <Button className="w-[342px] h-[55px] -top-px -left-px bg-[#007fff] rounded-3xl relative h-auto">
                        <div className="[font-family:'Poppins',Helvetica] font-semibold text-[#fafafb] text-2xl text-center tracking-[0] leading-[normal]">
                          Next
                        </div>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="absolute w-[30px] h-[30px] top-7 right-[43px] h-auto p-0"
      >
        <XIcon className="w-[30px] h-[30px]" />
      </Button>
    </div>
  );
};
