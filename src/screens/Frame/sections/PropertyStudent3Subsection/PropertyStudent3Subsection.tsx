import { XIcon } from "lucide-react";
import React from "react";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";
import { Progress } from "../../../../components/ui/progress";
import { FaGamepad, FaMusic, FaBook } from "react-icons/fa";
import { SiCodementor } from "react-icons/si";


interface PropertyStudent3SubsectionProps {
  initialValue?: string;
  onNext: (value: string) => void;
  onBack?: () => void;
  onClose?: () => void;
}

export const PropertyStudent3Subsection: React.FC<PropertyStudent3SubsectionProps> = ({
  initialValue,
  onNext,
  onBack,
  onClose,
}) => {

  const [selectedHobby, setSelectedHobby] = React.useState(initialValue || "music");

  
  const hobbies = [
    {
      id: "gaming",
      label: "Gaming",
      icon: <FaGamepad className="w-8 h-8 text-[#007fff]" />,
      selected: false,
      className:
        "relative w-[420px] h-[54px] bg-white rounded-3xl border border-solid border-[#e2e2ea]",
      contentClassName:
        "gap-2 top-[5px] left-[23px] inline-flex items-center relative",
    },
    {
      id: "music",
      label: "Music",
      icon: <FaMusic className="w-8 h-8 text-[#007fff]" />,
      selected: true,
      className: "relative w-[420px] h-[54px] shadow-[0px_0px_20px_#007fff33]",
      contentClassName:
        "gap-[9px] top-[11px] left-6 bg-white inline-flex items-center relative",
      wrapperClassName:
        "relative w-[422px] h-14 -top-px -left-px bg-white rounded-3xl border border-solid border-[#007fff57]",
    },
    {
      id: "coding",
      label: "Coding",
      icon: <SiCodementor className="w-8 h-8 text-[#007fff]" />,
      selected: false,
      className:
        "relative w-[420px] h-[54px] bg-white rounded-3xl border border-solid border-[#e2e2ea]",
      contentClassName:
        "inline-flex items-center gap-2.5 relative top-[5px] left-[23px]",
    },
    {
      id: "reading",
      label: "Reading Books",
      icon: <FaBook className="w-8 h-8 text-[#007fff]" />,
      selected: false,
      className:
        "relative w-[420px] h-[54px] bg-white rounded-3xl border border-solid border-[#e2e2ea]",
      contentClassName:
        "gap-3 top-[5px] left-[23px] inline-flex items-center relative",
    },
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
              className="absolute w-[434px] h-[453px] top-[50px] left-[139px]"
              src="/happy_teacher.png"
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
<div className="w-1/2 h-full bg-white flex flex-col justify-start items-center p-12 relative overflow-y-auto">
  <img
    className="w-[366px] h-[91px] object-contain mb-12"
    src="/logosimplify.png"
    alt="logosimplify"
  />

  <div className="flex flex-col w-full max-w-[420px] gap-8 items-center">
    <div className="text-center text-xl font-medium text-[#13377c]">
      Select your Hobbies & Interests
    </div>

    <div className="w-full flex flex-col items-center gap-3">
      <Progress value={50} className="w-full h-[10px] bg-[#bddeff] rounded-full" />
      <span className="text-[#81b3ff] font-medium text-lg mt-1">50% Completed</span>
    </div>

    <div className="flex flex-col w-full gap-4">
      {hobbies.map((hobby) => (
        <div
          key={hobby.id}
          className={`w-full h-[55px] flex items-center gap-4 px-4 cursor-pointer rounded-3xl border ${
            selectedHobby === hobby.id
              ? "bg-white border-[#007fff57] shadow-[0px_0px_20px_#007fff33]"
              : "bg-white border-[#e2e2ea]"
          }`}
          onClick={() => setSelectedHobby(hobby.id)}
        >
          {hobby.icon}
          <span className="font-normal text-[#007fff] text-lg">{hobby.label}</span>
        </div>
      ))}
    </div>

    <Button
      disabled={!selectedHobby}
      className="w-full h-[55px] bg-[#007fff] rounded-3xl text-white text-2xl font-semibold hover:bg-[#0066cc]"
      onClick={() => onNext(selectedHobby)}
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
          className="absolute top-5 right-5 w-10 h-10 p-0 hover:bg-gray-100"
          onClick={onClose}
        >
          <XIcon className="w-6 h-6" />
        </Button>
      )}
    </div>
  );
};
