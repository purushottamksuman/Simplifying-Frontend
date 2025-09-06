import { XIcon } from "lucide-react";
import React, { useState } from "react";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";
import { Progress } from "../../../../components/ui/progress";
import { FaLanguage } from "react-icons/fa"; // English icon
import { SiGoogletranslate } from "react-icons/si"; // Hindi/translation icon

const decorativeElements = [];

const initialLanguageOptions = [
  {
    id: "english",
    name: "English",
    icon: <FaLanguage className="w-6 h-6" />,
    selected: false,
  },
  {
    id: "hindi",
    name: "Hindi",
    icon: <SiGoogletranslate className="w-6 h-6" />,
    selected: true,
  },
];

export const PropertyStudent5Subsection = (): JSX.Element => {
  const [languageOptions, setLanguageOptions] = useState(initialLanguageOptions);

  const handleSelect = (id: string) => {
    setLanguageOptions((prev) =>
      prev.map((lang) => ({
        ...lang,
        selected: lang.id === id,
      }))
    );
  };

  return (
    <div className="w-full bg-white rounded-[37px] overflow-hidden p-5 relative">
      <div className="flex flex-col lg:flex-row gap-8 h-full">
        {/* Left section with images */}
        <div className="flex-1 relative">
          <Card className="bg-[#007fff] rounded-[23px] overflow-hidden shadow-[0px_0px_20px_#3479ff40] border-0 h-full min-h-[810px] relative">
            <CardContent className="p-0 relative h-full">
              <div className="absolute w-[342px] top-[593px] left-[46px] [font-family:'Playfair_Display',Helvetica] font-black text-white text-[28.7px] tracking-[0] leading-[normal]">
                Learning Became Easy
              </div>

              <div className="absolute w-[508px] top-[679px] left-[46px] [font-family:'Poppins',Helvetica] font-medium text-white text-sm tracking-[0] leading-[normal]">
                Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit. Amet Ut
                Nec Vitae Gravida Ullamcorper .
              </div>

              <img
                className="w-[651px] h-[633px] left-px absolute top-0"
                src="/framestudent.png"
                alt="Frame"
              />

              <img
                className="absolute w-[463px] h-[464px] top-[125px] left-[94px] object-cover"
                src="/hindi_student.png"
                alt="Image"
              />

              <div className="absolute w-[651px] h-[627px] top-0 left-px">
                {decorativeElements.map((element, index) => (
                  <img
                    key={`decorative-${index}`}
                    className={`absolute ${element.className}`}
                    alt={element.alt}
                  />
                ))}

                <div className="absolute w-[73px] h-72 top-[339px] left-[519px]">
                  {/* <img
                    className="absolute w-[45px] h-[23px] top-[265px] left-7"
                    alt="Group"
                  /> */}
                  {/* <div className="w-[62px] top-0 left-0 absolute [-webkit-text-stroke:3px_#ffc909] [font-family:'Righteous',Helvetica] font-normal text-[#ffffff1a] text-[90px] tracking-[2.70px] leading-[normal]">
                    g
                  </div> */}
                </div>

                <div className="absolute w-[23px] top-[167px] left-[120px] [-webkit-text-stroke:3px_#ffc909] [font-family:'Righteous',Helvetica] font-normal text-[#ffffff1a] text-[76px] tracking-[2.28px] leading-[normal]">
                  {/* XIcon */}
                </div>

                {/* <div className="top-72 left-[136px] absolute w-3.5 [-webkit-text-stroke:3px_#ffc909] [font-family:'Righteous',Helvetica] font-normal text-[#ffffff33] text-[42px] tracking-[1.26px] leading-[normal]">
                  B
                </div>

                <div className="top-[179px] left-[451px] absolute w-[17px] [-webkit-text-stroke:3px_#ffc909] [font-family:'Righteous',Helvetica] font-normal text-[#ffffff33] text-[42px] tracking-[1.26px] leading-[normal]">
                  M
                </div>

                <div className="absolute w-3.5 top-[126px] left-[194px] [-webkit-text-stroke:3px_#ffc909] [font-family:'Righteous',Helvetica] font-normal text-[#ffffff33] text-[42px] tracking-[1.26px] leading-[normal]">
                  D
                </div> */}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right section with progress + language selection */}
        <div className="flex flex-col w-full lg:w-[450px] items-center gap-[51px] pt-32">
          <img
            className="w-[366px] h-[91px] object-cover"
            src="/logosimplify.png"
            alt="Simplifying SKILLS"
          />

          <div className="flex flex-col w-[420px] items-center gap-8">
            <div className="w-[379px] [font-family:'Poppins',Helvetica] font-medium text-[#13377c] text-xl text-center tracking-[0] leading-[normal]">
              Talk the world, one word at a time.
            </div>

            <div className="flex flex-col w-[410px] items-center gap-[18px]">
              <div className="w-full relative">
                <Progress value={80} className="w-full h-[18px] bg-[#bddeff]" />
              </div>

              <div className="[font-family:'DM_Sans',Helvetica] font-medium text-[#81b3ff] text-lg text-center tracking-[0] leading-[normal]">
                80% Completed
              </div>
            </div>

            <div className="flex flex-col w-[420px] items-start justify-center gap-[26px]">
              <div className="[font-family:'Roboto',Helvetica] font-semibold text-[#007fff] text-lg text-center tracking-[0.10px] leading-[normal] whitespace-nowrap">
                Select Preferred Language
              </div>

              <div className="flex flex-col items-center gap-[53px] w-full">
                <div className="flex flex-col items-start gap-[23px] w-full">
                  {languageOptions.map((language) => (
                    <Card
                      key={language.id}
                      onClick={() => handleSelect(language.id)}
                      className={`w-[420px] h-[54px] bg-white rounded-3xl border border-solid cursor-pointer transition-all ${
                        language.selected
                          ? "border-[#007fff57] shadow-[0px_0px_20px_#007fff33]"
                          : "border-[#e2e2ea]"
                      }`}
                    >
                      <CardContent className="p-0">
                        <div
                          className={`gap-[13px] ${
                            language.selected
                              ? "top-1.5 left-6"
                              : "top-[5px] left-[23px]"
                          } inline-flex items-center relative`}
                        >
                          {language.icon}
                          <div className="[font-family:'Roboto',Helvetica] font-normal text-[#007fff] text-lg text-center tracking-[0.10px] leading-[normal] whitespace-nowrap">
                            {language.name}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Button className="w-[340px] h-[53px] bg-[#007fff] rounded-3xl [font-family:'Poppins',Helvetica] font-semibold text-[#fafafb] text-2xl text-center tracking-[0] leading-[normal] h-auto">
                  Next
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Close button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute w-[30px] h-[30px] top-7 right-[30px] p-0 h-auto"
      >
        {/* <XIcon className="w-[30px] h-[30px]" /> */}
      </Button>
    </div>
  );
};
