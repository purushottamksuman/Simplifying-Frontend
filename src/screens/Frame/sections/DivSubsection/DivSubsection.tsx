import { XIcon } from "lucide-react";
import React, { useState } from "react";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import { Progress } from "../../../../components/ui/progress";

interface DivSubsectionProps {
  initialValue?: string;
  onNext: (value: string) => void;
  onBack?: () => void;
  onClose?: () => void;
}

export const DivSubsection: React.FC<DivSubsectionProps> = ({
  initialValue,
  onNext,
  onClose,
}) => {
  const [name, setName] = useState(initialValue || "");

  return (
    <div className="w-full min-h-[860px] bg-white rounded-[37px] relative overflow-hidden">
      {/* LEFT */}
      <div className="w-full lg:w-[666px] h-[810px] relative p-[13px] pb-0 pl-0">
        <Card className="w-full h-full bg-[#007fff] rounded-[23px] overflow-hidden shadow-[0px_0px_20px_#3479ff40] border-0">
          <CardContent className="relative w-full h-full p-0">
            <div className="absolute w-[342px] top-[593px] left-[46px] font-black text-white text-[28.7px]">
              Learning Became Easy
            </div>

            <div className="absolute w-[508px] top-[679px] left-[46px] font-medium text-white text-sm">
              Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit. Amet Ut
              Nec Vitae Gravida Ullamcorper.
            </div>

            <img
              className="absolute w-[375px] h-[433px] top-[105px] left-[139px]"
              src="/g1.png"
              alt="Group"
            />
          </CardContent>
        </Card>

        <img
          className="w-[642px] h-[627px] left-0 absolute top-0"
          src="/framestudent.png"
          alt="Frame"
        />
      </div>

      {/* RIGHT */}
      <div className="absolute top-[108px] left-[764px] flex flex-col w-[450px] items-center gap-[51px]">
        <img
          src="/logosimplify.png"
          alt="Simplifying SKILLS"
          className="relative w-[366px] h-[91px] object-contain"
        />

        <div className="flex flex-col w-[450px] items-center gap-[39px]">
          <div className="w-[379px] text-[#13377c] text-xl text-center font-medium">
            Let&apos;s personalize your dashboard for the best experience!
          </div>

          <div className="flex flex-col w-full items-center gap-[18px]">
            <Progress value={0} className="w-[410px] h-[18px] bg-[#bddeff]" />
            <div className="w-full text-[#81b3ff] text-lg text-center font-medium">
              0% Let&apos;s Start
            </div>
          </div>

          <div className="flex flex-col items-center gap-[63px] w-full">
            <div className="flex flex-col items-center gap-9 w-full">
              <div className="text-center text-xl font-medium text-[#13377c]">
                Hello, my name is <span className="text-[#007fff]">Melio</span>. What&apos;s your name?
              </div>

              <div className="relative w-full h-[67px]">
                <div className="absolute top-[13px] left-0 w-[452px] h-[54px]">
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-[450px] h-[54px] bg-white rounded-3xl border border-[#e2e2ea] px-[23px] py-[18px] text-sm text-[#7f7f7f]"
                    placeholder="Enter Full Name"
                  />
                </div>
                <div className="absolute top-0 left-[18px]">
                  <div className="relative w-[47px] h-[27px] bg-white rounded-[11px]">
                    <Label className="absolute top-1.5 left-[7px] w-8 text-xs text-[#7f7f7f]">
                      Name
                    </Label>
                  </div>
                </div>
              </div>
            </div>

            <Button
              disabled={!name.trim()}
              className="w-[342px] h-[55px] bg-[#007fff] rounded-3xl hover:bg-[#0066cc]"
              onClick={() => onNext(name.trim())}
            >
              <div className="text-2xl font-semibold text-[#fafafb]">Next</div>
            </Button>
          </div>
        </div>
      </div>

      {/* Close */}
      {onClose && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-7 right-[73px] w-[30px] h-[30px] p-0 hover:bg-gray-100"
          onClick={onClose}
        >
          <XIcon className="w-[30px] h-[30px]" />
        </Button>
      )}
    </div>
  );
};
