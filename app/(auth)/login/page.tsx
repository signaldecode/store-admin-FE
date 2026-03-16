"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { login } from "@/services/authService";
import { useAuthStore } from "@/stores/useAuthStore";
import { auth, common } from "@/data/labels";
import type { ApiError } from "@/types/api";

export default function LoginPage() {
  const router = useRouter();
  const setAdmin = useAuthStore((s) => s.setAdmin);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError(auth.validationRequired);
      return;
    }

    setLoading(true);
    try {
      const res = await login({ email, password });
      setAdmin(res.data);
      router.push("/");
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || common.loginFailed);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">{auth.pageTitle}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">{auth.emailLabel}</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={auth.emailPlaceholder}
              autoComplete="email"
              aria-required="true"
              aria-describedby={error ? "login-error" : undefined}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">{auth.passwordLabel}</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={auth.passwordPlaceholder}
              autoComplete="current-password"
              aria-required="true"
              disabled={loading}
            />
          </div>

          {error && (
            <p id="login-error" className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? auth.loggingIn : auth.loginButton}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
