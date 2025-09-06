import { XIcon } from "lucide-react";
import React, { useState } from "react";
import { Button } from "../../../../components/ui/button";
import { Label } from "../../../../components/ui/label";
import { Progress } from "../../../../components/ui/progress";
import {
  RadioGroup,
  RadioGroupItem,
} from "../../../../components/ui/radio-group";

// ✅ React Icons
import { FaInstagram, FaFacebook, FaUserFriends, FaTv } from "react-icons/fa";

const decorativeElements = [];

const textElements = [
  // {
  //   className:
  //     "w-[23px] top-[167px] left-[120px] [-webkit-text-stroke:3px_#ffc909] [font-family:'Righteous',Helvetica] font-normal text-[#ffffff1a] text-[76px] tracking-[2.28px] leading-[normal]",
  //   text: "X",
  // },
  // {
  //   className:
  //     "top-[148px] left-[459px] w-3.5 [-webkit-text-stroke:3px_#ffc909] [font-family:'Righteous',Helvetica] font-normal text-[#ffffff33] text-[42px] tracking-[1.26px] leading-[normal]",
  //   text: "B",
  // },
  // {
  //   className:
  //     "w-[27px] top-[339px] left-[489px] [-webkit-text-stroke:3px_#ffc909] [font-family:'Righteous',Helvetica] font-normal text-[#ffffff1a] text-[90px] tracking-[2.70px] leading-[normal]",
  //   text: "g",
  // },
  // {
  //   className:
  //     "top-[249px] left-[462px] w-[17px] [-webkit-text-stroke:3px_#ffc909] [font-family:'Righteous',Helvetica] font-normal text-[#ffffff33] text-[42px] tracking-[1.26px] leading-[normal]",
  //   text: "M",
  // },
  // {
  //   className:
  //     "w-3.5 top-[126px] left-[194px] [-webkit-text-stroke:3px_#ffc909] [font-family:'Righteous',Helvetica] font-normal text-[#ffffff33] text-[42px] tracking-[1.26px] leading-[normal]",
  //   text: "D",
  // },
];

// ✅ Replace icons with React Icon components
const surveyOptions = [
  {
    id: "instagram",
    label: "Instagram",
    icon: <FaInstagram className="w-[28px] h-[28px] text-[#E1306C]" />,
  },
  {
    id: "ott",
    label: "OTT Ads",
    icon: <FaTv className="w-[28px] h-[28px] text-[#007fff]" />,
  },
  {
    id: "facebook",
    label: "Facebook",
    icon: <FaFacebook className="w-[28px] h-[28px] text-[#1877F2]" />,
  },
  {
    id: "friend",
    label: "Refer By Friend",
    icon: <FaUserFriends className="w-[28px] h-[28px] text-[#007fff]" />,
  },
];

export const PropertyStudent6Subsection = (): JSX.Element => {
  const [selectedOption, setSelectedOption] = useState("facebook");

  return (
    <div className="w-full h-auto bg-white rounded-[37px] overflow-hidden relative">
      <div className="flex flex-col lg:flex-row min-h-[835px]">
        {/* Left Side */}
        <div className="flex-1 lg:w-[655px] p-3">
          <div className="bg-[#007fff] rounded-[23px] overflow-hidden shadow-[0px_0px_20px_#3479ff40] h-full relative">
            <div className="absolute w-[342px] top-[593px] left-[46px] [font-family:'Playfair_Display',Helvetica] font-black text-white text-[28.7px] tracking-[0] leading-[normal]">
              Learning Became Easy
            </div>

            <div className="absolute w-[508px] top-[679px] left-[46px] [font-family:'Poppins',Helvetica] font-medium text-white text-sm tracking-[0] leading-[normal]">
              Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit. Amet Ut
              Nec Vitae Gravida Ullamcorper .
            </div>

            <img
              className="w-[651px] h-[633px] left-px absolute top-0"
              src="/framestudent.png"
              alt="Frame"
            />

            <img
              className="absolute w-[406px] h-[342px] top-[158px] left-[60px]"
              src="/programmer.png"
              alt="Group"
            />

            <div className="absolute w-[651px] h-[627px] top-0 left-px">
              {decorativeElements.map((element, index) => (
                <img
                  key={`decorative-${index}`}
                  className={`absolute ${element.className}`}
                  alt={element.alt}
                />
              ))}

              {textElements.map((element, index) => (
                <div
                  key={`text-${index}`}
                  className={`absolute ${element.className}`}
                >
                  {element.text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex-1 lg:w-[450px] flex flex-col items-center gap-[51px] p-[51px] pt-[51px]">
          <img
            className="w-[366px] h-[91px] object-cover"
            src="/logosimplify.png"
            alt="Simplifying SKILLS"
          />

          <div className="flex flex-col w-full max-w-[420px] items-center gap-8">
            <div className="w-full max-w-[379px] [font-family:'Poppins',Helvetica] font-medium text-[#13377c] text-xl text-center tracking-[0] leading-[normal]">
              learn in better way !!
            </div>

            <div className="flex flex-col w-full max-w-[410px] items-center gap-[18px]">
              <div className="w-full h-[18px] bg-[#bddeff] rounded-[100px] overflow-hidden">
                <Progress
                  value={100}
                  className="h-full bg-[#007fff] rounded-[100px]"
                />
              </div>

              <div className="w-full [font-family:'DM_Sans',Helvetica] font-medium text-[#81b3ff] text-lg text-center tracking-[0] leading-[normal]">
                100% Completed
              </div>
            </div>

            {/* Survey Options */}
            <div className="flex flex-col w-full max-w-[420px] items-start justify-center gap-[26px]">
              <div className="[font-family:'Roboto',Helvetica] font-semibold text-[#007fff] text-lg text-center tracking-[0.10px] leading-[normal]">
                How did you hear about us ?
              </div>

              <div className="flex flex-col items-center gap-[53px] w-full">
                <RadioGroup
                  value={selectedOption}
                  onValueChange={setSelectedOption}
                  className="flex flex-col items-start gap-[23px] w-full"
                >
                  {surveyOptions.map((option) => (
                    <div
                      key={option.id}
                      className={`w-full h-[54px] bg-white rounded-3xl border border-solid ${
                        selectedOption === option.id
                          ? "border-[#007fff57] shadow-[0px_0px_20px_#007fff33]"
                          : "border-[#e2e2ea]"
                      }`}
                    >
                      <Label
                        htmlFor={option.id}
                        className="flex items-center gap-[13px] h-full px-[23px] py-[5px] cursor-pointer"
                      >
                        <RadioGroupItem
                          value={option.id}
                          id={option.id}
                          className="sr-only"
                        />
                        {option.icon}
                        <span className="[font-family:'Roboto',Helvetica] font-normal text-[#007fff] text-lg text-center tracking-[0.10px] leading-[normal]">
                          {option.label}
                        </span>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>

                <Button className="w-[340px] h-[53px] bg-[#007fff] rounded-3xl [font-family:'Poppins',Helvetica] font-semibold text-[#fafafb] text-2xl text-center tracking-[0] leading-[normal] h-auto">
                  Submit
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
        className="absolute top-7 right-[73px] w-[30px] h-[30px] p-0"
      >
        <XIcon className="w-[30px] h-[30px]" />
      </Button>
    </div>
  );
};
