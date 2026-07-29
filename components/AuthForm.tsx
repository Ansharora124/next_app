"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { loginUser, signupUser } from "@/lib/actions/auth.action";
import { LiquidGlassCard } from "@/components/ui/liquid-glass";

type AuthMode = "login" | "signup";

const AuthForm = ({ mode }: { mode: AuthMode }) => {
  const router = useRouter();
  const isSignup = mode === "signup";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    const result = isSignup
      ? await signupUser({ name, email, password })
      : await loginUser({ email, password });

    if (result.success) {
      router.push("/");
      router.refresh();
      return;
    }

    setError(result.error);
    setIsSubmitting(false);
  };

  return (
    <LiquidGlassCard
      className="auth-card"
      glowIntensity="md"
      shadowIntensity="md"
      blurIntensity="md"
      borderRadius="12px"
    >
      <form onSubmit={handleSubmit}>
        {isSignup && (
          <label>
            Name
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Your name"
              required
            />
          </label>
        )}

        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="At least 8 characters"
            minLength={8}
            required
          />
        </label>

        {error && <p className="auth-error">{error}</p>}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? isSignup
              ? "Creating..."
              : "Logging in..."
            : isSignup
              ? "Create Account"
              : "Login"}
        </button>

        <p className="auth-switch">
          {isSignup ? "Already have an account?" : "Need an account?"}{" "}
          <Link href={isSignup ? "/login" : "/signup"}>
            {isSignup ? "Login" : "Sign up"}
          </Link>
        </p>
      </form>
    </LiquidGlassCard>
  );
};

export default AuthForm;
