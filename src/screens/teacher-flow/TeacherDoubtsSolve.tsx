import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { ClockIcon } from "lucide-react";
import { Textarea } from "../../components/ui/textarea";

export const TeacherDoubtsSolve = (): JSX.Element => {
  const [doubts, setDoubts] = useState<any[]>([]);
  const [fetchedResponses, setFetchedResponses] = useState<{ [key: number]: any[] }>({});
  const [newResponses, setNewResponses] = useState<{ [key: number]: string }>({});

  const teacherId = localStorage.getItem("currentUser")
    ? JSON.parse(localStorage.getItem("currentUser")!).id
    : null;

  // Fetch doubts
  const fetchDoubts = async () => {
    const { data, error } = await supabase
      .from("doubts")
      .select("*")
      .order("created_at", { ascending: false });

    console.log("Fetched doubts:", data, "Error:", error);
    if (!error) setDoubts(data || []);
  };

  // Fetch all responses
  const fetchResponses = async () => {
    const { data, error } = await supabase.from("doubt_responses").select("*");
    if (!error) {
      const grouped: { [key: number]: any[] } = {};
      data.forEach((r) => {
        if (!grouped[r.doubt_id]) grouped[r.doubt_id] = [];
        grouped[r.doubt_id].push(r);
      });
      setFetchedResponses(grouped);
    } else console.error(error);
  };

  useEffect(() => {
    fetchDoubts();
    fetchResponses();
  }, []);

  // Teacher submits a response
  const handleSubmitResponse = async (doubtId: number, message: string) => {
    if (!message) return alert("Enter a response");

    const { error } = await supabase.from("doubt_responses").insert([
      { doubt_id: doubtId, user_id: teacherId, message },
    ]);

    if (!error) {
      // mark doubt as resolved
      await supabase.from("doubts").update({ status: "resolved" }).eq("id", doubtId);
      fetchDoubts();
      fetchResponses();
      setNewResponses((prev) => ({ ...prev, [doubtId]: "" })); // clear textarea
    } else console.error(error);
  };

  return (
    <div className="w-full min-h-screen bg-[#f9fbff] p-10">
      <h1 className="text-4xl font-bold text-[#13377c] mb-6">All Student Doubts</h1>

      <div className="flex flex-col gap-5">
        {doubts.map((doubt) => (
          <Card key={doubt.id} className="bg-white rounded-xl shadow-md border border-gray-100">
            <CardContent className="p-5">
              <div className="flex flex-col gap-3">
                {/* Title + Badge */}
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

                {/* Description */}
          <p className="text-gray-600">{doubt.description}</p>

{/* Show uploaded file if available */}
{doubt.file_url && (
  <div className="mt-2">
    <a
      href={doubt.file_url}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-600 underline text-sm"
    >
      View Attachment
    </a>
  </div>
)}

{/* Responses */}
<div className="mt-3 flex flex-col gap-2">
  {fetchedResponses[doubt.id]?.map((r) => (
    <div key={r.id} className="bg-gray-100 p-2 rounded-md text-gray-800 text-sm">
      {r.message}
    </div>
  ))}

{/* Teacher input for pending doubts */}
{doubt.status === "pending" && (
  <div className="flex gap-2 mt-2">
    <Textarea
      className="flex-1"
      placeholder="Write your response..."
      value={newResponses[doubt.id] || ""}
      onChange={(e) =>
        setNewResponses((prev) => ({ ...prev, [doubt.id]: e.target.value }))
      }
    />
    <Button
      onClick={() =>
        handleSubmitResponse(doubt.id, newResponses[doubt.id] || "")
      }
    >
      Submit
    </Button>
  </div>
)}
</div>



                {/* Footer */}
                <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                  <ClockIcon size={14} />
                  <span>{new Date(doubt.created_at).toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
