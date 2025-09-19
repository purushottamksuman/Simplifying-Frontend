import { XIcon } from "lucide-react";
import React, { useState } from "react";
import { Button } from "../../../components/ui/button";
import { Progress } from "../../../components/ui/progress";
import { Card, CardContent } from "../../../components/ui/card";

// ✅ React Icons
import { FaInstagram, FaFacebook, FaUserFriends, FaTv } from "react-icons/fa";

interface PropertyTeacher4SubsectionProps {
  initialValue?: string;
  onNext: (value: string) => void;
  onBack?: () => void;
  onClose?: () => void;
}



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

export const PropertyTeacher4Subsection: React.FC<PropertyTeacher4SubsectionProps> = ({
  initialValue,
  onNext,
  onBack,
  onClose,
}) => {
  const [selectedOption, setSelectedOption] = useState(initialValue || "facebook");

  return (
  <div className="fixed top-0 left-0 w-screen h-screen flex overflow-hidden shadow-lg z-[9999] bg-white">
    {/* LEFT BLUE PANEL */}
    <div className="w-1/2 h-full bg-[#007fff] relative flex flex-col justify-center items-center p-8">
      <Card className="w-full h-full bg-transparent rounded-none overflow-hidden border-0 shadow-none">
        <CardContent className="relative w-full h-full p-0">
          <div className="absolute bottom-[90px] left-[50px] max-w-[400px] font-black text-white text-[32px] leading-snug">
            Learning Became Easy
          </div>
          <div className="absolute bottom-[20px] left-[50px] max-w-[508px] font-medium text-white text-sm">
            Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit. Amet Ut Nec Vitae Gravida Ullamcorper.
          </div>

          <img
            className="absolute w-[406px] h-[342px] top-[70px] left-[60px]"
            src="/programmer.png"
            alt="Illustration"
          />
        </CardContent>
      </Card>

      <img
        className="absolute top-0 left-0 w-[742px] h-[627px]"
        src="/framestudent.png"
        alt="Frame"
      />
    </div>

    {/* RIGHT FORM PANEL */}
    <div className="w-1/2 h-full bg-white flex flex-col justify-center items-center p-12 relative">
      <img
        className="w-[366px] h-[91px] object-contain mb-12"
        src="/logosimplify.png"
        alt="logosimplify"
      />

      <div className="flex flex-col w-full max-w-[420px] gap-8 items-center">
        <div className="text-center text-xl font-medium text-[#13377c]">
          Learn in a better way!
        </div>

        {/* Progress */}
        <div className="flex flex-col w-full items-center gap-3">
          <Progress value={100} className="w-full h-[10px] bg-[#bddeff] rounded-full" />
          <span className="text-[#81b3ff] font-medium text-lg mt-1">100% Completed</span>
        </div>

        {/* Survey Options */}
        <div className="flex flex-col w-full gap-6">
          {surveyOptions.map((option) => (
            <div
              key={option.id}
              onClick={() => setSelectedOption(option.id)}
              className={`flex items-center gap-4 w-full h-[55px] px-4 cursor-pointer rounded-3xl border transition-all ${
                selectedOption === option.id
                  ? "bg-white border-[#007fff57] shadow-[0px_0px_20px_#007fff33]" // ✅ active glow
                  : "bg-white border-[#e2e2ea]"
              }`}
            >
              {option.icon}
              <span className="font-normal text-[#007fff] text-lg">{option.label}</span>
            </div>
          ))}

          <Button
            disabled={!selectedOption}
            className="w-full h-[55px] bg-[#007fff] rounded-3xl text-white text-2xl font-semibold hover:bg-[#0066cc]"
            onClick={() => selectedOption && onNext(selectedOption)}
          >
            Submit
          </Button>
                    <Button
            variant="outline"
            className="w-full h-[50px] lg:h-[55px] rounded-3xl text-[#007fff] border-[#007fff] text-xl lg:text-2xl font-semibold hover:bg-[#f0f8ff]"
            onClick={onBack}
          >
            Back
          </Button>
        </div>
      </div>
    </div>

    {/* CLOSE BUTTON */}
    {onClose && (
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-5 right-5 w-10 h-10 p-0 hover:bg-gray-100"
        onClick={onClose}
      >
        <XIcon className="w-6 h-6" />
      </Button>
    )}
  </div>
);

};
