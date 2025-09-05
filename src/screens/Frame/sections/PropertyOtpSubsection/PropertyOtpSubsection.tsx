import React from "react";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "../../../../components/ui/input-otp";

export const PropertyOtpSubsection = (): JSX.Element => {
  const otpSlots = Array.from({ length: 6 }, (_, index) => ({
    id: index,
    value: "2",
  }));

  return (
    <div className="w-full h-full bg-white relative">
      <div className="relative w-full h-full p-9">
        <div className="w-full h-full bg-[#edf0fa] rounded-[101px] relative overflow-hidden">
          <div className="absolute w-[598px] h-[535px] top-[338px] left-[352px] bg-[#007fff59] rounded-[299px/267.5px] blur-[125px]" />
          <div className="absolute w-[568px] h-[535px] top-[157px] left-[83px] bg-[#0011ff59] rounded-[284px/267.5px] blur-[125px]" />

          <img
            className="absolute w-[370px] h-[209px] top-[434px] left-[800px]"
            alt="Add a heading"
          />
          <img
            className="absolute w-[370px] h-[289px] top-[510px] left-[940px]"
            alt="Add a heading"
          />
          <img
            className="absolute w-[420px] h-[328px] top-[439px] left-[1090px]"
            alt="Add a heading"
          />
          <img
            className="absolute w-[417px] h-[315px] top-[250px] left-[940px]"
            alt="Add a heading"
          />
          <img
            className="absolute w-[1208px] h-[647px] top-[379px] left-[676px]"
            alt="Add a heading"
          />

          <div className="absolute top-[57px] left-36 w-[623px] h-[858px] shadow-[0px_4px_4px_#00000040]">
            <Card className="w-[625px] h-[860px] -ml-px -mt-px bg-white rounded-[20px] shadow-[3px_-5px_40px_#cdcdd31a] border-0">
              <CardContent className="p-0">
                <div className="flex flex-col items-center pt-[200px] px-[94px] pb-[200px]">
                  <div className="flex flex-col items-center gap-[57px] w-[436px]">
                    <div className="flex flex-col items-center gap-[34px] w-full">
                      <div className="flex flex-col items-center gap-[19px] w-full">
                        <h1 className="[font-family:'Poppins',Helvetica] font-semibold text-[#0062ff] text-5xl tracking-[0.10px] leading-normal text-center">
                          OTP VERIFICATION
                        </h1>

                        <p className="[font-family:'Poppins',Helvetica] font-medium text-xl text-center tracking-[0] leading-normal">
                          <span className="text-black">
                            Enter the OTP sent to&nbsp;&nbsp;
                          </span>
                          <span className="text-[#007fff]">+91-81xxxxxx24</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-3.5 -mx-6">
                        <InputOTP maxLength={6} value="222222">
                          <InputOTPGroup className="gap-3.5">
                            {otpSlots.map((slot) => (
                              <InputOTPSlot
                                key={slot.id}
                                index={slot.id}
                                className="w-[68px] h-[68px] bg-white rounded-3xl border border-[#e2e2ea] [font-family:'Roboto',Helvetica] font-normal text-[#7f7f7f] text-sm tracking-[0.10px] leading-normal flex items-center justify-center"
                              />
                            ))}
                          </InputOTPGroup>
                        </InputOTP>
                      </div>

                      <div className="[font-family:'Poppins',Helvetica] font-medium text-black text-xl text-center tracking-[0] leading-normal">
                        00:120 Sec
                      </div>

                      <p className="[font-family:'Poppins',Helvetica] font-medium text-xl text-center tracking-[0] leading-normal">
                        <span className="text-black">
                          Don&apos;t Receive code ?{" "}
                        </span>
                        <span className="text-[#007fff] cursor-pointer">
                          Re-send
                        </span>
                      </p>
                    </div>

                    <Button className="w-[340px] h-[53px] bg-[#007fff] rounded-3xl border-0 hover:bg-[#0066cc] h-auto">
                      <span className="[font-family:'Poppins',Helvetica] font-semibold text-[#fafafb] text-2xl text-center tracking-[0] leading-normal">
                        Submit
                      </span>
                    </Button>
                  </div>
                </div>

                <img
                  className="absolute w-[366px] h-[91px] top-[15px] left-[130px] object-cover"
                  alt="Simplifying SKILLS"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
