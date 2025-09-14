import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BellIcon, SettingsIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import { authHelpers, supabase } from "../../../lib/supabase";

const PropertyTeacherDashboard = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("Teacher");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { user, error } = await authHelpers.getCurrentUser();
      if (error || !user) {
        navigate("/login");
        return;
      }

      const { data: profile } = await supabase
        .from("user_profiles")
        .select("user_type, full_name")
        .eq("id", user.id)
        .single();

      if (profile?.user_type !== "teacher") {
        navigate("/component/dashboard");
        return;
      }

      setUserName(profile.full_name || user.email?.split("@")[0] || "Teacher");
      setLoading(false);
    };

    checkAuth();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex w-full h-screen items-center justify-center">
        <div className="text-[#3479ff] text-xl">Loading Teacher Dashboard...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Dashboard Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-700">Upcoming Classes</h3>
            <p className="text-2xl font-bold text-[#3479ff] mt-2">5</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-700">Assignments to Review</h3>
            <p className="text-2xl font-bold text-[#3479ff] mt-2">23</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-700">Student Queries</h3>
            <p className="text-2xl font-bold text-[#3479ff] mt-2">8</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-700">Active Courses</h3>
            <p className="text-2xl font-bold text-[#3479ff] mt-2">4</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <Button className="w-full bg-[#3479ff] text-white">Schedule Class</Button>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Button className="w-full bg-[#3479ff] text-white">Create Test</Button>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Button className="w-full bg-[#3479ff] text-white">Upload Content</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PropertyTeacherDashboard;
