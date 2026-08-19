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
} from "lucide-react";

const featureLinks = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
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

    // Listen for custom auth-change events
    window.addEventListener("auth-change", checkAuth);

    // Also listen for storage changes (cross-tab)
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

    // Dispatch auth-change event
    window.dispatchEvent(new Event("auth-change"));

    router.push("/login");

  };

  return (

    <header className="bg-white shadow sticky top-0 z-50">

      <div className="max-w-7xl mx-auto h-16 flex justify-between items-center px-6">

        <Link
          href="/"
          className="text-2xl font-bold text-blue-600"
        >
          ResumeAI
        </Link>

        <nav className="flex items-center gap-8">

          <Link href="/">Home</Link>

          {

            loggedIn && (

              <Link href="/dashboard">

                Dashboard

              </Link>

            )

          }

          <div
            className="relative"
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
          >

            <button className="flex items-center gap-1">

              Features

              <ChevronDown size={18} />

            </button>

            {

              open && (

                <div className="absolute top-10 left-0 w-72 bg-white rounded-xl shadow-xl border p-3">

                  {

                    featureLinks.map((item) => {

                      const Icon = item.icon;

                      return (

                        <Link
                          key={item.name}
                          href={item.href}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50"
                        >

                          <Icon
                            size={20}
                            className="text-blue-600"
                          />

                          {item.name}

                        </Link>

                      );

                    })

                  }

                </div>

              )

            }

          </div>

          <Link href="/about">

            About

          </Link>

          <Link href="/contact">

            Contact

          </Link>

        </nav>

        {

          loggedIn ?

          (

            <div className="flex gap-3">

              <Link
                href="/profile"
                className="flex items-center gap-2 border px-4 py-2 rounded-lg hover:bg-slate-50 transition"
              >

                <User size={18}/>

                Profile

              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
              >

                <LogOut size={18}/>

                Logout

              </button>

            </div>

          )

          :

          (

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

          )

        }

      </div>

    </header>

  );

}