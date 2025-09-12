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

interface PropertyStudent6SubsectionProps {
  initialValue?: string;
  onNext: (value: string) => void;
  onBack?: () => void;
  onClose?: () => void;
}

const decorativeElements = [];

const textElements = [];

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

export const PropertyStudent6Subsection: React.FC<PropertyStudent6SubsectionProps> = ({
  initialValue,
  onNext,
  onBack,
  onClose,
}) => {
  const [selectedOption, setSelectedOption] = useState(initialValue || "facebook");

  return (
    <div className="w-full h-auto bg-white rounded-[37px] overflow-hidden relative">
      <div className="flex flex-col lg:flex-row min-h-[835px]">
        {/* Left Side */}
        <div className="flex-1 lg:w-[655px] p-3">
          <div className="bg-[#007fff] rounded-[23px] overflow-hidden shadow-[0px_0px_20px_#3479ff40] h-full relative">
            <div className="absolute w-[342px] top-[593px] left-[46px] font-black text-white text-[28.7px]">
              Learning Became Easy
            </div>

            <div className="absolute w-[508px] top-[679px] left-[46px] font-medium text-white text-sm">
              Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit. Amet Ut
              Nec Vitae Gravida Ullamcorper.
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
            <div className="w-full max-w-[379px] font-medium text-[#13377c] text-xl text-center">
              Learn in a better way!
            </div>

            {/* Progress */}
            <div className="flex flex-col w-full max-w-[410px] items-center gap-[18px]">
              <div className="w-full h-[18px] bg-[#bddeff] rounded-[100px] overflow-hidden">
                <Progress value={100} className="h-full bg-[#007fff] rounded-[100px]" />
              </div>
              <div className="w-full font-medium text-[#81b3ff] text-lg text-center">
                100% Completed
              </div>
            </div>

            {/* Survey Options */}
            <div className="flex flex-col w-full max-w-[420px] items-start justify-center gap-[26px]">
              <div className="font-semibold text-[#007fff] text-lg text-center">
                How did you hear about us?
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
                        <span className="font-normal text-[#007fff] text-lg text-center">
                          {option.label}
                        </span>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>

                {/* Buttons */}
                <div className="flex gap-4 w-full">
                  
                  <Button
                    className="flex-1 h-[53px] bg-[#007fff] rounded-3xl hover:bg-[#0066cc]"
                    onClick={() => onNext(selectedOption)}
                  >
                    Submit
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Close Button */}
      {onClose && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-7 right-[73px] w-[30px] h-[30px] p-0"
          onClick={onClose}
        >
          <XIcon className="w-[30px] h-[30px]" />
        </Button>
      )}
    </div>
  );
};
