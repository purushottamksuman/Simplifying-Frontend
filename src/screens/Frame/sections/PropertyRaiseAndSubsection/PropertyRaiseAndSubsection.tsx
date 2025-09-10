import React, { useState } from "react";
import {
  ClockIcon,
  MessageCircleIcon,
  UploadIcon,
} from "lucide-react";
import {
  Card,
  CardContent,
} from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "../../../../components/ui/tabs";
import { Badge } from "../../../../components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../../components/ui/dialog";
import { Label } from "../../../../components/ui/label";
import { Input } from "../../../../components/ui/input";
import { Textarea } from "../../../../components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../../../components/ui/select";

const doubtsData = [
  {
    id: 1,
    title: "Understanding React Hooks",
    category: "React Development",
    topic: "Hooks",
    description:
      "I'm having trouble understanding when to use useEffect vs useLayoutEffect. Can someone explain the difference?",
    status: "resolved",
    date: "Jan 10, 05:30 AM",
    responses: "1 response",
  },
  {
    id: 2,
    title: "JavaScript Async/Await",
    category: "JavaScript Fundamentals",
    topic: "Asynchronous Programming",
    description:
      "How do I handle multiple async operations that depend on each other?",
    status: "pending",
    date: "Jan 11, 05:30 AM",
    estimatedResponse: "Est. response: 1-2 hours",
  },
  {
    id: 3,
    title: "Understanding React Hooks",
    category: "React Development",
    topic: "Hooks",
    description:
      "I'm having trouble understanding when to use useEffect vs useLayoutEffect. Can someone explain the difference?",
    status: "resolved",
    date: "Jan 10, 05:30 AM",
    responses: "1 response",
  },
  {
    id: 4,
    title: "JavaScript Async/Await",
    category: "JavaScript Fundamentals",
    topic: "Asynchronous Programming",
    description:
      "How do I handle multiple async operations that depend on each other?",
    status: "pending",
    date: "Jan 11, 05:30 AM",
    estimatedResponse: "Est. response: 1-2 hours",
  },
];

export const PropertyRaiseAndSubsection = (): JSX.Element => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  const filteredDoubts =
    activeTab === "all"
      ? doubtsData
      : doubtsData.filter((doubt) => doubt.status === activeTab);

  const allCount = doubtsData.length;
  const pendingCount = doubtsData.filter((d) => d.status === "pending").length;
  const resolvedCount = doubtsData.filter(
    (d) => d.status === "resolved"
  ).length;

  return (
    <div className="w-full h-full bg-[#f9fbff] min-h-screen">
      <div className="w-full max-w-[1605px] mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-bold text-[#13377c] text-4xl">My Doubts</h1>
            <p className="text-[#6f6f6f] text-lg">
              Track your submitted questions and view responses from mentors and
              peers.
            </p>
          </div>
          <Button
            className="bg-[#3479ff] hover:bg-[#2563eb] rounded-lg text-white text-lg px-8 py-3"
            onClick={() => setIsModalOpen(true)}
          >
            Raise Doubts
          </Button>
        </div>
        {/* Tabs */}
<div className="flex flex-col w-full items-start gap-2.5">
  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
    <div className="w-[692px] mb-8">
      <TabsList className="flex h-[60px] items-center p-2.5 bg-white rounded-[21px] shadow-[0px_0px_20px_#3479ff40] gap-[100px]">
        <TabsTrigger
          value="all"
          className="w-[186px] flex flex-col items-center justify-center gap-2.5 p-2.5 rounded-[20px] data-[state=active]:bg-[#007fff59]"
        >
          <span className="font-bold text-[#083a50] text-2xl [font-family:'Nunito',Helvetica] tracking-[0] leading-[19.6px]">
            ALL {allCount}
          </span>
        </TabsTrigger>

        <TabsTrigger
          value="pending"
          className="font-bold text-[#888888] text-2xl [font-family:'Nunito',Helvetica] tracking-[0] leading-[19.6px] data-[state=active]:text-[#083a50]"
        >
          Pending {pendingCount}
        </TabsTrigger>

        <TabsTrigger
          value="resolved"
          className="font-bold text-[#888888] text-2xl [font-family:'Nunito',Helvetica] tracking-[0] leading-[19.6px] data-[state=active]:text-[#083a50]"
        >
          Resolved {resolvedCount}
        </TabsTrigger>
      </TabsList>
    </div>
  </Tabs>
</div>


        {/* Doubts List */}
        <div className="flex flex-col gap-5">
          {filteredDoubts.map((doubt) => (
            <Card
              key={doubt.id}
              className="bg-white rounded-xl shadow-md border border-gray-100"
            >
              <CardContent className="p-5">
                <div className="flex flex-col gap-3">
                  {/* Title + Badge */}
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {doubt.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {doubt.category} • {doubt.topic}
                      </p>
                    </div>
                    <Badge
                      className={`px-3 py-1 rounded-md text-sm ${
                        doubt.status === "resolved"
                          ? "bg-green-100 text-green-700 border border-green-300"
                          : "bg-yellow-100 text-yellow-700 border border-yellow-300"
                      }`}
                    >
                      {doubt.status === "resolved" ? "Resolved" : "Pending"}
                    </Badge>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600">{doubt.description}</p>

                  {/* Footer */}
                  <div className="flex items-center justify-between border-t pt-3 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <ClockIcon size={14} />
                      {doubt.date}
                    </div>
                    {doubt.responses && (
                      <div className="flex items-center gap-2">
                        <MessageCircleIcon size={14} />
                        {doubt.responses}
                      </div>
                    )}
                    {doubt.estimatedResponse && (
                      <span>{doubt.estimatedResponse}</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Raise Doubt Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="w-[700px] bg-white rounded-lg p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#083a50]">
              Raise a Doubt
            </DialogTitle>
            <p className="text-gray-500 text-sm">
              Submit your questions and get help from mentors or peers.
            </p>
          </DialogHeader>
          <div className="flex flex-col gap-5 mt-4">
            {/* Course and Topic */}
            <div className="flex gap-5">
              <div className="flex flex-col gap-2 flex-1">
                <Label>Course/Subject *</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a course" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="react">React Development</SelectItem>
                    <SelectItem value="javascript">
                      JavaScript Fundamentals
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2 flex-1">
                <Label>Topic *</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a topic" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hooks">Hooks</SelectItem>
                    <SelectItem value="async">
                      Asynchronous Programming
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {/* Doubt Title */}
            <div className="flex flex-col gap-2">
              <Label>Doubt Title *</Label>
              <Input placeholder="Brief title for your doubt" />
            </div>
            {/* Doubt Description */}
            <div className="flex flex-col gap-2">
              <Label>Doubt Description *</Label>
              <Textarea placeholder="Describe your doubt in detail" />
            </div>
            {/* Attachments */}
            <div className="flex flex-col gap-2">
              <Label>Attach Images (Optional)</Label>
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:bg-gray-50 transition">
                <UploadIcon size={24} className="text-gray-400" />
                <p className="text-gray-500 text-sm">
                  Click to upload images or drag and drop
                </p>
              </div>
            </div>
            {/* Submit */}
            <Button className="bg-[#3479ff] hover:bg-[#2563eb] text-white rounded-lg">
              Submit Doubt
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
