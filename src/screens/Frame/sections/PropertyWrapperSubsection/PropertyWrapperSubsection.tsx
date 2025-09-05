import {
  CalendarIcon,
  DownloadIcon,
  HeartIcon,
  PlayIcon,
  SearchIcon,
  Share2Icon,
} from "lucide-react";
import React from "react";
import { Badge } from "../../../../components/ui/badge";
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

const certificateData = [
  {
    id: 1,
    image: "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=321&h=190&fit=crop",
    title: "Beginner's Guide To Becoming A professional Frontend Developer",
    academy: "Teach Academy",
    completedDate: "March 15, 2024",
    certId: "Cert-2024-001",
    imageHeight: "h-[190px]",
  },
  {
    id: 2,
    image: "https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=321&h=250&fit=crop",
    title: "Beginner's Guide To Becoming A professional Frontend Developer",
    academy: "Teach Academy",
    completedDate: "March 15, 2024",
    certId: "Cert-2024-001",
    imageHeight: "h-[250px] -mt-[30px] -ml-[30px] -mr-[30px]",
  },
  {
    id: 3,
    image: "https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=321&h=250&fit=crop",
    title: "Beginner's Guide To Becoming A professional Frontend Developer",
    academy: "Teach Academy",
    completedDate: "March 15, 2024",
    certId: "Cert-2024-001",
    imageHeight: "h-[250px] -mt-[30px] -ml-[30px] -mr-[30px]",
  },
  {
    id: 4,
    image: "https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=321&h=250&fit=crop",
    title: "Beginner's Guide To Becoming A professional Frontend Developer",
    academy: "Teach Academy",
    completedDate: "March 15, 2024",
    certId: "Cert-2024-001",
    imageHeight: "h-[250px] -mt-[30px] -ml-[30px] -mr-[30px]",
  },
  {
    id: 5,
    image: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=321&h=223&fit=crop",
    title: "Beginner's Guide To Becoming A professional Frontend Developer",
    academy: "Teach Academy",
    completedDate: "March 15, 2024",
    certId: "Cert-2024-001",
    imageHeight: "h-[223px] -mt-[30px] -ml-[30px] -mr-[30px]",
  },
  {
    id: 6,
    image: "https://images.pexels.com/photos/1181772/pexels-photo-1181772.jpeg?auto=compress&cs=tinysrgb&w=321&h=223&fit=crop",
    title: "Beginner's Guide To Becoming A professional Frontend Developer",
    academy: "Teach Academy",
    completedDate: "March 15, 2024",
    certId: "Cert-2024-001",
    imageHeight: "h-[223px] -mt-[30px] -ml-[30px] -mr-[30px]",
  },
  {
    id: 7,
    image: "https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=321&h=223&fit=crop",
    title: "Beginner's Guide To Becoming A professional Frontend Developer",
    academy: "Teach Academy",
    completedDate: "March 15, 2024",
    certId: "Cert-2024-001",
    imageHeight: "h-[223px] -mt-[30px] -ml-[30px] -mr-[30px]",
  },
  {
    id: 8,
    image: "https://images.pexels.com/photos/1181354/pexels-photo-1181354.jpeg?auto=compress&cs=tinysrgb&w=321&h=223&fit=crop",
    title: "Beginner's Guide To Becoming A professional Frontend Developer",
    academy: "Teach Academy",
    completedDate: "March 15, 2024",
    certId: "Cert-2024-001",
    imageHeight: "h-[223px] -mt-[30px] -ml-[30px] -mr-[30px]",
  },
];

const navigationItems = [
  { icon: "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=26&h=26&fit=crop", label: "Dashboard", active: false },
  { icon: "https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=26&h=26&fit=crop", label: "Profile Settings", active: false },
  { icon: "https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=26&h=26&fit=crop", label: "My Course", active: false },
  { icon: "https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=26&h=26&fit=crop", label: "Live Classes", active: false },
  { icon: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=26&h=26&fit=crop", label: "Test & Assessment", active: false },
  { icon: "https://images.pexels.com/photos/1181772/pexels-photo-1181772.jpeg?auto=compress&cs=tinysrgb&w=26&h=26&fit=crop", label: "Certificates", active: true },
  { icon: "https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=24&h=24&fit=crop", label: "Leaderboard", active: false },
  { icon: "https://images.pexels.com/photos/1181354/pexels-photo-1181354.jpeg?auto=compress&cs=tinysrgb&w=26&h=26&fit=crop", label: "Badges & Rewards", active: false },
  { icon: "https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=26&h=26&fit=crop", label: "Clubs & Community", active: false },
  { icon: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=26&h=26&fit=crop", label: "Raise a Doubt", active: false },
  { icon: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=26&h=26&fit=crop", label: "Referrals Program", active: false },
];

export const PropertyWrapperSubsection = (): JSX.Element => {
  return (
    <div className="w-full h-full bg-[#3479ff] relative">
      <div className="w-full max-w-[1605px] mx-auto bg-white shadow-[0px_0px_29px_#00000075] min-h-[1103px] relative">
        <div className="relative w-full">
          <div className="w-full">
            <div className="relative w-full">
              <img
                className="absolute top-[295px] w-[336px] h-[196px] left-0 z-10"
                alt="Group"
                src="https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=336&h=196&fit=crop"
              />

              <div className="w-full bg-white min-h-[886px] pl-[300px]">
                <div className="w-full max-w-[1425px] h-[181px] mt-[49px] bg-[#3479ff] rounded-[20px] overflow-hidden relative">
                  <div className="absolute w-[221px] h-[181px] top-0 right-[7px]">
                    <div className="absolute w-[221px] h-[181px] top-0 left-0">
                      <img
                        className="absolute w-20 h-20 top-[45px] left-[71px]"
                        alt="Star"
                        src="https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop"
                      />
                      <img
                        className="absolute w-20 h-20 top-[93px] left-[141px]"
                        alt="Star"
                        src="https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop"
                      />
                      <img
                        className="absolute w-20 h-[59px] top-[122px] left-0"
                        alt="Star"
                        src="https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=80&h=59&fit=crop"
                      />
                      <img
                        className="absolute w-[61px] h-[59px] top-0 left-[141px]"
                        alt="Star"
                        src="https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=61&h=59&fit=crop"
                      />
                    </div>
                    <img
                      className="absolute w-[61px] h-[60px] top-5 left-2.5"
                      alt="Star"
                      src="https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=61&h=60&fit=crop"
                    />
                  </div>

                  <div className="absolute w-[675px] h-[141px] top-5 left-6">
                    <div className="absolute top-[31px] left-0 [font-family:'Poppins',Helvetica] font-semibold text-white text-2xl tracking-[0] leading-[35px]">
                      Sharpen&nbsp;&nbsp;Your Skills With
                      <br />
                      Professional Online Courses And Earn More Certificates
                    </div>
                    <div className="absolute top-0 left-0 [font-family:'Inter',Helvetica] font-normal text-white text-xs tracking-[0] leading-[normal]">
                      ONLINE COURSE
                    </div>
                    <Button className="absolute top-[105px] left-0 h-9 bg-[#202020] rounded-[40px] px-3 py-2 gap-3">
                      <span className="[font-family:'Inter',Helvetica] font-medium text-xs text-white">
                        Join Now
                      </span>
                      <div className="flex w-5 h-5 items-center justify-center bg-white rounded-[50px] p-1.5">
                        <PlayIcon className="w-2 h-2 text-black fill-black" />
                      </div>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col w-full max-w-[1430px] items-start justify-center gap-[54px] mt-[84px] px-[358px]">
            <div className="relative w-full h-14">
              <div className="absolute w-[186px] h-[54px] top-px left-0">
                <div className="absolute w-[150px] top-0 left-0 text-xl [font-family:'Nunito',Helvetica] font-bold text-[#13377c] tracking-[0] leading-[26px]">
                  My Certificates
                </div>
                <div className="w-[182px] absolute top-[30px] left-0 [font-family:'Poppins',Helvetica] font-normal text-object-black-60 text-base tracking-[0] leading-6">
                  List of your certificates
                </div>
              </div>

              <Select>
                <SelectTrigger className="absolute top-[7px] right-0 w-[217px] h-[41px] border-2 border-[#eaeaea] rounded-[3px]">
                  <SelectValue
                    placeholder="Recently added"
                    className="[font-family:'Poppins',Helvetica] font-normal text-object-black-90 text-base"
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Recently added</SelectItem>
                  <SelectItem value="oldest">Oldest first</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger className="absolute top-[7px] right-[236px] w-[217px] h-[41px] border-2 border-[#eaeaea] rounded-[3px]">
                  <SelectValue
                    placeholder="All Certificates"
                    className="[font-family:'Poppins',Helvetica] font-normal text-object-black-90 text-base"
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Certificates</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>

              <div className="absolute w-[603px] h-14 top-0 left-[294px]">
                <div className="flex w-[603px] items-start justify-center gap-3 relative">
                  <div className="flex items-center justify-center gap-2.5 px-4 py-5 relative flex-1 grow bg-white rounded-xl border border-solid border-[#cccccccc]">
                    <SearchIcon className="w-4 h-4 text-[#9e9e9e]" />
                    <Input
                      placeholder="SearchIcon your certificates here...."
                      className="border-0 p-0 h-auto [font-family:'Inter',Helvetica] font-medium text-[#9e9e9e] text-xs focus-visible:ring-0"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col w-full items-start gap-[43px] relative">
              <div className="grid grid-cols-4 gap-[47px] w-full">
                {certificateData.slice(0, 4).map((cert) => (
                  <Card
                    key={cert.id}
                    className="w-[321px] h-[385px] bg-white rounded-[20px] shadow-[0px_4px_45px_#0000001a] p-3 relative"
                  >
                    <CardContent className="p-0 flex flex-col gap-2.5">
                      <img
                        className={`${cert.imageHeight} relative self-stretch w-full object-cover`}
                        alt="Certificate"
                        src={cert.image}
                      />

                      <div className="flex flex-col gap-5">
                        <div className="flex flex-col w-[280px] items-start justify-center gap-2.5 px-1.5 py-0">
                          <Badge className="h-[15px] bg-[#75a4ff87] rounded-lg px-3 py-3">
                            <span className="[font-family:'Inter',Helvetica] font-semibold text-[#083a50] text-[8px] -mt-[10.5px] -mb-[8.5px]">
                              COURSE
                            </span>
                          </Badge>

                          <div className="[font-family:'Inter',Helvetica] font-medium text-[#202020] text-sm tracking-[0] leading-[normal]">
                            {cert.title}
                          </div>

                          <div className="flex gap-2 items-center">
                            <div className="flex flex-col w-[116px] items-start gap-1 bg-white">
                              <div className="[font-family:'Inter',Helvetica] font-medium text-[#202020] text-[10px] -mt-px">
                                {cert.academy}
                              </div>

                              <div className="flex items-center gap-[3px] w-full">
                                <CalendarIcon className="w-2 h-2 text-[#9c9c9c]" />
                                <div className="[font-family:'Inter',Helvetica] font-normal text-[#9c9c9c] text-[8px] -mt-px">
                                  Completed: {cert.completedDate}
                                </div>
                              </div>

                              <div className="flex items-center gap-[3px]">
                                <div className="[font-family:'Inter',Helvetica] font-normal text-[#999494] text-[8px] -mt-px">
                                  #
                                </div>
                                <div className="[font-family:'Inter',Helvetica] font-normal text-[#9c9c9c] text-[8px] -mt-px">
                                  {cert.certId}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex w-[294px] h-[31px] items-center gap-[9px]">
                          <Button className="w-[143px] h-[27px] bg-[#3479ff] rounded-lg px-[19px] py-px border border-solid h-auto">
                            <div className="flex items-center gap-1">
                              <DownloadIcon className="w-3 h-3 text-white" />
                              <span className="font-bold text-white text-xs [font-family:'Nunito',Helvetica]">
                                DownloadIcon
                              </span>
                            </div>
                          </Button>

                          <Button
                            variant="outline"
                            className="w-[143px] h-[27px] rounded-lg px-[47px] py-1 border border-solid border-[#3479ff] h-auto"
                          >
                            <div className="flex items-center gap-[9px]">
                              <Share2Icon className="w-3 h-3 text-[#3479ff]" />
                              <span className="font-bold text-[#3479ff] text-xs [font-family:'Nunito',Helvetica]">
                                Share
                              </span>
                            </div>
                          </Button>
                        </div>
                      </div>

                      <Button className="absolute top-[22px] right-[22px] w-5 h-5 bg-[#3479ff] rounded-[50px] p-1.5 h-auto">
                        <HeartIcon className="w-2 h-2 text-white fill-white" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="grid grid-cols-4 gap-[47px] w-full">
                {certificateData.slice(4, 8).map((cert) => (
                  <Card
                    key={cert.id}
                    className="w-[321px] h-[385px] bg-white rounded-[20px] shadow-[0px_4px_45px_#0000001a] p-3 relative"
                  >
                    <CardContent className="p-0 flex flex-col gap-2.5">
                      <img
                        className={`${cert.imageHeight} relative self-stretch w-full object-cover`}
                        alt="Certificate"
                        src={cert.image}
                      />

                      <div className="flex flex-col gap-5">
                        <div className="flex flex-col w-[280px] items-start justify-center gap-2.5 px-1.5 py-0">
                          <Badge className="h-[15px] bg-[#75a4ff87] rounded-lg px-3 py-3">
                            <span className="[font-family:'Inter',Helvetica] font-semibold text-[#083a50] text-[8px] -mt-[10.5px] -mb-[8.5px]">
                              COURSE
                            </span>
                          </Badge>

                          <div className="[font-family:'Inter',Helvetica] font-medium text-[#202020] text-sm tracking-[0] leading-[normal]">
                            {cert.title}
                          </div>

                          <div className="flex gap-2 items-center">
                            <div className="flex flex-col w-[116px] items-start gap-1 bg-white">
                              <div className="[font-family:'Inter',Helvetica] font-medium text-[#202020] text-[10px] -mt-px">
                                {cert.academy}
                              </div>

                              <div className="flex items-center gap-[3px] w-full">
                                <CalendarIcon className="w-2 h-2 text-[#9c9c9c]" />
                                <div className="[font-family:'Inter',Helvetica] font-normal text-[#9c9c9c] text-[8px] -mt-px">
                                  Completed: {cert.completedDate}
                                </div>
                              </div>

                              <div className="flex items-center gap-[3px]">
                                <div className="[font-family:'Inter',Helvetica] font-normal text-[#999494] text-[8px] -mt-px">
                                  #
                                </div>
                                <div className="[font-family:'Inter',Helvetica] font-normal text-[#9c9c9c] text-[8px] -mt-px">
                                  {cert.certId}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex w-[294px] h-[31px] items-center gap-[9px]">
                          <Button className="w-[143px] h-[27px] bg-[#3479ff] rounded-lg px-[19px] py-px border border-solid h-auto">
                            <div className="flex items-center gap-1">
                              <DownloadIcon className="w-3 h-3 text-white" />
                              <span className="font-bold text-white text-xs [font-family:'Nunito',Helvetica]">
                                DownloadIcon
                              </span>
                            </div>
                          </Button>

                          <Button
                            variant="outline"
                            className="w-[143px] h-[27px] rounded-lg px-[47px] py-1 border border-solid border-[#3479ff] h-auto"
                          >
                            <div className="flex items-center gap-[9px]">
                              <Share2Icon className="w-3 h-3 text-[#3479ff]" />
                              <span className="font-bold text-[#3479ff] text-xs [font-family:'Nunito',Helvetica]">
                                Share
                              </span>
                            </div>
                          </Button>
                        </div>
                      </div>

                      <Button className="absolute top-[22px] right-[22px] w-5 h-5 bg-[#3479ff] rounded-[50px] p-1.5 h-auto">
                        <HeartIcon className="w-2 h-2 text-white fill-white" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          <div className="absolute top-0 left-[326px] flex w-[1503px] items-center justify-between px-8 py-0">
            <div className="flex items-center gap-[57px]">
              <img
                className="w-[25px] h-[25px]"
                alt="Component"
                src="https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=25&h=25&fit=crop"
              />
              <div className="[font-family:'Nunito',Helvetica] font-bold text-[#13377c] text-2xl tracking-[0] leading-[normal]">
                Certificates
              </div>
            </div>

            <div className="flex items-center gap-[23px]">
              <div className="w-6 h-6">
                <div className="w-[17px] h-5 mt-0.5 ml-1 bg-[100%_100%]" />
              </div>
              <div className="w-14 h-14 bg-cover bg-[50%_50%]">
                <div className="h-14 rounded-[28px] border-4 border-solid border-[#3479ff99]" />
              </div>
              <img
                className="w-6 h-6"
                alt="Iconly light outline"
                src="https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=24&h=24&fit=crop"
              />
            </div>
          </div>
        </div>
      </div>

      <img
        className="absolute w-[262px] h-[68px] top-[35px] left-[19px]"
        alt="Frame"
        src="https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=262&h=68&fit=crop"
      />

      <div className="flex flex-col items-start gap-[90px] absolute top-[137px] left-[59px]">
        <div className="flex flex-col items-start gap-[43px] w-full">
          {navigationItems.map((item, index) => (
            <div key={index} className="flex items-center gap-[17px] w-full">
              <img
                className="w-[26px] h-[26px]"
                alt={item.label}
                src={item.icon}
              />
              <div
                className={`font-extrabold text-lg [font-family:'Nunito',Helvetica] tracking-[0] leading-[19.6px] whitespace-nowrap ${
                  item.active ? "text-[#13377c]" : "text-white"
                }`}
              >
                {item.label}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <img
            className="w-7 h-7"
            alt="Sign out"
            src="https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=28&h=28&fit=crop"
          />
          <div className="[font-family:'Poppins',Helvetica] font-semibold text-white text-xl tracking-[0.40px] leading-[normal]">
            Log Out
          </div>
        </div>
      </div>
    </div>
  );
};
