import { XIcon } from "lucide-react";
import React, { useState } from "react";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";
import { Progress } from "../../../../components/ui/progress";
import { FaLanguage } from "react-icons/fa"; // English icon
import { SiGoogletranslate } from "react-icons/si"; // Hindi/translation icon

interface PropertyStudent5SubsectionProps {
  initialValue?: string;
  onNext: (value: string) => void;
  onBack?: () => void;
  onClose?: () => void;
}

const decorativeElements = [];

const initialLanguageOptions = [
  { id: "english", name: "English", icon: <FaLanguage className="w-6 h-6" /> },
  { id: "hindi", name: "Hindi", icon: <SiGoogletranslate className="w-6 h-6" /> },
];

export const PropertyStudent5Subsection: React.FC<PropertyStudent5SubsectionProps> = ({
  initialValue,
  onNext,
  onClose,
}) => {
  const [languageOptions, setLanguageOptions] = useState(
    initialLanguageOptions.map((lang) => ({
      ...lang,
      selected: initialValue ? lang.id === initialValue : lang.id === "hindi",
    }))
  );

  const handleSelect = (id: string) => {
    setLanguageOptions((prev) =>
      prev.map((lang) => ({
        ...lang,
        selected: lang.id === id,
      }))
    );
  };

  const selectedLanguage = languageOptions.find((lang) => lang.selected)?.name;

  return (
    <div className="w-full bg-white rounded-[37px] overflow-hidden p-5 relative">
      <div className="flex flex-col lg:flex-row gap-8 h-full">
        {/* Left section with images */}
        <div className="flex-1 relative">
          <Card className="bg-[#007fff] rounded-[23px] overflow-hidden shadow-[0px_0px_20px_#3479ff40] border-0 h-full min-h-[810px] relative">
            <CardContent className="p-0 relative h-full">
              <div className="absolute w-[342px] top-[593px] left-[46px] font-black text-white text-[28.7px]">
                Learning Became Easy
              </div>
              <div className="absolute w-[508px] top-[679px] left-[46px] font-medium text-white text-sm">
                Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit. Amet Ut
                Nec Vitae Gravida Ullamcorper.
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
            </CardContent>
          </Card>
        </div>

        {/* Right section */}
        <div className="flex flex-col w-full lg:w-[450px] items-center gap-[51px] pt-32">
          <img
            className="w-[366px] h-[91px] object-cover"
            src="/logosimplify.png"
            alt="Simplifying SKILLS"
          />

          <div className="flex flex-col w-[420px] items-center gap-8">
            <div className="w-[379px] font-medium text-[#13377c] text-xl text-center">
              Talk the world, one word at a time.
            </div>

            {/* Progress */}
            <div className="flex flex-col w-[410px] items-center gap-[18px]">
              <Progress value={80} className="w-full h-[18px] bg-[#bddeff]" />
              <div className="font-medium text-[#81b3ff] text-lg text-center">80% Completed</div>
            </div>

            {/* Language Selection */}
            <div className="flex flex-col w-[420px] items-start justify-center gap-[26px]">
              <div className="font-semibold text-[#007fff] text-lg text-center whitespace-nowrap">
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
                      <CardContent className="p-0 flex items-center h-full pl-6 gap-4">
                        {language.icon}
                        <div className="font-normal text-[#007fff] text-lg">{language.name}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="flex gap-4 w-full">
<Button
  className="flex-1 h-[53px] bg-[#007fff] rounded-3xl hover:bg-[#0066cc]"
  onClick={() => selectedLanguage && onNext(selectedLanguage)}
>
  <span className="font-semibold text-white text-2xl">Next</span>
</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Close button */}
      {onClose && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute w-[30px] h-[30px] top-7 right-[30px] p-0"
          onClick={onClose}
        >
          <XIcon className="w-[30px] h-[30px]" />
        </Button>
      )}
    </div>
  );
};
