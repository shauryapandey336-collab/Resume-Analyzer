import { FileText, BrainCircuit, Target, ShieldCheck } from "lucide-react";

export default function About() {
  return (
    <main className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-6xl mx-auto px-6">

        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-slate-800">
            About <span className="text-blue-600">ResumeAI</span>
          </h1>

          <p className="mt-6 text-lg text-gray-600 max-w-3xl mx-auto">
            ResumeAI is an AI-powered Resume Analyzer that uses Natural Language
            Processing (NLP) to evaluate resumes, identify skills, calculate ATS
            scores, and provide intelligent suggestions for improving career
            opportunities.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <FileText className="mx-auto text-blue-600" size={45} />
            <h2 className="mt-4 text-xl font-semibold">Resume Parsing</h2>
            <p className="mt-3 text-gray-600">
              Extract important information such as skills, education,
              experience, and certifications.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <BrainCircuit className="mx-auto text-blue-600" size={45} />
            <h2 className="mt-4 text-xl font-semibold">NLP Analysis</h2>
            <p className="mt-3 text-gray-600">
              Analyze resume content using NLP techniques for accurate insights.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <Target className="mx-auto text-blue-600" size={45} />
            <h2 className="mt-4 text-xl font-semibold">ATS Score</h2>
            <p className="mt-3 text-gray-600">
              Measure resume compatibility with Applicant Tracking Systems.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <ShieldCheck className="mx-auto text-blue-600" size={45} />
            <h2 className="mt-4 text-xl font-semibold">Career Guidance</h2>
            <p className="mt-3 text-gray-600">
              Receive personalized suggestions to strengthen your resume and
              improve job readiness.
            </p>
          </div>

        </div>

      </div>
    </main>
  );
}