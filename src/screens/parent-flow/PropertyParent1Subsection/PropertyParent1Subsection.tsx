import { GraduationCapIcon, SchoolIcon, XIcon } from "lucide-react";
import React, { useState } from "react";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import { Label } from "../../../components/ui/label";
import { Progress } from "../../../components/ui/progress";
import {
  RadioGroup,
  RadioGroupItem,
} from "../../../components/ui/radio-group";

const educationOptions = [
  {
    id: "school",
    label: "School",
    icon: SchoolIcon,
    selected: true,
  },
  {
    id: "university",
    label: "University",
    icon: GraduationCapIcon,
    selected: false,
  },
];

export const PropertyParent1Subsection = ({
  initialValue,
  onNext,
  onBack,
  onClose,
}: {
  initialValue?: string;
  onNext: (value: string) => void;
  onBack?: () => void;
  onClose?: () => void;
}) => {
  const [selectedEducation, setSelectedEducation] = useState(
    initialValue || "school"
  );

  return (
    <div className="fixed top-0 left-0 w-screen h-screen flex overflow-hidden shadow-lg z-[9999] bg-white">
      {/* LEFT BLUE PANEL */}
      <div className="w-1/2 h-full bg-[#007fff] relative flex flex-col justify-center items-center p-8">
        <Card className="w-full h-full bg-transparent rounded-none overflow-hidden border-0 shadow-none">
          <CardContent className="relative w-full h-full p-0">
            {/* Title and description */}
            <div className="absolute bottom-[90px] left-[50px] max-w-[400px] font-black text-white text-[32px] leading-snug">
              Learning Became Easy
            </div>
            <div className="absolute bottom-[20px] left-[50px] max-w-[508px] font-medium text-white text-sm">
              Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit. Amet Ut
              Nec Vitae Gravida Ullamcorper.
            </div>

            {/* Main illustration */}
            <img
              className="absolute w-[375px] h-[433px] top-[70px] left-[139px]"
              src="/sch_students.png"
              alt="Illustration"
            />
          </CardContent>
        </Card>

        {/* Frame image */}
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
            Learn in a better way!!
          </div>

          <div className="w-full flex flex-col items-center gap-3">
            <Progress
              value={20}
              className="w-full h-[10px] bg-[#bddeff] rounded-full"
            />
            <span className="text-[#81b3ff] font-medium text-lg mt-1">
              10% Completed
            </span>
          </div>

          <div className="text-center text-xl font-medium text-[#13377c]">
            Is your kid in?
          </div>

          <div className="flex flex-col w-full items-center gap-6">
            <RadioGroup
              value={selectedEducation}
              onValueChange={setSelectedEducation}
              className="flex flex-col gap-4 w-full"
            >
              {educationOptions.map((option) => {
                const IconComponent = option.icon;
                const isSelected = selectedEducation === option.id;

                return (
                  <div key={option.id} className="w-full h-[55px] relative">
                    <div
                      className={`w-full h-full bg-white rounded-3xl border flex items-center px-6 ${
                        isSelected
                          ? "border-[#007fff57] shadow-[0px_0px_20px_#007fff33]"
                          : "border-[#e2e2ea]"
                      }`}
                    >
                      <Label
                        htmlFor={option.id}
                        className="flex items-center gap-2.5 h-full w-full cursor-pointer"
                      >
                        <RadioGroupItem
                          value={option.id}
                          id={option.id}
                          className="sr-only"
                        />
                        <IconComponent className="w-[42px] h-[42px] text-[#007fff]" />
                        <span className="font-normal text-[#007fff] text-lg text-center whitespace-nowrap">
                          {option.label}
                        </span>
                      </Label>
                    </div>
                  </div>
                );
              })}
            </RadioGroup>

            <Button
              className="w-full h-[55px] bg-[#007fff] rounded-3xl text-white text-2xl font-semibold hover:bg-[#0066cc]"
              onClick={() => onNext(selectedEducation)}
            >
              Next
            </Button>

            {onBack && (
              <button onClick={onBack} className="mt-3 text-sm text-gray-500">
                Back
              </button>
            )}
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

