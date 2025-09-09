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
  const [userPurchases, setUserPurchases] = useState<string[]>([]);

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
        await fetchUserPurchases(user.id);
        
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

  const fetchUserPurchases = async () => {
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
        
        // Refresh user purchases
        await fetchUserPurchases();
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
      
      // Refresh user purchases
      await fetchUserPurchases();
    } catch (error) {
      console.error('Error recording free exam access:', error);
      alert('Error accessing exam. Please try again.');
    }
  };

  const handleAttemptExam = (exam: Exam) => {
    // Navigate to exam environment
    navigate(`/exam/${exam.exam_id}`);
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
                                    handleAttemptExam(exam);
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
                                    ? "Attempt Exam" 
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
                            handleAttemptExam(exam);
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
                            ? "Attempt Exam" 
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