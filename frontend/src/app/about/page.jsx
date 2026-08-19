import React from "react";
import {
  BrainCircuit,
  FileText,
  Target,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

function About() {
  return (
    <main className="bg-slate-50 min-h-screen">

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">

          <h1 className="text-5xl md:text-6xl font-bold">
            About ResumeAI
          </h1>

          <p className="mt-6 text-lg text-blue-100 max-w-3xl mx-auto">
            ResumeAI is an AI-powered Resume Analyzer built using
            Natural Language Processing (NLP) to help students,
            freshers, and professionals create ATS-friendly resumes
            and improve their chances of getting shortlisted.
          </p>

        </div>
      </section>

      {/* About Section */}

      <section className="max-w-7xl mx-auto px-6 py-20">

        <div className="grid lg:grid-cols-2 gap-12 items-center">

          <div>

            <h2 className="text-4xl font-bold text-slate-800 mb-6">
              Our Mission
            </h2>

            <p className="text-gray-600 leading-8 mb-5">
              ResumeAI combines Artificial Intelligence and Natural
              Language Processing to evaluate resumes, identify
              strengths and weaknesses, calculate ATS compatibility,
              and provide personalized recommendations for career
              growth.
            </p>

            <p className="text-gray-600 leading-8">
              Our goal is to simplify resume building by giving users
              smart insights that help them create professional,
              recruiter-friendly resumes.
            </p>

          </div>

          <div>
            <img
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800"
              alt="About"
              className="rounded-3xl shadow-xl"
            />
          </div>

        </div>

      </section>

      {/* Features */}

      <section className="bg-white py-20">

        <div className="max-w-7xl mx-auto px-6">

          <div className="text-center mb-14">

            <h2 className="text-4xl font-bold text-slate-800">
              Why Choose ResumeAI?
            </h2>

            <p className="mt-4 text-gray-500">
              Powerful AI features designed to make your resume stand out.
            </p>

          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

            <div className="bg-slate-50 rounded-2xl p-8 shadow hover:shadow-xl transition">

              <BrainCircuit
                className="text-blue-600 mb-5"
                size={45}
              />

              <h3 className="text-2xl font-semibold">
                AI Analysis
              </h3>

              <p className="mt-4 text-gray-600 leading-7">
                Analyze resumes using NLP techniques to identify skills,
                projects, certifications, and important keywords.
              </p>

            </div>

            <div className="bg-slate-50 rounded-2xl p-8 shadow hover:shadow-xl transition">

              <Target
                className="text-green-600 mb-5"
                size={45}
              />

              <h3 className="text-2xl font-semibold">
                ATS Score
              </h3>

              <p className="mt-4 text-gray-600 leading-7">
                Measure how well your resume performs with Applicant
                Tracking Systems used by recruiters.
              </p>

            </div>

            <div className="bg-slate-50 rounded-2xl p-8 shadow hover:shadow-xl transition">

              <FileText
                className="text-purple-600 mb-5"
                size={45}
              />

              <h3 className="text-2xl font-semibold">
                Resume Parsing
              </h3>

              <p className="mt-4 text-gray-600 leading-7">
                Automatically extract education, experience, projects,
                certifications, and skills.
              </p>

            </div>

            <div className="bg-slate-50 rounded-2xl p-8 shadow hover:shadow-xl transition">

              <Sparkles
                className="text-yellow-500 mb-5"
                size={45}
              />

              <h3 className="text-2xl font-semibold">
                Smart Suggestions
              </h3>

              <p className="mt-4 text-gray-600 leading-7">
                Receive personalized recommendations to improve your
                resume and increase interview opportunities.
              </p>

            </div>

            <div className="bg-slate-50 rounded-2xl p-8 shadow hover:shadow-xl transition">

              <ShieldCheck
                className="text-red-500 mb-5"
                size={45}
              />

              <h3 className="text-2xl font-semibold">
                Secure Processing
              </h3>

              <p className="mt-4 text-gray-600 leading-7">
                Your uploaded resume is processed securely with a strong
                focus on privacy and data protection.
              </p>

            </div>

            <div className="bg-slate-50 rounded-2xl p-8 shadow hover:shadow-xl transition">

              <Users
                className="text-indigo-600 mb-5"
                size={45}
              />

              <h3 className="text-2xl font-semibold">
                Career Support
              </h3>

              <p className="mt-4 text-gray-600 leading-7">
                Whether you're a student, fresher, or experienced
                professional, ResumeAI helps you improve your career profile.
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* Stats */}

      <section className="py-20">

        <div className="max-w-6xl mx-auto px-6">

          <div className="grid md:grid-cols-4 gap-8 text-center">

            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-5xl font-bold text-blue-600">
                95%
              </h2>
              <p className="mt-3 text-gray-600">
                Parsing Accuracy
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-5xl font-bold text-green-600">
                AI
              </h2>
              <p className="mt-3 text-gray-600">
                NLP Powered
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-5xl font-bold text-purple-600">
                ATS
              </h2>
              <p className="mt-3 text-gray-600">
                Resume Scoring
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-5xl font-bold text-red-500">
                24×7
              </h2>
              <p className="mt-3 text-gray-600">
                AI Assistance
              </p>
            </div>

          </div>

        </div>

      </section>

    </main>
  );
}

export default About;