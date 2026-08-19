import {
  FileText,
  BrainCircuit,
  Search,
  BadgeCheck,
  Briefcase,
  Sparkles,
  BarChart3,
  ShieldCheck,
} from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "Resume Parsing",
    description:
      "Automatically extracts personal details, education, skills, certifications, and experience from uploaded resumes.",
  },
  {
    icon: BrainCircuit,
    title: "AI & NLP Analysis",
    description:
      "Uses Natural Language Processing to understand resume content and generate meaningful insights.",
  },
  {
    icon: BadgeCheck,
    title: "ATS Resume Score",
    description:
      "Checks how ATS-friendly your resume is and provides an overall resume quality score.",
  },
  {
    icon: Search,
    title: "Skill Detection",
    description:
      "Identifies technical and soft skills from your resume using intelligent keyword matching.",
  },
  {
    icon: Briefcase,
    title: "Job Matching",
    description:
      "Compare your resume with job descriptions and calculate compatibility percentage.",
  },
  {
    icon: Sparkles,
    title: "AI Suggestions",
    description:
      "Receive personalized recommendations to improve your resume and increase interview chances.",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description:
      "View resume score, ATS score, detected skills, and performance insights in one place.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Upload",
    description:
      "Uploaded resumes are processed securely with a focus on user privacy and data protection.",
  },
];

export default function Features() {
  return (
    <main className="min-h-screen bg-slate-50">

      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">

          <h1 className="text-5xl font-bold">
            Powerful Features
          </h1>

          <p className="mt-6 text-lg text-blue-100 max-w-3xl mx-auto">
            ResumeAI combines Artificial Intelligence and Natural Language
            Processing to analyze resumes, improve ATS compatibility, detect
            skills, and help candidates build stronger professional profiles.
          </p>

        </div>
      </section>

      {/* Feature Cards */}
      <section className="max-w-7xl mx-auto px-6 py-20">

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">

          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 p-8 border hover:-translate-y-2"
              >
                <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center mb-5">
                  <Icon className="text-blue-600" size={30} />
                </div>

                <h2 className="text-xl font-semibold text-slate-800">
                  {feature.title}
                </h2>

                <p className="mt-4 text-gray-600 leading-7">
                  {feature.description}
                </p>
              </div>
            );
          })}

        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-white py-20">

        <div className="max-w-6xl mx-auto px-6 text-center">

          <h2 className="text-4xl font-bold text-slate-800">
            Why Choose ResumeAI?
          </h2>

          <p className="mt-5 text-gray-600 max-w-3xl mx-auto">
            Whether you're a student, fresher, or experienced professional,
            ResumeAI helps you build resumes that are optimized for recruiters
            and Applicant Tracking Systems (ATS).
          </p>

          <div className="grid md:grid-cols-3 gap-8 mt-14">

            <div className="bg-slate-50 rounded-xl p-8 shadow">
              <h3 className="text-3xl font-bold text-blue-600">95%</h3>
              <p className="mt-3 text-gray-600">
                Accurate Resume Parsing
              </p>
            </div>

            <div className="bg-slate-50 rounded-xl p-8 shadow">
              <h3 className="text-3xl font-bold text-blue-600">AI Powered</h3>
              <p className="mt-3 text-gray-600">
                Smart NLP-based Resume Analysis
              </p>
            </div>

            <div className="bg-slate-50 rounded-xl p-8 shadow">
              <h3 className="text-3xl font-bold text-blue-600">100%</h3>
              <p className="mt-3 text-gray-600">
                Easy to Use & Responsive Interface
              </p>
            </div>

          </div>

        </div>

      </section>

      {/* CTA */}
      <section className="py-20 bg-blue-600 text-white">

        <div className="max-w-5xl mx-auto text-center px-6">

          <h2 className="text-4xl font-bold">
            Ready to Improve Your Resume?
          </h2>

          <p className="mt-5 text-blue-100 text-lg">
            Upload your resume and receive an AI-powered analysis, ATS score,
            skill insights, and personalized improvement suggestions.
          </p>

          <button className="mt-8 bg-white text-blue-600 font-semibold px-8 py-4 rounded-xl hover:bg-slate-100 transition">
            Get Started
          </button>

        </div>

      </section>

    </main>
  );
}