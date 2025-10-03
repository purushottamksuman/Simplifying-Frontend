import { useEffect, useState } from "react";
import { AdminSkillsphereReport } from "./AdminSkillsphereReport"
import { supabase } from "../../lib/supabase";
import type { SectionType } from "./AdminSkillsphereReport";

interface StudentProfile {
  full_name: string;
}

interface Student {
  user_id: any;
  answers: any;
  user_profiles: StudentProfile[];
  attempt_id?: any;
}

export const AdminSkillsphereReportContainer = () => {

    const [students, setStudents] = useState<Student[]>([]);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [selectedSection, setSelectedSection] = useState<SectionType>("all");
    const [responses, setResponses] = useState<any[]>([]);

    // Fetch students for exam
    useEffect(() => {
        const fetchStudents = async () => {
        const { data, error } = await supabase
            .from("exam_attempts")
            .select(`
                user_id,
                attempt_id,
                answers,
                user_profiles(full_name)
            `)
            .eq("exam_id", "feaf4147-ecf2-4c68-9f81-090bc4acb92d")
            .order("created_at", { ascending: true });

        if (error) console.log(error);
        else setStudents(data);
        };
        fetchStudents();
    }, []);

    // Fetch responses for a student
    const openResponses = async (student: any) => {
        console.log("Opening responses for student:", student);
        setSelectedStudent(student);
        const { data: responsesData, error } = await supabase
            .from("exam_responses")
            .select(`
            *,
            questions_vo (
                question_text,
                marks,
                options_vo (
                id,
                option_text,
                marks
                )
            )
            `)
            .eq("exam_attempt_id", student.attempt_id)
            .eq("user_id", student.user_id)
            .order("answered_at");

        if (error) {
            console.log("Error fetching responses:", error);
            setResponses([]);
        } else {
            console.log("Fetched responses:", responsesData);

            const processedResponses = responsesData?.map((response) => {
            const question = response.questions_vo;
            const allOptions = question?.options_vo || [];
            const correctOption = allOptions.find((opt: any) => opt.marks > 0);

            return {
                id: response.id,
                question_id: response.question_id,
                question_text: question?.question_text || "Question not found",
                selected_option_id: response.selected_option_id,
                selected_option_text: response.selected_option_text,
                option_marks: response.option_marks,
                section_type: response.section_type,
                answered_at: response.answered_at,
                question_marks: question?.marks || 1,
                correct_answer: correctOption?.option_text,
                is_correct:
                response.section_type === "aptitude"
                    ? response.option_marks > 0
                    : undefined,
            };
            });

            console.log("Processed Responses:", processedResponses);
            setResponses(processedResponses);
        }
    };


    // Filter responses by section
    const filteredResponses =
        selectedSection === "all"
        ? responses
        : responses.filter((r) => r.section_type === selectedSection);

    return (
        <AdminSkillsphereReport 
            students={students}
            selectedStudent={selectedStudent}
            responses={filteredResponses}
            selectedSection={selectedSection}
            setSelectedSection={setSelectedSection}
            openResponses={openResponses}
            setSelectedStudent={setSelectedStudent}
            filteredResponses={filteredResponses}
        />
    )
}