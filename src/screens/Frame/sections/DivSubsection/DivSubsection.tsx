import { XIcon } from "lucide-react";
import React from "react";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import { Progress } from "../../../../components/ui/progress";

export const DivSubsection = (): JSX.Element => {
  return (
    <div className="w-full h-auto bg-white rounded-[37px] overflow-hidden relative">
      <div className="bg-[#007fff] rounded-[23px] overflow-hidden shadow-[0px_0px_20px_#3479ff40] absolute top-[13px] left-[11px] w-[655px] h-[810px]">
        <div className="relative h-[810px]">
          <div className="absolute w-[342px] top-[593px] left-[46px] [font-family:'Playfair_Display',Helvetica] font-black text-white text-[28.7px] tracking-[0] leading-[normal]">
            Learning Became Easy
          </div>

          <div className="absolute w-[508px] top-[679px] left-[46px] [font-family:'Poppins',Helvetica] font-medium text-white text-sm tracking-[0] leading-[normal]">
            Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit. Amet Ut Nec
            Vitae Gravida Ullamcorper .
          </div>

          <img
            className="top-0 left-0 absolute w-[655px] h-[810px]"
            alt="Iphone pro x"
          />
        </div>
      </div>

      <div className="absolute top-[108px] left-[764px] flex flex-col w-[450px] items-center gap-[51px]">
        <img
          className="relative w-[366px] h-[91px] object-cover"
          alt="Simplifying SKILLS"
        />

        <div className="flex flex-col w-[450.13px] items-center gap-[39px] relative flex-[0_0_auto]">
          <div className="relative w-[379px] mt-[-1.00px] [font-family:'Poppins',Helvetica] font-medium text-[#13377c] text-xl text-center tracking-[0] leading-[normal]">
            Let&#39;s personalize your dashboard for the best experience!&#34;
          </div>

          <div className="flex flex-col w-[410px] items-center gap-[18px] relative flex-[0_0_auto]">
            <Progress value={0} className="w-[410px] h-[18px] bg-[#bddeff]" />

            <div className="relative self-stretch [font-family:'DM_Sans',Helvetica] font-medium text-[#81b3ff] text-lg text-center tracking-[0] leading-[normal]">
              0% Let&apos;s Start
            </div>
          </div>

          <div className="flex flex-col items-center gap-[63px] relative self-stretch w-full flex-[0_0_auto]">
            <div className="flex flex-col items-center gap-9 relative self-stretch w-full flex-[0_0_auto]">
              <div className="flex flex-col w-[246px] items-center gap-3.5 relative flex-[0_0_auto]">
                <div className="relative self-stretch mt-[-1.00px] [font-family:'Poppins',Helvetica] font-medium text-transparent text-xl text-center tracking-[0] leading-[normal]">
                  <span className="text-[#13377c]">Hello, my name is</span>

                  <span className="text-black">&nbsp;</span>

                  <span className="text-[#007fff]">Melio</span>

                  <span className="text-black">. </span>

                  <span className="text-[#13377c]">What&apos;s your name?</span>
                </div>
              </div>

              <div className="relative self-stretch w-full h-[67px]">
                <div className="relative w-[452px] h-[67px]">
                  <div className="absolute w-[452px] h-[54px] top-[13px] left-0">
                    <Input
                      className="w-[450px] h-[54px] bg-white rounded-3xl border border-solid border-[#e2e2ea] px-[23px] py-[18px] [font-family:'Roboto',Helvetica] font-normal text-[#7f7f7f] text-sm tracking-[0.10px] leading-[normal]"
                      placeholder="Enter Full Name"
                    />
                  </div>

                  <div className="absolute w-[77px] h-[25px] top-0 left-[18px] overflow-hidden">
                    <div className="relative w-[47px] h-[27px] -top-px -left-px bg-white rounded-[11px]">
                      <Label className="absolute w-8 top-1.5 left-[7px] [font-family:'Roboto',Helvetica] font-normal text-[#7f7f7f] text-xs tracking-[0] leading-[normal]">
                        Name
                      </Label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative w-[340px] h-[53px]">
              <div className="h-[53px]">
                <div className="w-[340px] h-[53px] overflow-hidden">
                  <Button className="relative w-[342px] h-[55px] -top-px -left-px bg-[#007fff] rounded-3xl hover:bg-[#0066cc] h-auto">
                    <div className="[font-family:'Poppins',Helvetica] font-semibold text-[#fafafb] text-2xl text-center tracking-[0] leading-[normal]">
                      Next
                    </div>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="absolute w-[30px] h-[30px] top-7 right-[73px] p-0 hover:bg-gray-100"
      >
        <XIcon className="w-[30px] h-[30px]" />
      </Button>
    </div>
  );
};
