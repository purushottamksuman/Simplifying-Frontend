import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import { authHelpers, supabase } from "../../../lib/supabase";
import { OnboardingFlow } from "../../../components/onboarding/OnboardingFlow";

const PropertyParentDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [userName, setUserName] = useState("Parent");
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { user, error } = await authHelpers.getCurrentUser();
      if (error || !user) {
        navigate("/login");
        return;
      }

      setUser(user);

      const { data: profile } = await supabase
        .from("user_profiles")
        .select("user_type, full_name, onboarded, edu_level, career_domain")
        .eq("id", user.id)
        .single();

      if (profile?.user_type !== "parent") {
        navigate("/login");
        return;
      }

     if (
  !profile?.onboarded ||
  !profile?.edu_level ||
  !profile?.career_domain
) {
  setShowOnboarding(true);
  setLoading(false); // ✅ stop loading when showing onboarding
  return;
}

      setUserName(profile.full_name || user.email?.split("@")[0] || "Parent");
      setLoading(false);
    };

    checkAuth();
  }, [navigate]);

  if (loading) {
    return <div>Loading Parent Dashboard...</div>;
  }

if (showOnboarding) {
  return (
    <OnboardingFlow
      user={user}
      onFinish={async () => {
        console.log("🎉 Onboarding finished for parent");

        // ✅ Mark onboarded in DB
        await supabase
          .from("user_profiles")
          .update({ onboarded: true })
          .eq("id", user.id);

        // ✅ Hide onboarding & show dashboard
        setShowOnboarding(false);
        setLoading(false);
      }}
    />
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

export default PropertyParentDashboard;
