"use client";

import React, { useEffect, useState } from "react";
import {
  BrainCircuit,
  Code2,
  Lightbulb,
  Star,
  CheckCircle,
  Search,
} from "lucide-react";
import { skills } from "../../services/resumeService";

export default function Skill_Detection() {
  const skillScore = 92;

  const [aiData, setAiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const id = localStorage.getItem("resumeId");

        if (!id) {
          setError("Resume ID not found");
          setLoading(false);
          return;
        }

        const res = await skills(id);
        setAiData(res);
      } catch (err) {
        console.error("Error fetching skills:", err);
        setError("Failed to fetch skill data");
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  const technicalSkills = [
    "Python",
    "React.js",
    "Next.js",
    "Node.js",
    "Flask",
    "MongoDB",
    "MySQL",
    "Machine Learning",
    "Git",
    "Tailwind CSS",
  ];

  const softSkills = [
    "Communication",
    "Leadership",
    "Problem Solving",
    "Teamwork",
    "Time Management",
  ];

  const missingSkills = [
    "Docker",
    "AWS",
    "Redis",
    "CI/CD",
  ];

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 py-12 flex items-center justify-center">
        <p className="text-gray-500 text-lg">Loading skill detection...</p>
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

        <div className="bg-gradient-to-r from-indigo-600 to-blue-700 rounded-3xl text-white p-10 shadow-lg">

          <div className="flex items-center gap-4">

            <BrainCircuit size={55} />

            <div>

              <h1 className="text-4xl font-bold">
                Skill Detection
              </h1>

              <p className="mt-3 text-indigo-100">
                AI automatically detects your technical and soft skills
                from your uploaded resume.
              </p>

            </div>

          </div>

        </div>

        {/* Skill Score */}

        <div className="bg-white rounded-2xl shadow-lg p-8 mt-10">

          <h2 className="text-2xl font-bold mb-8">
            Overall Skill Score
          </h2>

          <div className="flex flex-col md:flex-row items-center gap-10">

            <div className="w-40 h-40 rounded-full border-[12px] border-indigo-600 flex items-center justify-center">

              <div className="text-center">

                <h2 className="text-5xl font-bold text-indigo-600">
                  {aiData?.skillScore ?? skillScore}
                </h2>

                <p className="text-gray-500">
                  /100
                </p>

              </div>

            </div>

            <div>

              <h3 className="text-2xl font-semibold">
                Excellent Skill Profile ⭐
              </h3>

              <p className="mt-4 text-gray-600 leading-7">
                Your resume contains strong technical skills.
                Adding a few cloud and DevOps technologies will
                improve your profile further.
              </p>

            </div>

          </div>

        </div>

        {/* Skills */}

        <div className="grid lg:grid-cols-2 gap-8 mt-10">

          {/* Technical Skills */}

          <div className="bg-white rounded-2xl shadow-lg p-8">

            <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">

              <Code2 className="text-blue-600" />

              Technical Skills

            </h2>

            <div className="flex flex-wrap gap-3">

              {(aiData?.technicalSkills ?? technicalSkills).map((skill, index) => (

                <span
                  key={index}
                  className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-medium"
                >
                  {skill}
                </span>

              ))}

            </div>

          </div>

          {/* Soft Skills */}

          <div className="bg-white rounded-2xl shadow-lg p-8">

            <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">

              <Star className="text-yellow-500" />

              Soft Skills

            </h2>

            <div className="flex flex-wrap gap-3">

              {(aiData?.softSkills ?? softSkills).map((skill, index) => (

                <span
                  key={index}
                  className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full font-medium"
                >
                  {skill}
                </span>

              ))}

            </div>

          </div>

        </div>

        {/* Missing Skills */}

        <div className="bg-white rounded-2xl shadow-lg p-8 mt-10">

          <h2 className="text-3xl font-bold flex items-center gap-2 mb-8">

            <Search className="text-red-500" />

            Recommended Skills

          </h2>

          <div className="flex flex-wrap gap-4">

            {(aiData?.missingSkills ?? missingSkills).map((skill, index) => (

              <span
                key={index}
                className="bg-red-100 text-red-700 px-5 py-3 rounded-full font-semibold"
              >
                {skill}
              </span>

            ))}

          </div>

        </div>

        {/* AI Insights */}

        <div className="bg-white rounded-2xl shadow-lg p-8 mt-10">

          <h2 className="text-3xl font-bold flex items-center gap-2 mb-8">

            <Lightbulb className="text-yellow-500" />

            AI Insights

          </h2>

          <div className="space-y-5">

            <div className="flex items-center gap-3">
              <CheckCircle className="text-green-600" />
              Strong programming language knowledge detected.
            </div>

            <div className="flex items-center gap-3">
              <CheckCircle className="text-green-600" />
              Good frontend development experience.
            </div>

            <div className="flex items-center gap-3">
              <CheckCircle className="text-green-600" />
              Machine Learning skills identified.
            </div>

            <div className="flex items-center gap-3">
              <CheckCircle className="text-green-600" />
              Consider learning Docker and AWS to improve job opportunities.
            </div>

          </div>

        </div>

      </div>

    </main>
  );
}