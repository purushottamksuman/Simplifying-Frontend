import {
  EditIcon,
  EyeIcon,
  HeartIcon,
  PlusIcon,
  SearchIcon,
  UsersIcon,
} from "lucide-react";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";

const courseData = [
  {
    id: 1,
    image: "/unsplash-qq9lains6ti-12.png",
    status: "Active",
    statusColor: "bg-[#dbfbe6] text-[#016630]",
    title: "Advanced React Development",
    description:
      "Master advanced React patterns, hooks, and performance optimization techniques.",
    students: "1,247 students",
  },
  {
    id: 2,
    image: "/unsplash-qq9lains6ti-13.png",
    status: "Draft",
    statusColor: "bg-[#fef9c1] text-[#884a00]",
    title: "Advanced React Development",
    description:
      "Master advanced React patterns, hooks, and performance optimization techniques.",
    students: "1,247 students",
  },
  {
    id: 3,
    image: "/unsplash-qq9lains6ti-11.png",
    status: "Archived",
    statusColor: "bg-[#f2f4f6] text-[#1d2838]",
    title: "Advanced React Development",
    description:
      "Master advanced React patterns, hooks, and performance optimization techniques.",
    students: "1,247 students",
  },
  {
    id: 4,
    image: "/unsplash-qq9lains6ti-12.png",
    status: "Active",
    statusColor: "bg-[#dbfbe6] text-[#016630]",
    title: "Advanced React Development",
    description:
      "Master advanced React patterns, hooks, and performance optimization techniques.",
    students: "1,247 students",
  },
  {
    id: 5,
    image: "/unsplash-qq9lains6ti-12.png",
    status: "Active",
    statusColor: "bg-[#dbfbe6] text-[#016630]",
    title: "Advanced React Development",
    description:
      "Master advanced React patterns, hooks, and performance optimization techniques.",
    students: "1,247 students",
  },
  {
    id: 6,
    image: "/unsplash-qq9lains6ti-13.png",
    status: "Draft",
    statusColor: "bg-[#fef9c1] text-[#884a00]",
    title: "Advanced React Development",
    description:
      "Master advanced React patterns, hooks, and performance optimization techniques.",
    students: "1,247 students",
  },
  {
    id: 7,
    image: "/unsplash-qq9lains6ti-11.png",
    status: "Archived",
    statusColor: "bg-[#f2f4f6] text-[#1d2838]",
    title: "Advanced React Development",
    description:
      "Master advanced React patterns, hooks, and performance optimization techniques.",
    students: "1,247 students",
  },
  {
    id: 8,
    image: "/unsplash-qq9lains6ti-12.png",
    status: "Active",
    statusColor: "bg-[#dbfbe6] text-[#016630]",
    title: "Advanced React Development",
    description:
      "Master advanced React patterns, hooks, and performance optimization techniques.",
    students: "1,247 students",
  },
];

export const PropertyMycourseSubsection = (): JSX.Element => {
  return (
      

      <div className="flex-1 bg-white relative">
        <img
          className="absolute top-[102px] left-[-300px] w-[1905px] h-[930px]"
          alt="Group"
          src="/group-1321317804-6.png"
        />

     
        <main className="px-[92px] mt-[15px] flex flex-col gap-[51px]">
          <section className="flex flex-col gap-[21px]">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-[7px]">
                <h1 className="[font-family:'Nunito',Helvetica] font-bold text-[#13377c] text-4xl tracking-[0] leading-[31.5px]">
                  My Courses
                </h1>
                <p className="[font-family:'Segoe_UI-Regular',Helvetica] font-normal text-wwwfigmacomstorm-gray text-xl tracking-[0] leading-[21px]">
                  Manage and track your course portfolio
                </p>
              </div>

              <Button className="bg-[#155cfb] hover:bg-[#155cfb]/90 text-white px-[49px] py-[7px] h-[49px] rounded-[6.75px] gap-2">
                <PlusIcon className="w-6 h-6" />
                <span className="[font-family:'Segoe_UI-Semibold',Helvetica] font-normal text-[17px] text-center tracking-[0] leading-[17.5px]">
                  Create New Course
                </span>
              </Button>
            </div>

            <div className="flex items-center gap-3.5 h-14">
              <div className="flex-1">
                <div className="relative">
                  <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#9e9e9e]" />
                  <Input
                    placeholder="Search your courses here...."
                    className="pl-10 h-full border-[#cccccccc] [font-family:'Inter',Helvetica] font-medium text-[#9e9e9e] text-xs"
                  />
                </div>
              </div>

              <Select>
                <SelectTrigger className="w-[174px] h-[43px] bg-[#f3f3f5] border-none rounded-[6.75px] gap-[13.5px] px-[12.1px] py-[8.6px]">
                  <div className="flex items-center gap-[13.5px]">
                    <img
                      className="w-[21px] h-3.5"
                      alt="Svg margin"
                      src="/svg-margin.svg"
                    />
                    <SelectValue
                      placeholder="All Status"
                      className="[font-family:'Segoe_UI-Regular',Helvetica] text-wwwfigmacomcod-gray text-[12.3px] text-center leading-[17.5px] font-normal tracking-[0]"
                    />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger className="w-[174px] h-[43px] bg-[#f3f3f5] border-none rounded-[6.75px] gap-[13.5px] px-[12.1px] py-[8.6px]">
                  <div className="flex items-center gap-[13.5px]">
                    <img
                      className="w-[21px] h-3.5"
                      alt="Svg margin"
                      src="/svg-margin.svg"
                    />
                    <SelectValue
                      placeholder="All Categories"
                      className="[font-family:'Segoe_UI-Regular',Helvetica] text-wwwfigmacomcod-gray text-[12.3px] text-center leading-[17.5px] font-normal tracking-[0]"
                    />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="development">Development</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </section>

          <section className="grid grid-cols-4 gap-[58px] gap-y-[29px]">
            {courseData.map((course) => (
              <Card
                key={course.id}
                className="w-[277px] h-[364px] bg-white rounded-[20px] shadow-[0px_14px_42px_#080f340f] p-3 relative"
              >
                <CardContent className="p-0 flex flex-col gap-2.5">
                  <img
                    className="w-full h-[113px] rounded-xl object-cover"
                    alt="Course thumbnail"
                    src={course.image}
                  />

                  <Badge
                    className={`w-fit h-[17px] ${course.statusColor} rounded-[6.75px] text-[10.5px] font-normal tracking-[0] leading-[14px] [font-family:'Segoe_UI-Semibold',Helvetica]`}
                  >
                    {course.status}
                  </Badge>

                  <div className="flex flex-col gap-[22px]">
                    <div className="flex flex-col gap-5">
                      <div className="h-[87px]">
                        <h3 className="[font-family:'Segoe_UI-Regular',Helvetica] font-normal text-neutral-950 text-sm tracking-[0] leading-[21px] mb-[10px]">
                          {course.title}
                        </h3>
                        <p className="[font-family:'Segoe_UI-Regular',Helvetica] font-normal text-[#717182] text-sm tracking-[0] leading-[21px]">
                          {course.description}
                        </p>
                      </div>

                      <div className="flex items-end gap-1">
                        <UsersIcon className="w-3.5 h-3.5 text-[#717182]" />
                        <span className="[font-family:'Segoe_UI-Regular',Helvetica] font-normal text-[#717182] text-[12.3px] tracking-[0] leading-[17.5px]">
                          {course.students}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <Button className="w-32 bg-[#155cfb] hover:bg-[#155cfb]/90 text-white rounded-[6.75px] px-4.5 py-2 gap-[7px] h-auto">
                        <EditIcon className="w-2 h-2" />
                        <span className="[font-family:'Segoe_UI-Semibold',Helvetica] font-normal text-xs text-center tracking-[0] leading-[17.5px]">
                          EditIcon
                        </span>
                      </Button>

                      <Button
                        variant="outline"
                        className="w-28 bg-white hover:bg-gray-50 text-[#757575] border-[#0000001a] rounded-[6.75px] px-[15.6px] py-1.5 h-auto"
                      >
                        <EyeIcon className="w-3 h-3" />
                        <span className="[font-family:'Segoe_UI-Semibold',Helvetica] font-normal text-[#757575] text-[12.3px] text-center tracking-[0] leading-[17.5px]">
                          View
                        </span>
                      </Button>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    className="absolute top-[22px] right-[22px] w-5 h-5 p-1.5 bg-[#cccccc80] hover:bg-[#cccccc] rounded-[50px]"
                  >
                    <HeartIcon className="w-full h-full text-gray-600" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </section>
        </main>
    </div>
  );
};
