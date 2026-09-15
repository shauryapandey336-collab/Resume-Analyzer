"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  User,
  Mail,
  Phone,
  FileText,
  BadgeCheck,
  BrainCircuit,
  Briefcase,
  Sparkles,
  Upload,
  ArrowRight,
  CheckCircle,
  LogOut,
} from "lucide-react";

import API from "../services/api";

export default function Profile() {
  const [loading, setLoading] = useState(true);

  const [profile, setProfile] = useState({
    name: "User",
    email: "",
    phone: "",
  });

  const [resumeData, setResumeData] = useState({
    filename: "No Resume Uploaded",
    resumeScore: 0,
    atsScore: 0,
    skills: [],
    jobMatch: 0,
    aiSuggestion: "No suggestions available.",
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);

      // Get logged-in user/profile
      const profileResponse = await API.get("/profile");

      console.log("Profile Response:", profileResponse.data);

      if (profileResponse.data?.success) {
        const data =
          profileResponse.data?.data ||
          profileResponse.data?.user ||
          profileResponse.data?.profile ||
          {};

        setProfile({
          name: data.name || data.username || "User",
          email: data.email || "",
          phone: data.phone || "",
        });
      }

      // Get dashboard/resume analysis
      const dashboardResponse = await API.get("/dashboard");

      console.log(
        "Dashboard Response:",
        dashboardResponse.data
      );

      if (dashboardResponse.data?.success) {
        const data = dashboardResponse.data.dashboard || {};

        const atsScore =
          typeof data.atsScore === "object"
            ? data.atsScore?.score || 0
            : data.atsScore || 0;

        const jobMatch =
          typeof data.jobMatch === "object"
            ? data.jobMatch?.matchScore ||
              data.jobMatch?.score ||
              0
            : data.jobMatch || 0;

        let skills = [];

        if (Array.isArray(data.skills)) {
          skills = data.skills;
        } else if (data.skills?.technicalSkills) {
          skills = [
            ...(data.skills.technicalSkills || []),
            ...(data.skills.softSkills || []),
          ];
        }

        setResumeData({
          filename:
            data.recentResume ||
            data.filename ||
            "No Resume Uploaded",

          resumeScore:
            data.resumeScore || 0,

          atsScore,

          skills,

          jobMatch,

          aiSuggestion:
            data.aiSuggestion ||
            data.ai_suggestion ||
            "No suggestions available.",
        });
      }
    } catch (error) {
      console.error(
        "Profile loading error:",
        error
      );

      /*
       * If /profile API does not exist,
       * dashboard data can still be displayed.
       */

      try {
        const dashboardResponse =
          await API.get("/dashboard");

        if (dashboardResponse.data?.success) {
          const data =
            dashboardResponse.data.dashboard || {};

          const atsScore =
            typeof data.atsScore === "object"
              ? data.atsScore?.score || 0
              : data.atsScore || 0;

          const jobMatch =
            typeof data.jobMatch === "object"
              ? data.jobMatch?.matchScore ||
                data.jobMatch?.score ||
                0
              : data.jobMatch || 0;

          let skills = [];

          if (Array.isArray(data.skills)) {
            skills = data.skills;
          } else if (data.skills?.technicalSkills) {
            skills = [
              ...(data.skills.technicalSkills || []),
              ...(data.skills.softSkills || []),
            ];
          }

          setResumeData({
            filename:
              data.recentResume ||
              "No Resume Uploaded",

            resumeScore:
              data.resumeScore || 0,

            atsScore,

            skills,

            jobMatch,

            aiSuggestion:
              data.aiSuggestion ||
              data.ai_suggestion ||
              "No suggestions available.",
          });
        }
      } catch (dashboardError) {
        console.error(
          "Dashboard fallback error:",
          dashboardError
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("resumeId");
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/login";
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />

          <h1 className="text-2xl font-bold mt-5">
            Loading Profile...
          </h1>

          <p className="text-gray-500 mt-2">
            Fetching your resume information
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100">

      {/* Header */}

      <section className="bg-gradient-to-r from-blue-700 to-indigo-700 text-white py-14">
        <div className="max-w-7xl mx-auto px-6">

          <div className="flex flex-col md:flex-row justify-between items-center gap-6">

            <div className="flex items-center gap-5">

              <div className="bg-white/20 p-5 rounded-full">
                <User size={50} />
              </div>

              <div>
                <h1 className="text-4xl font-bold">
                  My Profile
                </h1>

                <p className="text-blue-100 mt-2">
                  Manage your profile and resume analysis
                </p>
              </div>

            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-white text-red-600 px-5 py-3 rounded-xl font-semibold hover:bg-red-50 transition"
            >
              <LogOut size={20} />
              Logout
            </button>

          </div>

        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* Profile + Resume */}

        <div className="grid lg:grid-cols-3 gap-8">

          {/* User Profile */}

          <div className="bg-white rounded-2xl shadow-lg p-8">

            <div className="flex justify-center">
              <div className="w-28 h-28 bg-blue-100 rounded-full flex items-center justify-center">
                <User
                  size={55}
                  className="text-blue-600"
                />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-center mt-5">
              {profile.name}
            </h2>

            <div className="mt-8 space-y-5">

              <div className="flex items-center gap-3">
                <Mail
                  size={20}
                  className="text-blue-600"
                />

                <div>
                  <p className="text-sm text-gray-500">
                    Email
                  </p>

                  <p className="font-medium break-all">
                    {profile.email || "Not available"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone
                  size={20}
                  className="text-blue-600"
                />

                <div>
                  <p className="text-sm text-gray-500">
                    Phone
                  </p>

                  <p className="font-medium">
                    {profile.phone || "Not available"}
                  </p>
                </div>
              </div>

            </div>

          </div>

          {/* Resume Information */}

          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-8">

            <div className="flex flex-col md:flex-row justify-between gap-5">

              <div className="flex items-center gap-4">

                <div className="bg-blue-100 p-4 rounded-xl">
                  <FileText
                    size={35}
                    className="text-blue-600"
                  />
                </div>

                <div>
                  <p className="text-gray-500">
                    Current Resume
                  </p>

                  <h2 className="text-2xl font-bold">
                    {resumeData.filename}
                  </h2>
                </div>

              </div>

              <Link
                href="/upload"
                className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
              >
                <Upload size={20} />
                Upload New
              </Link>

            </div>

            <div className="grid md:grid-cols-3 gap-5 mt-10">

              <div className="bg-blue-50 rounded-xl p-5">
                <FileText
                  className="text-blue-600"
                  size={30}
                />

                <p className="text-gray-500 mt-3">
                  Resume Score
                </p>

                <h3 className="text-3xl font-bold">
                  {resumeData.resumeScore}%
                </h3>
              </div>

              <div className="bg-green-50 rounded-xl p-5">
                <BadgeCheck
                  className="text-green-600"
                  size={30}
                />

                <p className="text-gray-500 mt-3">
                  ATS Score
                </p>

                <h3 className="text-3xl font-bold">
                  {resumeData.atsScore}%
                </h3>
              </div>

              <div className="bg-orange-50 rounded-xl p-5">
                <Briefcase
                  className="text-orange-600"
                  size={30}
                />

                <p className="text-gray-500 mt-3">
                  Job Match
                </p>

                <h3 className="text-3xl font-bold">
                  {resumeData.jobMatch}%
                </h3>
              </div>

            </div>

          </div>

        </div>

        {/* Skills */}

        <div className="bg-white rounded-2xl shadow-lg p-8 mt-8">

          <div className="flex items-center gap-3 mb-6">

            <BrainCircuit
              size={32}
              className="text-purple-600"
            />

            <div>
              <h2 className="text-2xl font-bold">
                Detected Skills
              </h2>

              <p className="text-gray-500">
                Skills detected from your latest resume
              </p>
            </div>

          </div>

          {resumeData.skills.length > 0 ? (

            <div className="flex flex-wrap gap-3">

              {resumeData.skills.map(
                (skill, index) => (

                  <span
                    key={`${skill}-${index}`}
                    className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full font-medium"
                  >
                    {skill}
                  </span>

                )
              )}

            </div>

          ) : (

            <div className="text-center py-8">

              <BrainCircuit
                size={45}
                className="mx-auto text-gray-300"
              />

              <p className="text-gray-500 mt-3">
                No skills detected yet.
              </p>

              <Link
                href="/upload"
                className="inline-flex items-center gap-2 mt-4 text-blue-600 font-semibold"
              >
                Upload Resume
                <ArrowRight size={18} />
              </Link>

            </div>

          )}

        </div>

        {/* AI Recommendation */}

        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white rounded-2xl shadow-lg p-8 mt-8">

          <div className="flex items-start gap-5">

            <div className="bg-white/20 p-4 rounded-xl">
              <Sparkles size={35} />
            </div>

            <div className="flex-1">

              <h2 className="text-2xl font-bold">
                AI Recommendation
              </h2>

              <p className="text-indigo-100 mt-3 leading-7">
                {resumeData.aiSuggestion}
              </p>

              <Link
                href="/features/AI-Suggestion"
                className="inline-flex items-center gap-2 mt-6 bg-white text-indigo-700 px-5 py-3 rounded-xl font-semibold"
              >
                View AI Suggestions
                <ArrowRight size={18} />
              </Link>

            </div>

          </div>

        </div>

        {/* Features */}

        <div className="mt-10">

          <h2 className="text-3xl font-bold mb-6">
            Resume Analysis
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

            <Link href="/features/ATS">
              <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">

                <BadgeCheck
                  size={35}
                  className="text-green-600"
                />

                <h3 className="text-xl font-bold mt-4">
                  ATS Analysis
                </h3>

                <p className="text-gray-500 mt-2">
                  Check your resume ATS compatibility.
                </p>

                <div className="flex items-center gap-2 text-blue-600 mt-5 font-semibold">
                  View Analysis
                  <ArrowRight size={18} />
                </div>

              </div>
            </Link>

            <Link href="/features/skill-detection">
              <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">

                <BrainCircuit
                  size={35}
                  className="text-purple-600"
                />

                <h3 className="text-xl font-bold mt-4">
                  Skill Detection
                </h3>

                <p className="text-gray-500 mt-2">
                  View your detected technical and soft skills.
                </p>

                <div className="flex items-center gap-2 text-blue-600 mt-5 font-semibold">
                  View Skills
                  <ArrowRight size={18} />
                </div>

              </div>
            </Link>

            <Link href="/features/job-matching">
              <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">

                <Briefcase
                  size={35}
                  className="text-orange-600"
                />

                <h3 className="text-xl font-bold mt-4">
                  Job Matching
                </h3>

                <p className="text-gray-500 mt-2">
                  Compare your resume with a job description.
                </p>

                <div className="flex items-center gap-2 text-blue-600 mt-5 font-semibold">
                  Match Job
                  <ArrowRight size={18} />
                </div>

              </div>
            </Link>

            <Link href="/features/AI-Suggestion">
              <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">

                <Sparkles
                  size={35}
                  className="text-indigo-600"
                />

                <h3 className="text-xl font-bold mt-4">
                  AI Suggestions
                </h3>

                <p className="text-gray-500 mt-2">
                  Get personalized recommendations.
                </p>

                <div className="flex items-center gap-2 text-blue-600 mt-5 font-semibold">
                  View Suggestions
                  <ArrowRight size={18} />
                </div>

              </div>
            </Link>

          </div>

        </div>

        {/* Account Status */}

        <div className="bg-white rounded-2xl shadow-lg p-8 mt-10">

          <h2 className="text-2xl font-bold mb-6">
            Account Overview
          </h2>

          <div className="space-y-4">

            <div className="flex items-center gap-3">
              <CheckCircle
                className="text-green-600"
                size={22}
              />

              <span>
                Account is active
              </span>
            </div>

            <div className="flex items-center gap-3">
              <CheckCircle
                className="text-green-600"
                size={22}
              />

              <span>
                Resume analysis available
              </span>
            </div>

            <div className="flex items-center gap-3">
              <CheckCircle
                className="text-green-600"
                size={22}
              />

              <span>
                Personalized dashboard enabled
              </span>
            </div>

          </div>

        </div>

      </div>

    </main>
  );
}