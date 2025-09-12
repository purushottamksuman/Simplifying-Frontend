import { XIcon } from "lucide-react";
import React from "react";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";
import { Progress } from "../../../../components/ui/progress";
import { FaBook, FaLaptopCode, FaChartLine, FaBrain } from "react-icons/fa";

interface PropertyStudent4SubsectionProps {
  initialValue?: string;
  onNext: (value: string) => void;
  onBack?: () => void;
  onClose?: () => void;
}

export const PropertyStudent4Subsection: React.FC<PropertyStudent4SubsectionProps> = ({
  initialValue,
  onNext,
  onBack,
  onClose,
}) => {
  const [selectedGoal, setSelectedGoal] = React.useState(initialValue || "Learning Skills");

  const goalOptions = [
    { icon: <FaBrain className="w-6 h-6 text-[#007fff]" />, text: "Learning Skills" },
    { icon: <FaChartLine className="w-6 h-6 text-[#007fff]" />, text: "Exam Preparation" },
    { icon: <FaLaptopCode className="w-6 h-6 text-[#007fff]" />, text: "Learn Coding" },
    { icon: <FaBook className="w-6 h-6 text-[#007fff]" />, text: "Gain Extra Knowledge" },
  ];

  return (
    <div className="w-full h-auto bg-white rounded-[37px] overflow-hidden relative">
      <div className="flex flex-col lg:flex-row gap-8 p-8">
        {/* Left Card */}
        <div className="flex-1 relative">
          <Card className="bg-[#007fff] rounded-[23px] overflow-hidden shadow-[0px_0px_20px_#3479ff40] border-0 h-[810px] relative">
            <CardContent className="p-0 relative h-full">
              <div className="absolute w-[342px] top-[593px] left-[46px] font-black text-white text-[28.7px]">
                Learning Became Easy
              </div>
              <div className="absolute w-[508px] top-[679px] left-[46px] font-medium text-white text-sm">
                Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit. Amet Ut Nec Vitae Gravida Ullamcorper.
              </div>
              <img className="w-[651px] h-[633px] left-px absolute top-0" src="/framestudent.png" alt="Frame" />
              <img className="absolute w-[413px] h-[365px] top-[152px] left-[109px]" src="/drawing.png" alt="Group" />
            </CardContent>
          </Card>
        </div>

        {/* Right Section */}
        <div className="flex flex-col w-[450px] items-center gap-[51px]">
          <img className="w-[366px] h-[91px] object-cover" src="/logosimplify.png" alt="Simplifying SKILLS" />

          <div className="flex flex-col w-[420px] items-center gap-8">
            <div className="w-[379px] font-medium text-[#13377c] text-xl text-center">
              Grow your goals, bloom your future
            </div>

            {/* Progress */}
            <div className="flex flex-col w-[410px] items-center gap-[18px]">
              <Progress value={60} className="w-full h-[18px] bg-[#bddeff]" />
              <div className="font-medium text-[#81b3ff] text-lg text-center">60% Completed</div>
            </div>

            {/* Goal Selection */}
            <div className="flex flex-col w-[420px] items-start gap-[26px]">
              <div className="font-semibold text-[#007fff] text-lg text-center whitespace-nowrap">
                What Is Your Goal
              </div>

              <div className="flex flex-col items-center gap-[53px] w-full">
                <div className="flex flex-col items-start gap-[23px] w-full">
                  {goalOptions.map((option, index) => (
                    <Card
                      key={`goal-${index}`}
                      className={`w-[420px] h-[54px] bg-white rounded-3xl border border-solid cursor-pointer transition-all ${
                        selectedGoal === option.text
                          ? "border-[#007fff57] shadow-[0px_0px_20px_#007fff33]"
                          : "border-[#e2e2ea]"
                      }`}
                      onClick={() => setSelectedGoal(option.text)}
                    >
                      <CardContent className="p-0 flex items-center h-full pl-6 pr-4 py-2">
                        <div className="flex items-center gap-4 w-full">
                          <div className="w-10 h-10 flex items-center justify-center">{option.icon}</div>
                          <div className="font-normal text-[#007fff] text-lg">{option.text}</div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Buttons */}
                <div className="flex gap-4 w-full">
                  <Button
                    className="flex-1 h-[53px] bg-[#007fff] rounded-3xl hover:bg-[#0066cc]"
                    onClick={() => onNext(selectedGoal)}
                  >
                    <span className="font-semibold text-white text-2xl">Next</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Close Button */}
      <Button variant="ghost" size="icon" className="absolute top-7 right-[73px] w-[30px] h-[30px] p-0" onClick={onClose}>
        <XIcon className="w-[30px] h-[30px]" />
      </Button>
    </div>
  );
};
