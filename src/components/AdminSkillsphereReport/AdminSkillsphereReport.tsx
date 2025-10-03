import { CheckCircle, XCircle } from "lucide-react";

export type SectionType = "all" | "aptitude" | "behavioral";

interface AdminSkillsphereReportProps {
  students: any[];
  selectedStudent: any;
  responses: any[];
  selectedSection: SectionType;
  setSelectedSection: (section: SectionType) => void;
  openResponses: (student: any) => void;
  setSelectedStudent: (student: any | null) => void;
  filteredResponses: any[];
}

export const AdminSkillsphereReport = ({
    students,
    selectedStudent,
    responses,
    selectedSection,
    setSelectedSection,
    openResponses,
    setSelectedStudent,
    filteredResponses
}: AdminSkillsphereReportProps) => {
  
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Skillsphere Report</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2 text-left">Student Name</th>
            <th className="border border-gray-300 p-2 text-left">Responses</th>
            <th className="border border-gray-300 p-2 text-left">Report</th>
          </tr>
        </thead>
        <tbody>
          {students.length > 0 ? (
            students.map((student) => (
              <tr key={student.user_id}>
                <td className="border border-gray-300 p-2">
                  {student.user_profiles?.full_name || ""}
                </td>
                <td className="border border-gray-300 p-2">
                  <button
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    onClick={() => openResponses(student)}
                  >
                    View Responses
                  </button>
                </td>
                <td className="border border-gray-300 p-2">{/* Report button */}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="border border-gray-300 p-2 text-center">
                No students found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Responses Dialog */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start pt-20 z-50">
          <div className="bg-white rounded-lg shadow w-3/4 max-h-[80vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">
                {selectedStudent.user_profiles?.full_name}'s Responses
              </h3>
              <button
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={() => setSelectedStudent(null)}
              >
                Close
              </button>
            </div>

            {/* Section Filters */}
            <div className="px-6 py-4 border-b border-gray-200 flex space-x-2">
              <button
                onClick={() => setSelectedSection("all")}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  selectedSection === "all"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                All ({responses.length})
              </button>
              <button
                onClick={() => setSelectedSection("aptitude")}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  selectedSection === "aptitude"
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Aptitude ({responses.filter((r) => r.section_type === "aptitude").length})
              </button>
              <button
                onClick={() => setSelectedSection("behavioral")}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  selectedSection === "behavioral"
                    ? "bg-purple-100 text-purple-800"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Behavioral ({responses.filter((r) => r.section_type === "behavioral").length})
              </button>
            </div>

            {/* Responses */}
            <div className="divide-y divide-gray-200">
              {filteredResponses.map((response, index) => (
                <div key={response.id} className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-sm font-medium text-gray-500">Q{index + 1}</span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            response.section_type === "aptitude"
                              ? "bg-green-100 text-green-800"
                              : "bg-purple-100 text-purple-800"
                          }`}
                        >
                          {response.section_type}
                        </span>
                        {response.is_correct !== undefined && (
                          <span
                            className={`flex items-center text-xs ${
                              response.is_correct ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {response.is_correct ? (
                              <CheckCircle className="h-4 w-4 mr-1" />
                            ) : (
                              <XCircle className="h-4 w-4 mr-1" />
                            )}
                            {response.is_correct ? "Correct" : "Incorrect"}
                          </span>
                        )}
                      </div>
                      <h4 className="font-medium text-gray-900 mb-2">{response.question_text}</h4>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-lg font-bold text-blue-600">
                        {response.option_marks}
                        {response.section_type === "aptitude" ? "/1" : "/5"}
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Your Answer:</p>
                    <p className="font-medium text-gray-900">{response.selected_option_text}</p>

                    {response.correct_answer &&
                      response.section_type === "aptitude" &&
                      !response.is_correct && (
                        <div className="mt-2 pt-2 border-t border-gray-200">
                          <p className="text-sm text-gray-600 mb-1">Correct Answer:</p>
                          <p className="font-medium text-green-600">{response.correct_answer}</p>
                        </div>
                      )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
