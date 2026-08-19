"use client";

import React, { useEffect, useState } from "react";
import {
  Sparkles,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  ArrowRight,
} from "lucide-react";

import { suggestion } from "../../services/resumeService";

export default function AI_Suggestion() {
  const resumeScore = 82;

  const [aiData, setAiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const id = localStorage.getItem("resumeId");

        if (!id) {
          setError("Resume ID not found");
          setLoading(false);
          return;
        }

        const res = await suggestion(id);
        setAiData(res);
      } catch (err) {
        console.error("Error fetching suggestions:", err);
        setError("Failed to fetch AI suggestions");
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, []);

  const strengths = [
    "Strong technical skills section",
    "Projects are clearly mentioned",
    "Education section is complete",
    "Good resume formatting",
  ];

  const improvements = [
    "Add a professional summary",
    "Include your GitHub profile",
    "Mention measurable achievements",
    "Add certifications",
    "Use more action verbs",
  ];

  const aiSuggestions = [
    {
      title: "Improve Resume Summary",
      description:
        "Add a 3–4 line professional summary highlighting your skills and career objectives.",
    },
    {
      title: "Include GitHub",
      description:
        "Recruiters prefer candidates with project repositories. Add your GitHub profile.",
    },
    {
      title: "Optimize Keywords",
      description:
        "Use keywords from the job description to improve ATS compatibility.",
    },
    {
      title: "Highlight Achievements",
      description:
        "Mention measurable achievements instead of only responsibilities.",
    },
  ];

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 py-12 flex items-center justify-center">
        <p className="text-gray-500 text-lg">Loading AI suggestions...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-6">

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 rounded-xl p-4">
            {error}
          </div>
        )}

        {/* Hero */}

        <div className="bg-gradient-to-r from-purple-600 to-indigo-700 rounded-3xl text-white p-10 shadow-lg">

          <div className="flex items-center gap-4">

            <Sparkles size={55} />

            <div>
              <h1 className="text-4xl font-bold">
                AI Resume Suggestions
              </h1>

              <p className="mt-2 text-purple-100">
                Personalized recommendations generated using Artificial Intelligence.
              </p>
            </div>

          </div>

        </div>

        {/* Resume Score */}

        <div className="mt-10 bg-white rounded-2xl shadow-lg p-8">

          <h2 className="text-2xl font-bold mb-6">
            Resume Quality Score
          </h2>

          <div className="flex items-center gap-8">

            <div className="w-36 h-36 rounded-full border-[10px] border-purple-600 flex items-center justify-center">

              <div className="text-center">

                <h2 className="text-5xl font-bold text-purple-600">
                  {aiData?.resumeScore ?? resumeScore}
                </h2>

                <p className="text-gray-500">
                  /100
                </p>

              </div>

            </div>

            <div>

              <h3 className="text-2xl font-semibold">
                Great Progress 🎉
              </h3>

              <p className="mt-3 text-gray-600">
                Your resume looks good but applying these AI suggestions
                can significantly improve your chances of getting shortlisted.
              </p>

            </div>

          </div>

        </div>

        {/* Strengths & Improvements */}

        <div className="grid lg:grid-cols-2 gap-8 mt-10">

          <div className="bg-white rounded-2xl shadow-lg p-8">

            <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">

              <CheckCircle className="text-green-600" />

              Resume Strengths

            </h2>

            <div className="space-y-4">

              {(aiData?.strengths ?? strengths).map((item, index) => (

                <div
                  key={index}
                  className="flex gap-3 items-center"
                >
                  <CheckCircle
                    size={18}
                    className="text-green-600"
                  />

                  <span>{item}</span>

                </div>

              ))}

            </div>

          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">

            <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">

              <AlertCircle className="text-red-500" />

              Needs Improvement

            </h2>

            <div className="space-y-4">

              {(aiData?.improvements ?? improvements).map((item, index) => (

                <div
                  key={index}
                  className="flex gap-3 items-center"
                >
                  <AlertCircle
                    size={18}
                    className="text-red-500"
                  />

                  <span>{item}</span>

                </div>

              ))}

            </div>

          </div>

        </div>

        {/* AI Suggestions */}

        <div className="mt-10">

          <h2 className="text-3xl font-bold mb-8">
            AI Recommendations
          </h2>

          <div className="grid md:grid-cols-2 gap-8">

            {(aiData?.aiSuggestions ?? aiSuggestions).map((item, index) => (

              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition"
              >

                <div className="flex items-center gap-3">

                  <Lightbulb className="text-yellow-500" />

                  <h3 className="text-xl font-semibold">
                    {item.title}
                  </h3>

                </div>

                <p className="text-gray-600 mt-4 leading-7">
                  {item.description}
                </p>

                <button className="mt-6 flex items-center gap-2 text-purple-600 font-semibold hover:gap-3 transition-all">

                  Learn More

                  <ArrowRight size={18} />

                </button>

              </div>

            ))}

          </div>

        </div>

      </div>
    </main>
  );
}