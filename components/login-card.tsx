"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Eye, EyeOff, Chrome } from "lucide-react"
import { DEPARTMENTS } from "@/lib/constants"

interface LoginCardProps {
  mode: "student" | "contributor"
  setMode: (mode: "student" | "contributor") => void
}

export function LoginCard({ mode, setMode }: LoginCardProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [department, setDepartment] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate login
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  const isStudent = mode === "student"

  const departments = DEPARTMENTS

  return (
    <div className="w-full max-w-md">
      {/* Mode toggle */}
      <div className="mb-8 flex gap-2 bg-white/10 backdrop-blur-md rounded-lg p-1 border border-white/20">
        <button
          onClick={() => setMode("student")}
          className={`flex-1 py-2.5 px-4 rounded-md font-medium text-sm transition-all duration-300 ${
            isStudent ? "bg-sky-500 text-white shadow-lg shadow-sky-500/50" : "text-white/70 hover:text-white/90"
          }`}
        >
          Student Access
        </button>
        <button
          onClick={() => setMode("contributor")}
          className={`flex-1 py-2.5 px-4 rounded-md font-medium text-sm transition-all duration-300 ${
            !isStudent ? "bg-purple-600 text-white shadow-lg shadow-purple-600/50" : "text-white/70 hover:text-white/90"
          }`}
        >
          Contributor Portal
        </button>
      </div>

      {/* Login card */}
      <Card
        className={`p-8 backdrop-blur-xl border transition-all duration-500 ${
          isStudent
            ? "bg-sky-50/90 border-sky-200 shadow-2xl shadow-sky-500/20"
            : "bg-purple-50/90 border-purple-200 shadow-2xl shadow-purple-600/20"
        }`}
      >
        {/* Header */}
        <div className="mb-6">
          <h1
            className={`text-2xl font-bold mb-2 transition-colors duration-500 ${
              isStudent ? "text-sky-900" : "text-purple-900"
            }`}
          >
            {isStudent ? "Enter Study Hub" : "Manage Resources"}
          </h1>
          <p className={`text-sm transition-colors duration-500 ${isStudent ? "text-sky-700" : "text-purple-700"}`}>
            {isStudent
              ? "Access your academic resources and growth materials"
              : "Upload and manage resources for the community"}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email/ID Field */}
          <div>
            <label
              className={`block text-sm font-medium mb-2 transition-colors duration-500 ${
                isStudent ? "text-sky-900" : "text-purple-900"
              }`}
            >
              {isStudent ? "University ID" : "Faculty Email"}
            </label>
            <Input
              type={isStudent ? "text" : "email"}
              placeholder={isStudent ? "e.g., STU123456" : "faculty@university.edu"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`transition-all duration-500 ${
                isStudent
                  ? "border-sky-200 focus:border-sky-500 focus:ring-sky-500/20"
                  : "border-purple-200 focus:border-purple-600 focus:ring-purple-600/20"
              }`}
              required
            />
          </div>

          {isStudent && (
            <div>
              <label className="block text-sm font-medium mb-2 text-sky-900">Department</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2 border border-sky-200 rounded-md bg-white text-sky-900 text-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-all duration-500"
                required
              >
                <option value="">Select your department</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Password/Access Key Field */}
          <div>
            <label
              className={`block text-sm font-medium mb-2 transition-colors duration-500 ${
                isStudent ? "text-sky-900" : "text-purple-900"
              }`}
            >
              {isStudent ? "Password" : "Access Key"}
            </label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder={isStudent ? "Enter password" : "Enter access key"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`pr-10 transition-all duration-500 ${
                  isStudent
                    ? "border-sky-200 focus:border-sky-500 focus:ring-sky-500/20"
                    : "border-purple-200 focus:border-purple-600 focus:ring-purple-600/20"
                }`}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors duration-500 ${
                  isStudent ? "text-sky-600 hover:text-sky-700" : "text-purple-600 hover:text-purple-700"
                }`}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Forgot Password */}
          {isStudent && (
            <div className="text-right">
              <a
                href="#"
                className="text-sm text-sky-600 hover:text-sky-700 font-medium transition-colors duration-300"
              >
                Forgot Password?
              </a>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className={`w-full font-semibold py-2.5 transition-all duration-500 ${
              isStudent
                ? "bg-sky-500 hover:bg-sky-600 text-white shadow-lg shadow-sky-500/40"
                : "bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-600/40"
            }`}
          >
            {isLoading ? "Loading..." : isStudent ? "Enter Study Hub" : "Manage Resources"}
          </Button>
        </form>

        {isStudent && (
          <>
            <div className="mt-6 flex items-center gap-4">
              <div className="flex-1 h-px bg-sky-200"></div>
              <p className="text-xs text-sky-600 font-medium">OR</p>
              <div className="flex-1 h-px bg-sky-200"></div>
            </div>

            <button className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2.5 border border-sky-200 rounded-md bg-white hover:bg-sky-50 transition-all duration-300 text-sky-900 font-medium text-sm">
              <Chrome size={18} />
              Sign in with University Google
            </button>
          </>
        )}

        {/* Footer Links */}
        <div className="mt-6 pt-6 border-t border-current/10">
          {isStudent ? (
            <p
              className={`text-center text-sm transition-colors duration-500 ${
                isStudent ? "text-sky-700" : "text-purple-700"
              }`}
            >
              Want to contribute?{" "}
              <a
                href="#"
                className={`font-semibold ${isStudent ? "text-sky-600 hover:text-sky-700" : ""} transition-colors duration-300`}
              >
                Request Contributor Access
              </a>
            </p>
          ) : (
            <p
              className={`text-center text-sm transition-colors duration-500 ${
                !isStudent ? "text-purple-700" : "text-purple-700"
              }`}
            >
              Don't have access yet?{" "}
              <a
                href="#"
                className="font-semibold text-purple-600 hover:text-purple-700 transition-colors duration-300"
              >
                Contact Administrator
              </a>
            </p>
          )}
        </div>
      </Card>

      {/* Logo or branding */}
      <div className="mt-8 text-center">
        <p className="text-white/70 text-sm font-medium">Resource Hub</p>
      </div>
    </div>
  )
}
