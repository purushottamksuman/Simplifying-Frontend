import React, { useRef, useState } from "react";
import * as XLSX from "xlsx";
import { supabase } from "../lib/supabase";
function generateRandomPassword(length = 10) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  FileText,
  PlusCircle,
  List,
  Edit,
  HelpCircle,
  BookOpen,
} from "lucide-react";

const adminRoutes = [
  {
    title: "Exam Management",
    description: "Manage existing exams, schedules, and details.",
    path: "/admin/exam-management",
    icon: FileText,
  },
  {
    title: "Create Assessment",
    description: "Design and create a new assessment for students.",
    path: "/admin/create-assessment",
    icon: PlusCircle,
  },
  {
    title: "SkillSphere Questions Management",
    description: "View, edit, and manage your questions bank.",
    path: "/admin/questions-list",
    icon: List,
  },
  {
    title: "Edit Assessment",
    description: "Update or edit an existing assessment.",
    path: "/admin/edit-assessment/123", // Example ID, replace dynamically if needed
    icon: Edit,
  },
//   {
//     title: "Solve Doubts",
//     description: "View and resolve student doubts.",
//     path: "/admin/doubt-solve",
//     icon: HelpCircle,
//   },
//   {
//     title: "Exam Details",
//     description: "Check detailed info of a specific exam.",
//     path: "/exam-details/456", // Example ID
//     icon: BookOpen,
//   },
];

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Handle Excel upload and parse
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError("");
    setUploadSuccess("");
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      let json: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
      if (!json.length) throw new Error("No data found in sheet");

      // Normalize all keys in each row: trim and lowercase
      json = json.map(row => {
        const newRow: any = {};
        Object.keys(row).forEach(key => {
          newRow[key.trim().toLowerCase()] = row[key];
        });
        return newRow;
      });

      // Validate required fields
      const requiredFields = ["email", "name", "phone"];
      for (const row of json) {
        for (const field of requiredFields) {
          if (!row[field]) throw new Error(`Missing field: ${field}`);
        }
      }

      // Prepare students array
      const students = json.map(row => ({
        email: row["email"],
        full_name: row["name"],
        phone: row["phone"],
        password: generateRandomPassword(10),
        user_type: "student"
      }));

      // Bulk create users using client-side signUp (no admin privileges)
      let successCount = 0;
      let failCount = 0;
      let failList: string[] = [];
      let failDetails: string[] = [];
      for (const student of students) {
        try {
          // 1. Create user in Supabase Auth (client-side, no admin)
          const { data: userData, error: userError } = await supabase.auth.signUp({
            email: student.email,
            password: student.password,
            options: {
              data: {
                full_name: student.full_name,
                phone: student.phone,
                user_type: "student"
              }
            }
          });
          if (userError || !userData?.user?.id) {
            failCount++;
            failList.push(student.email);
            failDetails.push(`${student.email}: ${userError?.message || 'Unknown error'}`);
            continue;
          }
          // 2. Add to user_profiles table
          const { error: profileError } = await supabase.from("user_profiles").upsert({
            id: userData.user.id,
            email: student.email,
            full_name: student.full_name,
            phone: student.phone,
            user_type: "student",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
          if (profileError) {
            failCount++;
            failList.push(student.email);
            failDetails.push(`${student.email}: ${profileError.message || 'Unknown error'}`);
            continue;
          }
          successCount++;
        } catch (e: any) {
          failCount++;
          failList.push(student.email);
          failDetails.push(`${student.email}: ${e?.message || 'Unknown error'}`);
        }
      }
      setUploadSuccess(`Created ${successCount} students. ${failCount ? failCount + ' failed.' : ''}`);
      if (failDetails.length) setUploadError(failDetails.join('\n'));
    } catch (err: any) {
      setUploadError(err.message || "Failed to process file");
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = async () => {
      try {
        const { error } = await supabase.auth.signOut();
        if (error) {
          console.error("❌ Logout error:", error);
          return;
        }
        localStorage.removeItem("currentUser");
        localStorage.removeItem("pendingUser");
        navigate("/login");
      } catch (err) {
        console.error("❌ Logout error:", err);
      }
    };

  return (
      <div className="p-8 relative">
        {/* Top-right logout button */}
        <div className="absolute top-6 right-8 z-10">
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="gap-2 px-4 py-2 rounded-xl text-white bg-red-500 hover:bg-red-600 transition-all duration-200 shadow-md"
          >
            <span className="font-medium text-sm">Log Out</span>
          </Button>
        </div>
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Bulk Add Students Card */}
        <Card className="cursor-pointer hover:shadow-xl transition border-2 border-green-200 bg-green-50" onClick={() => setShowModal(true)}>
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="w-10 h-10 mb-4 flex items-center justify-center rounded-full bg-green-100">
              <PlusCircle className="w-7 h-7 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-green-800">Bulk Add Students</h2>
            <p className="text-sm text-green-700 mt-2">Upload an Excel file to add multiple students at once.</p>
            <Button className="mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold" onClick={e => { e.stopPropagation(); setShowModal(true); }}>
              Upload Students
            </Button>
          </CardContent>
        </Card>
        {/* Other admin cards */}
        {adminRoutes.map((route) => {
          const Icon = route.icon;
          return (
            <Card
              key={route.path}
              className="cursor-pointer hover:shadow-xl transition"
              onClick={() => navigate(route.path)}
            >
              <CardContent className="p-6 flex flex-col items-center text-center">
                <Icon className="w-10 h-10 mb-4 text-blue-600" />
                <h2 className="text-xl font-semibold">{route.title}</h2>
                <p className="text-sm text-gray-500 mt-2">{route.description}</p>
                <Button className="mt-4">Visit</Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="p-3 border-t border-[#ffffff15] flex-shrink-0">
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-full gap-3 px-4 py-3 h-auto rounded-2xl text-white hover:bg-[#ffffff15] hover:text-white transition-all duration-200">
            <span className="font-medium text-sm">Log Out</span>
          </Button>
        </div>

      {/* Modal for Bulk Add Students */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-3xl shadow-2xl p-0 w-full max-w-lg relative animate-fade-in">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 rounded-t-3xl">
              <h2 className="text-2xl font-bold text-green-800">Bulk Add Students</h2>
              <button
                className="text-gray-400 hover:text-gray-700 text-2xl"
                onClick={() => setShowModal(false)}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="px-8 py-6">
              <p className="mb-4 text-gray-600 text-sm text-center">Upload an Excel file (.xlsx) with columns: <b>email</b>, <b>name</b>, <b>phone</b></p>
              <div className="flex flex-col items-center justify-center mb-4">
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="mb-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                  disabled={uploading}
                />
                {uploading && <div className="mb-2 text-green-600">Uploading...</div>}
                {uploadError && <div className="mb-2 text-red-600 whitespace-pre-line text-left w-full">{uploadError}</div>}
                {uploadSuccess && <div className="mb-2 text-green-600 whitespace-pre-line text-left w-full">{uploadSuccess}</div>}
              </div>
              <Button onClick={() => setShowModal(false)} className="w-full mt-2 bg-green-600 hover:bg-green-700 text-white font-semibold">Close</Button>
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
};

export default AdminDashboard;
