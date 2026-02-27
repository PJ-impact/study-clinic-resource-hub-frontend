'use client';

import { useActionState, useState } from "react"
import { motion, Variants } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff, Chrome, Mail, Lock, ChevronRight, AlertCircle } from "lucide-react"
import { authenticate } from "@/actions/auth"
import { DEPARTMENTS } from "@/lib/constants"

export function StudentLoginPanel() {
  const [errorMessage, formAction, isPending] = useActionState(authenticate, undefined)
  const [showPassword, setShowPassword] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)
  
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [department, setDepartment] = useState("")

  const departments = DEPARTMENTS

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  }

  return (
    <div className="hidden md:flex md:items-center md:justify-center px-6 py-12 md:px-8 bg-gradient-to-br from-slate-50/80 via-indigo-50/40 to-slate-50/80 backdrop-blur-sm">
      <motion.div className="w-full max-w-sm" variants={containerVariants} initial="hidden" animate="visible">
        {/* Header */}
        <motion.div className="mb-8" variants={itemVariants}>
          <motion.h1
            className="font-jakarta text-3xl font-bold tracking-tight text-slate-900 mb-2"
            variants={itemVariants}
          >
            Student Portal
          </motion.h1>
          <motion.p className="font-jakarta text-slate-600 text-sm leading-relaxed" variants={itemVariants}>
            Access your academic resources, growth materials, and personalized study hub.
          </motion.p>
        </motion.div>

        {/* Form */}
        <form action={formAction} className="space-y-4">
          {/* University Email Field */}
          <motion.div variants={itemVariants}>
            <label className="font-jakarta block text-xs font-semibold uppercase text-slate-700 mb-2 tracking-wide">
              University Email
            </label>
            <div className="relative group">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500/60 w-4 h-4 group-focus-within:text-indigo-600 transition-colors duration-300" />
              <Input
                name="email"
                type="email"
                placeholder="student@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
                className={`font-jakarta pl-9 border-2 rounded-2xl bg-white/80 text-slate-900 placeholder:text-slate-400 transition-all duration-300 focus:outline-none ${
                  focusedField === "email"
                    ? "border-indigo-500 shadow-xl shadow-indigo-500/25 ring-2 ring-indigo-500/20 bg-white"
                    : "border-slate-200/80 hover:border-indigo-300/80 hover:shadow-lg hover:shadow-indigo-500/10"
                }`}
                required
              />
            </div>
          </motion.div>

          {/* Department Selection */}
          <motion.div variants={itemVariants}>
            <label className="font-jakarta block text-xs font-semibold uppercase text-slate-700 mb-2 tracking-wide">
              Department
            </label>
            <div className="relative group">
              <Chrome className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500/60 w-4 h-4 group-focus-within:text-indigo-600 transition-colors duration-300" />
              <select
                name="department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                onFocus={() => setFocusedField("department")}
                onBlur={() => setFocusedField(null)}
                className={`w-full font-jakarta pl-9 pr-4 py-2 text-sm border-2 rounded-2xl bg-white/80 text-slate-900 placeholder:text-slate-400 transition-all duration-300 focus:outline-none appearance-none cursor-pointer ${
                  focusedField === "department"
                    ? "border-indigo-500 shadow-xl shadow-indigo-500/25 ring-2 ring-indigo-500/20 bg-white"
                    : "border-slate-200/80 hover:border-indigo-300/80 hover:shadow-lg hover:shadow-indigo-500/10"
                }`}
                required
              >
                <option value="" disabled>
                  Select your department
                </option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
              <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
            </div>
          </motion.div>

          {/* Password Field */}
          <motion.div variants={itemVariants}>
            <label className="font-jakarta block text-xs font-semibold uppercase text-slate-700 mb-2 tracking-wide">
              Password
            </label>
            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500/60 w-4 h-4 group-focus-within:text-indigo-600 transition-colors duration-300" />
              <Input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField(null)}
                className={`font-jakarta pl-9 pr-10 border-2 rounded-2xl bg-white/80 text-slate-900 placeholder:text-slate-400 transition-all duration-300 focus:outline-none ${
                  focusedField === "password"
                    ? "border-indigo-500 shadow-xl shadow-indigo-500/25 ring-2 ring-indigo-500/20 bg-white"
                    : "border-slate-200/80 hover:border-indigo-300/80 hover:shadow-lg hover:shadow-indigo-500/10"
                }`}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors duration-200 focus:outline-none"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </motion.div>

          {errorMessage && (
            <div className="flex items-center space-x-2 text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
              <AlertCircle className="w-4 h-4" />
              <p>{errorMessage}</p>
            </div>
          )}

          {/* Submit Button */}
          <motion.div variants={itemVariants} className="pt-2">
            <Button
              className="w-full font-jakarta bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-6 rounded-2xl shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 transition-all duration-300 text-base"
              type="submit"
              disabled={isPending}
            >
              {isPending ? "Signing in..." : "Sign In"}
            </Button>
          </motion.div>

          <motion.div variants={itemVariants} className="text-center pt-2">
            <a href="#" className="font-jakarta text-sm text-slate-500 hover:text-indigo-600 transition-colors">
              Forgot your password?
            </a>
          </motion.div>
        </form>
      </motion.div>
    </div>
  )
}
