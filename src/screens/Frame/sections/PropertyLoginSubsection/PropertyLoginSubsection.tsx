import React from "react";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";
import { Input } from "../../../../components/ui/input";
import { Separator } from "../../../../components/ui/separator";

const socialLoginOptions = [
  {
    name: "Google",
    icon: "https://c.animaapp.com/OpLUDWyw/img/google-icon.svg",
    text: "Log in with Google",
    className: "flex-1",
  },
  {
    name: "Apple",
    icon: "https://c.animaapp.com/OpLUDWyw/img/apple-logo.svg",
    text: "Log in with Apple",
    className: "w-[190px]",
  },
];

const linkedInOption = {
  name: "LinkedIn",
  icon: "https://c.animaapp.com/OpLUDWyw/img/linkedin-icon.svg",
  text: "Log in with LinkedIn",
  className: "w-[190px]",
};

export const PropertyLoginSubsection = (): JSX.Element => {
  return (
    <div className="w-full h-[1080px] bg-white relative">
      <div className="relative w-full max-w-[1884px] h-[1026px] mx-auto mt-[54px] px-9">
        <div className="w-full h-[971px] bg-[#edf0fa] rounded-[101px] relative overflow-hidden">
          <img
            className="absolute w-full h-full top-0 left-0 object-cover"
            alt="Mask group"
          />

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

          <div className="absolute top-[57px] left-36">
            <Card className="w-[625px] h-[860px] bg-white rounded-[20px] shadow-[3px_-5px_40px_#cdcdd31a]">
              <CardContent className="p-0 relative w-full h-full">
                <div className="flex flex-col items-center pt-[15px]">
                  <div className="w-[366px] h-[139px] flex flex-col items-center">
                    <img
                      className="w-[366px] h-[91px] object-cover"
                      alt="Simplifying SKILLS"
                    />
                    <h1 className="mt-2 [font-family:'Poppins',Helvetica] font-semibold text-[#0062ff] text-[40px] tracking-[0.10px] leading-[normal]">
                      Login
                    </h1>
                  </div>

                  <div className="mt-[24px] text-center [font-family:'Poppins',Helvetica] font-medium text-black text-[15px] tracking-[0.10px] leading-[25px]">
                    Log in to your personal account
                    <br />
                    and begin your journey with us!
                  </div>

                  <div className="flex flex-col gap-6 mt-[55px] w-[448px]">
                    <div className="space-y-1">
                      <div className="relative">
                        <Input
                          className="h-[53px] bg-white rounded-3xl border border-[#e2e2ea] pl-3.5 pr-24 [font-family:'Roboto',Helvetica] font-normal text-sm tracking-[0.10px]"
                          placeholder="Mail Address"
                          defaultValue=""
                        />
                        <div className="absolute top-[17px] right-3.5 [font-family:'Roboto',Helvetica] font-normal text-[#7f7f7f] text-sm tracking-[0.10px] leading-[normal]">
                          @gmail.com
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="relative">
                        <Input
                          type="password"
                          className="h-[54px] bg-white rounded-3xl border border-[#e2e2ea] pl-3.5 pr-12 [font-family:'Roboto',Helvetica] font-normal text-sm tracking-[0.10px]"
                          placeholder="Password"
                          defaultValue=""
                        />
                        <img
                          className="absolute w-[19px] h-[18px] top-[17px] right-[26px]"
                          alt="Component icon ic"
                        />
                      </div>
                      <div className="text-right">
                        <button className="[font-family:'Poppins',Helvetica] font-medium text-place-holder text-xs tracking-[0] leading-[normal]">
                          Forgot Password ?
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-center mt-8">
                      <Button className="w-[340px] h-[53px] bg-[#007fff] hover:bg-[#0066cc] rounded-3xl [font-family:'Poppins',Helvetica] font-semibold text-[#fafafb] text-2xl">
                        Log In
                      </Button>
                    </div>
                  </div>

                  <div className="mt-[67px] w-[403px]">
                    <div className="relative flex items-center justify-center mb-[38px]">
                      <Separator className="flex-1 bg-gray-300" />
                      <div className="px-3 bg-white">
                        <span className="[font-family:'Poppins',Helvetica] font-medium text-black text-[9px] tracking-[0] leading-[normal]">
                          Or
                        </span>
                      </div>
                      <Separator className="flex-1 bg-gray-300" />
                    </div>

                    <div className="flex flex-col gap-5">
                      <div className="flex items-center justify-between gap-4">
                        {socialLoginOptions.map((option, index) => (
                          <Button
                            key={option.name}
                            variant="outline"
                            className={`${option.className} h-auto px-5 py-1 rounded-xl border-[#d9d9d9] hover:bg-gray-50`}
                          >
                            <div className="flex items-center gap-2.5">
                              <img
                                className="w-6 h-6"
                                alt={option.name}
                                src={option.icon}
                              />
                              <span className="[font-family:'Poppins',Helvetica] font-medium text-black text-xs tracking-[0] leading-[normal]">
                                {option.text}
                              </span>
                            </div>
                          </Button>
                        ))}
                      </div>

                      <div className="flex justify-center">
                        <Button
                          variant="outline"
                          className="w-[190px] h-auto px-5 py-1 rounded-xl border-[#d9d9d9] hover:bg-gray-50"
                        >
                          <div className="flex items-center gap-2.5">
                            <img
                              className="w-[22px] h-[22px]"
                              alt={linkedInOption.name}
                              src={linkedInOption.icon}
                            />
                            <span className="[font-family:'Poppins',Helvetica] font-medium text-black text-xs tracking-[0] leading-[normal]">
                              {linkedInOption.text}
                            </span>
                          </div>
                        </Button>
                      </div>

                      <div className="flex justify-center mt-2">
                        <div className="[font-family:'Poppins',Helvetica] font-medium text-sm tracking-[0] leading-[normal]">
                          <span className="text-black">
                            Create a new account?&nbsp;&nbsp;
                          </span>
                          <button className="text-[#007fff] hover:underline">
                            Sign Up
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
