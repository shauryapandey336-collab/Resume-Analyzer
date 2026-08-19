import React from "react";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";

function Contact() {
  return (
    <main className="bg-slate-50 min-h-screen">

      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 py-20 text-white">
        <div className="max-w-7xl mx-auto px-6 text-center">

          <h1 className="text-5xl font-bold">
            Contact Us
          </h1>

          <p className="mt-6 text-lg text-blue-100 max-w-2xl mx-auto">
            Have questions about ResumeAI? We'd love to hear from you.
            Reach out to our team and we'll get back to you as soon as possible.
          </p>

        </div>
      </section>

      {/* Content */}

      <section className="max-w-7xl mx-auto px-6 py-16">

        <div className="grid lg:grid-cols-2 gap-10">

          {/* Contact Form */}

          <div className="bg-white rounded-2xl shadow-lg p-8">

            <h2 className="text-3xl font-bold text-slate-800">
              Send a Message
            </h2>

            <p className="text-gray-500 mt-2 mb-8">
              Fill out the form below and we'll respond shortly.
            </p>

            <form className="space-y-5">

              <input
                type="text"
                placeholder="Full Name"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="email"
                placeholder="Email Address"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="text"
                placeholder="Subject"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <textarea
                rows="6"
                placeholder="Write your message..."
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 transition text-white py-3 rounded-xl flex justify-center items-center gap-2"
              >
                <Send size={18} />
                Send Message
              </button>

            </form>

          </div>

          {/* Contact Details */}

          <div className="space-y-6">

            <div className="bg-white rounded-2xl shadow-lg p-6 flex gap-5 items-center">

              <div className="bg-blue-100 p-4 rounded-xl">
                <Mail className="text-blue-600" />
              </div>

              <div>
                <h3 className="font-semibold text-xl">Email</h3>
                <p className="text-gray-500">
                  support@resumeai.com
                </p>
              </div>

            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 flex gap-5 items-center">

              <div className="bg-green-100 p-4 rounded-xl">
                <Phone className="text-green-600" />
              </div>

              <div>
                <h3 className="font-semibold text-xl">Phone</h3>
                <p className="text-gray-500">
                  +91 98765 43210
                </p>
              </div>

            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 flex gap-5 items-center">

              <div className="bg-red-100 p-4 rounded-xl">
                <MapPin className="text-red-500" />
              </div>

              <div>
                <h3 className="font-semibold text-xl">Location</h3>
                <p className="text-gray-500">
                  Gwalior, Madhya Pradesh, India
                </p>
              </div>

            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 flex gap-5 items-center">

              <div className="bg-yellow-100 p-4 rounded-xl">
                <Clock className="text-yellow-600" />
              </div>

              <div>
                <h3 className="font-semibold text-xl">Working Hours</h3>
                <p className="text-gray-500">
                  Monday - Friday
                </p>

                <p className="text-gray-500">
                  9:00 AM - 6:00 PM
                </p>
              </div>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}

export default Contact;