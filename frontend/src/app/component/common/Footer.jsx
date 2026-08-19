import Link from "next/link";
import {
  FileText,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-gray-300 mt-auto">

      <div className="max-w-7xl mx-auto px-6 py-14 grid md:grid-cols-4 gap-10">

        {/* Logo */}
        <div>
          <div className="flex items-center gap-2 mb-4">

            <div className="bg-blue-600 p-2 rounded-lg text-white">
              <FileText size={22} />
            </div>

            <h2 className="text-2xl font-bold text-white">
              ResumeAI
            </h2>

          </div>

          <p className="text-gray-400 leading-7">
            AI-powered Resume Analyzer that helps students and professionals
            improve resumes using NLP and ATS analysis.
          </p>
        </div>

        {/* Quick Links */}
        <div>

          <h3 className="text-white font-semibold mb-5">
            Quick Links
          </h3>

          <div className="space-y-3">

            <Link href="/" className="block hover:text-blue-400">
              Home
            </Link>

            <Link href="/features" className="block hover:text-blue-400">
              Features
            </Link>

            <Link href="/about" className="block hover:text-blue-400">
              About
            </Link>

            <Link href="/contact" className="block hover:text-blue-400">
              Contact
            </Link>

          </div>

        </div>

        {/* Resources */}

        <div>

          <h3 className="text-white font-semibold mb-5">
            Resources
          </h3>

          <div className="space-y-3">

            <Link href="#" className="block hover:text-blue-400">
              Privacy Policy
            </Link>

            <Link href="#" className="block hover:text-blue-400">
              Terms & Conditions
            </Link>

            <Link href="#" className="block hover:text-blue-400">
              Help Center
            </Link>

            <Link href="#" className="block hover:text-blue-400">
              FAQ
            </Link>

          </div>

        </div>

        {/* Contact */}

        <div>

          <h3 className="text-white font-semibold mb-5">
            Contact
          </h3>

          <div className="space-y-4">

            <div className="flex gap-3 items-center">
              <Mail size={18} />
              support@resumeai.com
            </div>

            <div className="flex gap-3 items-center">
              <Phone size={18} />
              +91 9876543210
            </div>

            <div className="flex gap-3 items-center">
              <MapPin size={18} />
              India
            </div>

          </div>

        </div>

      </div>

      <div className="border-t border-slate-700 py-5 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} ResumeAI. All Rights Reserved.
      </div>

    </footer>
  );
}