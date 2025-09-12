import React from "react";
import {
  CalendarIcon,
  DownloadIcon,
  HeartIcon,
  PlayIcon,
  SearchIcon,
  Share2Icon,
} from "lucide-react";

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

// Certificate data
const certificateData = [
  {
    id: 1,
    image: "/certificate.png",
    title: "Beginner's Guide To Becoming A Professional Frontend Developer",
    academy: "Teach Academy",
    completedDate: "March 15, 2024",
    certId: "Cert-2024-001",
  },
  {
    id: 2,
    image: "/certificate.png",
    title: "Mastering UI/UX Design For Beginners",
    academy: "Design School",
    completedDate: "April 10, 2024",
    certId: "Cert-2024-002",
  },
  {
    id: 3,
    image: "/certificate.png",
    title: "Advanced React Development Bootcamp",
    academy: "Code Hub",
    completedDate: "May 5, 2024",
    certId: "Cert-2024-003",
  },
  {
    id: 4,
    image: "/certificate.png",
    title: "Complete Backend Development With Node.js",
    academy: "Backend Masters",
    completedDate: "May 25, 2024",
    certId: "Cert-2024-004",
  },
  {
    id: 5,
    image: "/certificate.png",
    title: "Intro To Data Science With Python",
    academy: "DataCamp",
    completedDate: "June 15, 2024",
    certId: "Cert-2024-005",
  },
  {
    id: 6,
    image: "/certificate.png",
    title: "JavaScript Algorithms And Data Structures",
    academy: "CodeCademy",
    completedDate: "July 2, 2024",
    certId: "Cert-2024-006",
  },
  {
    id: 7,
    image: "/certificate.png",
    title: "Cloud Computing Essentials",
    academy: "AWS Academy",
    completedDate: "August 5, 2024",
    certId: "Cert-2024-007",
  },
  {
    id: 8,
    image: "/certificate.png",
    title: "AI & Machine Learning Fundamentals",
    academy: "AI Labs",
    completedDate: "September 1, 2024",
    certId: "Cert-2024-008",
  },
];

// Component
export const PropertyWrapperSubsection = (): JSX.Element => {
  return (
    
        
      <div className="flex-1 flex flex-col px-10 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-[#13377c] text-2xl font-bold">Certificates</h1>
          <img
            src="https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg"
            alt="Profile"
            className="w-10 h-10 rounded-full border-2 border-[#3479ff99]"
          />
        </div>

        {/* Hero Section */}
        <div className="w-full bg-[#3479ff] rounded-[20px] p-6 flex justify-between items-center shadow-md mb-12">
          <div>
            <p className="text-white text-xs mb-2">ONLINE COURSE</p>
            <h2 className="text-2xl font-semibold text-white leading-snug max-w-[600px]">
              Sharpen Your Skills With Professional Online Courses And Earn More Certificates
            </h2>
            <Button className="mt-4 h-9 bg-[#202020] rounded-[40px] px-5 py-2 gap-3 flex items-center">
              <span className="text-white text-xs">Join Now</span>
              <div className="w-5 h-5 flex items-center justify-center bg-white rounded-full">
                <PlayIcon className="w-2 h-2 text-black fill-black" />
              </div>
            </Button>
          </div>
          <div className="right-0 top-0 w-[221px] h-[171px]">
<div className="relative w-full h-full">
                      <img
                        className="absolute w-20 h-20 top-[45px] left-[71px]"
                        alt="Star"
                        src="/Star1.png"
                        

                      />
                      <img
                        className="absolute w-20 h-20 top-[93px] left-[141px]"
                        alt="Star"
                        src="/Star 3.png"
                      />
                      <img
                        className="absolute w-20 h-[59px] top-[122px] left-0"
                        alt="Star"
                        src="/Star 4.png"

                      />
                      <img
                        className="absolute w-[61px] h-[59px] top-0 left-[141px]"
                        alt="Star"
                        src="/Star 2.png"

                      />
                      <img
                        className="absolute w-[61px] h-[60px] top-5 left-2.5"
                        alt="Star"
                        src="/Star 3.png"

                        
                      />
                    </div>
          </div>
          
        </div>

        {/* Search & Filters */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h3 className="text-xl font-bold text-[#13377c]">My Certificates</h3>
            <p className="text-[#8c8c8c] text-sm">List of your certificates</p>
          </div>
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative w-[350px]">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#9e9e9e]" />
              <Input
                placeholder="Search your certificates here..."
                className="pl-10 py-3 border border-[#cccccc] rounded-xl text-sm"
              />
            </div>
            {/* Filters */}
            <Select>
              <SelectTrigger className="w-[200px] border border-[#eaeaea] rounded-lg">
                <SelectValue placeholder="All Certificates" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Certificates</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[200px] border border-[#eaeaea] rounded-lg">
                <SelectValue placeholder="Recently added" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Recently added</SelectItem>
                <SelectItem value="oldest">Oldest first</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Certificates Grid */}
        <div className="grid grid-cols-4 gap-8">
          {certificateData.map((cert) => (
            <Card
              key={cert.id}
              className="w-full h-[420px] bg-white rounded-[20px] shadow-md p-4 relative flex flex-col justify-between"
            >
              <CardContent className="p-0 flex flex-col gap-3">
                {/* Image */}
                <div className="h-[190px] flex items-center justify-center">
                  <img
                    className="max-h-full object-contain mx-auto"
                    src={cert.image}
                    alt="Certificate"
                  />
                </div>
                {/* Badge */}
                <Badge className="bg-[#75a4ff87] rounded-lg px-3 py-3 w-fit">
                  <span className="text-[#083a50] text-[8px] font-semibold">
                    COURSE
                  </span>
                </Badge>
                {/* Title */}
                <div className="text-[#202020] text-sm font-medium">
                  {cert.title}
                </div>
                {/* Details */}
                <div className="flex flex-col gap-1">
                  <span className="text-[#202020] text-[10px] font-medium">
                    {cert.academy}
                  </span>
                  <div className="flex items-center gap-1">
                    <CalendarIcon className="w-3 h-3 text-[#9c9c9c]" />
                    <span className="text-[#9c9c9c] text-[8px]">
                      Completed: {cert.completedDate}
                    </span>
                  </div>
                  <span className="text-[#9c9c9c] text-[8px]">#{cert.certId}</span>
                </div>
              </CardContent>

              {/* Buttons */}
              <div className="flex justify-between gap-2 mt-2">
                <Button className="w-[140px] h-[30px] bg-[#3479ff] rounded-lg flex items-center justify-center gap-1">
                  <DownloadIcon className="w-3 h-3 text-white" />
                  <span className="text-white text-xs font-bold">Download</span>
                </Button>
                <Button
                  variant="outline"
                  className="w-[140px] h-[30px] rounded-lg flex items-center justify-center gap-1 border border-[#3479ff]"
                >
                  <Share2Icon className="w-3 h-3 text-[#3479ff]" />
                  <span className="text-[#3479ff] text-xs font-bold">Share</span>
                </Button>
              </div>

              {/* Like Button */}
              <Button className="absolute top-4 right-4 w-5 h-5 bg-[#3479ff] rounded-full p-1.5">
                <HeartIcon className="w-2 h-2 text-white fill-white" />
              </Button>
            </Card>
          ))}
        </div>
    </div>
  );
};

export default PropertyWrapperSubsection;
