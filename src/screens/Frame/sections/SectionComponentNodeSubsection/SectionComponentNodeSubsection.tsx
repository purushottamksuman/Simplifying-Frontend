import { CalendarIcon, XIcon } from "lucide-react";
import React from "react";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import { Progress } from "../../../../components/ui/progress";

export const SectionComponentNodeSubsection = (): JSX.Element => {
  return (
    <div className="w-full h-auto bg-white rounded-[37px] overflow-hidden relative">
      <div className="flex flex-col lg:flex-row w-full min-h-[835px]">
        <div className="w-full lg:w-[666px] h-[810px] relative p-[13px] pb-0 pl-0">
          <Card className="w-full h-full bg-[#007fff] rounded-[23px] overflow-hidden shadow-[0px_0px_20px_#3479ff40] border-0">
            <CardContent className="relative w-full h-full p-0">
              <div className="absolute w-[342px] top-[593px] left-[46px] [font-family:'Playfair_Display',Helvetica] font-black text-white text-[28.7px] tracking-[0] leading-[normal]">
                Learning Became Easy
              </div>

              <div className="absolute w-[508px] top-[679px] left-[46px] [font-family:'Poppins',Helvetica] font-medium text-white text-sm tracking-[0] leading-[normal]">
                Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit. Amet Ut
                Nec Vitae Gravida Ullamcorper .
              </div>

              <img
                className="absolute w-[375px] h-[433px] top-[105px] left-[139px]"
                alt="Group"
              />
            </CardContent>
          </Card>

          <img
            className="w-[642px] h-[627px] left-0 absolute top-0"
            alt="Frame"
          />
        </div>

        <div className="flex-1 flex flex-col items-center justify-start pt-[139px] px-4 lg:px-0 lg:pl-[98px] lg:pr-[103px] relative">
          <div className="flex flex-col w-full max-w-[450px] items-center gap-[51px]">
            <img
              className="w-[366px] h-[91px] object-cover"
              alt="Simplifying SKILLS"
            />

            <div className="flex flex-col items-center gap-[39px] w-full">
              <div className="w-full max-w-[379px] [font-family:'Poppins',Helvetica] font-medium text-[#13377c] text-xl text-center tracking-[0] leading-[normal]">
                Please verify your age
              </div>

              <div className="flex flex-col w-full max-w-[410px] items-center gap-[18px]">
                <div className="w-full h-[18px] relative">
                  <Progress
                    value={5}
                    className="w-full h-[18px] bg-[#bddeff]"
                  />
                </div>

                <div className="w-full [font-family:'DM_Sans',Helvetica] font-medium text-[#81b3ff] text-lg text-center tracking-[0] leading-[normal]">
                  5% Completed
                </div>
              </div>

              <div className="flex flex-col items-center gap-[63px] w-full">
                <div className="flex flex-col items-center gap-9 w-full">
                  <div className="flex flex-col w-[246px] items-center gap-3.5">
                    <div className="w-full [font-family:'Poppins',Helvetica] font-medium text-[#13377c] text-xl text-center tracking-[0] leading-[normal]">
                      Enter Your Date Of Birth
                    </div>
                  </div>

                  <div className="w-full max-w-[450px] relative">
                    <div className="relative">
                      <Label className="absolute -top-2 left-[17px] bg-white px-2 z-10 [font-family:'Roboto',Helvetica] font-normal text-[#7f7f7f] text-xs tracking-[0] leading-[normal]">
                        Date of Birth
                      </Label>

                      <Input
                        defaultValue="DD/MM/YY"
                        className="w-full h-[55px] bg-white rounded-3xl border border-solid border-[#e2e2ea] pl-[23px] pr-[45px] [font-family:'Roboto',Helvetica] font-normal text-[#7f7f7f] text-sm tracking-[0.10px] leading-[normal]"
                      />

                      <CalendarIcon className="absolute w-3 h-3 top-1/2 right-[35px] transform -translate-y-1/2 text-[#7f7f7f]" />
                    </div>
                  </div>
                </div>

                <Button className="w-[340px] h-[53px] bg-[#007fff] rounded-3xl border-0 hover:bg-[#0066cc] h-auto">
                  <span className="[font-family:'Poppins',Helvetica] font-semibold text-[#fafafb] text-2xl text-center tracking-[0] leading-[normal]">
                    Next
                  </span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="absolute top-7 right-[73px] w-[30px] h-[30px] p-0 hover:bg-transparent"
        >
          <XIcon className="w-[30px] h-[30px]" />
        </Button>
      </div>
    </div>
  );
};
