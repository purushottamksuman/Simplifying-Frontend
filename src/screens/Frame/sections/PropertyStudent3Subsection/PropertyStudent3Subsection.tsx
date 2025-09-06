import { XIcon } from "lucide-react";
import React from "react";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";
import { Progress } from "../../../../components/ui/progress";
import { FaGamepad, FaMusic, FaBook } from "react-icons/fa";
import { SiCodementor } from "react-icons/si";

export const PropertyStudent3Subsection = (): JSX.Element => {
  const hobbies = [
    {
      id: "gaming",
      label: "Gaming",
      icon: <FaGamepad className="w-8 h-8 text-[#007fff]" />,
      selected: false,
      className:
        "relative w-[420px] h-[54px] bg-white rounded-3xl border border-solid border-[#e2e2ea]",
      contentClassName:
        "gap-2 top-[5px] left-[23px] inline-flex items-center relative",
    },
    {
      id: "music",
      label: "Music",
      icon: <FaMusic className="w-8 h-8 text-[#007fff]" />,
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
      icon: <SiCodementor className="w-8 h-8 text-[#007fff]" />,
      selected: false,
      className:
        "relative w-[420px] h-[54px] bg-white rounded-3xl border border-solid border-[#e2e2ea]",
      contentClassName:
        "inline-flex items-center gap-2.5 relative top-[5px] left-[23px]",
    },
    {
      id: "reading",
      label: "Reading Books",
      icon: <FaBook className="w-8 h-8 text-[#007fff]" />,
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
        {/* Left Card */}
        <div className="w-[655px] h-full relative">
          <Card className="w-[655px] h-[810px] mt-[13px] bg-[#007fff] rounded-[23px] overflow-hidden shadow-[0px_0px_20px_#3479ff40] border-0">
            <CardContent className="p-0 relative w-full h-full">
              <div className="absolute w-[342px] top-[593px] left-[46px] [font-family:'Playfair_Display',Helvetica] font-black text-white text-[28.7px]">
                Learning Became Easy
              </div>
              <div className="absolute w-[508px] top-[679px] left-[46px] [font-family:'Poppins',Helvetica] font-medium text-white text-sm">
                Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit. Amet Ut
                Nec Vitae Gravida Ullamcorper.
              </div>
              <img
                className="absolute w-[555px] h-[405px] top-[127px] left-[47px]"
                src="/happy_teacher.png"
                alt="happy"
              />
            </CardContent>
          </Card>
          <img
            className="w-[651px] h-[633px] left-px absolute top-0"
            src="/framestudent.png"
            alt="Frame"
          />
        </div>

        {/* Right Section */}
        <div className="flex flex-col w-[450px] items-center gap-[51px] pt-[51px] pl-[64px]">
          <img
            className="w-[366px] h-[91px] object-cover"
            src="/logosimplify.png"
            alt="Simplifying SKILLS"
          />

          <div className="flex flex-col w-[420px] items-center gap-8">
            <div className="w-[379px] font-medium text-[#13377c] text-xl text-center">
              Dream it. Do it. Live it.
            </div>

            {/* Progress */}
            <div className="flex flex-col w-[410px] items-center gap-[18px]">
              <div className="relative w-[410px] h-[18px] bg-[#bddeff] rounded-[100px]">
                <Progress value={50} className="w-full h-full bg-[#bddeff]" />
                <div className="absolute top-0 left-0 w-[194px] h-[18px] bg-[#007fff] rounded-[100px]" />
              </div>
              <div className="font-medium text-[#81b3ff] text-lg">
                50% Completed
              </div>
            </div>

            {/* Hobby Selection */}
            <div className="flex flex-col w-[420px] items-start gap-[26px]">
              <div className="font-semibold text-[#007fff] text-lg">
                Select your Hobbies &amp; Interest
              </div>

              <div className="flex flex-col items-center gap-[53px] w-full">
                <div className="flex flex-col items-start gap-[23px] w-full">
                  {hobbies.map((hobby) => (
                    <div key={hobby.id} className={hobby.className}>
                      {hobby.wrapperClassName ? (
                        <div className={hobby.wrapperClassName}>
                          <div className={hobby.contentClassName}>
                            {hobby.icon}
                            <div className="font-normal text-[#007fff] text-lg">
                              {hobby.label}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className={hobby.contentClassName}>
                          {hobby.icon}
                          <div className="font-normal text-[#007fff] text-lg">
                            {hobby.label}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <Button className="w-[342px] h-[55px] bg-[#007fff] rounded-3xl hover:bg-[#0066cc]">
                  <span className="font-semibold text-[#fafafb] text-2xl">
                    Next
                  </span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Close Button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute w-[30px] h-[30px] top-7 right-[43px] p-0"
      >
        <XIcon className="w-[30px] h-[30px]" />
      </Button>
    </div>
  );
};
