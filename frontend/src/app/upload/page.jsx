"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  UploadCloud,
  FileText,
  Trash2,
  CheckCircle,
  Sparkles,
  Loader2,
} from "lucide-react";

import { uploadResume } from "../services/resumeService";

export default function Upload() {

  const router = useRouter();

  const [file, setFile] = useState(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const handleChange = (e) => {

    if (e.target.files.length > 0) {

      setFile(e.target.files[0]);

      setError("");

    }

  };

  const removeFile = () => {

    setFile(null);

  };

  const handleUpload = async () => {

    if (!file) {

      setError("Please select a resume.");

      return;

    }

    const token = localStorage.getItem("token");

    if (!token) {

      setError("Please login first.");

      router.push("/login");

      return;

    }

    try {

      setLoading(true);

      setError("");

      const formData = new FormData();

      formData.append("resume", file);

      const response = await uploadResume(formData);

      if (response.data.success) {

        // Backend returns resumeId (camelCase)
        const resumeId = response.data.data.resumeId;

        if (resumeId) {
          localStorage.setItem("resumeId", resumeId);
        }

        alert("Resume Uploaded & Analyzed Successfully!");

        router.push("/dashboard");

      } else {

        setError(response.data.message || "Upload Failed");

      }

    } catch (error) {

      console.error("Upload error:", error);

      setError(
        error.response?.data?.message ||
        "Upload Failed. Please try again."
      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <main className="min-h-screen bg-slate-50">

      {/* Hero Section */}

      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">

        <div className="max-w-7xl mx-auto px-6 text-center">

          <UploadCloud
            size={60}
            className="mx-auto mb-6"
          />

          <h1 className="text-5xl font-bold">

            Upload Your Resume

          </h1>

          <p className="mt-5 text-blue-100 text-lg max-w-3xl mx-auto">

            Upload your resume and let AI analyze your skills,
            ATS compatibility, projects, education,
            experience and provide smart suggestions.

          </p>

        </div>

      </section>

      {/* Upload Section */}

      <section className="max-w-6xl mx-auto px-6 py-16">

        <div className="bg-white rounded-3xl shadow-xl p-10">

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 text-center">
              {error}
            </div>
          )}

          <div className="border-2 border-dashed border-blue-300 rounded-3xl p-16 text-center hover:border-blue-600 transition">

            <UploadCloud
              size={70}
              className="mx-auto text-blue-600"
            />

            <h2 className="text-3xl font-bold mt-6">

              Drag & Drop Resume

            </h2>

            <p className="mt-3 text-gray-500">

              Upload PDF or DOCX (Max 16 MB)

            </p>

            <input
              type="file"
              id="resume"
              accept=".pdf,.doc,.docx"
              onChange={handleChange}
              className="hidden"
            />

            <label
              htmlFor="resume"
              className="inline-block mt-8 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl cursor-pointer transition"
            >

              Browse Resume

            </label>

          </div>

          {/* Selected File */}

          {file && (

            <div className="mt-10 bg-slate-100 rounded-2xl p-6 flex justify-between items-center">

              <div className="flex items-center gap-4">

                <FileText
                  className="text-blue-600"
                  size={40}
                />

                <div>

                  <h3 className="font-semibold">

                    {file.name}

                  </h3>

                  <p className="text-gray-500">

                    {(file.size / 1024).toFixed(2)} KB

                  </p>

                </div>

              </div>

              <button
                onClick={removeFile}
                className="text-red-500 hover:text-red-700"
              >

                <Trash2 size={28}/>

              </button>

            </div>

          )}

          {/* Analyze Resume */}

          <div className="text-center mt-10">

            <button

              onClick={handleUpload}

              disabled={loading}

              className={`px-10 py-4 rounded-xl text-lg font-semibold text-white transition flex items-center justify-center gap-2 mx-auto

              ${loading

                ? "bg-gray-400 cursor-not-allowed"

                : "bg-green-600 hover:bg-green-700"

              }`}

            >

              {

                loading

                ?

                (
                  <>
                    <Loader2 size={22} className="animate-spin" />
                    Analyzing Resume...
                  </>
                )

                :

                "Analyze Resume"

              }

            </button>

          </div>

        </div>

      </section>

      {/* Features Section */}

      <section className="max-w-7xl mx-auto px-6 pb-20">

        <h2 className="text-4xl font-bold text-center mb-14">

          What We Analyze

        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

          <div className="bg-white rounded-2xl shadow-lg p-8">

            <Sparkles
              className="text-blue-600 mb-4"
              size={40}
            />

            <h3 className="font-bold text-xl">

              ATS Score

            </h3>

            <p className="text-gray-500 mt-3">

              Check resume compatibility with Applicant Tracking Systems.

            </p>

          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">

            <CheckCircle
              className="text-green-600 mb-4"
              size={40}
            />

            <h3 className="font-bold text-xl">

              Skills Detection

            </h3>

            <p className="text-gray-500 mt-3">

              Detect technical and soft skills automatically.

            </p>

          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">

            <FileText
              className="text-purple-600 mb-4"
              size={40}
            />

            <h3 className="font-bold text-xl">

              Resume Parsing

            </h3>

            <p className="text-gray-500 mt-3">

              Extract education, projects, certifications,
              experience and contact information automatically.

            </p>

          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">

            <UploadCloud
              className="text-red-500 mb-4"
              size={40}
            />

            <h3 className="font-bold text-xl">

              AI Suggestions

            </h3>

            <p className="text-gray-500 mt-3">

              Receive personalized AI recommendations to improve
              your resume and increase your ATS score.

            </p>

          </div>

        </div>

      </section>

    </main>

  );

}