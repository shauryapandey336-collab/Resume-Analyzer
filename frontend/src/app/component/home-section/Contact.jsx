import {
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

export default function Contact() {
  return (
    <main className="bg-slate-50 min-h-screen py-16">

      <div className="max-w-6xl mx-auto px-6">

        <div className="text-center mb-12">

          <h1 className="text-5xl font-bold text-slate-800">
            Contact Us
          </h1>

          <p className="mt-4 text-lg text-gray-600">
            We'd love to hear from you. Feel free to reach out anytime.
          </p>

        </div>

        <div className="grid lg:grid-cols-2 gap-10">

          {/* Contact Form */}

          <div className="bg-white rounded-xl shadow-md p-8">

            <h2 className="text-2xl font-bold mb-6">
              Send a Message
            </h2>

            <form className="space-y-5">

              <input
                type="text"
                placeholder="Your Name"
                className="w-full border rounded-lg p-3 outline-none focus:border-blue-600"
              />

              <input
                type="email"
                placeholder="Your Email"
                className="w-full border rounded-lg p-3 outline-none focus:border-blue-600"
              />

              <input
                type="text"
                placeholder="Subject"
                className="w-full border rounded-lg p-3 outline-none focus:border-blue-600"
              />

              <textarea
                rows="5"
                placeholder="Your Message"
                className="w-full border rounded-lg p-3 outline-none focus:border-blue-600"
              ></textarea>

              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition"
              >
                Send Message
              </button>

            </form>

          </div>

          {/* Contact Details */}

          <div className="bg-white rounded-xl shadow-md p-8">

            <h2 className="text-2xl font-bold mb-6">
              Contact Information
            </h2>

            <div className="space-y-8">

              <div className="flex items-center gap-4">
                <Mail className="text-blue-600" size={28} />
                <div>
                  <h3 className="font-semibold">Email</h3>
                  <p className="text-gray-600">
                    support@resumeai.com
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Phone className="text-blue-600" size={28} />
                <div>
                  <h3 className="font-semibold">Phone</h3>
                  <p className="text-gray-600">
                    +91 9876543210
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <MapPin className="text-blue-600" size={28} />
                <div>
                  <h3 className="font-semibold">Location</h3>
                  <p className="text-gray-600">
                    Gwalior, Madhya Pradesh, India
                  </p>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>

    </main>
  );
}