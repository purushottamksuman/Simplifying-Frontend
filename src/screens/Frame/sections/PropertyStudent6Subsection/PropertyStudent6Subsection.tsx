import { XIcon } from "lucide-react";
import React, { useState } from "react";
import { Button } from "../../../../components/ui/button";
import { Label } from "../../../../components/ui/label";
import { Progress } from "../../../../components/ui/progress";
import {
  RadioGroup,
  RadioGroupItem,
} from "../../../../components/ui/radio-group";

const decorativeElements = [
  {
    className: "w-[61px] h-[78px] top-[74px] left-[37px]",
    alt: "Group",
  },
  {
    className: "w-[61px] h-[59px] top-[119px] left-[512px]",
    alt: "Group",
  },
  {
    className: "w-[99px] h-[19px] top-[18px] left-[257px]",
    alt: "Group",
  },
  {
    className: "w-9 h-[67px] top-[357px] left-24",
    alt: "Group",
  },
  {
    className: "w-[63px] h-[52px] -top-1.5 left-[426px]",
    alt: "Group",
  },
  {
    className: "w-[61px] h-[55px] top-[72px] left-[305px]",
    alt: "Group",
  },
  {
    className: "w-[52px] h-[70px] top-[487px] left-[17px]",
    alt: "Group",
  },
  {
    className: "w-[52px] h-14 top-[41px] left-[158px]",
    alt: "Group",
  },
  {
    className: "w-14 h-[18px] top-[33px] left-[51px]",
    alt: "Group",
  },
  {
    className: "w-14 h-[18px] top-[543px] left-48",
    alt: "Group",
  },
  {
    className: "w-[62px] h-[21px] top-[42px] left-[540px]",
    alt: "Group",
  },
  {
    className: "w-[62px] h-[21px] top-[561px] left-[403px]",
    alt: "Group",
  },
  {
    className: "w-[34px] h-[45px] top-[285px] left-0",
    alt: "Group",
  },
  {
    className: "w-12 h-[52px] top-[496px] left-[603px]",
    alt: "Group",
  },
  {
    className: "w-[37px] h-[81px] top-[296px] left-[614px]",
    alt: "Group",
  },
  {
    className: "w-[45px] h-[23px] top-[604px] left-[547px]",
    alt: "Group",
  },
];

const textElements = [
  {
    className:
      "w-[23px] top-[167px] left-[120px] [-webkit-text-stroke:3px_#ffc909] [font-family:'Righteous',Helvetica] font-normal text-[#ffffff1a] text-[76px] tracking-[2.28px] leading-[normal]",
    text: "X",
  },
  {
    className:
      "top-[148px] left-[459px] w-3.5 [-webkit-text-stroke:3px_#ffc909] [font-family:'Righteous',Helvetica] font-normal text-[#ffffff33] text-[42px] tracking-[1.26px] leading-[normal]",
    text: "B",
  },
  {
    className:
      "w-[27px] top-[339px] left-[489px] [-webkit-text-stroke:3px_#ffc909] [font-family:'Righteous',Helvetica] font-normal text-[#ffffff1a] text-[90px] tracking-[2.70px] leading-[normal]",
    text: "g",
  },
  {
    className:
      "top-[249px] left-[462px] w-[17px] [-webkit-text-stroke:3px_#ffc909] [font-family:'Righteous',Helvetica] font-normal text-[#ffffff33] text-[42px] tracking-[1.26px] leading-[normal]",
    text: "M",
  },
  {
    className:
      "w-3.5 top-[126px] left-[194px] [-webkit-text-stroke:3px_#ffc909] [font-family:'Righteous',Helvetica] font-normal text-[#ffffff33] text-[42px] tracking-[1.26px] leading-[normal]",
    text: "D",
  },
];

const surveyOptions = [
  {
    id: "instagram",
    label: "Instagram",
    icon: "Instagram",
  },
  {
    id: "ott",
    label: "OTT Ads",
    icon: "Ott media",
  },
  {
    id: "facebook",
    label: "Facebook",
    icon: "Facebook",
  },
  {
    id: "friend",
    label: "Refer By Friend",
    icon: "Friend",
  },
];

export const PropertyStudent6Subsection = (): JSX.Element => {
  const [selectedOption, setSelectedOption] = useState("facebook");

  return (
    <div className="w-full h-auto bg-white rounded-[37px] overflow-hidden relative">
      <div className="flex flex-col lg:flex-row min-h-[835px]">
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
              className="absolute w-[406px] h-[342px] top-[158px] left-[122px]"
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

        <div className="flex-1 lg:w-[450px] flex flex-col items-center gap-[51px] p-[51px] pt-[51px]">
          <img
            className="w-[366px] h-[91px] object-cover"
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
                        <img className="w-[42px] h-[42px]" alt={option.icon} />
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
