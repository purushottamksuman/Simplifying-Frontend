import {
  AwardIcon,
  BellIcon,
  FileTextIcon,
  FolderIcon,
  GiftIcon,
  HelpCircleIcon,
  HomeIcon,
  LockIcon,
  LogOutIcon,
  MenuIcon,
  PresentationIcon,
  SearchIcon,
  SettingsIcon,
  SunIcon,
  TrophyIcon,
  UserIcon,
  UserPlusIcon,
  UsersIcon,
  XIcon,
  BrainIcon,
} from "lucide-react";
import React from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../../components/ui/avatar";
import { OnboardingFlow } from "../../../../components/onboarding/OnboardingFlow";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";
import { Input } from "../../../../components/ui/input";
import { authHelpers } from "../../../../lib/supabase";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { razorpayService } from "../../../../lib/razorpay";
import { supabase } from "../../../../lib/supabase";

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
  { icon: BrainIcon, label: "Simplifying AI", active: false },
];

interface Exam {
  exam_id: string;
  exam_name: string;
  description: string;
  original_price: number;
  discounted_price: number;
  tax: number;
  total_time: number;
  maximum_marks: number;
  is_active: boolean;
}

export const PropertyDasboardSubsection = (): JSX.Element => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [userName, setUserName] = useState("User");
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [exams, setExams] = useState<Exam[]>([]);
  const [activeSection, setActiveSection] = useState("Dashboard");
  const [userPurchases, setUserPurchases] = useState<string[]>([]);
  const [showOnboarding, setShowOnboarding] = useState(false);

useEffect(() => {
  const checkAuth = async () => {
    try {
      const { user, error } = await authHelpers.getCurrentUser();

      if (error || !user) {
        console.log("❌ No authenticated user, redirecting to login");
        navigate("/login");
        return;
      }

      setUser(user);
      const name = user.user_metadata?.full_name || "User";
      setUserName(name);
      console.log("✅ Dashboard loaded for user:", name);

 const { data: profile, error: profileError } = await supabase
  .from("user_profiles")
  .select("full_name, user_type")
  .eq("id", user.id)
  .single();

if (profileError || !profile) {
  console.error("❌ Profile fetch error:", profileError);
  navigate("/login");
  return;
}

setUserName(profile.full_name || "User");

if (profile.user_type?.toLowerCase() !== "student") {
  navigate("/login");
  return;
}

      await fetchExams();
      await fetchUserPurchases(user.id);

    } catch (err) {
      console.error("❌ Auth check error:", err);
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  checkAuth();
}, [navigate]);


  // 🔹 Check onboarding state after user is loaded
  useEffect(() => {
    const checkProfile = async () => {
      if (!user) {
        console.log("⏳ No user yet, skipping onboarding check");
        return;
      }

      console.log("🔍 Checking profile for user:", user.id);

      const { data, error } = await supabase
        .from("user_profiles")
        .select("edu_level, career_domain, onboarded")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("❌ Profile fetch error:", error);
        console.log("➡️ No profile found, showing onboarding");
        setShowOnboarding(true);
        return;
      }

      console.log("📄 Profile data:", data);

      const needsOnboard =
        !data?.onboarded ||
        !data?.edu_level ||
        !data?.career_domain;

      if (needsOnboard) {
        console.log("🚪 User profile incomplete, showing onboarding");
      } else {
        console.log("✅ User already onboarded");
      }

      setShowOnboarding(Boolean(needsOnboard));
    };

    checkProfile();
  }, [user]);


  const fetchExams = async () => {
    try {
      const { data, error } = await supabase
        .from('exams')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setExams(data || []);
    } catch (error) {
      console.error('Error fetching exams:', error);
    }
  };

  const fetchUserPurchases = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('exam_purchases')
        .select('exam_id')
        .eq('user_id', userId);

      if (error) throw error;
      setUserPurchases(data?.map(p => p.exam_id) || []);
    } catch (error) {
      console.error('Error fetching user purchases:', error);
    }
  };

  const handleLogout = async () => {
    try {
      console.log("🔄 Logging out user...");
      const { error } = await authHelpers.signOut();
      
      if (error) {
        console.error("❌ Logout error:", error);
        return;
      }
      
      localStorage.removeItem('currentUser');
      localStorage.removeItem('pendingUser');
      
      console.log("✅ User logged out successfully");
      navigate('/login');
      
    } catch (err) {
      console.error("❌ Logout error:", err);
    }
  };

  const handleExamPayment = async (exam: Exam) => {
    setPaymentLoading(true);
    setPaymentError("");
    setPaymentSuccess(false);

    try {
      const totalAmount = exam.discounted_price + exam.tax;
      console.log(`🚀 Initiating payment for ${exam.exam_name}...`);
      
      const paymentResult = await razorpayService.initiatePayment({
        amount: totalAmount,
        currency: 'INR',
        description: `${exam.exam_name} - Exam Payment`,
        notes: {
          product: 'exam_purchase',
          exam_id: exam.exam_id,
          exam_name: exam.exam_name,
          user_id: user?.id,
          original_price: exam.original_price,
          discounted_price: exam.discounted_price,
          tax: exam.tax
        }
      });

      if (paymentResult.success) {
  console.log("✅ Payment completed successfully:", paymentResult);

  // Record exam purchase
  const { error: purchaseError } = await supabase
    .from('exam_purchases')
    .upsert({
      user_id: user.id,
      exam_id: exam.exam_id,
      payment_id: paymentResult.payment.payment_id,
      purchase_type: 'paid',
      amount_paid: totalAmount
    }, { onConflict: 'user_id,exam_id' });

  if (purchaseError) {
    console.error('Error recording purchase:', purchaseError);
  }

  // 🔹 Update skillsphere_enabled
  const { error: updateError } = await supabase
    .from('user_profiles')
    .update({ skillsphere_enabled: true })
    .eq('id', user.id);

  if (updateError) console.error("❌ Failed to update skillsphere_enabled:", updateError);

  setPaymentSuccess(true);
  alert(`🎉 Payment successful! You now have access to ${exam.exam_name}. Please Refresh to`);

  // Refresh user purchases
  await fetchUserPurchases(user.id);
}


    } catch (error) {
      console.error("❌ Payment failed:", error);
      setPaymentError(error.message || "Payment failed. Please try again.");
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleFreeExamAccess = async (exam: Exam) => {
    try {
      // Record free exam access - handle duplicate constraint
      const { error: purchaseError } = await supabase
        .from('exam_purchases')
        .upsert({
          user_id: user.id,
          exam_id: exam.exam_id,
          payment_id: null,
          purchase_type: 'free',
          amount_paid: 0
        }, {
          onConflict: 'user_id,exam_id'
        });
      
      if (purchaseError) {
        console.error('Error recording free access:', purchaseError);
        // Don't throw error if it's just a duplicate
        if (!purchaseError.message.includes('duplicate key')) {
          throw new Error('Failed to record free access');
        }
      }
      
      alert(`✅ You now have access to ${exam.exam_name}!`);
      
      // Refresh user purchases
      await fetchUserPurchases(user?.id);
    } catch (error) {
      console.error('Error recording free exam access:', error);
      alert('Error accessing exam. Please try again.');
    }
  };

  const handleAttemptExam = (exam: Exam) => {
    // Navigate to exam environment
    navigate(`/exam/${exam.exam_id}`);
  };

  const renderDashboardContent = () => {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex gap-8">
          {/* Left Content */}
          <div className="flex-1 max-w-4xl">
            {/* Welcome Card */}
            <Card className="mb-8 rounded-3xl shadow-xl border-0 overflow-visible relative">
  <CardContent className="p-0">
    <div className="h-72 bg-gradient-to-r from-[#3479ff] to-[#4f8bff] relative overflow-visible rounded-3xl">

      {/* Gradient Purple / Character Image */}
      <img
        className="absolute bottom-0 -right-4 z-10 drop-shadow-2xl pointer-events-none select-none"
        alt="Character Illustration"
        src="/GradientPurple.png"
      />

      {/* Text Content */}
      <div className="p-8 relative z-30 max-w-xl">
        <h2 className="font-bold text-white text-4xl mb-6">
          Hello {userName}! 👋
        </h2>
        <p className="text-white/90 text-lg leading-relaxed">
          Don't miss out! Your child's future starts with one smart step — complete the payment today.
        </p>
      </div>
    </div>
  </CardContent>
</Card>

<Card className="rounded-3xl border-0 shadow-xl">
  <CardContent className="p-8">
    <h3 className="font-bold text-[#13377c] text-3xl mb-8">Summary</h3>
    <div className="space-y-6">

      {/* Payment Section */}
<div className="bg-gradient-to-r from-[#e9efff] to-[#f0f4ff] rounded-2xl p-6 relative overflow-hidden">
  <div className="max-w-lg relative z-10">
    <h4 className="font-bold text-gray-900 text-2xl mb-3">
      Unlock Your SkillSphere Assessment
    </h4>
    <p className="text-gray-700 text-base mb-6 leading-relaxed">
      Get access to your personalized SkillSphere assessment. Complete the payment to evaluate your strengths, track progress, and unlock insights that help you grow faster.
    </p>

    {exams.length > 0 && (() => {
  const exam = exams.find(e => e.discounted_price + e.tax > 0);
  if (!exam) return null; // no paid exams

  const totalPrice = exam.discounted_price + exam.tax;

  return (
    <Button
      onClick={() => handleExamPayment(exam)}
      disabled={paymentLoading}
      className="bg-[#3479ff] hover:bg-[#2968e6] text-white px-8 py-3 rounded-xl font-semibold"
    >
      {paymentLoading ? "Processing..." : `Pay ₹${totalPrice}`}
    </Button>
  );
})()}

  </div>

  {/* Image floated right */}
  <img
    className="absolute top-1/2 right-6 -translate-y-1/2 w-40 h-auto opacity-90"
    alt="Payment illustration"
    src="/CashlessPayment.png"
  />
</div>



      {/* Cashback Section */}
      <div className="bg-gradient-to-r from-[#fff4fb] to-[#fef7fc] rounded-2xl p-6 relative overflow-hidden">
        {/* Content */}
        <div className="max-w-lg relative z-10">
          <h4 className="font-bold text-gray-900 text-2xl mb-2">
            You Have ₹200 Cashback
          </h4>
          <p className="text-gray-600 text-sm mb-6">T&C Apply</p>
          <Button className="bg-[#3479ff] hover:bg-[#2968e6] text-white px-8 py-3 rounded-xl font-semibold">
            Refer & Earn
          </Button>
        </div>

        {/* Image floated right */}
        <img
          className="absolute top-1/2 right-8 -translate-y-1/2 w-44 h-auto opacity-90"
          alt="Wallet illustration"
          src="/Wallet.png"
        />
      </div>

    </div>
  </CardContent>
</Card>



            {/* Payment Plans Card */}
            <Card className="rounded-3xl border-0 shadow-xl">
              <CardContent className="p-8">
                <h3 className="font-bold text-[#13377c] text-3xl mb-8">
                  Complete Your Payment
                </h3>
                <p className="text-gray-600 text-lg mb-8">
                  Please select a plan that suits you best and complete your payment to unlock the assessment.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {exams.map((exam) => {
                    const totalPrice = exam.discounted_price + exam.tax;
                    const isFree = totalPrice === 0;
                    const isPurchased = userPurchases.includes(exam.exam_id);
                    
                    return (
                      <Card key={exam.exam_id} className="rounded-2xl border border-gray-200 hover:shadow-lg transition-all duration-200">
                        <CardContent className="p-6">
                          <div className="flex flex-col h-full">
                            <h4 className="font-bold text-[#13377c] text-lg mb-2">{exam.exam_name}</h4>
                            <p className="text-gray-600 text-sm mb-4 flex-1 line-clamp-3">{exam.description}</p>
                            
                            <div className="space-y-3">
                              <div className="flex items-center justify-between text-sm text-gray-600">
                                <span>Duration:</span>
                                <span>{exam.total_time} minutes</span>
                              </div>
                              <div className="flex items-center justify-between text-sm text-gray-600">
                                <span>Max Marks:</span>
                                <span>{exam.maximum_marks}</span>
                              </div>
                              
                              {!isFree && (
                                <div className="border-t pt-3 space-y-2">
                                  {exam.original_price > exam.discounted_price && (
                                    <div className="flex items-center justify-between text-sm">
                                      <span className="text-gray-500">Original Price:</span>
                                      <span className="text-gray-500 line-through">₹{exam.original_price}</span>
                                    </div>
                                  )}
                                  <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-700">Price:</span>
                                    <span className="text-[#3479ff] font-semibold">₹{exam.discounted_price}</span>
                                  </div>
                                  {exam.tax > 0 && (
                                    <div className="flex items-center justify-between text-sm">
                                      <span className="text-gray-700">Tax:</span>
                                      <span className="text-gray-700">₹{exam.tax}</span>
                                    </div>
                                  )}
                                  <div className="flex items-center justify-between font-semibold border-t pt-2">
                                    <span className="text-gray-900">Total:</span>
                                    <span className="text-[#3479ff] text-lg">₹{totalPrice}</span>
                                  </div>
                                </div>
                              )}
                              
                              <Button 
                                onClick={() => {
                                  if (isPurchased) {
                                    navigate(`/exam-details/${exam.exam_id}`);
                                  } else if (isFree) {
                                    handleFreeExamAccess(exam);
                                  } else {
                                    handleExamPayment(exam);
                                  }
                                }}
                                // disabled={paymentLoading}
                                className={`w-full mt-4 ${
                                  isPurchased 
                                    ? 'bg-green-500 hover:bg-green-600' 
                                    : isFree 
                                      ? 'bg-green-500 hover:bg-green-600' 
                                      : 'bg-[#3479ff] hover:bg-[#2968e6]'
                                } text-white rounded-xl`}
                              >
                                {paymentLoading 
                                  ? "Processing..." 
                                  : isPurchased 
                                    ? "View Exam" 
                                    : isFree 
                                      ? "Access Free" 
                                      : `Pay ₹${totalPrice}`
                                }
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
                
                {paymentError && (
                  <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm">{paymentError}</p>
                  </div>
                )}
                
                {paymentSuccess && (
                  <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-600 text-sm">✅ Payment completed successfully!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar - Premium Features */}
          <div className="w-96 flex-shrink-0">
            <div className="sticky top-8">
              <Card className="rounded-[3rem] shadow-xl border-0 bg-white">
                <CardContent className="p-8">
                  <h3 className="font-bold text-[#13377c] text-2xl mb-8">
                    Unlock Premium Features
                  </h3>

                  <div className="space-y-6">
                    {/* Expert Guidance Card */}
                    <div className="rounded-[2rem] bg-gradient-to-br from-[#7b58f2] to-[#a493ff] p-6 h-80 relative overflow-hidden">
                      <div className="relative z-10">
                        <h4 className="font-bold text-white text-2xl mb-4">
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
                          className="w-48 h-36 object-contain"
                          alt="Expert guidance illustration"
                          src="/GoodKid.png"
                        />
                      </div>
                    </div>

                    {/* Join Clubs Card */}
                    <div className="rounded-[2rem] bg-gradient-to-br from-[#fec854] to-[#ffdf99] p-6 h-80 relative overflow-hidden">
                      <div className="relative z-10">
                        <h4 className="font-bold text-gray-900 text-2xl mb-4">
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
    );
  };

  const renderTestAssessmentContent = () => {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="font-bold text-[#13377c] text-3xl mb-4">Test & Assessment</h2>
          <p className="text-gray-600 text-lg">Choose from our available exams and assessments</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exams.map((exam) => {
            const totalPrice = exam.discounted_price + exam.tax;
            const isFree = totalPrice === 0;
            const isPurchased = userPurchases.includes(exam.exam_id);
            
            return (
              <Card key={exam.exam_id} className="rounded-2xl border border-gray-200 hover:shadow-lg transition-all duration-200">
                <CardContent className="p-6">
                  <div className="flex flex-col h-full">
                    <h3 className="font-bold text-[#13377c] text-xl mb-3">{exam.exam_name}</h3>
                    <p className="text-gray-600 text-sm mb-4 flex-1">{exam.description}</p>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Duration:</span>
                        <span className="font-medium">{exam.total_time} minutes</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Max Marks:</span>
                        <span className="font-medium">{exam.maximum_marks}</span>
                      </div>
                      
                      {!isFree && (
                        <div className="border-t pt-3 space-y-2">
                          {exam.original_price > exam.discounted_price && (
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-500">Original Price:</span>
                              <span className="text-gray-500 line-through">₹{exam.original_price}</span>
                            </div>
                          )}
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-700">Price:</span>
                            <span className="text-[#3479ff] font-semibold">₹{exam.discounted_price}</span>
                          </div>
                          {exam.tax > 0 && (
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-700">Tax:</span>
                              <span className="text-gray-700">₹{exam.tax}</span>
                            </div>
                          )}
                          <div className="flex items-center justify-between font-semibold border-t pt-2">
                            <span className="text-gray-900">Total:</span>
                            <span className="text-[#3479ff] text-lg">₹{totalPrice}</span>
                          </div>
                        </div>
                      )}
                      
                      <Button 
                        onClick={() => {
                          if (isPurchased) {
                            navigate(`/exam-details/${exam.exam_id}`);
                          } else if (isFree) {
                            handleFreeExamAccess(exam);
                          } else {
                            handleExamPayment(exam);
                          }
                        }}
                        disabled={paymentLoading}
                        className={`w-full mt-4 ${
                          isPurchased 
                            ? 'bg-green-500 hover:bg-green-600' 
                            : isFree 
                              ? 'bg-green-500 hover:bg-green-600' 
                              : 'bg-[#3479ff] hover:bg-[#2968e6]'
                        } text-white rounded-xl`}
                      >
                        {paymentLoading 
                          ? "Processing..." 
                          : isPurchased 
                            ? "View Exam" 
                            : isFree 
                              ? "Attempt Free" 
                              : `Pay ₹${totalPrice} Now`
                        }
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
  };

  const renderDummyContent = (sectionName: string) => {
    return (
      <div className="max-w-4xl mx-auto text-center py-20">
        <div className="bg-gray-50 rounded-3xl p-12">
          <h2 className="font-bold text-[#13377c] text-3xl mb-4">{sectionName}</h2>
          <p className="text-gray-600 text-lg">This section is coming soon...</p>
        </div>
      </div>
    );
  };

  const renderSimplifyingAIContent = () => {
    return (
      <div className="fixed inset-0 z-50 bg-white">
        <iframe
          src="https://testgenie-ai-questio-fefq.bolt.host/"
          className="w-full h-full border-0"
          title="Simplifying AI - Question Generator"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  };


  if (loading) {
    return (
      <div className="flex w-full h-screen items-center justify-center">
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

  // 🔹 Show onboarding if needed
  if (showOnboarding) {
    return (
      <OnboardingFlow
        user={user}
        onFinish={() => {
          console.log("🎉 Onboarding finished, hiding flow");
          setShowOnboarding(false);
        }}
      />
    );
  }

  return (
    <div className="flex w-full h-screen">
      {/* Fixed Sidebar */}
    
 
      {/* Main Content Container - Fixed Height */}
        <div className="h-full bg-white rounded-l-[3rem] flex flex-col">
         

          {/* Scrollable Dashboard Content */}
          <div className="flex-1">
            <div className="p-8">
              {activeSection === "Dashboard" && renderDashboardContent()}
              {activeSection === "Test & Assessment" && renderTestAssessmentContent()}
              {activeSection === "Simplifying AI" && renderSimplifyingAIContent()}
              {activeSection !== "Dashboard" && activeSection !== "Test & Assessment" && activeSection !== "Simplifying AI" && renderDummyContent(activeSection)}
            </div>
          </div>
        </div>

      
    </div>
  );
};