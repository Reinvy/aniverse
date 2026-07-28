"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, UserPlus, Eye, EyeOff, Code2, AtSign, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { APP_NAME } from "@/lib/constants";
import { useAuth } from "@/components/auth/AuthProvider";

export default function RegisterPage() {
  const { register } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  function validate(): Record<string, string> {
    const errs: Record<string, string> = {};
    if (!firstName.trim()) {
      errs.firstName = "First name is required";
    }
    if (!lastName.trim()) {
      errs.lastName = "Last name is required";
    }
    if (!email.trim()) {
      errs.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = "Please enter a valid email address";
    }
    if (!password) {
      errs.password = "Password is required";
    } else if (password.length < 6) {
      errs.password = "Password must be at least 6 characters";
    }
    if (!agreeToTerms) {
      errs.agreeToTerms = "You must agree to the Terms of Service and Privacy Policy";
    }
    return errs;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);

    const result = await register({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      password,
    });

    if (!result.ok) {
      setErrors({ _form: result.error || "Registration failed" });
      setIsLoading(false);
    }
    // Success redirect happens inside register() via router.push
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-navy-900 px-4">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0 bg-starfield" />
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-20" />
      <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 w-[600px] h-[500px] bg-gradient-to-b from-cyan-400/10 via-gold-400/5 to-transparent blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        {/* Logo — Game HUD style */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-8 group">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[rgba(243,198,105,0.3)] to-[rgba(243,198,105,0.1)] border border-stroke-gold shadow-[0_0_15px_rgba(243,198,105,0.1)] group-hover:shadow-[0_0_25px_rgba(243,198,105,0.2)] transition-all duration-300">
            <Sparkles className="h-5 w-5 text-gold-400" />
            <span className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-gold-400 shadow-[0_0_6px_rgba(243,198,105,0.6)]" />
          </div>
          <div className="flex flex-col items-start">
            <span className="text-xl font-bold text-white group-hover:text-gold-300 transition-colors">
              {APP_NAME}
            </span>
            <span className="sys-label-gold -mt-0.5">v2.4 // AUTH-NODE</span>
          </div>
        </Link>

        <Card className="cut-corner">
          <CardHeader className="text-center">
            <Badge variant="secondary" className="mb-2 mx-auto w-fit px-3 py-1 text-xs">
              FREE PLAN INCLUDED
            </Badge>
            <span className="sys-label mb-1">REGISTRATION // NEW USER</span>
            <CardTitle className="text-2xl">Create your account</CardTitle>
            <CardDescription>
              Start generating AI anime art in minutes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Social buttons */}
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="gap-2" type="button" disabled>
                <Code2 className="h-4 w-4" />
                Github
              </Button>
              <Button variant="outline" className="gap-2" type="button" disabled>
                <AtSign className="h-4 w-4" />
                Twitter
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-stroke-white" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-navy-900 px-2 text-white/30 sys-label">
                  OR SIGN UP WITH EMAIL
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Form-level error */}
              {errors._form && (
                <div className="rounded-lg border border-[rgba(239,68,68,0.3)] bg-[rgba(239,68,68,0.1)] px-3 py-2 text-sm text-red-400">
                  {errors._form}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="firstName"
                    className="sys-label block mb-1.5"
                  >
                    FIRST NAME // ID
                  </label>
                  <Input
                    id="firstName"
                    placeholder="John"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    disabled={isLoading}
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-xs text-red-400">{errors.firstName}</p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="sys-label block mb-1.5"
                  >
                    LAST NAME // ID
                  </label>
                  <Input
                    id="lastName"
                    placeholder="Doe"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    disabled={isLoading}
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-xs text-red-400">{errors.lastName}</p>
                  )}
                </div>
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="sys-label block mb-1.5"
                >
                  EMAIL // ADDRESS
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-400">{errors.email}</p>
                )}
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="sys-label block mb-1.5"
                >
                  PASSWORD // SECURE
                </label>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  endIcon={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-white/40 hover:text-gold-300 transition-colors"
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
                {errors.password && (
                  <p className="mt-1 text-xs text-red-400">{errors.password}</p>
                )}
              </div>

              <div className="flex items-start gap-2 text-sm">
                <input
                  id="agreeToTerms"
                  type="checkbox"
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                  className="mt-0.5 rounded border-stroke-white bg-glass-200 text-gold-400 focus:ring-gold-400/30"
                  disabled={isLoading}
                />
                <div>
                  <label htmlFor="agreeToTerms" className="text-white/40 cursor-pointer">
                    I agree to the{" "}
                    <span className="text-gold-400">Terms of Service</span>{" "}
                    and{" "}
                    <span className="text-gold-400">Privacy Policy</span>
                  </label>
                  {errors.agreeToTerms && (
                    <p className="mt-1 text-xs text-red-400">{errors.agreeToTerms}</p>
                  )}
                </div>
              </div>

              <Button className="w-full gap-2" size="lg" type="submit" disabled={isLoading} variant="primary">
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <UserPlus className="h-4 w-4" />
                )}
                {isLoading ? "Creating account..." : "Create Account"}
              </Button>
            </form>

            <p className="text-center text-sm text-white/40">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-gold-400 hover:text-gold-300 transition-colors font-medium"
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
