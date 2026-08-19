"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  FileText,
  BadgeCheck,
  BrainCircuit,
  Briefcase,
  Sparkles,
  Upload,
  ArrowRight,
} from "lucide-react";

import { dashboard } from "../services/dashboardService";

export default function Dashboard() {

  const [loading, setLoading] = useState(true);

  const [dashboardData, setDashboardData] = useState({
    filename: "",
    ats_score: 0,
    resume_score: 0,
    skills: [],
    job_match: 0,
    ai_suggestion: "No Suggestions"
  });

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
  try {

    const res = await dashboard();

    console.log("Dashboard Response:", res.data);

    if (res.data.success) {

      const data = res.data.dashboard;

      setDashboardData({

        filename: data.recentResume || "No Resume",

        ats_score: data.atsScore?.score || 0,

        resume_score: data.resumeScore || 0,

        skills: Array(data.skills).fill("Skill"),

        job_match:
          typeof data.jobMatch === "object"
            ? data.jobMatch?.matchScore || 0
            : data.jobMatch || 0,

        ai_suggestion:
          data.aiSuggestion?.suggestions?.join(", ") ||
          "No Suggestions Available"

      });

    }

  } catch (err) {

    console.log(err);

  } finally {

    setLoading(false);

  }
};
  const cards = [
  {
    title: "Resume Score",
    value: `${dashboardData.resume_score}%`,
    color: "bg-blue-500",
    icon: FileText,
    link: "/features/resume-score",
  },
  {
    title: "ATS Score",
    value: `${dashboardData.ats_score}%`,
    color: "bg-green-500",
    icon: BadgeCheck,
    link: "/features/ATS",
  },
  {
    title: "Skills Found",
    value: Array.isArray(dashboardData.skills)
      ? dashboardData.skills.length
      : 0,
    color: "bg-purple-500",
    icon: BrainCircuit,
    link: "/features/skill-detection",
  },
  {
    title: "Job Match",
    value: `${dashboardData.job_match}%`,
    color: "bg-orange-500",
    icon: Briefcase,
    link: "/features/job-matching",
  },
];

const quickActions = [
  {
    title: "Upload Resume",
    link: "/upload",
    icon: Upload,
  },
  {
    title: "AI Suggestions",
    link: "/features/AI-Suggestion",
    icon: Sparkles,
  },
];

  if (loading) {

    return (

      <div className="min-h-screen flex justify-center items-center">

        <h1 className="text-3xl font-bold">

          Loading Dashboard...

        </h1>

      </div>

    );

  }

  return (

    <main className="min-h-screen bg-slate-100">

      {/* Hero Section */}

      <section className="bg-gradient-to-r from-blue-700 to-indigo-700 text-white py-14">

        <div className="max-w-7xl mx-auto px-6">

          <h1 className="text-4xl font-bold">

            Dashboard

          </h1>

          <p className="mt-3 text-blue-100">

            Welcome back! Here's your latest Resume Analysis.

          </p>

        </div>

      </section>

      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* Stats Cards */}

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

          {cards.map((item, index) => {

            const Icon = item.icon;

            return (

              <Link
                href={item.link}
                key={index}
              >

                <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">

                  <div className="flex justify-between items-center">

                    <div>

                      <p className="text-gray-500">

                        {item.title}

                      </p>

                      <h2 className="text-4xl font-bold mt-2">

                        {item.value}

                      </h2>

                    </div>

                    <div className={`${item.color} p-4 rounded-xl text-white`}>

                      <Icon size={32}/>

                    </div>

                  </div>

                </div>

              </Link>

            );

          })}

        </div>
        {/* Resume Summary & AI Recommendation */}

        <div className="grid lg:grid-cols-2 gap-8 mt-10">

          {/* Resume Summary */}

          <div className="bg-white rounded-2xl shadow-lg p-8">

            <h2 className="text-2xl font-bold mb-6">

              Resume Summary

            </h2>

            <ul className="space-y-4 text-gray-600">

              <li>

                📄 <span className="font-semibold">Resume :</span>{" "}

                {dashboardData.filename}

              </li>

              <li>

                ✅ <span className="font-semibold">ATS Score :</span>{" "}

                {dashboardData.ats_score}%

              </li>

              <li>

                ⭐ <span className="font-semibold">Resume Score :</span>{" "}

                {dashboardData.resume_score}%

              </li>

              <li>

                💼 <span className="font-semibold">Job Match :</span>{" "}

                {dashboardData.job_match}%

              </li>

              <li>

                🧠 <span className="font-semibold">Skills :</span>{" "}

                {

                  dashboardData.skills.length > 0

                    ?

                    dashboardData.skills.join(", ")

                    :

                    "No Skills Found"

                }

              </li>

            </ul>

          </div>

          {/* AI Recommendation */}

          <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white rounded-2xl shadow-lg p-8">

            <Sparkles size={45} />

            <h2 className="text-3xl font-bold mt-5">

              AI Recommendation

            </h2>

            <p className="mt-4 text-indigo-100 leading-7">

              {dashboardData.ai_suggestion}

            </p>

            <Link

              href="/features/AI-Suggestion"

              className="inline-flex items-center gap-2 mt-8 bg-white text-indigo-700 px-6 py-3 rounded-xl font-semibold"

            >

              View Suggestions

              <ArrowRight size={18}/>

            </Link>

          </div>

        </div>

        {/* Quick Actions */}

        <div className="mt-12">

          <h2 className="text-3xl font-bold mb-8">

            Quick Actions

          </h2>

          <div className="grid md:grid-cols-2 gap-6">

            {

              quickActions.map((item,index)=>{

                const Icon=item.icon;

                return(

                  <Link

                    href={item.link}

                    key={index}

                  >

                    <div className="bg-white rounded-2xl shadow-lg p-6 flex justify-between items-center hover:shadow-xl transition">

                      <div className="flex items-center gap-4">

                        <div className="bg-blue-100 p-4 rounded-xl">

                          <Icon

                            className="text-blue-600"

                            size={28}

                          />

                        </div>

                        <h3 className="text-xl font-semibold">

                          {item.title}

                        </h3>

                      </div>

                      <ArrowRight className="text-gray-500"/>

                    </div>

                  </Link>

                )

              })

            }

          </div>

        </div>

        {/* Recent Analysis */}

        <div className="bg-white rounded-2xl shadow-lg p-8 mt-12">

          <h2 className="text-3xl font-bold mb-6">

            Recent Resume Analysis

          </h2>

          <table className="w-full">

            <thead>

              <tr className="border-b">

                <th className="text-left py-3">

                  Resume

                </th>

                <th className="text-left">

                  ATS

                </th>

                <th className="text-left">

                  Resume Score

                </th>

                <th className="text-left">

                  Job Match

                </th>

              </tr>

            </thead>

            <tbody>

              <tr>

                <td className="py-4">

                  {dashboardData.filename}

                </td>

                <td>

                  {dashboardData.ats_score}%

                </td>

                <td>

                  {dashboardData.resume_score}%

                </td>

                <td>

                  {dashboardData.job_match}%

                </td>

              </tr>

            </tbody>

          </table>

        </div>

      </div>

    </main>

  );

}        