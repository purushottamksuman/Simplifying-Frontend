import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";
import { Input } from "../../../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";

export const PropertyCommanSubsection = (): JSX.Element => {
  const navigate = useNavigate();

  const handleSignUp = () => {
    navigate('/component/otp');
  };

  return (
    <div className="w-full bg-white relative">
      <div className="relative w-full mx-auto">
        {/* Background Container */}
        <div className="w-full bg-[#edf0fa] rounded-[101px]" />

        {/* Mask Image */}
        <img
          className="absolute w-full max-w-[1040px] top-0 right-0 lg:right-[-40px] rounded-tr-[100px] rounded-br-[100px]"
          alt="Mask group"
          src="/Mask group.png"
        />

        {/* Blur circles */}
        <div className="absolute w-[598px] h-[535px] top-[338px] left-[352px] bg-[#007fff59] rounded-[299px/267.5px] blur-[125px]" />
        <div className="absolute w-[568px] h-[535px] top-[157px] left-[83px] bg-[#0011ff59] rounded-[284px/267.5px] blur-[125px]" />

        {/* Decorative images */}
        <img
          className="absolute w-[370px] h-[209px] top-[434px] left-[800px]"
          alt="bot"
          src="/bot.png"
        />
        <img
          className="absolute w-[370px] h-[289px] top-[510px] left-[940px]"
          alt="code"
          src="/code.png"
        />
        <img
          className="absolute w-[420px] h-[328px] top-[439px] left-[1090px]"
          alt="messenger"
          src="/messenger.png"
        />
        <img
          className="absolute w-[417px] h-[315px] top-[250px] left-[940px]"
          alt="money"
          src="/money.png"
        />

        {/* Card Section */}
        <div className="absolute w-[623px] h-[858px] top-[57px] left-36 shadow-[0px_4px_4px_#00000040]">
          <Card className="w-[623px] h-[858px] bg-white rounded-[20px] shadow-[0px_4px_4px_#00000040,3px_-5px_40px_#cdcdd31a] rounded-[20px]">
            <CardContent className="p-0 relative w-full h-full">
              <img
                className="absolute top-3.5 left-[129px] w-[366px] h-[91px] object-cover"
                alt="Simplifying SKILLS"
                src="/simplifying_skills_logo.png"
              />

              <div className="absolute top-[93px] left-[211px] [font-family:'Poppins',Helvetica] font-normal text-[#0062ff] text-5xl tracking-[0.12px] leading-[normal]">
                <span className="font-semibold tracking-[0.06px]">Register</span>
                <span className="font-semibold text-[40px] tracking-[0.04px]">&nbsp;</span>
              </div>

              <div className="absolute top-[177px] left-[83px] [font-family:'Poppins',Helvetica] font-medium text-black text-[15px] text-center tracking-[0.10px] leading-[25px]">
                Let&#39;s get you set up so you can verify your personal
                account
                <br />
                and begin your journey with us!
              </div>

              <div className="absolute w-[445px] h-[65px] top-[281px] left-[89px]">
                <div className="relative h-[65px]">
                  <Select>
                    <SelectTrigger className="w-[445px] h-[54px] absolute top-[11px] left-0 bg-white rounded-3xl border border-solid border-[#e2e2ea]">
                      <div className="absolute w-32 h-[25px] top-[-11px] left-7 overflow-hidden">
                        <div className="relative w-[119px] h-[27px] -top-px -left-px">
                          <div className="absolute w-[62px] h-[27px] top-0 left-0 bg-white rounded-[11px]" />
                          <div className="absolute w-[109px] top-[5px] left-2.5 [font-family:'Roboto',Helvetica] font-normal text-[#7f7f7f] text-xs tracking-[0] leading-[normal]">
                            You Are
                          </div>
                        </div>
                      </div>
                      <SelectValue
                        placeholder="Select Student / Parent / Teacher"
                        className="absolute top-[18px] left-6 [font-family:'Roboto',Helvetica] font-normal text-[#7f7f7f] text-sm tracking-[0.10px] leading-[normal]"
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="parent">Parent</SelectItem>
                      <SelectItem value="teacher">Teacher</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="absolute w-[445px] h-[53px] top-[377px] left-[89px]">
                <Input
                  className="h-[53px] bg-white rounded-3xl border border-solid border-[#e2e2ea] px-3.5"
                  placeholder="Mail Address"
                />
                <div className="absolute top-[17px] right-[24px] [font-family:'Roboto',Helvetica] font-normal text-[#7f7f7f] text-sm tracking-[0.10px] leading-[normal]">
                  @gmail.com
                </div>
              </div>

              <div className="absolute w-[443px] h-[54px] top-[461px] left-[90px] flex gap-1">
                <Input
                  className="w-14 h-[53px] bg-white rounded-3xl border border-solid border-[#e2e2ea] px-[13px] text-center"
                  defaultValue="+91"
                />
                <Input
                  className="flex-1 h-[53px] bg-white rounded-3xl border border-solid border-[#e2e2ea] px-[15px]"
                  placeholder="Phone Number"
                />
              </div>

              <div className="absolute w-[340px] h-[53px] top-[546px] left-[142px]">
                <Button 
                  onClick={handleSignUp}
                  className="w-[340px] h-[53px] bg-[#007fff] rounded-3xl hover:bg-[#0066cc] h-auto"
                >
                  <span className="[font-family:'Poppins',Helvetica] font-semibold text-[#fafafb] text-2xl text-center tracking-[0] leading-[normal]">
                    Sign Up
                  </span>
                </Button>
              </div>

              <div className="absolute w-[403px] h-[163px] top-[630px] left-[110px]">
                <div className="absolute w-[400px] h-[15px] top-0 left-[3px]">
                  <div className="relative h-3.5">
                    <div className="flex w-5 items-center justify-center gap-2.5 px-[3px] py-0 absolute top-0 left-[190px] bg-white">
                      <div className="relative w-fit mt-[-1.00px] [font-family:'Poppins',Helvetica] font-medium text-black text-[9px] tracking-[0] leading-[normal]">
                        Or
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-10 w-[448px]">
                  {/* Google */}
                  <Button
                    variant="outline"
                    className="h-[50px] rounded-xl border border-[#d9d9d9] hover:bg-gray-50 flex items-center justify-center px-5"
                  >
                    <div className="flex items-center gap-3">
                      <img className="w-6 h-6" src="/google.png" alt="Google" />
                      <span className="font-poppins font-medium text-black text-sm">
                        Sign up with Google
                      </span>
                    </div>
                  </Button>

                  {/* Apple */}
                  <Button
                    variant="outline"
                    className="h-[50px] rounded-xl border border-[#d9d9d9] hover:bg-gray-50 flex items-center justify-center px-5"
                  >
                    <div className="flex items-center gap-3">
                      <img className="w-6 h-6" src="/apple.png" alt="Apple" />
                      <span className="font-poppins font-medium text-black text-sm">
                        Sign up with Apple
                      </span>
                    </div>
                  </Button>

                  {/* LinkedIn → spans both columns */}
                  <Button
                    variant="outline"
                    className="col-span-2 h-[50px] rounded-xl border border-[#d9d9d9] hover:bg-gray-50 flex items-center justify-center px-5"
                  >
                    <div className="flex items-center gap-3">
                      <img className="w-6 h-6" src="/linkedin.png" alt="LinkedIn" />
                      <span className="font-poppins font-medium text-black text-sm">
                        Sign up with LinkedIn
                      </span>
                    </div>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};



