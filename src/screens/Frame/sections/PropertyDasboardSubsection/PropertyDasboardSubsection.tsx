import {
  AwardIcon,
  FileTextIcon,
  FolderIcon,
  GiftIcon,
  HelpCircleIcon,
  HomeIcon,
  LockIcon,
  LogOutIcon,
  PresentationIcon,
  SunIcon,
  TrophyIcon,
  UserIcon,
  UserPlusIcon,
  UsersIcon,
} from "lucide-react";
import React from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../../components/ui/avatar";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";
import { authHelpers } from "../../../../lib/supabase";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const navigationItems = [
  { icon: HomeIcon, label: "Dashboard", active: true },
  { icon: UserIcon, label: "Profile Settings", active: false },
  { icon: FolderIcon, label: "My Course", active: false },
  { icon: PresentationIcon, label: "Live Classes", active: false },
  { icon: FileTextIcon, label: "Test & Assessment", active: false },
  { icon: AwardIcon, label: "Certificates", active: false },
  { icon: TrophyIcon, label: "Leaderboard", active: false },
  { icon: GiftIcon, label: "Badges & Rewards", active: false },
  { icon: UsersIcon, label: "Clubs & Community", active: false },
  { icon: HelpCircleIcon, label: "Raise a Doubt", active: false },
  { icon: UserPlusIcon, label: "Referrals Program", active: false },
];

export const PropertyDasboardSubsection = (): JSX.Element => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [userName, setUserName] = useState("User");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { user, error } = await authHelpers.getCurrentUser();
        
        if (error || !user) {
          console.log("❌ No authenticated user, redirecting to login");
          navigate('/component/login');
          return;
        }
        
        setUser(user);
        const name = user.email?.split('@')[0] || user.user_metadata?.full_name || "User";
        setUserName(name);
        console.log("✅ Dashboard loaded for user:", name);
        
      } catch (err) {
        console.error("❌ Auth check error:", err);
        navigate('/component/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      console.log("🔄 Logging out user...");
      const { error } = await authHelpers.signOut();
      
      if (error) {
        console.error("❌ Logout error:", error);
        return;
      }
      
      // Clear all stored user data
      localStorage.removeItem('currentUser');
      localStorage.removeItem('pendingUser');
      
      console.log("✅ User logged out successfully");
      navigate('/component/login');
      
    } catch (err) {
      console.error("❌ Logout error:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex w-full h-screen bg-[#3479ff] items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex w-full h-screen bg-[#3479ff] items-center justify-center">
        <div className="text-white text-xl">Redirecting to login...</div>
      </div>
    );
  }

  return (
    <div className="flex w-full h-screen bg-[#3479ff] overflow-hidden">
      {/* Fixed Sidebar */}
      <aside className="w-[280px] h-full bg-[#3479ff] flex flex-col shadow-lg relative z-10">
        {/* Logo */}
        <div className="p-6 border-b border-[#ffffff20]">
          <img
            className="w-[220px] h-[55px] object-contain"
            alt="Simplifying Skills Logo"
            src="/Simplifying.png"
          />
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6">
          <div className="flex flex-col gap-2">
            {navigationItems.map((item, index) => (
              <Button
                key={index}
                variant="ghost"
                className={`w-full justify-start gap-3 px-4 py-3 h-auto rounded-xl transition-all duration-200 ${
                  item.active 
                    ? "bg-white text-[#3479ff] hover:bg-white shadow-sm" 
                    : "text-white hover:bg-[#ffffff15] hover:text-white"
                }`}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium text-sm">
                  {item.label}
                </span>
              </Button>
            ))}
          </div>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-[#ffffff20]">
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-full justify-start gap-3 px-4 py-3 h-auto rounded-xl text-white hover:bg-red-500/20 hover:text-red-200 transition-all duration-200"
          >
            <LogOutIcon className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium text-sm">Log Out</span>
          </Button>
        </div>
      </aside>

      {/* Main Content - Scrollable */}
      <main className="flex-1 bg-white overflow-y-auto">
        <div className="min-h-full">
          {/* Header */}
          <header className="sticky top-0 bg-white border-b border-gray-200 px-8 py-4 z-20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img
                  className="w-[120px] h-[24px] object-contain"
                  alt="Navigation Arrow"
                  src="/NavbarArrow.png"
                />
              </div>

              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="w-10 h-10">
                  <div className="w-4 h-4 bg-gray-300 rounded" />
                </Button>
                <Avatar className="w-12 h-12 border-2 border-[#3479ff]">
                  <AvatarImage src="/Profile.png" />
                  <AvatarFallback className="bg-[#3479ff] text-white">
                    {userName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <Button variant="ghost" size="icon" className="w-10 h-10">
                  <div className="w-4 h-4 bg-gray-300 rounded" />
                </Button>
              </div>
            </div>
          </header>

          {/* Dashboard Content */}
          <div className="p-8">
            <div className="flex gap-8">
              {/* Left Content */}
              <div className="flex-1 max-w-4xl">
                {/* Welcome Card */}
                <Card className="mb-8 rounded-3xl shadow-lg border-0 overflow-hidden">
                  <CardContent className="p-0">
                    <div className="h-[280px] bg-gradient-to-r from-[#3479ff] to-[#4f8bff] relative overflow-hidden">
                      <div className="p-8 relative z-10">
                        <h2 className="font-bold text-white text-4xl mb-6">
                          Good Morning {userName}! 👋
                        </h2>
                        <p className="text-white/90 text-lg max-w-lg leading-relaxed">
                          Don't miss out! Your child's future starts with one smart step - complete the payment today.
                        </p>
                      </div>
                      
                      {/* Decorative Elements */}
                      <div className="absolute w-64 h-64 top-0 right-8 bg-[#697ffc] rounded-full opacity-30" />
                      <SunIcon className="absolute w-14 h-14 top-6 right-20 text-white/80" />
                      <img
                        className="absolute w-64 h-80 top-0 right-0 opacity-80"
                        alt="Gradient decoration"
                        src="/GradientPurple.png"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Summary Card */}
                <Card className="rounded-3xl border-0 shadow-lg">
                  <CardContent className="p-8">
                    <h3 className="font-bold text-[#13377c] text-3xl mb-8">
                      Summary
                    </h3>

                    <div className="space-y-6">
                      {/* Payment Section */}
                      <div className="bg-gradient-to-r from-[#e9efff] to-[#f0f4ff] rounded-2xl p-6 relative overflow-hidden">
                        <div className="max-w-lg relative z-10">
                          <h4 className="font-bold text-gray-900 text-2xl mb-3">
                            Complete Your Payment
                          </h4>
                          <p className="text-gray-700 text-base mb-6 leading-relaxed">
                            Please select a plan that suits you best and complete your payment to unlock the assessment.
                          </p>
                          <Button className="bg-[#3479ff] hover:bg-[#2968e6] text-white px-8 py-3 rounded-xl font-semibold">
                            Pay Now
                          </Button>
                        </div>
                        <img
                          className="absolute w-40 h-44 top-2 right-8 opacity-90"
                          alt="Payment illustration"
                          src="/CashlessPayment.png"
                        />
                      </div>

                      {/* Cashback Section */}
                      <div className="bg-gradient-to-r from-[#fff4fb] to-[#fef7fc] rounded-2xl p-6 relative overflow-hidden">
                        <div className="max-w-lg relative z-10">
                          <h4 className="font-bold text-gray-900 text-2xl mb-2">
                            You Have ₹200 Cashback
                          </h4>
                          <p className="text-gray-600 text-sm mb-6">
                            T&C Apply
                          </p>
                          <Button className="bg-[#3479ff] hover:bg-[#2968e6] text-white px-8 py-3 rounded-xl font-semibold">
                            Refer & Earn
                          </Button>
                        </div>
                        <img
                          className="absolute w-48 h-40 top-4 right-8 opacity-90"
                          alt="Wallet illustration"
                          src="/Wallet.png"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Sidebar - Premium Features */}
              <div className="w-[480px] flex-shrink-0">
                <Card className="rounded-3xl shadow-lg border-0 sticky top-24">
                  <CardContent className="p-8">
                    <h3 className="font-bold text-[#13377c] text-2xl mb-8">
                      Unlock Premium Features
                    </h3>

                    <div className="space-y-8">
                      {/* Expert Guidance Card */}
                      <div className="rounded-3xl bg-gradient-to-br from-[#7b58f2] to-[#a493ff] p-6 h-80 relative overflow-hidden">
                        <div className="relative z-10">
                          <h4 className="font-bold text-white text-3xl mb-4">
                            Get Expert Guidance
                          </h4>
                          <p className="text-white/90 text-base mb-8 leading-relaxed max-w-sm">
                            Unlock your test results with a 1:1 counselling call and get a personalized growth plan.
                          </p>
                          <Button className="bg-white hover:bg-gray-100 text-gray-900 px-6 py-3 rounded-2xl font-bold flex items-center gap-2">
                            <LockIcon className="w-4 h-4" />
                            Unlock Session
                          </Button>
                        </div>
                        <div className="absolute bottom-0 right-0">
                          <img
                            className="w-56 h-44 object-contain"
                            alt="Expert guidance illustration"
                            src="/GoodKid.png"
                          />
                        </div>
                      </div>

                      {/* Join Clubs Card */}
                      <div className="rounded-3xl bg-gradient-to-br from-[#fec854] to-[#ffdf99] p-6 h-80 relative overflow-hidden">
                        <div className="relative z-10">
                          <h4 className="font-bold text-gray-900 text-3xl mb-4">
                            Join Our Clubs
                          </h4>
                          <p className="text-gray-800/90 text-base mb-8 leading-relaxed max-w-sm">
                            Discover your interests, learn new skills, and connect with like-minded students.
                          </p>
                          <Button className="bg-white hover:bg-gray-100 text-gray-900 px-6 py-3 rounded-2xl font-bold">
                            Explore Now
                          </Button>
                        </div>
                        <div className="absolute bottom-0 right-0">
                          <img
                            className="w-56 h-48 object-contain"
                            alt="Clubs illustration"
                            src="/SorryMother.png"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};