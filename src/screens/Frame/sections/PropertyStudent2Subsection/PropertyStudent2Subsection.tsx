import { XIcon } from "lucide-react";
import React, { useState } from "react";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";
import { Label } from "../../../../components/ui/label";
import { Progress } from "../../../../components/ui/progress";
import { RadioGroup, RadioGroupItem } from "../../../../components/ui/radio-group";
import { FaUserMd, FaChalkboardTeacher, FaGavel } from "react-icons/fa";
import { GiGearHammer } from "react-icons/gi";

interface PropertyStudent2SubsectionProps {
  initialValue?: string;
  onNext: (value: string) => void;
  onBack?: () => void;
  onClose?: () => void;
}

export const PropertyStudent2Subsection: React.FC<PropertyStudent2SubsectionProps> = ({
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
      <div className="w-1/2 h-full bg-white flex flex-col justify-center items-center p-12 relative">
        <img
          className="w-[366px] h-[91px] object-contain mb-12"
          src="/logosimplify.png"
          alt="logosimplify"
        />

        <div className="flex flex-col w-full max-w-[420px] gap-8 items-center">
          <div className="text-center text-xl font-medium text-[#13377c]">
            Map your dreams, chart your career
          </div>

          <div className="w-full flex flex-col items-center gap-3">
            <Progress value={35} className="w-full h-[10px] bg-[#bddeff] rounded-full" />
            <span className="text-[#81b3ff] font-medium text-lg mt-1">35% Completed</span>
          </div>

          <div className="text-center text-xl font-medium text-[#13377c]">
            Select Preferred Career Domain
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
                  className={`flex items-center w-full h-[55px] cursor-pointer rounded-3xl border px-4 ${
                    selectedCareer === option.id
                      ? "bg-white border-[#007fff57] shadow-[0px_0px_20px_#007fff33]"
                      : "bg-white border-[#e2e2ea]"
                  }`}
                >
                  <RadioGroupItem value={option.id} id={option.id} className="sr-only" />
                  <div className="flex items-center gap-2">
                    {option.icon}
                    <span className="font-normal text-[#007fff] text-lg">{option.label}</span>
                  </div>
                </Label>
              ))}
            </RadioGroup>
          </div>

          <Button
            className="w-full h-[55px] bg-[#007fff] rounded-3xl text-white text-2xl font-semibold hover:bg-[#0066cc]"
            onClick={() => onNext(selectedCareer)}
          >
            Next
          </Button>
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
