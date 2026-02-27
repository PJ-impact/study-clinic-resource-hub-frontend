'use client';

import { useActionState, useState } from "react"
import { motion, Variants } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff, Mail, Lock, Key, Info, AlertCircle } from "lucide-react"
import { authenticate } from "@/actions/auth"

export function ContributorLoginPanel() {
  const [errorMessage, formAction, isPending] = useActionState(authenticate, undefined)
  const [showPassword, setShowPassword] = useState(false)
  const [showAccessKey, setShowAccessKey] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [accessKey, setAccessKey] = useState("")
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [showTooltip, setShowTooltip] = useState(false)

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
    <div className="flex items-center justify-center px-6 py-12 md:px-8 bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900 md:border-l border-purple-500/20">
      <motion.div className="w-full max-w-sm" variants={containerVariants} initial="hidden" animate="visible">
        {/* Header */}
        <motion.div className="mb-8" variants={itemVariants}>
          <motion.h1 className="font-jakarta text-3xl font-bold tracking-tight text-white mb-2" variants={itemVariants}>
            Contributor Portal
          </motion.h1>
          <motion.p className="font-jakarta text-purple-200/80 text-sm leading-relaxed" variants={itemVariants}>
            Upload, organize, and manage your academic resources for the community.
          </motion.p>
        </motion.div>

        {/* Form */}
        <form action={formAction} className="space-y-4">
          {/* Faculty Email Field */}
          <motion.div variants={itemVariants}>
            <label className="font-jakarta block text-xs font-semibold uppercase text-purple-200/90 mb-2 tracking-wide">
              Faculty Email
            </label>
            <div className="relative group">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400/60 w-4 h-4 group-focus-within:text-purple-300 transition-colors duration-300" />
              <Input
                name="email"
                type="email"
                placeholder="faculty@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
                className={`font-jakarta pl-9 border-2 rounded-2xl bg-white/10 text-white placeholder:text-purple-300/50 transition-all duration-300 focus:outline-none backdrop-blur-sm ${
                  focusedField === "email"
                    ? "border-purple-400 shadow-xl shadow-purple-500/30 ring-2 ring-purple-500/30 bg-white/15"
                    : "border-purple-400/30 hover:border-purple-400/60 hover:shadow-lg hover:shadow-purple-500/20"
                }`}
                required
              />
            </div>
          </motion.div>

          {/* Password Field */}
          <motion.div variants={itemVariants}>
            <label className="font-jakarta block text-xs font-semibold uppercase text-purple-200/90 mb-2 tracking-wide">
              Password
            </label>
            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400/60 w-4 h-4 group-focus-within:text-purple-300 transition-colors duration-300" />
              <Input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField(null)}
                className={`font-jakarta pl-9 pr-10 border-2 rounded-2xl bg-white/10 text-white placeholder:text-purple-300/50 transition-all duration-300 focus:outline-none backdrop-blur-sm ${
                  focusedField === "password"
                    ? "border-purple-400 shadow-xl shadow-purple-500/30 ring-2 ring-purple-500/30 bg-white/15"
                    : "border-purple-400/30 hover:border-purple-400/60 hover:shadow-lg hover:shadow-purple-500/20"
                }`}
                required
              />
              <motion.button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-300 hover:text-purple-100 transition-colors duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </motion.button>
            </div>
          </motion.div>

          {/* Access Key Field with Tooltip */}
          <motion.div variants={itemVariants}>
            <div className="flex items-center gap-2 mb-2">
              <label className="font-jakarta block text-xs font-semibold uppercase text-purple-200/90 tracking-wide">
                Access Key
              </label>
              <div className="relative">
                <motion.button
                  type="button"
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                  className="text-purple-400 hover:text-purple-300 transition-colors"
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Info size={16} />
                </motion.button>
                <motion.div
                  className={`absolute left-0 bottom-full mb-2 bg-purple-950/95 border border-purple-400/40 rounded-xl px-3 py-2 text-xs text-purple-100 whitespace-nowrap backdrop-blur-lg shadow-2xl shadow-purple-900/50 z-50 ${
                    showTooltip ? "pointer-events-auto" : "pointer-events-none"
                  }`}
                  initial={{ opacity: 0, y: 4 }}
                  animate={showTooltip ? { opacity: 1, y: 0 } : { opacity: 0, y: 4 }}
                  transition={{ duration: 0.2 }}
                >
                  Provided by your admin
                </motion.div>
              </div>
            </div>
            <div className="relative group">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400/60 w-4 h-4 group-focus-within:text-purple-300 transition-colors duration-300" />
              <Input
                name="accessKey"
                type={showAccessKey ? "text" : "password"}
                placeholder="Enter your access key"
                value={accessKey}
                onChange={(e) => setAccessKey(e.target.value)}
                onFocus={() => setFocusedField("accessKey")}
                onBlur={() => setFocusedField(null)}
                className={`font-jakarta pl-9 pr-10 border-2 rounded-2xl bg-white/10 text-white placeholder:text-purple-300/50 transition-all duration-300 focus:outline-none backdrop-blur-sm ${
                  focusedField === "accessKey"
                    ? "border-purple-400 shadow-xl shadow-purple-500/30 ring-2 ring-purple-500/30 bg-white/15"
                    : "border-purple-400/30 hover:border-purple-400/60 hover:shadow-lg hover:shadow-purple-500/20"
                }`}
                required
              />
              <motion.button
                type="button"
                onClick={() => setShowAccessKey(!showAccessKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-300 hover:text-purple-100 transition-colors duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {showAccessKey ? <EyeOff size={18} /> : <Eye size={18} />}
              </motion.button>
            </div>
          </motion.div>

          {errorMessage && (
            <div className="flex items-center space-x-2 text-red-500 text-sm bg-red-50/10 p-3 rounded-lg border border-red-400/50">
              <AlertCircle className="w-4 h-4" />
              <p>{errorMessage}</p>
            </div>
          )}

          {/* Submit Button */}
          <motion.div variants={itemVariants}>
            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
              <Button
                type="submit"
                disabled={isPending}
                className="font-jakarta w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-2.5 rounded-2xl transition-all duration-300 shadow-lg shadow-purple-600/40 hover:shadow-purple-600/60 disabled:opacity-75"
              >
                {isPending ? (
                  <span className="flex items-center justify-center gap-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                    />
                    Authenticating...
                  </span>
                ) : (
                  "Manage Resources"
                )}
              </Button>
            </motion.div>
          </motion.div>
        </form>

        {/* Security Note */}
        <motion.div
          className="mt-6 p-3.5 rounded-2xl bg-purple-500/15 border border-purple-500/40 backdrop-blur-sm"
          variants={itemVariants}
        >
          <p className="font-jakarta text-xs text-purple-200/90">
            <span className="font-semibold">Security Note:</span> Your access key is confidential. Never share it with
            others.
          </p>
        </motion.div>

        {/* Footer Link */}
        <motion.div className="mt-8 pt-6 border-t border-purple-500/20 text-center" variants={itemVariants}>
          <p className="font-jakarta text-sm text-purple-200/80">
            New here?{" "}
            <motion.a
              href="#"
              className="font-semibold text-purple-400 hover:text-purple-300 transition-colors duration-300 underline underline-offset-2"
              whileHover={{ x: 2 }}
              whileTap={{ x: 0 }}
            >
              Request Contributor Access
            </motion.a>
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}
