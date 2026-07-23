"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, UserPlus, Eye, EyeOff, Code2, AtSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { APP_NAME } from "@/lib/constants";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-zinc-950 px-4">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 bg-grid-pattern" />
      <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 w-[600px] h-[500px] bg-gradient-to-b from-fuchsia-600/15 via-violet-600/10 to-transparent blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 shadow-lg shadow-violet-600/20">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white">{APP_NAME}</span>
        </Link>

        <Card className="border-zinc-800/60">
          <CardHeader className="text-center">
            <Badge variant="secondary" className="mb-2 mx-auto w-fit px-3 py-1 text-xs">
              Free plan included
            </Badge>
            <CardTitle className="text-2xl">Create your account</CardTitle>
            <CardDescription>
              Start generating AI anime art in minutes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Social buttons */}
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="gap-2">
                <Code2 className="h-4 w-4" />
                Github
              </Button>
              <Button variant="outline" className="gap-2">
                <AtSign className="h-4 w-4" />
                Twitter
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-zinc-800" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-zinc-900 px-2 text-zinc-500">
                  Or sign up with email
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-zinc-300 mb-1.5"
                  >
                    First name
                  </label>
                  <Input id="firstName" placeholder="John" />
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-zinc-300 mb-1.5"
                  >
                    Last name
                  </label>
                  <Input id="lastName" placeholder="Doe" />
                </div>
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-zinc-300 mb-1.5"
                >
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-zinc-300 mb-1.5"
                >
                  Password
                </label>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  autoComplete="new-password"
                  endIcon={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-zinc-500 hover:text-zinc-300 transition-colors"
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  }
                />
              </div>
            </div>

            <div className="flex items-start gap-2 text-sm text-zinc-500">
              <input
                type="checkbox"
                className="mt-0.5 rounded border-zinc-700 bg-zinc-800 text-violet-600 focus:ring-violet-500"
              />
              <span>
                I agree to the{" "}
                <Link href="/terms" className="text-violet-400 hover:text-violet-300">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-violet-400 hover:text-violet-300">
                  Privacy Policy
                </Link>
              </span>
            </div>

            <Button className="w-full gap-2" size="lg">
              <UserPlus className="h-4 w-4" />
              Create Account
            </Button>

            <p className="text-center text-sm text-zinc-500">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-violet-400 hover:text-violet-300 transition-colors font-medium"
              >
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
