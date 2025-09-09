import {
  AwardIcon,
  BellIcon,
  Clock,
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
  Target,
  TrophyIcon,
  UserIcon,
  UserPlusIcon,
  UsersIcon,
  XIcon,
} from "lucide-react";
import React from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../../components/ui/avatar";
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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [exams, setExams] = useState<Exam[]>([]);
  const [activeSection, setActiveSection] = useState("Dashboard");

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
        
        // Fetch exams for payment plans
        await fetchExams();
        
      } catch (err) {
        console.error("❌ Auth check error:", err);
        navigate('/component/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

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
      navigate('/component/login');
      
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
        await supabase.from('exam_purchases').insert({
          user_id: user.id,
          exam_id: exam.exam_id,
          payment_id: paymentResult.payment.payment_id,
          purchase_type: 'paid',
          amount_paid: totalAmount
        });
        
        setPaymentSuccess(true);
        alert(`🎉 Payment successful! You now have access to ${exam.exam_name}.`);
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
      // Record free exam access
      await supabase.from('exam_purchases').insert({
        user_id: user.id,
        exam_id: exam.exam_id,
        payment_id: null,
        purchase_type: 'free',
        amount_paid: 0
      });
      
      alert(`✅ You now have access to ${exam.exam_name}!`);
    } catch (error) {
      console.error('Error recording free exam access:', error);
      alert('Error accessing exam. Please try again.');
    }
  };

  const handleNavigation = (item: any) => {
    setActiveSection(item.label);
    
    // Update active states
    navigationItems.forEach(navItem => {
      navItem.active = navItem.label === item.label;
    });
  };

  const renderDashboardContent = () => {
    return (
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
                      Don't miss out! Your child's future starts with one smart step - complete the payment today.
                    </p>
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
                                onClick={() => isFree ? handleFreeExamAccess(exam) : handleExamPayment(exam)}
                                disabled={paymentLoading}
                                className={`w-full mt-4 ${isFree ? 'bg-green-500 hover:bg-green-600' : 'bg-[#3479ff] hover:bg-[#2968e6]'} text-white rounded-xl`}
                              >
                                {paymentLoading ? "Processing..." : isFree ? "Access Free" : `Pay ₹${totalPrice}`}
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
              {/* Payment Plans Card */}
              <Card className="rounded-3xl border-0 shadow-xl">
                <CardContent className="p-8">
                  <h3 className="font-bold text-[#13377c] text-3xl mb-8">
                    Complete Your Payment
                  </h3>
                  <p className="text-gray-600 text-lg mb-8">
                    Please select a plan that suits you best and complete your payment to unlock the assessment.
                  </p>

                  <div className="space-y-4">
                    {exams.map((exam) => {
                      const totalPrice = exam.discounted_price + exam.tax;
                      const isFree = totalPrice === 0;
                      
                      return (
                        <Card key={exam.exam_id} className="rounded-2xl border border-gray-200 hover:shadow-lg transition-all duration-200">
                          <CardContent className="p-6">
                            <div className="flex flex-col">
                              <h4 className="font-bold text-[#13377c] text-lg mb-2">{exam.exam_name}</h4>
                              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{exam.description}</p>
                              
                              <div className="flex items-center gap-4 mb-4">
                                <div className="flex items-center gap-2">
                                  <Clock className="w-4 h-4 text-[#3479ff]" />
                                  <span className="text-sm text-gray-600">{exam.total_time} min</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Target className="w-4 h-4 text-[#3479ff]" />
                                  <span className="text-sm text-gray-600">{exam.maximum_marks} marks</span>
                                </div>
                              </div>
                              
                              {!isFree && (
                                <div className="border-t pt-3 space-y-2 mb-4">
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
                                onClick={() => isFree ? handleFreeExamAccess(exam) : handleExamPayment(exam)}
                                disabled={paymentLoading}
                                className={`w-full ${isFree ? 'bg-green-500 hover:bg-green-600' : 'bg-[#3479ff] hover:bg-[#2968e6]'} text-white rounded-xl`}
                              >
                                {paymentLoading ? "Processing..." : isFree ? "Attempt Free" : `Pay ₹${totalPrice} Now`}
                              </Button>
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

              {/* Premium Features Cards */}
              <div className="mt-8 space-y-6">
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
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderTestAssessmentContent = () => {
    return (
      <div className="w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-bold text-[#13377c] text-2xl">Test & Assessment</h1>
            <p className="text-gray-500">Test management and assessment tracking</p>
          </div>
          <div className="flex items-center gap-5">
            <div className="w-6 h-6 bg-gray-200 rounded" />
            <div className="w-12 h-12 rounded-full border-4 border-solid border-[#3479ff99] bg-gray-200" />
            <div className="w-6 h-6 bg-gray-200 rounded" />
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-3 gap-5 mb-8">
          {/* Total Tests */}
          <Card className="bg-white rounded-[20px] shadow-[0px_4px_20px_#3479ff20] border-0">
            <CardContent className="p-6 flex items-start justify-between relative">
              {/* Left Section */}
              <div className="flex flex-col gap-2">
                {/* Title with Icon Space */}
                <div className="flex items-center justify-between pr-6">
                  <h2 className="text-[#1c2752] font-bold text-lg">Total Tests</h2>
                </div>

                {/* Total Count */}
                <p className="text-[#3479ff] font-extrabold text-2xl mb-14 leading-tight">{exams.length}</p>

                {/* Achievements */}
                <p className="text-[#5f5f5f] text-[17px] font-extrabold">
                  <span className="font-bold text-[17px]">{exams.filter(e => e.is_active).length}</span> Active Exams
                </p>
              </div>

              {/* Progress Image */}
              <div className="flex flex-col items-center justify-start mt-14">
                <img
                  src="/marks.png"
                  alt="Marks Progress"
                  className="w-[130px] h-[130px] object-contain mt-2"
                />
              </div>

              {/* Top Right Icon */}
              <img className="absolute top-5 right-5 w-5 h-5 text-[#3479ff]" src="/BOOK.png"/>
            </CardContent>
          </Card>

          {/* Complete */}
          <Card className="bg-white rounded-[20px] shadow-[0px_4px_20px_#3479ff20] border-0">
            <CardContent className="p-6 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h2 className="text-[#1c2752] font-bold text-lg">Available</h2>
                <img className="w-5 h-5 text-[#3479ff]" src="/tick.png" />
              </div>

              {/* Count */}
              <p className="text-[#3479ff] font-extrabold text-2xl">{exams.filter(e => e.is_active).length}</p>

              {/* Progress Bar */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[#9e9e9e] text-sm">Progress</span>
                  <span className="text-[#9e9e9e] text-sm">100%</span>
                </div>
                <div className="w-full bg-[#e0e0e0] rounded-full h-3">
                  <div
                    className="bg-[#3479ff] h-3 rounded-full transition-all duration-500"
                    style={{ width: "100%" }}
                  />
                </div>
                <p className="text-[#9e9e9e] text-sm mt-1">Ready to attempt</p>
              </div>
            </CardContent>
          </Card>

          {/* Average Score */}
          <Card className="bg-white rounded-[25px] shadow-[0px_0px_20px_#3d57cf40] border-0">
            <CardContent className="p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="text-[#13377c] font-bold text-lg">
                  Free Exams
                </h2>
                <img className="w-6 h-4 text-[#3479ff]" src="/vector.png" />
              </div>
              <p className="text-[#3479ff] font-bold text-xl">{exams.filter(e => (e.discounted_price + e.tax) === 0).length}</p>
              <div className="h-[113px] bg-gradient-to-t from-[#dbe8ff] to-white rounded-xl border border-[#e4e4e4] flex items-end justify-around px-7 pb-4">
                {[78, 86, 95, 98, 92, 59].map((height, i) => (
                  <div
                    key={i}
                    className="w-3 bg-[#3479ff] rounded-t-lg opacity-70"
                    style={{ height: `${height}px` }}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      

        {/* Tabs */}
        <Card className="bg-white rounded-[21px] shadow-[0px_0px_20px_#3479ff40] border-0 mb-8">
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center gap-2 bg-[#007fff59] px-5 py-2 rounded-[20px]">
              <span className="font-bold text-[#083a50] text-lg">All</span>
              <Badge className="bg-[#fff8f8] text-[#083a50] font-bold text-sm rounded-full h-5 w-6 flex items-center justify-center">
                {exams.length}
              </Badge>
            </div>
            <span className="font-bold text-[#888888] text-lg">Free {exams.filter(e => (e.discounted_price + e.tax) === 0).length}</span>
            <span className="font-bold text-[#888888] text-lg">Paid {exams.filter(e => (e.discounted_price + e.tax) > 0).length}</span>
          </CardContent>
        </Card>

        {/* Test Cards */}
        <div className="grid grid-cols-3 gap-8">
          {exams.map((exam) => {
            const totalPrice = exam.discounted_price + exam.tax;
            const isFree = totalPrice === 0;
            
            return (
              <Card
                key={exam.exam_id}
                className="bg-white rounded-[25px] shadow-[0px_0px_20px_#3479ff40] border-0"
              >
                <CardContent className="flex flex-col items-start justify-between p-6 h-80">
                  <div className="flex flex-col gap-4">
                    <h3 className="font-semibold text-[#202020] text-xl">
                      {exam.exam_name}
                    </h3>
                    <Badge className="bg-[#75a4ff87] text-[#083a50] font-semibold text-xs rounded-[25px] h-[18px] px-3 py-1">
                      {isFree ? 'FREE' : 'PREMIUM'}
                    </Badge>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between text-sm text-[#7e7e7e]">
                        <div className="flex items-center gap-2">
                          <Clock className="w-5 h-5" />
                          {exam.total_time} Minutes
                        </div>
                        <div className="flex items-center gap-2">
                          <Target className="w-4 h-4" />
                          {exam.maximum_marks} Marks
                        </div>
                      </div>
                      {!isFree && (
                        <div className="text-sm text-[#7e7e7e]">
                          <div className="flex items-center justify-between">
                            <span>Price:</span>
                            <span className="text-[#3479ff] font-semibold">₹{totalPrice}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <Button 
                    onClick={() => isFree ? handleFreeExamAccess(exam) : handleExamPayment(exam)}
                    disabled={paymentLoading}
                    className="w-full h-[37px] bg-[#3479ff] text-white font-bold rounded-lg hover:bg-[#3479ff]/90"
                  >
                    {paymentLoading ? "Processing..." : isFree ? "Attempt Free" : `Pay ₹${totalPrice} Now`}
                  </Button>
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
      <aside className={`${sidebarCollapsed ? 'w-16' : 'w-64'} h-screen bg-[#3479ff] flex flex-col transition-all duration-300 ease-in-out flex-shrink-0 relative z-10`}>
        {/* Fixed Logo Section */}
        <div className="p-4 border-b border-[#ffffff15] flex-shrink-0 flex items-center justify-between h-20">
          {!sidebarCollapsed && (
            <img
              className="w-48 h-12 object-contain"
              alt="Simplifying Skills Logo"
              src="/Simplifying.png"
            />
          )}
          <Button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            variant="ghost"
            size="icon"
            className="w-8 h-8 text-white hover:bg-[#ffffff15] rounded-lg transition-colors duration-200 flex items-center justify-center"
          >
            {sidebarCollapsed ? <MenuIcon className="w-5 h-5 text-white" /> : <XIcon className="w-5 h-5 text-white" />}
          </Button>
        </div>

        {/* Scrollable Navigation */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto sidebar-scrollbar">
          <div className="flex flex-col gap-1">
            {navigationItems.map((item, index) => (
              <div key={index} className="relative group">
                {item.active && (
                  <div className="absolute inset-0 bg-white rounded-2xl" />
                )}
                <Button
                  variant="ghost"
                  className={`w-full justify-start gap-3 px-4 py-3 h-auto relative z-10 transition-all duration-200 rounded-2xl ${
                    item.active 
                      ? "text-[#3479ff] hover:text-[#3479ff] hover:bg-transparent" 
                      : "text-white hover:bg-[#ffffff15] hover:text-white"
                  } ${sidebarCollapsed ? 'justify-center px-0' : 'justify-start'}`}
                  onClick={() => handleNavigation(item)}
                >
                  <item.icon className={`w-5 h-5 flex-shrink-0 ${sidebarCollapsed ? 'mx-auto' : ''}`} />
                  {!sidebarCollapsed && (
                    <span className="font-medium text-sm truncate">
                      {item.label}
                    </span>
                  )}
                </Button>
                
                {/* Tooltip for collapsed state */}
                {sidebarCollapsed && (
                  <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                    {item.label}
                  </div>
                )}
              </div>
            ))}
          </div>
        </nav>

        {/* Fixed Logout Button */}
        <div className="p-3 border-t border-[#ffffff15] flex-shrink-0">
          <div className="relative \group">
            <Button
              onClick={handleLogout}
              variant="ghost"
              className={`w-full gap-3 px-4 py-3 h-auto rounded-2xl text-white hover:bg-[#ffffff15] hover:text-white transition-all duration-200 ${
                sidebarCollapsed ? 'justify-center px-0' : 'justify-start'
              }`}
            >
              <LogOutIcon className={`w-5 h-5 flex-shrink-0 ${sidebarCollapsed ? 'mx-auto' : ''}`} />
              {!sidebarCollapsed && (
                <span className="font-medium text-sm">Log Out</span>
              )}
            </Button>
            
            {/* Tooltip for collapsed state */}
            {sidebarCollapsed && (
              <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                Log Out
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Vertical separator line */}
      {!sidebarCollapsed && (
        <div className="w-px bg-white opacity-20 absolute left-[255px] top-20 bottom-20 z-20" />
      )}

      {/* Main Content Container - Fixed Height */}
      <main className="flex-1 h-screen bg-[#3479ff] rounded-l-[3rem] ml-1 overflow-hidden">
        <div className="h-full bg-white rounded-l-[3rem] flex flex-col">
          {/* Header with Search and Controls */}
          <header className="flex-shrink-0 px-8 py-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              {/* Left: Breadcrumbs */}
              <div className="flex items-center gap-2">
                <span className="text-[#3479ff] text-2xl font-bold">Dashboard</span>
              </div>

              {/* Center: Beautiful Search Bar */}
              <div className="flex-1 max-w-md mx-8">
                <div className="relative">
                  <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    placeholder="Search anything..."
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    className="pl-12 pr-4 py-3 bg-gray-50 border-0 rounded-2xl shadow-sm focus:bg-white focus:shadow-md transition-all duration-200 placeholder:text-gray-500"
                  />
                </div>
              </div>

              {/* Right: User Controls */}
              <div className="flex items-center gap-3">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="w-10 h-10 bg-gray-50 hover:bg-gray-100 rounded-xl text-gray-600 transition-all duration-200"
                >
                  <BellIcon className="w-5 h-5" />
                </Button>
                
                <Avatar className="w-10 h-10 border-2 border-gray-200 shadow-sm">
                  <AvatarImage src="/Profile.png" />
                  <AvatarFallback className="bg-[#3479ff] text-white text-sm font-semibold">
                    {userName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="w-10 h-10 bg-gray-50 hover:bg-gray-100 rounded-xl text-gray-600 transition-all duration-200"
                >
                  <SettingsIcon className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </header>

          {/* Scrollable Dashboard Content */}
          <div className="flex-1 overflow-y-auto main-scrollbar">
            <div className="p-8">
              {activeSection === "Dashboard" && renderDashboardContent()}
              {activeSection === "Test & Assessment" && renderTestAssessmentContent()}
              {activeSection !== "Dashboard" && activeSection !== "Test & Assessment" && renderDummyContent(activeSection)}
            </div>
          </div>
        </div>
      </main>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        /* Remove horizontal scrollbar */
        .sidebar-scrollbar {
          overflow-x: hidden;
        }
        
        .sidebar-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .sidebar-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .sidebar-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
          transition: background 0.2s ease;
        }
        
        .sidebar-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
        .main-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .main-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .main-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(52, 121, 255, 0.2);
          border-radius: 10px;
          transition: background 0.2s ease;
        }
        
        .main-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(52, 121, 255, 0.3);
        }
      `}</style>
    </div>
  );
};