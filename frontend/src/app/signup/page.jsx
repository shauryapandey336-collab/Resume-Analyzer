"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User,
  Mail,
  Lock,
  UserPlus,
  Loader2,
} from "lucide-react";

import { register } from "../services/authService";

export default function Signup() {

  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e) => {

    e.preventDefault();

    setError("");

    if (password !== confirmPassword) {

      setError("Passwords do not match");

      return;

    }

    setLoading(true);

    try {

      const response = await register({

        name,

        email,

        password

      });

      if (response.data.success) {

        // Auto-login after registration
        localStorage.setItem("token", response.data.token);

        if (response.data.user) {
          localStorage.setItem("user", JSON.stringify(response.data.user));
        }

        // Dispatch auth-change event for Header
        window.dispatchEvent(new Event("auth-change"));

        router.push("/dashboard");

      } else {

        setError(response.data.message || "Registration Failed");

      }

    } catch (error) {

      setError(
        error.response?.data?.message ||
        "Registration Failed"
      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <main className="min-h-screen bg-slate-100 flex items-center justify-center px-6">

      <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg p-8">

        <div className="text-center">

          <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center">

            <UserPlus
              className="text-green-600"
              size={40}
            />

          </div>

          <h1 className="text-3xl font-bold mt-5">

            Create Account

          </h1>

          <p className="text-gray-500 mt-2">

            Join ResumeAI today

          </p>

        </div>

        {error && (
          <div className="mt-6 bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 text-center text-sm">
            {error}
          </div>
        )}

        <form
          onSubmit={handleRegister}
          className="mt-8 space-y-5"
        >

          <div className="relative">

            <User
              className="absolute left-4 top-4 text-gray-400"
              size={20}
            />

            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e)=>setName(e.target.value)}
              className="w-full border rounded-xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-green-500"
              required
            />

          </div>

          <div className="relative">

            <Mail
              className="absolute left-4 top-4 text-gray-400"
              size={20}
            />

            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              className="w-full border rounded-xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-green-500"
              required
            />

          </div>

          <div className="relative">

            <Lock
              className="absolute left-4 top-4 text-gray-400"
              size={20}
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              className="w-full border rounded-xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-green-500"
              required
            />

          </div>

          <div className="relative">

            <Lock
              className="absolute left-4 top-4 text-gray-400"
              size={20}
            />

            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e)=>setConfirmPassword(e.target.value)}
              className="w-full border rounded-xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-green-500"
              required
            />

          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2
            ${loading
              ? "bg-gray-400 cursor-not-allowed text-white"
              : "bg-green-600 hover:bg-green-700 text-white"
            }`}
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
          </button>

        </form>

        <div className="text-center mt-6">

          <p className="text-gray-500">

            Already have an account?

            <Link
              href="/login"
              className="text-green-600 ml-2 font-semibold"
            >

              Login

            </Link>

          </p>

        </div>

      </div>

    </main>

  );

}