import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FileWarning,
  UserCircle,
  LogOut,
  Settings,
  Menu,
  X,
  UsersIcon,
  SunIcon,
  Map as MapIcon,
} from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  // const [showUserMenu, setShowUserMenu] = useState(false);

  // Links
  const navLinks = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <LayoutDashboard size={18} />,
    },
    { name: "Crisis Map", path: "/map", icon: <MapIcon size={18} /> },
    { name: "Reports", path: "/reports", icon: <FileWarning size={18} /> },
    { name: "Chatbot", path: "/chatbot", icon: <UsersIcon size={18} /> },
    { name: "Weather", path: "/weatherDisplay", icon: <SunIcon size={18} /> },
  ];

  // Handling Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* LEFT: Logo & Brand */}
          <div className="flex items-center">
            <div className="flex items-center">
              <div
                className="flex-shrink-0 flex items-center gap-2 cursor-pointer"
                onClick={() => navigate("/dashboard")}
              >
                {/* Replaced Icon Box with Logo Image */}
                <div className="flex items-center justify-center">
                  <img
                    src="/logo.png"
                    alt="FAEAS Logo"
                    className="w-8 h-8 object-contain rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* DESKTOP NAV LINKS */}
            <div className="hidden md:ml-8 md:flex md:space-x-4">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={({ isActive }) => `
                    flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors
                    ${
                      isActive
                        ? "text-indigo-600 bg-indigo-50"
                        : "text-gray-600 hover:text-indigo-600 hover:bg-gray-50"
                    }
                  `}
                >
                  {link.icon}
                  {link.name}
                </NavLink>
              ))}
            </div>
          </div>

          {/* RIGHT: User Management */}
          <div className="hidden md:flex items-center">
            <div className="relative flex items-center gap-2">
              <button
                onClick={() => navigate("/userProfile")}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition border border-transparent hover:border-gray-100"
              >
                <UserCircle className="text-indigo-600" size={32} />
              </button>

              {/* <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="p-2 text-gray-400 hover:text-indigo-600 transition"
              >
                <Settings size={20} />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl py-2 z-50">
                  <button 
                    onClick={() => { navigate("/userProfile"); setShowUserMenu(false); }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <UserCircle size={16} /> View Profile
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={16} /> Sign out
                  </button>
                </div>
              )} */}
            </div>
          </div>

          {/* MOBILE MENU BUTTON */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE NAV PANEL */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-2 pt-2 pb-3 space-y-1 shadow-lg">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-3 rounded-md text-base font-medium
                ${isActive ? "text-indigo-600 bg-indigo-50" : "text-gray-600 hover:bg-gray-50"}
              `}
            >
              {link.icon}
              {link.name}
            </NavLink>
          ))}

          <div className="border-t border-gray-100 pt-4 mt-4">
            <div
              className="flex items-center px-3 mb-3 cursor-pointer p-2 rounded-lg hover:bg-gray-50"
              onClick={() => {
                navigate("/userProfile");
                setIsOpen(false);
              }}
            >
              <UserCircle className="text-indigo-600" size={32} />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  User Profile
                </p>
                <p className="text-xs text-gray-500">View Settings</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-3 text-red-600 hover:bg-red-50 rounded-md"
            >
              <LogOut size={18} /> Log out
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
