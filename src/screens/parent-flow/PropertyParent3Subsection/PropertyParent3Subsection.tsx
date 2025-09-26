import { XIcon } from "lucide-react";
import React, { useState } from "react";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import { Label } from "../../../components/ui/label";
import { Progress } from "../../../components/ui/progress";
import { RadioGroup, RadioGroupItem } from "../../../components/ui/radio-group";
import { FaUserMd, FaChalkboardTeacher, FaGavel } from "react-icons/fa";
import { GiGearHammer } from "react-icons/gi";

interface PropertyParent3SubsectionProps {
  initialValue?: string;
  onNext: (value: string) => void;
  onBack?: () => void;
  onClose?: () => void;
}

export const PropertyParent3Subsection: React.FC<PropertyParent3SubsectionProps> = ({
  initialValue,
  onNext,
  onBack,
  onClose,
}) => {
  const [selectedCareer, setSelectedCareer] = useState(initialValue || "doctor");

  const careerOptions = [
    { id: "doctor", label: "Doctor", icon: <FaUserMd size={28} className="text-[#007fff]" /> },
    { id: "engineer", label: "Engineer", icon: <GiGearHammer size={28} className="text-[#007fff]" /> },
    { id: "teacher", label: "Teacher", icon: <FaChalkboardTeacher size={28} className="text-[#007fff]" /> },
    { id: "lawyer", label: "Lawyer", icon: <FaGavel size={28} className="text-[#007fff]" /> },
  ];

  return (
<div className="fixed top-0 left-0 w-screen h-screen flex overflow-hidden shadow-lg z-[9999] bg-white">
  {/* LEFT BLUE PANEL */}
  <div className="hidden md:flex w-1/2 h-full bg-[#007fff] relative flex-col justify-center items-center p-8">
    <Card className="w-full h-full bg-transparent rounded-none overflow-hidden border-0 shadow-none">
      <CardContent className="relative w-full h-full p-0">
        <div className="absolute bottom-[90px] left-[50px] max-w-[400px] font-black text-white text-[32px] leading-snug">
          Learning Became Easy
        </div>
        <div className="absolute bottom-[20px] left-[50px] max-w-[508px] font-medium text-white text-sm">
          Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit. Amet Ut Nec Vitae Gravida Ullamcorper.
        </div>

        <img
          className="absolute w-[315px] h-[443px] top-[60px] left-[180px]"
          src="/topper_girl.png"
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
  <div className="w-full md:w-1/2 h-full bg-white flex flex-col items-center p-6 md:p-12 relative overflow-y-auto">
    <img
      className="w-[220px] md:w-[366px] h-auto object-contain mb-8 md:mb-12"
          src="/logosimplify.png"
          alt="logosimplify"
        />

        <div className="flex flex-col w-full max-w-[420px] gap-6 lg:gap-8 items-center">
          <div className="text-center text-lg lg:text-xl font-medium text-[#13377c]">
            Map your dreams, chart your career
          </div>

          <div className="w-full flex flex-col items-center gap-3">
            <Progress value={75} className="w-full h-[8px] lg:h-[10px] bg-[#bddeff] rounded-full" />
            <span className="text-[#81b3ff] font-medium text-base lg:text-lg mt-1">
              75% Completed
            </span>
          </div>

          <div className="text-center text-lg lg:text-xl font-medium text-[#13377c]">
            What do you want your kid to become?
          </div>

          <div className="flex flex-col w-full items-center gap-4">
            <RadioGroup
              value={selectedCareer}
              onValueChange={setSelectedCareer}
              className="flex flex-col gap-4 w-full"
            >
              {careerOptions.map((option) => (
                <Label
                  key={option.id}
                  htmlFor={option.id}
                  className={`flex items-center w-full h-[50px] lg:h-[55px] cursor-pointer rounded-3xl border px-4 ${
                    selectedCareer === option.id
                      ? "bg-white border-[#007fff57] shadow-[0px_0px_20px_#007fff33]"
                      : "bg-white border-[#e2e2ea]"
                  }`}
                >
                  <RadioGroupItem value={option.id} id={option.id} className="sr-only" />
                  <div className="flex items-center gap-2">
                    {option.icon}
                    <span className="font-normal text-[#007fff] text-base lg:text-lg">
                      {option.label}
                    </span>
                  </div>
                </Label>
              ))}
            </RadioGroup>
          </div>

          <Button
            className="w-full h-[50px] lg:h-[55px] bg-[#007fff] rounded-3xl text-white text-xl lg:text-2xl font-semibold hover:bg-[#0066cc]"
            onClick={() => onNext(selectedCareer)}
          >
            Next
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

      {/* CLOSE BUTTON */}
      {onClose && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-3 right-3 lg:top-5 lg:right-5 w-8 h-8 lg:w-10 lg:h-10 p-0 hover:bg-gray-100"
          onClick={onClose}
        >
          <XIcon className="w-5 h-5 lg:w-6 lg:h-6" />
        </Button>
      )}
    </div>
  );
};
