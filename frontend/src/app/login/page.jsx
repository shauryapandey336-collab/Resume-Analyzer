"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, LogIn, Loader2 } from "lucide-react";

import { login } from "../services/authService";

export default function Login() {

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {

    e.preventDefault();

    setError("");
    setLoading(true);

    try {

      const response = await login({

        email,

        password

      });

      if (response.data.success) {

        localStorage.setItem(
          "token",
          response.data.token
        );

        // Store user data
        if (response.data.user) {
          localStorage.setItem(
            "user",
            JSON.stringify(response.data.user)
          );
        }

        // Dispatch auth-change event for Header
        window.dispatchEvent(new Event("auth-change"));

        router.push("/dashboard");

      } else {

        setError(response.data.message || "Login Failed");

      }

    } catch (error) {

      setError(
        error.response?.data?.message || "Login Failed"
      );

    } finally {

      setLoading(false);

    }

  };

  return (
    <main className="min-h-screen bg-slate-100 flex items-center justify-center px-6">

      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-8">

        <div className="text-center">

          <div className="w-20 h-20 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
            <LogIn className="text-blue-600" size={40}/>
          </div>

          <h1 className="text-3xl font-bold mt-5">
            Welcome Back
          </h1>

          <p className="text-gray-500 mt-2">
            Login to ResumeAI
          </p>

        </div>

        {error && (
          <div className="mt-6 bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 text-center text-sm">
            {error}
          </div>
        )}

        <form
          onSubmit={handleLogin}
          className="mt-8 space-y-5"
        >

          <div className="relative">

            <Mail
              className="absolute left-4 top-4 text-gray-400"
              size={20}
            />

            <input
              type="email"
              placeholder="Email Address"
              className="w-full border rounded-xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
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
              className="w-full border rounded-xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              required
            />

          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2
            ${loading
              ? "bg-gray-400 cursor-not-allowed text-white"
              : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>

        </form>

        <div className="text-center mt-6">

          <p className="text-gray-500">

            Don&apos;t have an account?

            <Link
              href="/signup"
              className="text-blue-600 ml-2 font-semibold"
            >
              Sign Up
            </Link>

          </p>

        </div>

      </div>

    </main>
  );
}