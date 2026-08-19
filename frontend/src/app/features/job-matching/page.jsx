"use client";

import React, { useState } from "react";
import {
  Briefcase,
  CheckCircle,
  XCircle,
  Target,
  ArrowRight,
} from "lucide-react";

import { jobMatch } from "../../services/resumeService";

export default function Page() {

  const [loading, setLoading] = useState(false);

  const [jobDescription, setJobDescription] = useState("");

  const [matchScore, setMatchScore] = useState(0);

  const [matchedSkills, setMatchedSkills] = useState([]);

  const [missingSkills, setMissingSkills] = useState([]);

  const [recommendations, setRecommendations] = useState([]);

  const handleMatch = async () => {

    try {

      const resumeId = localStorage.getItem("resumeId");

      if (!resumeId) {

        alert("Please upload your resume first.");

        return;

      }

      if (jobDescription.trim() === "") {

        alert("Please paste the Job Description.");

        return;

      }

      setLoading(true);

      const res = await jobMatch({

        resumeId,

        jobDescription

      });

      console.log("Job Match Response :", res.data);

      if (res.data.success) {

        const data = res.data.data.job_match;

        setMatchScore(data.score || 0);

        setMatchedSkills(data.matchedSkills || []);

        setMissingSkills(data.missingSkills || []);

        setRecommendations(data.recommendations || []);

      } else {

        alert(res.data.message);

      }

    } catch (error) {

      console.log(error);

      alert(

        error.response?.data?.message ||

        "Unable to Match Job"

      );

    } finally {

      setLoading(false);

    }

  };
    return (

    <main className="min-h-screen bg-slate-50 py-12">

      <div className="max-w-7xl mx-auto px-6">

        {/* Hero */}

        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-3xl text-white p-10 shadow-lg">

          <div className="flex items-center gap-4">

            <Briefcase size={55} />

            <div>

              <h1 className="text-4xl font-bold">
                Job Matching Analysis
              </h1>

              <p className="mt-2 text-blue-100">
                Compare your resume with any job description and
                discover how well your resume matches.
              </p>

            </div>

          </div>

        </div>

        {/* Match Score */}

        <div className="bg-white rounded-2xl shadow-lg p-8 mt-10">

          <h2 className="text-2xl font-bold mb-8">
            Job Match Score
          </h2>

          <div className="flex flex-col md:flex-row items-center gap-10">

            <div className="w-40 h-40 rounded-full border-[12px] border-blue-600 flex items-center justify-center">

              <div className="text-center">

                <h2 className="text-5xl font-bold text-blue-600">

                  {matchScore}%

                </h2>

                <p className="text-gray-500">

                  Match

                </p>

              </div>

            </div>

            <div>

              <h3 className="text-2xl font-semibold">

                {
                  matchScore >= 80
                    ? "Excellent Match 🎯"
                    : matchScore >= 60
                    ? "Good Match 👍"
                    : "Needs Improvement ⚠️"
                }

              </h3>

              <p className="mt-4 text-gray-600 leading-7">

                {
                  matchScore >= 80
                    ? "Your resume closely matches the selected job description."
                    : "Improve your resume by adding missing skills and relevant projects."
                }

              </p>

            </div>

          </div>

        </div>

        {/* Skills */}

        <div className="grid lg:grid-cols-2 gap-8 mt-10">

          {/* Matched Skills */}

          <div className="bg-white rounded-2xl shadow-lg p-8">

            <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">

              <CheckCircle className="text-green-600" />

              Matched Skills

            </h2>

            <div className="flex flex-wrap gap-3">

              {
                matchedSkills.length > 0 ?

                matchedSkills.map((skill, index) => (

                  <span
                    key={index}
                    className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-medium"
                  >

                    {skill}

                  </span>

                ))

                :

                <p>No Matched Skills Found</p>

              }

            </div>

          </div>

          {/* Missing Skills */}

          <div className="bg-white rounded-2xl shadow-lg p-8">

            <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">

              <XCircle className="text-red-500" />

              Missing Skills

            </h2>

            <div className="flex flex-wrap gap-3">

              {
                missingSkills.length > 0 ?

                missingSkills.map((skill, index) => (

                  <span
                    key={index}
                    className="bg-red-100 text-red-700 px-4 py-2 rounded-full font-medium"
                  >

                    {skill}

                  </span>

                ))

                :

                <p>No Missing Skills</p>

              }

            </div>

          </div>

        </div>
                {/* AI Recommendations */}

        <div className="bg-white rounded-2xl shadow-lg p-8 mt-10">

          <h2 className="text-3xl font-bold flex items-center gap-2 mb-8">

            <Target className="text-yellow-500" />

            AI Recommendations

          </h2>

          <div className="space-y-5">

            {

              recommendations.length > 0 ?

              recommendations.map((item, index) => (

                <div
                  key={index}
                  className="flex justify-between items-center bg-slate-50 rounded-xl p-5 hover:bg-blue-50 transition"
                >

                  <p>{item}</p>

                  <ArrowRight className="text-blue-600" />

                </div>

              ))

              :

              <p className="text-gray-500">

                No Recommendations Available

              </p>

            }

          </div>

        </div>

        {/* Job Description */}

        <div className="bg-white rounded-2xl shadow-lg p-8 mt-10">

          <h2 className="text-3xl font-bold mb-6">

            Paste Job Description

          </h2>

          <textarea

            rows={8}

            value={jobDescription}

            onChange={(e) => setJobDescription(e.target.value)}

            placeholder="Paste the Job Description here..."

            className="w-full border rounded-xl p-4 outline-none focus:ring-2 focus:ring-blue-500"

          />

          <button

            onClick={handleMatch}

            disabled={loading}

            className={`mt-6 px-8 py-3 rounded-xl text-white font-semibold transition

            ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}

          >

            {

              loading

              ?

              "Analyzing..."

              :

              "Analyze Job Match"

            }

          </button>

        </div>

      </div>

    </main>

  );

}