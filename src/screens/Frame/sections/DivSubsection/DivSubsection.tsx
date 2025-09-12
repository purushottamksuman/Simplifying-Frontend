import { XIcon } from "lucide-react";
import React, { useState } from "react";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import { Progress } from "../../../../components/ui/progress";

interface DivSubsectionProps {
  initialValue?: string;
  onNext: (value: string) => void;
  onClose?: () => void;
}

export const DivSubsection: React.FC<DivSubsectionProps> = ({
  initialValue,
  onNext,
  onClose,
}) => {
  const [name, setName] = useState(initialValue || "");

  return (
    <div className="fixed top-0 left-0 w-screen h-screen flex overflow-hidden shadow-lg z-[9999]">
      {/* LEFT BLUE PANEL */}
      <div className="w-1/2 h-full bg-[#007fff] relative flex flex-col justify-center items-center p-8">
        <img
          src="/g1.png"
          alt="Child Illustration"
          className="w-[320px] h-auto mb-24 z-10"
        />

        <div className="absolute bottom-[60px] left-[50px] max-w-[400px] text-white z-20">
          <h2 className="text-[32px] font-black leading-snug">
            Learning Became Easy
          </h2>
          <p className="text-sm mt-8 font-medium leading-relaxed">
            Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit. Amet Ut Nec
            Vitae Gravida Ullamcorper.
          </p>
        </div>
        <img
            
            className="w-[742px] h-[627px] left-18 absolute top-0"
            src="/framestudent.png"
            alt="Frame"
          />
      </div>


      {/* RIGHT FORM PANEL */}
      <div className="w-1/2 h-full bg-white flex flex-col justify-center items-center p-12 relative">
        <img
          src="/logosimplify.png"
          alt="Simplifying SKILLS"
          className="w-[366px] h-[91px] object-contain mb-12"
        />

        <div className="flex flex-col w-full max-w-[420px] gap-8 items-center">
          <div className="text-center text-xl font-medium text-[#13377c]">
            Let's personalize your dashboard for the best experience!
          </div>

          <div className="w-full flex flex-col items-center gap-3">
            <Progress value={0} className="w-full h-[10px] bg-[#bddeff] rounded-full" />
            <span className="text-[#81b3ff] font-medium text-lg mt-1">
              0% Let's Start
            </span>
          </div>

          <div className="text-center text-xl font-medium text-[#13377c]">
            Hello, my name is <span className="text-[#007fff]">Melio</span>. What's your name?
          </div>

          <div className="w-full relative">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter Full Name"
              className="w-full h-[55px] rounded-3xl border border-[#e2e2ea] px-4 text-sm text-[#7f7f7f]"
            />
            <Label className="absolute -top-2 left-4 bg-white px-1 text-xs text-[#7f7f7f]">
              Name
            </Label>
          </div>

          <Button
            disabled={!name.trim()}
            className="w-full h-[55px] bg-[#007fff] rounded-3xl text-white text-2xl font-semibold hover:bg-[#0066cc]"
            onClick={() => onNext(name.trim())}
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
