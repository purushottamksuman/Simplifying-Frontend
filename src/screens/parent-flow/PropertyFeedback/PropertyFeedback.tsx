// FeedbackPage.tsx
import React, { useState } from "react";
import { User, Send, Star } from "lucide-react";

type Feedback = {
  id: number;
  course: string;
  teacher: string;
  student: string;
  date: string;
  rating: number;
  feedback: string;
  avatar?: string;
};

const sampleFeedback: Feedback[] = [
  {
    id: 1,
    course: "Mathematics Grade 5",
    teacher: "Mrs. Sarah Wilson",
    student: "Emma Johnson",
    date: "Jan 15, 2024",
    rating: 5,
    feedback:
      "James absolutely loves the hands-on experiments. His curiosity about the natural world has really blossomed under Ms. Ta...",
    avatar: undefined,
  },
  {
    id: 2,
    course: "English Literature",
    teacher: "Mr. David Chen",
    student: "Emma Johnson",
    date: "Jan 15, 2024",
    rating: 5,
    feedback:
      "Great engagement in reading activities. Emma's vocabulary has expanded tremendously this semester.",
    avatar: undefined,
  },
  {
    id: 3,
    course: "Science Exploration",
    teacher: "Ms. Rebecca Taylor",
    student: "James Johnson",
    date: "Jan 15, 2024",
    rating: 5,
    feedback:
      "James absolutely loves the hands-on experiments. His curiosity about the natural world has really blossomed under Ms. Ta...",
    avatar: undefined,
  },
];

export default function FeedbackPage() {
  const [rating, setRating] = useState<number>(0);
  const [feedbackText, setFeedbackText] = useState<string>("");
  const [student, setStudent] = useState<string>("");
  const [course, setCourse] = useState<string>("");

  return (
    <div className="min-h-screen bg-white p-8">
      {/* Top header */}
      <div className="max-w-6xl mx-auto">
        <div className="flex items-start gap-6">
          <div className="relative">
            {/* yellow badge */}
            <div className="w-12 h-12 rounded-full shadow-sm flex items-center justify-center">
              <User className="w-10 h-10 text-blue-700" />
            </div>
            <div className="absolute -top-3 left-8 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-xs">
              ♥
            </div>
          </div>

          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold text-blue-900">
              We value your feedback
            </h1>
            <p className="mt-2 text-gray-500 max-w-2xl">
              Share your thoughts about your child's learning experience to help us
              improve our teaching and create an even better educational environment.
            </p>
          </div>
        </div>

        {/* Main grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Left: Share Your Feedback form (big card) */}
          <div className="md:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            {/* small header inside card with Send icon */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-md bg-blue-50 flex items-center justify-center border border-blue-100">
                <Send className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-base font-semibold">Share Your Feedback</h2>
              </div>
            </div>

            {/* Form */}
            <div className="space-y-4">
              {/* Student */}
              <div>
                <label className="text-sm text-gray-600 block mb-1">Select Student</label>
                <select
                  value={student}
                  onChange={(e) => setStudent(e.target.value)}
                  className="w-full border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-200"
                >
                  <option value="">Choose your child</option>
                  <option value="emma">Emma Johnson</option>
                  <option value="james">James Johnson</option>
                </select>
              </div>

              {/* Course & Teacher */}
              <div>
                <label className="text-sm text-gray-600 block mb-1">Course & Teacher</label>
                <select
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  className="w-full border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-200"
                >
                  <option value="">Select course and teacher</option>
                  <option value="math">Mathematics - Mrs. Sarah Wilson</option>
                  <option value="english">English Literature - Mr. David Chen</option>
                  <option value="science">Science - Ms. Rebecca Taylor</option>
                </select>
              </div>

              {/* Rating */}
              <div>
                <label className="text-sm text-gray-600 block mb-1">Rate Your Experience</label>
                <div className="flex items-center gap-3">
                  <div className="flex gap-2 bg-white border rounded-full px-3 py-2 w-full">
                    <div className="flex gap-2 items-center">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setRating(s)}
                          aria-label={`Rate ${s}`}
                          className="p-1"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              s <= rating ? "text-yellow-400 fill-current" : "text-gray-300"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                    <div className="ml-auto text-sm text-gray-400">Rate your experience</div>
                  </div>
                </div>
              </div>

              {/* Feedback textarea */}
              <div>
                <label className="text-sm text-gray-600 block mb-1">Your Feedback</label>
                <textarea
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Share your experience... What did you like? Any suggestions for improvement?"
                  maxLength={500}
                  className="w-full border rounded-lg p-3 h-36 text-sm focus:outline-none focus:ring-1 focus:ring-blue-200 resize-none"
                />
                <div className="text-xs text-gray-400 text-right mt-1">
                  {feedbackText.length}/500 characters
                </div>
              </div>

              {/* Submit button with "Send" icon (sent logo) */}
              <div>
                <button
                  type="button"
                  className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg py-3 shadow"
                  onClick={() => {
                    // placeholder submit handler
                    alert("Feedback submitted (demo).");
                    setFeedbackText("");
                    setRating(0);
                    setCourse("");
                    setStudent("");
                  }}
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Feedback</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right: Past Feedback */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-blue-900">Your Past Feedback</h3>

            {sampleFeedback.map((fb) => (
              <div
                key={fb.id}
                className="bg-white rounded-xl p-4 shadow-sm border border-blue-50 ring-1 ring-blue-50"
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-sm font-semibold text-gray-600">
                    {fb.avatar ? (
                      <img src={fb.avatar} alt="avatar" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      fb.teacher[0]
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-semibold">{fb.course}</h4>
                        <div className="text-xs text-gray-500">
                          {fb.teacher} <span className="mx-1">•</span> <span>Student: {fb.student}</span>
                        </div>
                      </div>
                      <div className="text-xs text-gray-400">{fb.date}</div>
                    </div>

                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < fb.rating ? "text-yellow-400 fill-current" : "text-gray-200"}`}
                          />
                        ))}
                      </div>
                    </div>

                    <p className="mt-3 text-sm text-gray-700 line-clamp-3">{fb.feedback}</p>

                    <button className="mt-3 text-sm text-blue-600 hover:underline">Read more</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
