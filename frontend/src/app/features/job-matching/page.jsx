"use client";

import React, { useState } from "react";
import {
  Briefcase,
  CheckCircle,
  XCircle,
  Target,
  ArrowRight,
  Loader2,
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
    const resumeId = localStorage.getItem("resumeId");

    // Resume validation
    if (!resumeId) {
      alert("Please upload your resume first.");
      return;
    }

    // Job description validation
    if (!jobDescription.trim()) {
      alert("Please paste the Job Description.");
      return;
    }

    if (jobDescription.trim().length < 30) {
      alert("Please enter a proper Job Description.");
      return;
    }

    try {
      setLoading(true);

      // Clear previous result while analyzing
      setMatchScore(0);
      setMatchedSkills([]);
      setMissingSkills([]);
      setRecommendations([]);

      console.log("Job Match Request:", {
        resumeId,
        jobDescription,
      });

      const res = await jobMatch({
        resumeId,
        jobDescription: jobDescription.trim(),
      });

      console.log("Job Match Response:", res.data);

      if (res.data?.success) {
        /*
          Backend response expected:

          {
            success: true,
            data: {
              job_match: {
                score: 80,
                matchedSkills: [],
                missingSkills: [],
                recommendations: []
              }
            }
          }
        */

        const data = res.data.data.jobMatch;

        const score =
          data.score ??
          data.matchScore ??
          data.jobMatch ??
          0;

        const matched =
          Array.isArray(data.matchedSkills)
            ? data.matchedSkills
            : [];

        const missing =
          Array.isArray(data.missingSkills)
            ? data.missingSkills
            : [];

        const recommendationList =
          Array.isArray(data.recommendations)
            ? data.recommendations
            : [];

        setMatchScore(Number(score));
        setMatchedSkills(matched);
        setMissingSkills(missing);
        setRecommendations(recommendationList);

        alert("Job Match Analysis Completed!");
      } else {
        alert(
          res.data?.message ||
            "Unable to analyze job match."
        );
      }
    } catch (error) {
      console.error("Job Match Error:", error);

      alert(
        error?.response?.data?.message ||
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
                Compare your resume with any job description
                and discover how well your resume matches.
              </p>
            </div>
          </div>
        </div>

        {/* Job Description */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mt-10">

          <h2 className="text-3xl font-bold mb-6">
            Paste Job Description
          </h2>

          <textarea
            rows={10}
            value={jobDescription}
            onChange={(e) =>
              setJobDescription(e.target.value)
            }
            disabled={loading}
            placeholder="Paste the complete Job Description here..."
            className="w-full border border-gray-300 rounded-xl p-4 outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          />

          <div className="flex items-center justify-between mt-3">
            <p className="text-sm text-gray-500">
              {jobDescription.length} characters
            </p>

            {jobDescription.length > 0 &&
              jobDescription.length < 30 && (
                <p className="text-sm text-red-500">
                  Please enter at least 30 characters.
                </p>
              )}
          </div>

          <button
            onClick={handleMatch}
            disabled={
              loading ||
              !jobDescription.trim() ||
              jobDescription.trim().length < 30
            }
            className={`mt-6 px-8 py-3 rounded-xl text-white font-semibold transition flex items-center gap-3 ${
              loading ||
              !jobDescription.trim() ||
              jobDescription.trim().length < 30
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? (
              <>
                <Loader2
                  size={20}
                  className="animate-spin"
                />
                Analyzing Job Match...
              </>
            ) : (
              <>
                Analyze Job Match
                <ArrowRight size={20} />
              </>
            )}
          </button>

          {/* Loading message */}
          {loading && (
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-5">
              <div className="flex items-center gap-3">
                <Loader2
                  className="text-blue-600 animate-spin"
                  size={25}
                />

                <div>
                  <p className="font-semibold text-blue-700">
                    AI is analyzing your resume...
                  </p>

                  <p className="text-sm text-blue-600 mt-1">
                    Comparing your skills with the job
                    description. Please wait.
                  </p>
                </div>
              </div>
            </div>
          )}
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
                {matchScore >= 80
                  ? "Excellent Match 🎯"
                  : matchScore >= 60
                  ? "Good Match 👍"
                  : matchScore > 0
                  ? "Needs Improvement ⚠️"
                  : "Analyze Your Job Match"}
              </h3>

              <p className="mt-4 text-gray-600 leading-7">
                {matchScore >= 80
                  ? "Your resume closely matches the selected job description."
                  : matchScore >= 60
                  ? "Your resume has a good match with the selected job."
                  : matchScore > 0
                  ? "Improve your resume by adding missing skills and relevant experience."
                  : "Paste a job description above and analyze your resume."}
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

              {matchedSkills.length > 0 ? (
                matchedSkills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-medium"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-gray-500">
                  No Matched Skills Found
                </p>
              )}

            </div>
          </div>

          {/* Missing Skills */}
          <div className="bg-white rounded-2xl shadow-lg p-8">

            <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
              <XCircle className="text-red-500" />
              Missing Skills
            </h2>

            <div className="flex flex-wrap gap-3">

              {missingSkills.length > 0 ? (
                missingSkills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-red-100 text-red-700 px-4 py-2 rounded-full font-medium"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-gray-500">
                  No Missing Skills
                </p>
              )}

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

            {recommendations.length > 0 ? (
              recommendations.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center bg-slate-50 rounded-xl p-5 hover:bg-blue-50 transition"
                >
                  <p>{item}</p>

                  <ArrowRight className="text-blue-600" />
                </div>
              ))
            ) : (
              <p className="text-gray-500">
                No Recommendations Available
              </p>
            )}

          </div>
        </div>

      </div>
    </main>
  );
}