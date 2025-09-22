import React, { useState, useEffect, useRef } from "react";
import { FaChevronDown } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";

const Header = ({ user = {}, handleLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const dropdownRef = useRef(null);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const words = [
    "Small steps today, big results tomorrow.",
    "Stay focused, stay productive.",
    "Turn your plans into progress.",
    "One task at a time, you've got this.",
    "Your goals are closer than you think.",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % words.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [words.length]);

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0].toUpperCase())
      .join("")
      .slice(0, 2);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-4 w-full bg-white shadow-sm rounded-lg sm:py-4 px-4 py-2">
        {/* Mobile layout - only visible on small screens */}
        <div className="md:hidden">
          {/* Top center - App title and quote */}
          <div className="flex flex-col items-center text-center mb-3 px-2">
            <h1 className="text-xl font-semibold text-blue-600">
              Todo List
            </h1>
            <p className="text-blue-500 italic text-xs mt-0.5 max-w-full">
              {words[quoteIndex]}
            </p>
          </div>
          
          {/* Bottom row - Greeting on left, profile on right */}
          <div className="flex items-center justify-between px-3">
            {/* Left side - Greeting and username */}
            <div className="flex flex-col">
              <p className="text-xs text-gray-500">{getGreeting()},</p>
              <p className="font-medium text-gray-800 text-sm truncate max-w-[120px]">
                {user.username || "User"}
              </p>
            </div>
            
            {/* Right side - User profile dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200"
                aria-label="User menu"
                aria-expanded={isOpen}
              >
                <div className="w-7 h-7 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full text-xs font-medium flex-shrink-0">
                  {getInitials(user.username)}
                </div>
                <FaChevronDown
                  className={`text-gray-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                  size={12}
                />
              </button>

              {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-md border border-gray-200 z-50 py-1 overflow-hidden">
                  <div className="px-4 py-2 text-sm text-gray-600 border-b border-gray-100">
                    <p className="font-medium text-gray-800 truncate">{user.username || "User"}</p>
                    <p className="truncate text-xs mt-0.5 text-gray-500">{user.email || "user@email.com"}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                  >
                    <FiLogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Desktop layout - hidden on mobile */}
        <div className="hidden md:flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4 px-4 sm:px-5">
          {/* Left side - User greeting */}
          <div className="flex-shrink-0">
            <p className="text-xs sm:text-sm text-gray-500">{getGreeting()},</p>
            <p className="font-medium text-gray-800 text-sm sm:text-base truncate max-w-[120px] sm:max-w-[160px]">
              {user.username || "User"}
            </p>
          </div>

          {/* Center - App title and quote */}
          <div className="flex flex-col items-center text-center flex-grow px-2">
            <h1 className="text-xl sm:text-2xl font-semibold text-blue-600">
              Todo List
            </h1>
            <p className="text-blue-500 italic text-xs sm:text-sm mt-0.5 max-w-full truncate">
              {words[quoteIndex]}
            </p>
          </div>

          {/* Right side - User dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-2 px-3 py-1.5 sm:px-3 sm:py-2 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200"
              aria-label="User menu"
              aria-expanded={isOpen}
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full text-xs sm:text-sm font-medium flex-shrink-0">
                {getInitials(user.username)}
              </div>
              <span className="hidden sm:inline text-gray-800 font-medium truncate max-w-[5rem] md:max-w-[6rem]">
                {user.username || "User"}
              </span>
              <FaChevronDown
                className={`text-gray-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                size={14}
              />
            </button>

            {isOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-md border border-gray-200 z-50 py-1 overflow-hidden">
                <div className="px-4 py-2 text-sm text-gray-600 border-b border-gray-100">
                  <p className="font-medium text-gray-800 truncate">{user.username || "User"}</p>
                  <p className="truncate text-xs mt-0.5 text-gray-500">{user.email || "user@email.com"}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                >
                  <FiLogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;