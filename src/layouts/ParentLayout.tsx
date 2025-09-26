import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, NavLink, useLocation } from "react-router-dom";
import {
  AwardIcon,
  BellIcon,
  ClipboardListIcon,
  LinkIcon,
  GiftIcon,
  HelpCircleIcon,
  HomeIcon,
  LogOutIcon,
  MenuIcon,
  BarChartIcon,
  SearchIcon,
  SettingsIcon,
  TrophyIcon,
  UserIcon,
  UserPlusIcon,
  UsersIcon,
  XIcon,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { authHelpers } from "../lib/supabase";

const parentNavigationItems = [
  { icon: HomeIcon, label: "Parent Dashboard", path: "dashboard" },
  { icon: UserIcon, label: "Profile Settings", path: "profile" },
  { icon: LinkIcon, label: "Linked Student", path: "courses" },
  { icon: BarChartIcon, label: "Progress Overview", path: "live" },
  { icon: ClipboardListIcon, label: "Test Reports", path: "tests" },
  { icon: AwardIcon, label: "Live Class Attendance", path: "certificates" },
  { icon: TrophyIcon, label: "Certificates", path: "leaderboard" },
  { icon: LinkIcon, label: "Manage Child", path: "manage" },
  { icon: GiftIcon, label: "Cart & Purchases", path: "rewards" },
  { icon: UsersIcon, label: "Give Feedback", path: "clubs" },
  { icon: UserPlusIcon, label: "Referrals Program", path: "referrals" },
];


const ParentLayout = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [userName, setUserName] = useState("User");
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const location = useLocation();
 
  useEffect(() => {
  if (location.pathname === "/" || location.pathname === "/parent") {
    navigate("/parent/dashboard", { replace: true });
  }
}, [location.pathname, navigate]);


const activeNav = parentNavigationItems.find(item =>
  location.pathname.includes(item.path)
);

  // Authentication check
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { user, error } = await authHelpers.getCurrentUser();
        if (error || !user) {
          navigate("/login");
          return;
        }
        setUser(user);
        const name = user.email?.split("@")[0] || user.user_metadata?.full_name || "User";
        setUserName(name);
      } catch (err) {
        console.error("❌ Auth check error:", err);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const { error } = await authHelpers.signOut();
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

  if (loading) {
    return (
      <div className="flex w-full h-screen bg-[#3479ff] items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex w-full h-screen bg-[#3479ff] overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarCollapsed ? "w-16" : "w-64"
        } h-screen bg-[#3479ff] flex flex-col transition-all duration-300 ease-in-out flex-shrink-0 relative z-10`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-[#ffffff15] flex-shrink-0 flex items-center justify-between h-20">
          {!sidebarCollapsed && (
            <img className="w-48 h-12 object-contain" alt="Logo" src="/Simplifying.png" />
          )}
          <Button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            variant="ghost"
            size="icon"
            className="w-8 h-8 text-white hover:bg-[#ffffff15] rounded-lg transition-colors duration-200 flex items-center justify-center"
          >
            {sidebarCollapsed ? <MenuIcon className="w-5 h-5" /> : <XIcon className="w-5 h-5" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto sidebar-scrollbar">
          <div className="flex flex-col gap-1">
            {parentNavigationItems.map((item, index) => (
              <NavLink
                key={index}
                to={`/parent/${item.path}`}
                className={({ isActive }) =>
                  `w-full justify-start gap-3 px-4 py-3 h-auto relative z-10 transition-all duration-200 rounded-2xl flex items-center ${
                    isActive
                      ? "bg-white text-[#3479ff] shadow-sm"
                      : "text-white hover:bg-[#ffffff15]"
                  } ${sidebarCollapsed ? "justify-center px-0" : "justify-start"}`
                }
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!sidebarCollapsed && (
                  <span className="font-medium text-sm truncate">{item.label}</span>
                )}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-[#ffffff15] flex-shrink-0">
          <Button
            onClick={handleLogout}
            variant="ghost"
            className={`w-full gap-3 px-4 py-3 h-auto rounded-2xl text-white hover:bg-[#ffffff15] hover:text-white transition-all duration-200 ${
              sidebarCollapsed ? "justify-center px-0" : "justify-start"
            }`}
          >
            <LogOutIcon className="w-5 h-5 flex-shrink-0" />
            {!sidebarCollapsed && <span className="font-medium text-sm">Log Out</span>}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 h-screen bg-[#3479ff] rounded-l-[3rem] ml-1 overflow-hidden">
        <div className="h-full bg-white rounded-l-[3rem] flex flex-col overflow-hidden">
          {/* Header */}
          <header className="flex-shrink-0 px-8 py-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              {/* Title */}
                            <span className="text-[#3479ff] text-2xl font-bold">
  {activeNav?.label || "Dashboard"}
</span>

              {/* Search */}
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

              {/* User Controls */}
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-10 h-10 bg-gray-50 hover:bg-gray-100 rounded-xl text-gray-600 transition-all duration-200"
                >
                  <BellIcon className="w-5 h-5" />
                </Button>
                <Avatar className="w-10 h-10 border-2 border-gray-200 shadow-sm">
                    <AvatarImage src="/Profile.png" onClick={() => navigate('/parent/profile')} className="cursor-pointer" />
                  
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

          {/* Dynamic Content */}
          <div className="flex-1 overflow-y-auto main-scrollbar p-8">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default ParentLayout;
