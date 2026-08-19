"use client";

import React, { useEffect, useState } from "react";
import {
  BadgeCheck,
  CheckCircle,
  XCircle,
  AlertTriangle,
  FileText,
} from "lucide-react";

import { ats } from "../../services/resumeService";

export default function ATS() {

  const [loading, setLoading] = useState(true);

  const [atsData, setAtsData] = useState({
    score: 0,
    passed: [],
    failed: [],
    suggestions: [],
  });

  useEffect(() => {
    loadATS();
  }, []);

  const loadATS = async () => {

    try {

      const resumeId = localStorage.getItem("resumeId");

      if (!resumeId) {
        alert("Please upload a resume first.");
        setLoading(false);
        return;
      }

      const res = await ats(resumeId);

      console.log("ATS Response:", res.data);

      if (!res.data.success) {
        alert(res.data.message);
        return;
      }

     const atsScore = res.data.data.atsScore;

      setAtsData({
        score: atsScore.score || 0,
        passed: atsScore.passed || [],
        failed: atsScore.failed || [],
        suggestions: atsScore.suggestions || [],
      });

    } catch (error) {

      console.error(error);

      alert("Unable to load ATS Score.");

    } finally {

      setLoading(false);

    }

  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <h1 className="text-3xl font-bold">
          Loading ATS...
        </h1>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 py-10">

      <div className="max-w-6xl mx-auto px-6">

        <div className="text-center mb-12">

          <BadgeCheck
            size={60}
            className="mx-auto text-blue-600"
          />

          <h1 className="text-4xl font-bold mt-5">
            ATS Score
          </h1>

          <h2 className="text-6xl font-bold text-blue-600 mt-8">
            {atsData.score}%
          </h2>

        </div>

        <div className="grid md:grid-cols-3 gap-6">

          {/* Passed */}

          <div className="bg-white rounded-xl shadow p-6">

            <h2 className="text-xl font-bold flex gap-2 items-center mb-5">
              <CheckCircle className="text-green-600"/>
              Passed
            </h2>

            {
              atsData.passed.length > 0
                ? atsData.passed.map((item, index) => (
                    <p
                      key={index}
                      className="flex gap-2 items-center py-2"
                    >
                      <CheckCircle
                        size={16}
                        className="text-green-600"
                      />
                      {item}
                    </p>
                  ))
                : <p>No Passed Checks</p>
            }

          </div>

          {/* Failed */}

          <div className="bg-white rounded-xl shadow p-6">

            <h2 className="text-xl font-bold flex gap-2 items-center mb-5">
              <XCircle className="text-red-600"/>
              Failed
            </h2>

            {
              atsData.failed.length > 0
                ? atsData.failed.map((item, index) => (
                    <p
                      key={index}
                      className="flex gap-2 items-center py-2"
                    >
                      <XCircle
                        size={16}
                        className="text-red-600"
                      />
                      {item}
                    </p>
                  ))
                : <p>No Failed Checks</p>
            }

          </div>

          {/* Suggestions */}

          <div className="bg-white rounded-xl shadow p-6">

            <h2 className="text-xl font-bold flex gap-2 items-center mb-5">
              <AlertTriangle className="text-yellow-500"/>
              Suggestions
            </h2>

            {
              atsData.suggestions.length > 0
                ? atsData.suggestions.map((item, index) => (
                    <p
                      key={index}
                      className="flex gap-2 items-center py-2"
                    >
                      <FileText
                        size={16}
                        className="text-blue-600"
                      />
                      {item}
                    </p>
                  ))
                : <p>No Suggestions</p>
            }

          </div>

        </div>

      </div>

    </main>
  );
}