"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Logo from "@/components/shared/Logo"
import { Eye, EyeOff, Lock, Mail, User, ArrowRight } from "lucide-react"

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // 1. Password mismatch validation
    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.")
      return
    }

    setLoading(true)

    try {
      // 2. Submit to registration API
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "An error occurred during registration.")
        setLoading(false)
        return
      }

      // 3. Auto-login on success
      const loginRes = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (loginRes?.error) {
        // Fallback to manual login redirect if auto-login somehow fails
        router.push("/login?registered=true")
      } else {
        router.push("/dashboard")
        router.refresh()
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen w-full bg-gradient-to-tr from-teal-50/40 via-slate-50 to-teal-50/30 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorative Blur Spheres */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-teal-200/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-sky-200/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo and Header Header */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="mb-4 transform hover:scale-105 transition-transform duration-300">
            <Logo size="md" showWordmark={false} />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-1.5 font-sans">
            Create Account
          </h1>
          <p className="text-slate-500 text-sm font-medium">
            Sign up to get started with your GP Edge trial
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/80 backdrop-blur-md border border-slate-200/60 shadow-xl rounded-3xl p-8 transition-all duration-300">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50/80 border border-red-200/60 text-red-700 text-sm rounded-xl p-3.5 flex items-start gap-2.5 animate-fadeIn">
                <span className="font-semibold text-red-800">Error:</span>
                <span>{error}</span>
              </div>
            )}

            {/* Name Input */}
            <div className="space-y-1">
              <label htmlFor="name" className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User size={18} />
                </div>
                <input
                  id="name"
                  type="text"
                  required
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 focus:bg-white"
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="space-y-1">
              <label htmlFor="email" className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail size={18} />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 focus:bg-white"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1">
              <label htmlFor="password" className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock size={18} />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-11 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 focus:bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password Input */}
            <div className="space-y-1">
              <label htmlFor="confirmPassword" className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock size={18} />
                </div>
                <input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 focus:bg-white"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-teal-600/70 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-teal-600/10 hover:shadow-teal-600/25 transition-all duration-200 flex items-center justify-center gap-2 group hover:-translate-y-0.5 mt-2"
            >
              {loading ? (
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Create Account
                  <ArrowRight size={16} className="transform group-hover:translate-x-0.5 transition-transform duration-200" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200/80"></div>
            </div>
            <span className="relative px-3 bg-white text-xs font-semibold text-slate-400 uppercase tracking-wider bg-white">
              or
            </span>
          </div>

          {/* Login Link */}
          <p className="text-center text-sm font-medium text-slate-500">
            Already have an account?{" "}
            <Link href="/login" className="text-teal-600 hover:text-teal-700 font-bold transition-colors">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
