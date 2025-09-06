import { XIcon } from "lucide-react";
import React, { useState } from "react";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";
import { FaUserMd, FaChalkboardTeacher, FaGavel } from "react-icons/fa";
import { GiGearHammer } from "react-icons/gi"; // ✅ Added missing import
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
      icon: <FaUserMd size={28} className="text-[#007fff]" />,
    },
    {
      id: "engineer",
      label: "Engineer",
      icon: <GiGearHammer size={28} className="text-[#007fff]" />,
    },
    {
      id: "teacher",
      label: "Teacher",
      icon: <FaChalkboardTeacher size={28} className="text-[#007fff]" />,
    },
    {
      id: "lawyer",
      label: "Lawyer",
      icon: <FaGavel size={28} className="text-[#007fff]" />,
    },
  ];

  return (
    <div className="w-full h-[835px] bg-white rounded-[37px] overflow-hidden relative">
      <div className="flex h-full">
        {/* Left Section */}
        <div className="w-[655px] h-[810px] mt-[13px] ml-[11px] rounded-[23px]">
          <Card className="w-full h-full bg-[#007fff] rounded-[23px] overflow-hidden shadow-[0px_0px_20px_#3479ff40] border-0">
            <CardContent className="relative w-full h-full p-0">
              <h2 className="absolute w-[342px] top-[593px] left-[46px] font-black text-white text-[28.7px] leading-normal">
                Learning Became Easy
              </h2>

              <p className="absolute w-[508px] top-[679px] left-[46px] font-medium text-white text-sm leading-normal">
                Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit. Amet Ut
                Nec Vitae Gravida Ullamcorper .
              </p>

              <img
                className="absolute w-[365px] h-[457px] top-[103px] left-[145px]"
                src="/topper_girl.png"
                alt="Student"
              />

              <img
                className="absolute w-[651px] h-[627px] top-0 left-0"
                src="/framestudent.png"
                alt="Frame"
              />
            </CardContent>
          </Card>
        </div>

        {/* Right Section */}
        <div className="flex flex-col w-[450px] items-center gap-[51px] mt-[51px] ml-[113px]">
          <img
            className="w-[366px] h-[91px] object-cover"
            src="/logosimplify.png"
            alt="Simplifying SKILLS"
          />

          <div className="flex flex-col w-[420px] items-center gap-8">
            <h3 className="w-[379px] font-medium text-[#13377c] text-xl text-center">
              Map your dreams, chart your career
            </h3>

            {/* Progress Bar */}
            <div className="flex flex-col w-[410px] items-center gap-[18px]">
              <div className="w-[410px] h-[18px] bg-[#bddeff] rounded-[100px] overflow-hidden">
                <Progress value={35} className="h-full bg-transparent border-0">
                  <div
                    className="h-full bg-[#007fff] rounded-[100px] transition-all"
                    style={{ width: "35%" }}
                  />
                </Progress>
              </div>

              <p className="font-medium text-[#81b3ff] text-lg text-center">
                35% Completed
              </p>
            </div>

            {/* Career Options */}
            <div className="flex flex-col w-[420px] items-start gap-[26px]">
              <h4 className="font-semibold text-[#007fff] text-lg">
                Select Preferred Career Domain
              </h4>

              <div className="flex flex-col items-center gap-[23px] w-full">
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
                        <div className="flex items-center gap-2 ml-6">
                          {option.icon} {/* ✅ Fixed (no <img>) */}
                          <span className="font-normal text-[#007fff] text-lg">
                            {option.label}
                          </span>
                        </div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>

                {/* Next Button */}
                <Button className="w-[340px] h-[53px] bg-[#007fff] rounded-3xl hover:bg-[#0066cc]">
                  <span className="font-semibold text-white text-2xl">
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
        className="absolute top-7 right-[43px] w-[30px] h-[30px] p-0 hover:bg-gray-100"
      >
        <XIcon className="w-[30px] h-[30px]" />
      </Button>
    </div>
  );
};
