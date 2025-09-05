import { XIcon } from "lucide-react";
import React, { useState } from "react";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";
import { Label } from "../../../../components/ui/label";
import { Progress } from "../../../../components/ui/progress";
import {
  RadioGroup,
  RadioGroupItem,
} from "../../../../components/ui/radio-group";

export const PropertyStudent2Subsection = (): JSX.Element => {
  const [selectedCareer, setSelectedCareer] = useState("doctor");

  const careerOptions = [
    {
      id: "doctor",
      label: "Doctor",
      icon: "https://c.animaapp.com/OpLUDWyw/img/doctor-icon.svg",
    },
    {
      id: "engineer",
      label: "Engineer",
      icon: "https://c.animaapp.com/OpLUDWyw/img/engineer-icon.svg",
    },
    {
      id: "teacher",
      label: "Teacher",
      icon: "https://c.animaapp.com/OpLUDWyw/img/teacher-icon.svg",
    },
    {
      id: "lawyer",
      label: "Lawyer",
      icon: "https://c.animaapp.com/OpLUDWyw/img/judge-icon.svg",
    },
  ];

  return (
    <div className="w-full h-[835px] bg-white rounded-[37px] overflow-hidden relative">
      <div className="flex h-full">
        <div className="w-[655px] h-[810px] mt-[13px] ml-[11px] rounded-[23px]">
          <Card className="w-full h-full bg-[#007fff] rounded-[23px] overflow-hidden shadow-[0px_0px_20px_#3479ff40] border-0">
            <CardContent className="relative w-full h-full p-0">
              <h2 className="absolute w-[342px] top-[593px] left-[46px] [font-family:'Playfair_Display',Helvetica] font-black text-white text-[28.7px] tracking-[0] leading-[normal]">
                Learning Became Easy
              </h2>

              <p className="absolute w-[508px] top-[679px] left-[46px] [font-family:'Poppins',Helvetica] font-medium text-white text-sm tracking-[0] leading-[normal]">
                Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit. Amet Ut
                Nec Vitae Gravida Ullamcorper .
              </p>

              <img
                className="absolute w-[365px] h-[457px] top-[103px] left-[145px]"
                alt="Group"
              />

              <img
                className="absolute w-[651px] h-[627px] top-0 left-0"
                alt="Frame"
              />
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col w-[450px] items-center gap-[51px] mt-[51px] ml-[113px]">
          <img
            className="w-[366px] h-[91px] object-cover"
            alt="Simplifying SKILLS"
          />

          <div className="flex flex-col w-[420px] items-center gap-8">
            <h3 className="w-[379px] [font-family:'Poppins',Helvetica] font-medium text-[#13377c] text-xl text-center tracking-[0] leading-[normal]">
              Map your dreams, chart your career
            </h3>

            <div className="flex flex-col w-[410px] items-center gap-[18px]">
              <div className="w-[410px] h-[18px] bg-[#bddeff] rounded-[100px] overflow-hidden">
                <Progress value={35} className="h-full bg-transparent border-0">
                  <div
                    className="h-full bg-[#007fff] rounded-[100px] transition-all"
                    style={{ width: "35%" }}
                  />
                </Progress>
              </div>

              <p className="[font-family:'DM_Sans',Helvetica] font-medium text-[#81b3ff] text-lg text-center tracking-[0] leading-[normal]">
                35% Completed
              </p>
            </div>

            <div className="flex flex-col w-[420px] items-start gap-[26px]">
              <h4 className="[font-family:'Roboto',Helvetica] font-semibold text-[#007fff] text-lg text-center tracking-[0.10px] leading-[normal] whitespace-nowrap">
                Select Preferred Career Domain
              </h4>

              <div className="flex flex-col items-center gap-[53px] w-full">
                <RadioGroup
                  value={selectedCareer}
                  onValueChange={setSelectedCareer}
                  className="flex flex-col items-start gap-[23px] w-full"
                >
                  {careerOptions.map((option) => (
                    <div
                      key={option.id}
                      className="w-[420px] h-[54px] relative"
                    >
                      <Label
                        htmlFor={option.id}
                        className={`flex items-center w-full h-full cursor-pointer rounded-3xl border ${
                          selectedCareer === option.id
                            ? "bg-white border-[#007fff57] shadow-[0px_0px_20px_#007fff33]"
                            : "bg-white border-[#e2e2ea]"
                        }`}
                      >
                        <RadioGroupItem
                          value={option.id}
                          id={option.id}
                          className="sr-only"
                        />
                        <div className="flex items-center gap-1.5 ml-6">
                          <img
                            className="w-[42px] h-[42px]"
                            alt={option.label}
                            src={option.icon}
                          />
                          <span className="[font-family:'Roboto',Helvetica] font-normal text-[#007fff] text-lg text-center tracking-[0.10px] leading-[normal] whitespace-nowrap">
                            {option.label}
                          </span>
                        </div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>

                <Button className="w-[340px] h-[53px] bg-[#007fff] rounded-3xl border-0 hover:bg-[#0066cc] h-auto">
                  <span className="[font-family:'Poppins',Helvetica] font-semibold text-[#fafafb] text-2xl text-center tracking-[0] leading-[normal]">
                    Next
                  </span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="absolute top-7 right-[43px] w-[30px] h-[30px] p-0 hover:bg-gray-100"
      >
        <XIcon className="w-[30px] h-[30px]" />
      </Button>
    </div>
  );
};
