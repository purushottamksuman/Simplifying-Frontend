
import { FaUsers, FaClipboardCheck, FaChalkboardTeacher, FaBookOpen } from "react-icons/fa";
import { XIcon } from "lucide-react";
import React from "react";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import { Progress } from "../../../components/ui/progress";

interface PropertyTeacher2SubsectionProps {
  initialValue?: string;
  onNext: (value: string) => void;
  onBack?: () => void;
  onClose?: () => void;
}

export const PropertyTeacher2Subsection: React.FC<PropertyTeacher2SubsectionProps> = ({
  initialValue,
  onNext,
  onClose,
}) => {
  const [selectedGoal, setSelectedGoal] = React.useState(initialValue || "Learning Skills");

const goalOptions = [
  { icon: <FaUsers className="w-6 h-6 text-[#007fff]" />, text: "Community Building" },
  { icon: <FaClipboardCheck className="w-6 h-6 text-[#007fff]" />, text: "Exam Helper" },
  { icon: <FaChalkboardTeacher className="w-6 h-6 text-[#007fff]" />, text: "Teaching" },
  { icon: <FaBookOpen className="w-6 h-6 text-[#007fff]" />, text: "Learning Skill" },
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
              Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit. Amet Ut Nec
              Vitae Gravida Ullamcorper.
            </div>

            <img
              className="absolute w-[415px] h-[433px] top-[70px] left-[139px]"
              src="/drawing.png"
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
            Grow your goals, bloom your future
          </div>

          {/* Progress */}
          <div className="flex flex-col w-full items-center gap-3">
            <Progress value={50} className="w-full h-[10px] bg-[#bddeff] rounded-full" />
            <span className="text-[#81b3ff] font-medium text-lg mt-1">50% Completed</span>
          </div>

          {/* Goal Selection */}
          <div className="flex flex-col w-full gap-6">
            {goalOptions.map((option, index) => (
              <div
                key={`goal-${index}`}
                className={`flex items-center gap-4 w-full h-[55px] px-4 cursor-pointer rounded-3xl border ${
                  selectedGoal === option.text
                    ? "bg-white border-[#007fff57] shadow-[0px_0px_20px_#007fff33]"
                    : "bg-white border-[#e2e2ea]"
                }`}
                onClick={() => setSelectedGoal(option.text)}
              >
                <div className="w-10 h-10 flex items-center justify-center">{option.icon}</div>
                <span className="font-normal text-[#007fff] text-lg">{option.text}</span>
              </div>
            ))}

            <Button
              disabled={!selectedGoal}
              className="w-full h-[55px] bg-[#007fff] rounded-3xl text-white text-2xl font-semibold hover:bg-[#0066cc]"
              onClick={() => onNext(selectedGoal)}
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
