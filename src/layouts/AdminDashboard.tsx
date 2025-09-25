import React from "react";
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

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
    </div>
  );
};

export default AdminDashboard;
