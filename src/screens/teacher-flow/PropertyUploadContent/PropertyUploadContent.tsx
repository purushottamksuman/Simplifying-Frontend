import React, { useState } from "react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { Card, CardContent } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { Switch } from "../../../components/ui/switch";
import { Label } from "../../../components/ui/label";
import { SearchIcon, ChevronDownIcon, UploadIcon, HeartIcon } from "lucide-react";

export const PropertyUploadContent = (): JSX.Element => {
  const [selectedContentType, setSelectedContentType] = useState("video");
  const [isPublic, setIsPublic] = useState(true);

  const contentTypes = [
    {
      id: "video",
      label: "Video",
      icon: "/svg-margin-2.svg",
      bgColor: "bg-wwwfigmacomzumthor",
      textColor: "text-wwwfigmacomblue-ribbon",
      borderColor: "border-neutral-950 shadow-[0px_0px_0px_4px_#0a0a0a,0px_0px_0px_2px_#ffffff]"
    },
    {
      id: "document",
      label: "Document",
      icon: "/svg-margin-3.svg",
      bgColor: "bg-wwwfigmacomfeta",
      textColor: "text-wwwfigmacomgreen-haze",
      borderColor: ""
    },
    {
      id: "quiz",
      label: "Quiz",
      icon: "/svg-margin-8.svg",
      bgColor: "bg-wwwfigmacomathens-gray",
      textColor: "text-[#980ffa]",
      borderColor: ""
    },
    {
      id: "other",
      label: "Other",
      icon: "/svg-margin-6.svg",
      bgColor: "bg-[#f8fafb]",
      textColor: "text-wwwfigmacomriver-bed",
      borderColor: ""
    }
  ];



  const courseCards = [
    {
      image: "/unsplash-qq9lains6ti-12.png",
      type: "video",
      typeIcon: "/svg-87.svg",
      typeBg: "bg-wwwfigmacomzumthor",
      typeColor: "text-wwwfigmacomdenim",
      title: "Introduction to React Hooks",
      date: "Aug 10, 2025",
      description: "Master advanced React patterns, hooks, and performance optimization techniques.",
      tags: ["react", "hooks", "javascript"]
    },
    {
      image: "/unsplash-qq9lains6ti-13.png",
      type: "quiz",
      typeIcon: "/svg-89.svg",
      typeBg: "bg-[#d5eaff]",
      typeColor: "text-wwwfigmacomelectric-violet",
      title: "Introduction to React Hooks",
      date: "Aug 10, 2025",
      description: "Master advanced React patterns, hooks, and performance optimization techniques.",
      tags: ["react", "hooks", "javascript"]
    },
    {
      image: "/unsplash-qq9lains6ti-11.png",
      type: "document",
      typeIcon: "/svg-102.svg",
      typeBg: "bg-wwwfigmacomfeta",
      typeColor: "text-[#008235]",
      title: "Introduction to React Hooks",
      date: "Aug 10, 2025",
      description: "Master advanced React patterns, hooks, and performance optimization techniques.",
      tags: ["react", "hooks", "javascript"]
    },
    {
      image: "/unsplash-qq9lains6ti-11.png",
      type: "other",
      typeIcon: "/svg-95.svg",
      typeBg: "bg-[#cdcdcd]",
      typeColor: "text-wwwfigmacomoxford-blue",
      title: "Introduction to React Hooks",
      date: "Aug 10, 2025",
      description: "Master advanced React patterns, hooks, and performance optimization techniques.",
      tags: ["react", "hooks", "javascript"]
    },
    {
      image: "/unsplash-qq9lains6ti-12.png",
      type: "quiz",
      typeIcon: "/svg-89.svg",
      typeBg: "bg-[#d5eaff]",
      typeColor: "text-wwwfigmacomelectric-violet",
      title: "Introduction to React Hooks",
      date: "Aug 10, 2025",
      description: "Master advanced React patterns, hooks, and performance optimization techniques.",
      tags: ["react", "hooks", "javascript"]
    },
    {
      image: "/unsplash-qq9lains6ti-13.png",
      type: "quiz",
      typeIcon: "/svg-89.svg",
      typeBg: "bg-[#d5eaff]",
      typeColor: "text-wwwfigmacomelectric-violet",
      title: "Introduction to React Hooks",
      date: "Aug 10, 2025",
      description: "Master advanced React patterns, hooks, and performance optimization techniques.",
      tags: ["react", "hooks", "javascript"]
    }
  ];

  return (
    // <div className="relative w-full h-full bg-[#3479ff]">
      <div className="relative ml-[315px] w-[1200px] h-[1103px] bg-white shadow-[0px_0px_29px_#00000075]">
        
       
         <aside className="flex flex-col w-[340px] h-[calc(100%_-_168px)] items-start gap-[21px] absolute top-[162px] right-6">
          <div className="flex flex-col items-start gap-3.5 w-full">
            <Label className="[font-family:'Nunito',Helvetica] font-bold text-[#083a50] text-sm leading-[21px] tracking-[0]">
              Content Type
            </Label>
            <div className="flex items-start justify-center gap-3.5 w-full">
              {contentTypes.map((type) => (
                <Button
                  key={type.id}
                  variant="outline"
                  className={`flex flex-col w-[75.82px] items-center p-[22.6px] h-auto ${type.bgColor} rounded-[12.75px] ${
                    selectedContentType === type.id ? `border ${type.borderColor}` : "border-transparent"
                  }`}
                  onClick={() => setSelectedContentType(type.id)}
                >
                  <img
                    className="w-7 h-[38.5px] mb-1"
                    alt={`${type.label} icon`}
                    src={type.icon}
                  />
                  <span className={`${type.textColor} text-[length:var(--www-figma-com-segoe-UI-semibold-font-size)] font-www-figma-com-segoe-UI-semibold font-[number:var(--www-figma-com-segoe-UI-semibold-font-weight)] tracking-[var(--www-figma-com-segoe-UI-semibold-letter-spacing)] leading-[var(--www-figma-com-segoe-UI-semibold-line-height)]`}>
                    {type.label}
                  </span>
                </Button>
              ))}
            </div>
          </div>
          <Card className="w-full bg-white rounded-[12.75px] border border-solid border-[#0000001a] shadow-[0px_0px_20px_#155dfc33]">
            <CardContent className="flex flex-col items-start gap-[19.3px] p-[22.6px]">
              <div className="flex flex-col items-start gap-[7px] w-full">
                <Label className="font-www-figma-com-semantic-label font-[number:var(--www-figma-com-semantic-label-font-weight)] text-[#083a50] text-[length:var(--www-figma-com-semantic-label-font-size)] tracking-[var(--www-figma-com-semantic-label-letter-spacing)] leading-[var(--www-figma-com-semantic-label-line-height)]">
                  Title *
                </Label>
                <Input
                  placeholder="Enter video title"
                  className="h-[31.5px] rounded-[25px] border border-solid border-[#caced8] font-www-figma-com-semantic-input font-[number:var(--www-figma-com-semantic-input-font-weight)] text-[#717182] text-[length:var(--www-figma-com-semantic-input-font-size)] tracking-[var(--www-figma-com-semantic-input-letter-spacing)] leading-[var(--www-figma-com-semantic-input-line-height)]"
                />
              </div>
              <div className="flex flex-col items-start gap-[7px] w-full">
                <Label className="font-www-figma-com-semantic-label font-[number:var(--www-figma-com-semantic-label-font-weight)] text-[#083a50] text-[length:var(--www-figma-com-semantic-label-font-size)] tracking-[var(--www-figma-com-semantic-label-letter-spacing)] leading-[var(--www-figma-com-semantic-label-line-height)]">
                  Description
                </Label>
                <Textarea
                  placeholder="Describe your video..."
                  className="h-14 rounded-lg border border-solid border-[#caced8] font-www-figma-com-semantic-textarea font-[number:var(--www-figma-com-semantic-textarea-font-weight)] text-[#717182] text-[length:var(--www-figma-com-semantic-textarea-font-size)] tracking-[var(--www-figma-com-semantic-textarea-letter-spacing)] leading-[var(--www-figma-com-semantic-textarea-line-height)]"
                />
              </div>
              <div className="flex flex-col items-start gap-[12.3px] w-full">
                <div className="flex flex-col h-[212px] items-start gap-[7px] w-full">
                  <Label className="font-www-figma-com-semantic-label font-[number:var(--www-figma-com-semantic-label-font-weight)] text-[#083a50] text-[length:var(--www-figma-com-semantic-label-font-size)] tracking-[var(--www-figma-com-semantic-label-letter-spacing)] leading-[var(--www-figma-com-semantic-label-line-height)]">
                    Upload File
                  </Label>
                  <div className="flex flex-col items-center gap-3.5 p-[29.6px] w-full rounded-[8.75px] border border-dashed border-[#0000001a]">
                    <img
                      className="w-[42px] h-[42px]"
                      alt="UploadIcon icon"
                      src="/svg-92.svg"
                    />
                    <div className="flex flex-col items-center w-full">
                      <p className="[font-family:'Segoe_UI-Regular',Helvetica] font-normal text-[#083a50] text-[15.8px] text-center tracking-[0] leading-[24.5px]">
                        Drop your file here
                      </p>
                      <p className="font-www-figma-com-segoe-UI-regular font-[number:var(--www-figma-com-segoe-UI-regular-font-weight)] text-[#717182] text-[length:var(--www-figma-com-segoe-UI-regular-font-size)] text-center tracking-[var(--www-figma-com-segoe-UI-regular-letter-spacing)] leading-[var(--www-figma-com-segoe-UI-regular-line-height)]">
                        or
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      className="h-[31.5px] px-[15.6px] py-1.5 bg-white rounded-[6.75px] border border-solid border-[#0000001a] [font-family:'Segoe_UI-Semibold',Helvetica] font-normal text-[#083a50] text-[12.3px] text-center tracking-[0] leading-[17.5px]"
                    >
                      Browse Files
                    </Button>
                  </div>
                </div>
                <div className="flex flex-col items-start gap-[7px] w-full">
                  <Label className="font-www-figma-com-semantic-label font-[number:var(--www-figma-com-semantic-label-font-weight)] text-[#083a50] text-[length:var(--www-figma-com-semantic-label-font-size)] tracking-[var(--www-figma-com-semantic-label-letter-spacing)] leading-[var(--www-figma-com-semantic-label-line-height)]">
                    Or paste a link
                  </Label>
                  <Input
                    placeholder="https://youtube.com/watch?v=..."
                    className="h-[31.5px] rounded-[25px] border border-solid border-[#caced8] font-www-figma-com-semantic-input font-[number:var(--www-figma-com-semantic-input-font-weight)] text-[#717182] text-[length:var(--www-figma-com-semantic-input-font-size)] tracking-[var(--www-figma-com-semantic-input-letter-spacing)] leading-[var(--www-figma-com-semantic-input-line-height)]"
                  />
                </div>
              </div>
              <div className="flex flex-col items-start gap-[7px] w-full">
                <Label className="font-www-figma-com-semantic-label font-[number:var(--www-figma-com-semantic-label-font-weight)] text-[#083a50] text-[length:var(--www-figma-com-semantic-label-font-size)] tracking-[var(--www-figma-com-semantic-label-letter-spacing)] leading-[var(--www-figma-com-semantic-label-line-height)]">
                  Tags
                </Label>
                <Input
                  placeholder="Type a tag and press Enter"
                  className="h-[31.5px] rounded-[25px] border border-solid border-[#caced8] font-www-figma-com-semantic-input font-[number:var(--www-figma-com-semantic-input-font-weight)] text-[#717182] text-[length:var(--www-figma-com-semantic-input-font-size)] tracking-[var(--www-figma-com-semantic-input-letter-spacing)] leading-[var(--www-figma-com-semantic-input-line-height)]"
                />
              </div>
              <div className="flex flex-col items-start gap-[7px] w-full">
                <Label className="font-www-figma-com-semantic-label font-[number:var(--www-figma-com-semantic-label-font-weight)] text-[#083a50] text-[length:var(--www-figma-com-semantic-label-font-size)] tracking-[var(--www-figma-com-semantic-label-letter-spacing)] leading-[var(--www-figma-com-semantic-label-line-height)]">
                  Category
                </Label>
                <Select>
                  <SelectTrigger className="h-[31.5px] rounded-[25px] border border-solid border-[#caced8] [font-family:'Segoe_UI-Regular',Helvetica] font-normal text-[#717182] text-[12.3px] tracking-[0] leading-[17.5px]">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="programming">Programming</SelectItem>
                    <SelectItem value="design">Design</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between w-full h-[66.15px] rounded-[8.75px] border border-solid border-[#0000001a] px-4">
                <div className="flex flex-col gap-[2.5px]">
                  <Label className="font-www-figma-com-semantic-label font-[number:var(--www-figma-com-semantic-label-font-weight)] text-[#083a50] text-[length:var(--www-figma-com-semantic-label-font-size)] tracking-[var(--www-figma-com-semantic-label-letter-spacing)] leading-[var(--www-figma-com-semantic-label-line-height)]">
                    Visibility
                  </Label>
                  <p className="[font-family:'Segoe_UI-Regular',Helvetica] font-normal text-[#717182] text-[12.3px] tracking-[0] leading-[17.5px]">
                    Public - Anyone can view
                  </p>
                </div>
                <Switch
                  checked={isPublic}
                  onCheckedChange={setIsPublic}
                  className="bg-[#155dfc] data-[state=checked]:bg-[#155dfc]"
                />
              </div>    
              <Button className="w-full h-[33.2px] bg-[#155dfc] rounded-[6.75px] [font-family:'Segoe_UI-Semibold',Helvetica] font-normal text-white text-[12.3px] text-center tracking-[0] leading-[17.5px]">
                <img
                  className="w-[21px] h-3.5 mr-2"
                  alt="UploadIcon icon"
                  src="/svg-margin-4.svg"
                />
                Upload Video
              </Button>
            </CardContent>
          </Card>
        </aside>
          <main className="flex flex-col w-[800px] items-center justify-center gap-[43px] absolute top-[161px] left-[40px]">
          <div className="flex flex-col items-end gap-[26px] w-full">
            <div className="flex w-[984px] h-[61px] items-center justify-between">
              <div className="flex flex-col w-[367px] items-start gap-[7px]">
                <h2 className="[font-family:'Nunito',Helvetica] font-bold text-[#13377c] text-4xl tracking-[0] leading-[31.5px]">
                  Upload Content
                </h2>
                <p className="[font-family:'Segoe_UI-Regular',Helvetica] font-normal text-wwwfigmacomstorm-gray text-xl tracking-[0] leading-[21px]">
                  Manage your Content
                </p>
              </div>
              <Button className="w-[230px] h-[49px] px-[49px] py-[7px] bg-[#155cfb] rounded-[6.75px] [font-family:'Segoe_UI-Semibold',Helvetica] font-normal text-wwwfigmacomwhite text-[17px] text-center tracking-[0] leading-[17.5px]">
                <img
                  className="w-6 h-6 mr-2"
                  alt="Add icon"
                  src="/svg-47.svg"
                />
                Create New Course
              </Button>
            </div>
            <div className="flex h-14 items-center justify-center gap-3.5">
              <div className="flex w-[608px] items-start justify-center gap-3">
                <div className="flex items-center justify-center gap-2.5 px-4 py-5 flex-1 bg-white rounded-xl border border-solid border-[#cccccccc]">
                  <SearchIcon className="w-4 h-4" />
                  <span className="flex-1 [font-family:'Inter',Helvetica] font-medium text-[#9e9e9e] text-xs tracking-[0] leading-[normal]">
                    Search your courses here....
                  </span>
                </div>
              </div>
              <Select>
                <SelectTrigger className="w-[174px] h-[43px] bg-[#f3f3f5] rounded-[6.75px] [font-family:'Segoe_UI-Regular',Helvetica] font-normal text-wwwfigmacomcod-gray text-[12.3px] tracking-[0] leading-[17.5px]">
                  <img
                    className="w-[21px] h-3.5 mr-2"
                    alt="Filter icon"
                    src="/svg-margin.svg"
                  />
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-[174px] h-[43px] bg-[#f3f3f5] rounded-[6.75px] [font-family:'Segoe_UI-Regular',Helvetica] font-normal text-wwwfigmacomcod-gray text-[12.3px] tracking-[0] leading-[17.5px]">
                  <img
                    className="w-[21px] h-3.5 mr-2"
                    alt="Filter icon"
                    src="/svg-margin.svg"
                  />
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="programming">Programming</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex flex-col w-[883px] items-start gap-[15px] shadow-[0px_0px_20px_#3479ff40]">
            <div className="grid grid-cols-3 gap-8 w-full">
              {courseCards.map((card, index) => (
                <Card key={index} className="w-[273px] h-[344px] bg-white rounded-[20px] shadow-[0px_14px_42px_#080f340f] relative">
                  <CardContent className="flex flex-col items-start justify-center gap-2.5 p-3">
                    <img
                      className="w-full h-[113px] rounded-xl object-cover"
                      alt="Course thumbnail"
                      src={card.image}
                    />
                    <Badge className={`${card.typeBg} ${card.typeColor} rounded-[6.75px] text-[10.5px] leading-[14px] font-normal`}>
                      <img
                        className="w-3.5 h-3.5 mr-2"
                        alt={`${card.type} icon`}
                        src={card.typeIcon}
                      />
                      {card.type}
                    </Badge>
                    <div className="flex flex-col items-start justify-center gap-2.5">
                      <div className="flex flex-col items-start gap-2.5">
                        <div className="flex flex-col items-start gap-0.5">
                          <div className="flex flex-col items-start gap-px">
                            <h3 className="font-www-figma-com-semantic-heading-3 font-[number:var(--www-figma-com-semantic-heading-3-font-weight)] text-wwwfigmacomcod-gray text-[length:var(--www-figma-com-semantic-heading-3-font-size)] tracking-[var(--www-figma-com-semantic-heading-3-letter-spacing)] leading-[var(--www-figma-com-semantic-heading-3-line-height)]">
                              {card.title}
                            </h3>
                            <p className="[font-family:'Segoe_UI-Regular',Helvetica] text-wwwfigmacomstorm-gray text-[12.3px] font-normal tracking-[0] leading-[17.5px]">
                              {card.date}
                            </p>
                          </div>
                          <p className="w-[243px] h-14 [font-family:'Segoe_UI-Regular',Helvetica] font-normal text-[#717182] text-sm tracking-[0] leading-[21px]">
                            {card.description}
                          </p>
                        </div>
                        <div className="flex items-start gap-[9px]">
                          {card.tags.map((tag, tagIndex) => (
                            <Badge
                              key={tagIndex}
                              variant="outline"
                              className="h-[20.67px] px-[8.6px] py-[1.95px] rounded-[6.75px] border border-solid border-[#0000001a] [font-family:'Segoe_UI-Semibold',Helvetica] text-wwwfigmacomcod-gray text-[10.5px] font-normal tracking-[0] leading-[14px]"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Badge className="w-28 h-5 px-3.5 py-1.5 bg-[#155cfb] rounded-[6.75px] [font-family:'Segoe_UI-Semibold',Helvetica] font-normal text-white text-xs text-center tracking-[0] leading-[17.5px]">
                        Public
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-[22px] right-[22px] w-5 h-5 p-1.5 bg-[#cccccc80] rounded-[50px]"
                    >
                      <HeartIcon className="w-full h-full" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
      
    // </div>
  );
};
            