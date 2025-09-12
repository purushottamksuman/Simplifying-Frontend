import { HeartIcon, PlayIcon, PlusIcon, SearchIcon, LogOutIcon } from "lucide-react";
import React from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../../components/ui/avatar";
import { Badge } from "../../../../components/ui/badge";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";
import { Input } from "../../../../components/ui/input";
import { Progress } from "../../../../components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import { Separator } from "../../../../components/ui/separator";

const courseData = [
  {
    id: 1,
    image:
      "https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop",
    category: "FRONTEND",
    title: "Beginner's Guide To Becoming A professional Frontend Developer",
    progress: 51,
    videosCompleted: "4/10 Videos Completed",
    instructor: "Prashant Kumar Singh",
    lastAccessed: "Last Accessed: 09 Aug 2025",
    avatar:
      "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop",
  },
  {
    id: 2,
    image:
      "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop",
    category: "FRONTEND",
    title: "Beginner's Guide To Becoming A professional Frontend Developer",
    progress: 51,
    videosCompleted: "4/10 Videos Completed",
    instructor: "Prashant Kumar Singh",
    lastAccessed: "Last Accessed: 09 Aug 2025",
    avatar:
      "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop",
  },
  {
    id: 3,
    image:
      "https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop",
    category: "FRONTEND",
    title: "Beginner's Guide To Becoming A professional Frontend Developer",
    progress: 51,
    videosCompleted: "4/10 Videos Completed",
    instructor: "Kitani Studio",
    lastAccessed: "Last Accessed: 09 Aug 2025",
    avatar:
      "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop",
  },
  {
    id: 4,
    image:
      "https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop",
    category: "FRONTEND",
    title: "Beginner's Guide To Becoming A professional Frontend Developer",
    progress: 51,
    videosCompleted: "4/10 Videos Completed",
    instructor: "Prashant Kumar Singh",
    lastAccessed: "Software Developer",
    avatar:
      "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop",
  },
  {
    id: 5,
    image:
      "https://images.pexels.com/photos/1181354/pexels-photo-1181354.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop",
    category: "FRONTEND",
    title: "Beginner's Guide To Becoming A professional Frontend Developer",
    progress: 51,
    videosCompleted: "4/10 Videos Completed",
    instructor: "Prashant Kumar Singh",
    lastAccessed: "Last Accessed: 09 Aug 2025",
    avatar:
      "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop",
  },
  {
    id: 6,
    image:
      "https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop",
    category: "FRONTEND",
    title: "Beginner's Guide To Becoming A professional Frontend Developer",
    progress: 51,
    videosCompleted: "4/10 Videos Completed",
    instructor: "Prashant Kumar Singh",
    lastAccessed: "Last Accessed: 09 Aug 2025",
    avatar:
      "https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop",
  },
  {
    id: 7,
    image:
      "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop",
    category: "FRONTEND",
    title: "Beginner's Guide To Becoming A professional Frontend Developer",
    progress: 51,
    videosCompleted: "4/10 Videos Completed",
    instructor: "Prashant Kumar Singh",
    lastAccessed: "Last Accessed: 09 Aug 2025",
    avatar:
      "https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop",
  },
  {
    id: 8,
    image:
      "https://images.pexels.com/photos/1181772/pexels-photo-1181772.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop",
    category: "FRONTEND",
    title: "Beginner's Guide To Becoming A professional Frontend Developer",
    progress: 51,
    videosCompleted: "4/10 Videos Completed",
    instructor: "Prashant Kumar Singh",
    lastAccessed: "Last Accessed: 09 Aug 2025",
    avatar:
      "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop",
  },
];

const mentorData = [
  {
    id: 1,
    name: "Prashant Kumar Singh",
    role: "Software Developer",
    avatar:
      "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop",
  },
  {
    id: 2,
    name: "Prashant Kumar Singh",
    role: "Software Developer",
    avatar:
      "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop",
  },
  {
    id: 3,
    name: "Prashant Kumar Singh",
    role: "Software Developer",
    avatar:
      "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop",
  },
  {
    id: 4,
    name: "Prashant Kumar Singh",
    role: "Software Developer",
    avatar:
      "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop",
  },
  {
    id: 5,
    name: "Prashant Kumar Singh",
    role: "Software Developer",
    avatar:
      "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop",
  },
];

export const PropertyMycourseSubsection = (): JSX.Element => {
  return (
    <div className="w-full h-screen bg-[#3479ff] flex">
    

      <main className="flex-1 bg-white relative">
        <div className="p-8">
          

          <div className="mb-8">
            <Card className="bg-[#3479ff] border-none rounded-[20px] overflow-hidden">
              <CardContent className="p-6 relative">
                <div className="flex justify-between items-center">
                  <div className="max-w-[345px]">
                    <div className="[font-family:'Inter',Helvetica] font-normal text-white text-xs tracking-[0] leading-[normal] mb-2">
                      ONLINE COURSE
                    </div>
                    <h2 className="[font-family:'Poppins',Helvetica] font-semibold text-white text-2xl tracking-[0] leading-[35px] mb-6">
                      Sharpen Your Skills With
                      <br />
                      Professional Online Courses
                    </h2>
                    <Button className="bg-[#202020] hover:bg-[#202020]/90 rounded-[40px] h-9 px-3 py-2 gap-3">
                      <span className="[font-family:'Inter',Helvetica] font-medium text-xs text-white">
                        Join Now
                      </span>
                      <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                        <PlayIcon className="w-2 h-2 text-black fill-black" />
                      </div>
                    </Button>
                  </div>
                  <div className="absolute right-0 top-0 w-[221px] h-[181px]">
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
              </CardContent>
            </Card>
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-center mb-8">
              <div className="flex items-center gap-3 max-w-[508px] w-full">
                <div className="flex-1 relative">
  {/* Replace SearchIcon with Image */}
  <img
    src="/search-normal.png"
    alt="Search"
    className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4"
  />

  {/* Input Field */}
  <Input
    placeholder="Your course here..."
    className="pl-10 py-5 border-[#cccccccc] [font-family:'Inter',Helvetica] font-medium text-[#9e9e9e] text-xs"
  />
</div>    

              </div>        
            </div>

            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="[font-family:'Nunito',Helvetica] font-bold text-[#13377c] text-xl tracking-[0] leading-[26px] mb-2">
                  My Course
                </h2>
                <p className="[font-family:'Poppins',Helvetica] font-normal text-object-black-60 text-base tracking-[0] leading-6">
                  List of your courses
                </p>
              </div>

              <div className="flex gap-4">
                <Select>
                  <SelectTrigger className="w-[183px] border-2 border-[#eaeaea] rounded-[3px]">
                    <SelectValue placeholder="All Rated" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Rated</SelectItem>
                    <SelectItem value="high">High Rated</SelectItem>
                    <SelectItem value="low">Low Rated</SelectItem>
                  </SelectContent>
                </Select>

                <Select>
                  <SelectTrigger className="w-[183px] border-2 border-[#eaeaea] rounded-[3px]">
                    <SelectValue placeholder="Recently added" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Recently added</SelectItem>
                    <SelectItem value="oldest">Oldest first</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  {courseData.map((course) => (
    <Card
  key={course.id}
  className="shadow-cards-long-default rounded-[20px] overflow-hidden h-[340px] flex flex-col justify-between"
>
  <CardContent className="p-3 relative flex flex-col justify-between h-full">
    <div>
      <div className="relative mb-3">
        <img
          className="w-full h-[150px] object-cover rounded-lg"
          alt="Course thumbnail"
          src={course.image}
          loading="lazy"
        />
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 w-5 h-5 p-0 bg-[#cccccc80] hover:bg-[#cccccc] rounded-full"
        >
          <HeartIcon className="w-3 h-3" />
        </Button>
      </div>

      <Badge className="bg-[#75a4ff87] text-[#083a50] text-[8px] font-semibold mb-3 h-[15px] px-3">
        {course.category}
      </Badge>

      <h3 className="[font-family:'Inter',Helvetica] font-medium text-[#202020] text-sm tracking-[0] leading-[normal] mb-3 line-clamp-2">
        {course.title}
      </h3>
    </div>

    <div>
      <div className="mb-2">
        <Progress value={course.progress} className="h-1.5 mb-1" />
        <p className="[font-family:'Poppins',Helvetica] font-normal text-[#7f7f7f] text-[6px] text-right tracking-[0] leading-[9px]">
          {course.videosCompleted}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Avatar className="w-6 h-6">
          <AvatarImage src={course.avatar} />
          <AvatarFallback>PK</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="[font-family:'Inter',Helvetica] font-medium text-[#202020] text-[10px] tracking-[0] leading-[normal]">
            {course.instructor}
          </p>
          <p className="[font-family:'Inter',Helvetica] font-normal text-[#202020] text-[8px] tracking-[0] leading-[normal]">
            {course.lastAccessed}
          </p>
        </div>
      </div>
    </div>
  </CardContent>
</Card>

  ))}
</div>

          </div>
        </div>
      </main>

      <aside className="w-[298px] bg-white p-6">
        <div className="flex flex-col items-center gap-4 mb-9">
          <img
            className="w-20 h-20 rounded-full"
            alt="Profile"
            src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop"
          />

          <div className="text-center">
            <h3 className="[font-family:'Inter',Helvetica] font-medium text-[#202020] text-base text-center tracking-[0] leading-[normal] mb-1.5">
              Good Morning Prashant
            </h3>
            <p className="[font-family:'Inter',Helvetica] font-medium text-[#7e7e7e] text-xs text-center tracking-[0] leading-[normal]">
              Continue Your Journey And Achieve Your Target
            </p>
          </div>

          <div className="flex items-center gap-6">
            <Button
              variant="outline"
              size="sm"
              className="w-12 h-12 rounded-full border-[#9e9e9e] p-3"
            >
              <img
                className="w-4 h-4"
                alt="Icon"
                src="/notification.png"
              />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-12 h-12 rounded-full border-[#9e9e9e] p-3"
            >
              <img
                className="w-4 h-4"
                alt="Icon"
                src="/direct-normal.png"
              />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-12 h-12 rounded-full border-[#9e9e9e] p-3"
            >
              <img
                className="w-4 h-4"
                alt="Icon"
                src="/direct-normal.png"
              />
            </Button>
          </div>
        </div>

        <div className="mb-9">
          <img
            className="w-[204px] h-[116px] mx-auto"
            alt="Graph"
            src="/graph.png"
          />
        </div>

        <div className="flex flex-col items-center gap-5 w-full rounded-[14px] border border-gray-200 shadow-md p-4 bg-white">
  {/* Heading */}
  <div className="flex w-full items-center justify-between">
    <h4 className="[font-family:'Inter',Helvetica] font-semibold text-[#202020] text-lg">
      Your Mentor
    </h4>
    <Button
      variant="outline"
      size="sm"
      className="w-7 h-7 rounded-full border-[#d1d1d1] p-0 shadow-sm"
    >
      <PlusIcon className="w-3.5 h-3.5" />
    </Button>
  </div>

  {/* Mentor List */}
  <div className="w-full flex flex-col gap-4">
    {mentorData.map((mentor, index) => (
      <div key={mentor.id}>
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <Avatar className="w-8 h-8">
            <AvatarImage src={mentor.avatar} />
            <AvatarFallback>PK</AvatarFallback>
          </Avatar>

          {/* Name & Role */}
          <div className="flex-1">
            <p className="[font-family:'Inter',Helvetica] font-semibold text-[#202020] text-sm">
              {mentor.name}
            </p>
            <p className="[font-family:'Inter',Helvetica] font-normal text-[#5f5f5f] text-xs">
              {mentor.role}
            </p>
          </div>

          {/* Follow Button */}
          <Button className="bg-[#3479ff] hover:bg-[#2e6de0] transition-colors h-auto px-3 py-1 rounded-full shadow-sm">
            <span className="[font-family:'Inter',Helvetica] font-medium text-white text-xs">
              Follow
            </span>
          </Button>
        </div>

        {/* Separator */}
        {index < mentorData.length - 1 && (
          <Separator className="my-3 bg-gray-200" />
        )}
      </div>
    ))}
  </div>

  {/* See All Button */}
  <Button className="w-full bg-[#3479ff] hover:bg-[#2e6de0] rounded-full h-auto px-4 py-2 shadow-md">
    <span className="[font-family:'Inter',Helvetica] font-bold text-white text-sm">
      See All
    </span>
  </Button>
</div>


      </aside>
    </div>
  );
};