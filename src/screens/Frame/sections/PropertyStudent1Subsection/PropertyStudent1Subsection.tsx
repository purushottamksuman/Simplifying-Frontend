import { GraduationCapIcon, SchoolIcon, XIcon } from "lucide-react";
import React, { useState } from "react";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";
import { Label } from "../../../../components/ui/label";
import { Progress } from "../../../../components/ui/progress";
import {
  RadioGroup,
  RadioGroupItem,
} from "../../../../components/ui/radio-group";

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

export const PropertyStudent1Subsection = ({
  initialValue,
  onNext,
  onBack,
}: {
  initialValue?: string;
  onNext: (value: string) => void;
  onBack?: () => void;
}) => {
  const [selectedEducation, setSelectedEducation] = useState(
    initialValue || "school"
  );


  return (
    <div className="w-full max-w-[1317px] h-auto bg-white rounded-[37px] overflow-hidden relative">
      <div className="flex flex-col lg:flex-row gap-6 p-6">
        <div className="flex-1 max-w-[655px]">
          <Card className="h-full bg-[#007fff] rounded-[23px] overflow-hidden shadow-[0px_0px_20px_#3479ff40] border-0">
            <CardContent className="p-0 relative h-[810px]">
              <div className="absolute bottom-[46px] left-[46px] right-[46px]">
                <h2 className="w-[342px] [font-family:'Playfair_Display',Helvetica] font-black text-white text-[28.7px] tracking-[0] leading-[normal] mb-6">
                  Learning Became Easy
                </h2>

                <p className="w-[508px] [font-family:'Poppins',Helvetica] font-medium text-white text-sm tracking-[0] leading-[normal]">
                  Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit. Amet
                  Ut Nec Vitae Gravida Ullamcorper .
                </p>
              </div>

              <div className="absolute top-32 left-[104px] w-[448px] h-[454px]">
                <img className="w-full h-full"
                src="/sch_students.png"
                alt="Image" />
              </div>

              <div className="absolute top-0 left-0 w-[651px] h-[627px]">
                <img className="w-full h-full"
                src="/framestudent.png" 
                alt="Frame" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex-1 max-w-[450px] flex flex-col items-center gap-[51px] pt-[125px]">
          <div className="w-[366px] h-[91px]">
            <img
              className="w-full h-full object-cover"
              src="/logosimplify.png"
              alt="Simplifying SKILLS"
            />
          </div>

          <div className="flex flex-col w-[420px] items-center gap-8">
            <div className="w-[379px] [font-family:'Poppins',Helvetica] font-medium text-[#13377c] text-xl text-center tracking-[0] leading-[normal]">
              learn in better way !!
            </div>

            <div className="flex flex-col w-[410px] items-center gap-[18px]">
              <div className="w-full">
                <Progress value={20} className="w-full h-[18px] bg-[#bddeff]" />
              </div>

              <div className="[font-family:'DM_Sans',Helvetica] font-medium text-[#81b3ff] text-lg text-center tracking-[0] leading-[normal]">
                20% Completed
              </div>
            </div>

            <div className="w-full [font-family:'Roboto',Helvetica] font-semibold text-[#007fff] text-lg tracking-[0.10px] leading-[normal]">
              Current Education Level ?
            </div>

            <div className="flex flex-col items-center gap-[53px] w-full">
              <RadioGroup
                value={selectedEducation}
                onValueChange={setSelectedEducation}
                className="flex flex-col gap-[23px] w-full"
              >
                {educationOptions.map((option) => {
                  const IconComponent = option.icon;
                  const isSelected = selectedEducation === option.id;

                  return (
                    <div
                      key={option.id}
                      className="relative w-[420px] h-[54px]"
                    >
                      <div
                        className={`w-full h-14 bg-white rounded-3xl border border-solid ${
                          isSelected
                            ? "border-[#007fff57] shadow-[0px_0px_20px_#007fff33]"
                            : "border-[#e2e2ea]"
                        }`}
                      >
                        <Label
                          htmlFor={option.id}
                          className="flex items-center gap-2.5 h-full px-6 cursor-pointer"
                        >
                          <RadioGroupItem
                            value={option.id}
                            id={option.id}
                            className="sr-only"
                          />
                          <IconComponent className="w-[42px] h-[42px] text-[#007fff]" />
                          <span className="[font-family:'Roboto',Helvetica] font-normal text-[#007fff] text-lg text-center tracking-[0.10px] leading-[normal] whitespace-nowrap">
                            {option.label}
                          </span>
                        </Label>
                      </div>
                    </div>
                  );
                })}
              </RadioGroup>

              <div className="w-[340px] h-[53px]">
        <Button
          className="w-full h-full bg-[#007fff] rounded-3xl hover:bg-[#0066cc]"
          onClick={() => onNext(selectedEducation)}
        >
          <span className="font-semibold text-white text-2xl">Next</span>
        </Button>
      </div>
      {onBack && (
        <button onClick={onBack} className="mt-3 text-sm text-gray-500">
          Back
        </button>
      )}
            </div>
          </div>
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="absolute top-7 right-7 w-[30px] h-[30px] p-0 hover:bg-gray-100"
      >
        <XIcon className="w-[30px] h-[30px]" />
      </Button>
    </div>
  );
};
