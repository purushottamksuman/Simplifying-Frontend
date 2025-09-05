import { XIcon } from "lucide-react";
import React from "react";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";
import { Progress } from "../../../../components/ui/progress";

export const PropertyStudent4Subsection = (): JSX.Element => {
  const decorativeElements = [
    {
      className: "absolute w-[61px] h-[78px] top-[74px] left-[37px]",
      alt: "Group",
    },
    {
      className: "absolute w-[61px] h-[59px] top-[119px] left-[512px]",
      alt: "Group",
    },
    {
      className: "absolute w-[99px] h-[19px] top-[18px] left-[257px]",
      alt: "Group",
    },
    {
      className: "absolute w-9 h-[67px] top-[357px] left-24",
      alt: "Group",
    },
    {
      className: "absolute w-[63px] h-[52px] -top-1.5 left-[426px]",
      alt: "Group",
    },
    {
      className: "absolute w-[61px] h-[55px] top-[72px] left-[305px]",
      alt: "Group",
    },
    {
      className: "absolute w-[52px] h-[70px] top-[487px] left-[17px]",
      alt: "Group",
    },
    {
      className: "absolute w-[52px] h-14 top-[41px] left-[158px]",
      alt: "Group",
    },
    {
      className: "absolute w-14 h-[18px] top-[33px] left-[51px]",
      alt: "Group",
    },
    {
      className: "absolute w-14 h-[18px] top-[543px] left-48",
      alt: "Group",
    },
    {
      className: "absolute w-[62px] h-[21px] top-[42px] left-[540px]",
      alt: "Group",
    },
    {
      className: "absolute w-[62px] h-[21px] top-[561px] left-[403px]",
      alt: "Group",
    },
    {
      className: "absolute w-[34px] h-[45px] top-[285px] left-0",
      alt: "Group",
    },
    {
      className: "absolute w-12 h-[52px] top-[496px] left-[603px]",
      alt: "Group",
    },
    {
      className: "absolute w-[37px] h-[81px] top-[296px] left-[614px]",
      alt: "Group",
    },
    {
      className: "absolute w-[45px] h-[23px] top-[604px] left-[547px]",
      alt: "Group",
    },
  ];

  const decorativeLetters = [
    {
      className:
        "absolute w-[23px] top-[167px] left-[120px] [-webkit-text-stroke:3px_#ffc909] [font-family:'Righteous',Helvetica] font-normal text-[#ffffff1a] text-[76px] tracking-[2.28px] leading-[normal]",
      text: "X",
    },
    {
      className:
        "absolute w-3.5 top-[148px] left-[459px] [-webkit-text-stroke:3px_#ffc909] [font-family:'Righteous',Helvetica] font-normal text-[#ffffff33] text-[42px] tracking-[1.26px] leading-[normal]",
      text: "B",
    },
    {
      className:
        "absolute w-[27px] top-[339px] left-[489px] [-webkit-text-stroke:3px_#ffc909] [font-family:'Righteous',Helvetica] font-normal text-[#ffffff1a] text-[90px] tracking-[2.70px] leading-[normal]",
      text: "g",
    },
    {
      className:
        "absolute w-[17px] top-[249px] left-[462px] [-webkit-text-stroke:3px_#ffc909] [font-family:'Righteous',Helvetica] font-normal text-[#ffffff33] text-[42px] tracking-[1.26px] leading-[normal]",
      text: "M",
    },
    {
      className:
        "absolute w-3.5 top-[126px] left-[194px] [-webkit-text-stroke:3px_#ffc909] [font-family:'Righteous',Helvetica] font-normal text-[#ffffff33] text-[42px] tracking-[1.26px] leading-[normal]",
      text: "D",
    },
    {
      className:
        "absolute w-2 top-[442px] left-[84px] [-webkit-text-stroke:3px_#ffc909] [font-family:'Righteous',Helvetica] font-normal text-[#ffffff33] text-[42px] tracking-[1.26px] leading-[normal]",
      text: "f",
    },
  ];

  const goalOptions = [
    {
      icon: "Self improvement",
      text: "Learning Skills",
      selected: false,
    },
    {
      icon: "Test outcome",
      text: "Exam Preparation",
      selected: true,
    },
    {
      icon: "Coding",
      text: "Learn Coding",
      selected: false,
    },
    {
      icon: "Reading",
      text: "Gain Extra Knowledge",
      selected: false,
    },
  ];

  return (
    <div className="w-full h-auto bg-white rounded-[37px] overflow-hidden relative">
      <div className="flex flex-col lg:flex-row gap-8 p-8">
        <div className="flex-1 relative">
          <Card className="bg-[#007fff] rounded-[23px] overflow-hidden shadow-[0px_0px_20px_#3479ff40] border-0 h-[810px] relative">
            <CardContent className="p-0 relative h-full">
              <div className="absolute w-[342px] top-[593px] left-[46px] [font-family:'Playfair_Display',Helvetica] font-black text-white text-[28.7px] tracking-[0] leading-[normal]">
                Learning Became Easy
              </div>

              <div className="absolute w-[508px] top-[679px] left-[46px] [font-family:'Poppins',Helvetica] font-medium text-white text-sm tracking-[0] leading-[normal]">
                Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit. Amet Ut
                Nec Vitae Gravida Ullamcorper .
              </div>

              <img
                className="absolute w-[413px] h-[365px] top-[152px] left-[109px]"
                alt="Group"
              />

              <div className="absolute w-[651px] h-[627px] top-0 left-px">
                {decorativeElements.map((element, index) => (
                  <img
                    key={`decorative-${index}`}
                    className={element.className}
                    alt={element.alt}
                  />
                ))}

                {decorativeLetters.map((letter, index) => (
                  <div key={`letter-${index}`} className={letter.className}>
                    {letter.text}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col w-[450px] items-center gap-[51px]">
          <img
            className="w-[366px] h-[91px] object-cover"
            alt="Simplifying SKILLS"
          />

          <div className="flex flex-col w-[420px] items-center gap-8">
            <div className="w-[379px] [font-family:'Poppins',Helvetica] font-medium text-[#13377c] text-xl text-center tracking-[0] leading-[normal]">
              Grow your goals, bloom your future
            </div>

            <div className="flex flex-col w-[410px] items-center gap-[18px]">
              <div className="w-full relative">
                <Progress value={60} className="w-full h-[18px] bg-[#bddeff]" />
              </div>

              <div className="[font-family:'DM_Sans',Helvetica] font-medium text-[#81b3ff] text-lg text-center tracking-[0] leading-[normal]">
                60% Completed
              </div>
            </div>

            <div className="flex flex-col w-[420px] items-start gap-[26px]">
              <div className="[font-family:'Roboto',Helvetica] font-semibold text-[#007fff] text-lg text-center tracking-[0.10px] leading-[normal] whitespace-nowrap">
                What Is Your Goal's
              </div>

              <div className="flex flex-col items-center gap-[53px] w-full">
                <div className="flex flex-col items-start gap-[23px] w-full">
                  {goalOptions.map((option, index) => (
                    <Card
                      key={`goal-${index}`}
                      className={`w-[420px] h-[54px] bg-white rounded-3xl border border-solid cursor-pointer transition-all ${
                        option.selected
                          ? "border-[#007fff57] shadow-[0px_0px_20px_#007fff33]"
                          : "border-[#e2e2ea]"
                      }`}
                    >
                      <CardContent className="p-0">
                        <div
                          className={`gap-2 ${option.selected ? "top-2 left-6" : "top-[7px] left-[23px]"} inline-flex items-center relative`}
                        >
                          <img
                            className="w-[38px] h-[38px]"
                            alt={option.icon}
                          />
                          <div className="[font-family:'Roboto',Helvetica] font-normal text-[#007fff] text-lg text-center tracking-[0.10px] leading-[normal] whitespace-nowrap">
                            {option.text}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Button className="w-[340px] h-[53px] bg-[#007fff] rounded-3xl [font-family:'Poppins',Helvetica] font-semibold text-[#fafafb] text-2xl text-center tracking-[0] leading-[normal] h-auto">
                  Next
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="absolute top-7 right-[73px] w-[30px] h-[30px] p-0"
      >
        <XIcon className="w-[30px] h-[30px]" />
      </Button>
    </div>
  );
};
