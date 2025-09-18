import React, { useEffect, useState } from "react";
import { supabase } from "../../../../lib/supabase";
import {
  ClockIcon,
  MessageCircleIcon,
} from "lucide-react";
import { Card, CardContent } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "../../../../components/ui/tabs";
import { Badge } from "../../../../components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../../components/ui/dialog";
import { Label } from "../../../../components/ui/label";
import { Input } from "../../../../components/ui/input";
import { Textarea } from "../../../../components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../../../components/ui/select";

export const PropertyRaiseAndSubsection = (): JSX.Element => {
  const [doubts, setDoubts] = useState<any[]>([]);
  const [fetchedResponses, setFetchedResponses] = useState<{ [key: number]: any[] }>({});
  const [activeTab, setActiveTab] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Track which doubt's response is visible
  const [showResponse, setShowResponse] = useState<{ [key: number]: boolean }>({});

  // Form state
  const [course, setCourse] = useState("");
  const [topic, setTopic] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const userId = localStorage.getItem("currentUser")
    ? JSON.parse(localStorage.getItem("currentUser")!).id
    : null;

  // Fetch doubts
  const fetchDoubts = async () => {
    const { data, error } = await supabase
      .from("doubts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) console.error("Error fetching doubts:", error);
    else setDoubts(data || []);
  };

  // Fetch responses
  const fetchResponses = async () => {
    const { data, error } = await supabase.from("doubt_responses").select("*");
    if (!error) {
      const grouped: { [key: number]: any[] } = {};
      data.forEach((r) => {
        if (!grouped[r.doubt_id]) grouped[r.doubt_id] = [];
        grouped[r.doubt_id].push(r);
      });
      setFetchedResponses(grouped);
    } else console.error("Error fetching responses:", error);
  };

  useEffect(() => {
    fetchDoubts();
    fetchResponses();
  }, []);


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmitDoubt = async () => {
  if (!course || !topic || !title || !description) {
    return alert("Please fill all fields");
  }

  let fileUrl = null;

  if (file) {
    try {
      const fileName = `${Date.now()}_${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("doubt-files") // replace with your bucket name
        .upload(fileName, file);

      if (uploadError) {
        console.error("File upload error:", uploadError);
        return alert("Failed to upload file");
      }

      const { data: publicUrlData } = supabase.storage
        .from("doubt-files")
        .getPublicUrl(fileName);

      fileUrl = publicUrlData.publicUrl;
    } catch (err) {
      console.error("Unexpected error uploading file:", err);
      return alert("Failed to upload file");
    }
  }

  // Insert doubt with optional file URL
  const { data, error } = await supabase.from("doubts").insert([
    {
      user_id: userId,
      category: course,
      topic,
      title,
      description,
      file_url: fileUrl, // store file URL if uploaded
    },
  ]);

  if (error) {
    console.error("Error submitting doubt:", error);
  } else {
    fetchDoubts(); // refresh the doubts list
    setIsModalOpen(false);
    setCourse("");
    setTopic("");
    setTitle("");
    setDescription("");
    setFile(null); // reset file
  }
};


  const filteredDoubts =
    activeTab === "all" ? doubts : doubts.filter((doubt) => doubt.status === activeTab);

  const allCount = doubts.length;
  const pendingCount = doubts.filter((d) => d.status === "pending").length;
  const resolvedCount = doubts.filter((d) => d.status === "resolved").length;

  return (
    <div className="w-full h-full bg-[#f9fbff] min-h-screen">
      <div className="w-full max-w-[1605px] mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-bold text-[#13377c] text-4xl">My Doubts</h1>
            <p className="text-[#6f6f6f] text-lg">
              Track your submitted questions and view responses from mentors and peers.
            </p>
          </div>
          <Button className="bg-[#3479ff] hover:bg-[#2563eb] rounded-lg text-white text-lg px-8 py-3"
            onClick={() => setIsModalOpen(true)}>Raise Doubts</Button>
        </div>

        {/* Tabs */}
        <div className="flex flex-col w-full items-start gap-2.5">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="w-[692px] mb-8">
              <TabsList className="flex h-[60px] items-center p-2.5 bg-white rounded-[21px] shadow-[0px_0px_20px_#3479ff40] gap-[100px]">
  <TabsTrigger
    value="all"
    className="w-[186px] flex flex-col items-center justify-center gap-2.5 p-2.5 text-xl rounded-[20px] data-[state=active]:bg-[#007fff59]"
  >
    ALL {allCount}
  </TabsTrigger>

  <TabsTrigger
    value="pending"
    className="w-[186px] flex flex-col items-center justify-center gap-2.5 p-2.5 rounded-[20px] text-[#888888] text-xl data-[state=active]:bg-[#007fff59] data-[state=active]:text-[#083a50]"
  >
    Pending {pendingCount}
  </TabsTrigger>

  <TabsTrigger
    value="resolved"
    className="w-[186px] flex flex-col items-center justify-center gap-2.5 p-2.5 rounded-[20px] text-[#888888] text-xl data-[state=active]:bg-[#007fff59] data-[state=active]:text-[#083a50]"
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
            <Card key={doubt.id} className="bg-white rounded-xl shadow-md border border-gray-100">
              <CardContent className="p-5">
                <div className="flex flex-col gap-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{doubt.title}</h3>
                      <p className="text-sm text-gray-500">{doubt.category} • {doubt.topic}</p>
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

                  <p className="text-gray-600">{doubt.description}</p>

                  <div className="flex items-center gap-4 border-t pt-3 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <ClockIcon size={14} />
                      {new Date(doubt.created_at).toLocaleString()}
                    </div>

                    {doubt.status === "resolved" && fetchedResponses[doubt.id]?.length > 0 && (
                      <div className="flex items-center gap-1 cursor-pointer"
                        onClick={() => setShowResponse(prev => ({ ...prev, [doubt.id]: !prev[doubt.id] }))}>
                        <MessageCircleIcon size={14} />
                        <span>View Response</span>
                      </div>
                    )}
                  </div>

                  {/* Inline response toggle */}
                  {showResponse[doubt.id] && (
                    <div className="mt-2 text-gray-700 text-sm flex gap-1">
                      {fetchedResponses[doubt.id].map((r) => (
                        <span key={r.id}>{r.message}</span>
                      ))}
                    </div>
                  )}

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
            <DialogTitle className="text-2xl font-bold text-[#083a50]">Raise a Doubt</DialogTitle>
            <p className="text-gray-500 text-sm">Submit your questions and get help from mentors or peers.</p>
          </DialogHeader>

          <div className="flex flex-col gap-5 mt-4">
            {/* Course and Topic */}
            <div className="flex gap-5">
              <div className="flex flex-col gap-2 flex-1">
                <Label>Course/Subject *</Label>
                <Select value={course} onValueChange={setCourse}>
                  <SelectTrigger><SelectValue placeholder="Select a course" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="React Development">React Development</SelectItem>
                    <SelectItem value="JavaScript Fundamentals">JavaScript Fundamentals</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2 flex-1">
                <Label>Topic *</Label>
                <Select value={topic} onValueChange={setTopic}>
                  <SelectTrigger><SelectValue placeholder="Select a topic" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Hooks">Hooks</SelectItem>
                    <SelectItem value="Asynchronous Programming">Asynchronous Programming</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Doubt Title */}
            <div className="flex flex-col gap-2">
              <Label>Doubt Title *</Label>
              <Input placeholder="Brief title for your doubt" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>

            {/* Doubt Description */}
            <div className="flex flex-col gap-2">
              <Label>Doubt Description *</Label>
              <Textarea placeholder="Describe your doubt in detail" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>

            <div className="flex flex-col gap-2">
        <Label>Attach File (optional)</Label>
        <Input type="file" onChange={handleFileChange} />
        {file && <span className="text-sm text-gray-500">{file.name}</span>}
      </div>

            <Button className="bg-[#3479ff] hover:bg-[#2563eb] text-white rounded-lg" onClick={handleSubmitDoubt}>
              Submit Doubt
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
