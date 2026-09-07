
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import {
  ChevronDown,
  BadgeCheck,
  BrainCircuit,
  Briefcase,
  Sparkles,
  LayoutDashboard,
  Upload,
  User,
  LogOut,
  MessageCircle,
} from "lucide-react";

const featureLinks = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Chatbot",
    href: "/chatbot",
    icon: MessageCircle,
  },
  {
    name: "Upload Resume",
    href: "/upload",
    icon: Upload,
  },
  {
    name: "ATS Score",
    href: "/features/ATS",
    icon: BadgeCheck,
  },
  {
    name: "Skill Detection",
    href: "/features/skill-detection",
    icon: BrainCircuit,
  },
  {
    name: "Job Matching",
    href: "/features/job-matching",
    icon: Briefcase,
  },
  {
    name: "AI Suggestion",
    href: "/features/AI-Suggestion",
    icon: Sparkles,
  },
];

export default function Header() {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  const checkAuth = () => {
    const token = localStorage.getItem("token");
    setLoggedIn(!!token);
  };

  useEffect(() => {
    checkAuth();

    // Listen for authentication changes
    window.addEventListener("auth-change", checkAuth);

    // Listen for storage changes between tabs
    window.addEventListener("storage", checkAuth);

    return () => {
      window.removeEventListener("auth-change", checkAuth);
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("resumeId");

    setLoggedIn(false);

    // Notify other components about auth change
    window.dispatchEvent(new Event("auth-change"));

    router.push("/login");
  };

  return (
    <header className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto h-16 flex justify-between items-center px-6">

        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-bold text-blue-600"
        >
          ResumeAI
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-8">

          <Link href="/" className="hover:text-blue-600 transition">
            Home
          </Link>

          {loggedIn && (
            <Link
              href="/dashboard"
              className="hover:text-blue-600 transition"
            >
              Dashboard
            </Link>
          )}

          {/* Features Dropdown */}
          <div
            className="relative h-16 flex items-center"
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
          >
            <button
              type="button"
              className="flex items-center gap-1 hover:text-blue-600 transition"
            >
              Features

              <ChevronDown
                size={18}
                className={`transition-transform duration-200 ${
                  open ? "rotate-180" : ""
                }`}
              />
            </button>

            {open && (
              <div className="absolute top-full left-0 pt-2">
                <div className="w-72 bg-white rounded-xl shadow-xl border border-slate-200 p-3">

                  {featureLinks.map((item) => {
                    const Icon = item.icon;

                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition"
                      >
                        <Icon
                          size={20}
                          className="text-blue-600"
                        />

                        <span>{item.name}</span>
                      </Link>
                    );
                  })}

                </div>
              </div>
            )}
          </div>

          <Link
            href="/about"
            className="hover:text-blue-600 transition"
          >
            About
          </Link>

          <Link
            href="/contact"
            className="hover:text-blue-600 transition"
          >
            Contact
          </Link>
        </nav>

        {/* Authentication Buttons */}
        {loggedIn ? (
          <div className="flex gap-3">

            <Link
              href="/profile"
              className="flex items-center gap-2 border px-4 py-2 rounded-lg hover:bg-slate-50 transition"
            >
              <User size={18} />
              Profile
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
            >
              <LogOut size={18} />
              Logout
            </button>

          </div>
        ) : (
          <div className="flex gap-3">

            <Link
              href="/login"
              className="px-4 py-2 border rounded-lg hover:bg-slate-50 transition"
            >
              Login
            </Link>

            <Link
              href="/signup"
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              Sign Up
            </Link>

          </div>
        )}
      </div>
    </header>
  );
}

