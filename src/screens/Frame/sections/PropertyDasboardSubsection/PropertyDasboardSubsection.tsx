import React, { useEffect, useState } from "react";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";
import { Input } from "../../../../components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../../../../components/ui/avatar";
import { SearchIcon, BellIcon, SettingsIcon, LockIcon } from "lucide-react";
import { authHelpers } from "../../../../lib/supabase";
import { useNavigate } from "react-router-dom";

export const PropertyDasboardSubsection = (): JSX.Element => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [userName, setUserName] = useState("User");
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { user, error } = await authHelpers.getCurrentUser();
        if (error || !user) {
          console.log("❌ No authenticated user, redirecting to login");
          navigate("/component/login");
          return;
        }

        setUser(user);
        const name =
          user.email?.split("@")[0] ||
          user.user_metadata?.full_name ||
          "User";
        setUserName(name);
        console.log("✅ Dashboard loaded for user:", name);
      } catch (err) {
        console.error("❌ Auth check error:", err);
        navigate("/component/login");
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

      localStorage.removeItem("currentUser");
      localStorage.removeItem("pendingUser");

      console.log("✅ User logged out successfully");
      navigate("/component/login");
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
  //   <div className="flex-1 h-screen bg-[#3479ff] rounded-l-[3rem] ml-1 overflow-hidden">
  //  <div className="h-full bg-white rounded-l-[3rem] flex flex-col overflow-hidden"> 
        
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-8">
                {/* Left Content */}
                <div className="flex-1 max-w-4xl">
                  {/* Welcome Card */}
                  <Card className="mb-8 rounded-3xl shadow-xl border-0 overflow-hidden">
                    <CardContent className="p-0">
                      <div className="h-72 bg-gradient-to-r from-[#3479ff] to-[#4f8bff] relative overflow-hidden">
                        <img
                          className="absolute w-64 h-80 top-0 right-0 opacity-80"
                          alt="Gradient decoration"
                          src="/GradientPurple.png"
                        />
                        <div className="p-8 relative z-10">
                          <h2 className="font-bold text-white text-4xl mb-6">
                            Hello {userName}! 👋
                          </h2>
                          <p className="text-white/90 text-lg max-w-lg leading-relaxed">
                            Don't miss out! Your child's future starts with one
                            smart step - complete the payment today.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Summary Card */}
                  <Card className="rounded-3xl border-0 shadow-xl">
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
                              Please select a plan that suits you best and
                              complete your payment to unlock the assessment.
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

                {/* Right Sidebar */}
                <div className="w-96 flex-shrink-0">
                  <div className="sticky top-8">
                    <Card className="rounded-[3rem] shadow-xl border-0 bg-white">
                      <CardContent className="p-8">
                        <h3 className="font-bold text-[#13377c] text-2xl mb-8">
                          Unlock Premium Features
                        </h3>
                        <div className="space-y-6">
                          {/* Expert Guidance */}
                          <div className="rounded-[2rem] bg-gradient-to-br from-[#7b58f2] to-[#a493ff] p-6 h-80 relative overflow-hidden">
                            <div className="relative z-10">
                              <h4 className="font-bold text-white text-2xl mb-4">
                                Get Expert Guidance
                              </h4>
                              <p className="text-white/90 text-base mb-8 leading-relaxed max-w-sm">
                                Unlock your test results with a 1:1 counselling
                                call and get a personalized growth plan.
                              </p>
                              <Button className="bg-white hover:bg-gray-100 text-gray-900 px-6 py-3 rounded-2xl font-bold flex items-center gap-2">
                                <LockIcon className="w-4 h-4" />
                                Unlock Session
                              </Button>
                            </div>
                            <div className="absolute bottom-0 right-0">
                              <img
                                className="w-48 h-36 object-contain"
                                alt="Expert guidance illustration"
                                src="/GoodKid.png"
                              />
                            </div>
                          </div>

                          {/* Join Clubs */}
                          <div className="rounded-[2rem] bg-gradient-to-br from-[#fec854] to-[#ffdf99] p-6 h-80 relative overflow-hidden">
                            <div className="relative z-10">
                              <h4 className="font-bold text-gray-900 text-2xl mb-4">
                                Join Our Clubs
                              </h4>
                              <p className="text-gray-800/90 text-base mb-8 leading-relaxed max-w-sm">
                                Discover your interests, learn new skills, and
                                connect with like-minded students.
                              </p>
                              <Button className="bg-white hover:bg-gray-100 text-gray-900 px-6 py-3 rounded-2xl font-bold">
                                Explore Now
                              </Button>
                            </div>
                            <div className="absolute bottom-0 right-0">
                              <img
                                className="w-48 h-40 object-contain"
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
          </div>
      //   </div>
      // </div>
  );
};
