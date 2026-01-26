"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type FormValues = z.infer<typeof schema>;

export default function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const emailId = useId();
  const passwordId = useId();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormValues) {
    setLoading(true);
    setFormError(null);
    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        callbackUrl: "/",
        redirect: false,
      });

      if (result?.error) {
        setFormError("Invalid credentials. Please try again.");
        return;
      }

      if (result?.url) {
        router.replace(result.url);
      } else {
        router.replace("/");
      }
    } catch (error) {
      console.error("login error", error);
      setFormError("Unexpected error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="mb-1 block font-medium text-sm" htmlFor={emailId}>
          Email
        </label>
        <Input id={emailId} type="email" {...register("email")} />
        {errors.email && (
          <p className="mt-1 text-destructive text-xs">
            {errors.email.message}
          </p>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between">
          <label
            className="mb-1 block font-medium text-sm"
            htmlFor={passwordId}
          >
            Password
          </label>
          <a
            className="text-primary text-sm hover:underline"
            href="/forgot-password"
          >
            Forgot your password?
          </a>
        </div>
        <div className="relative">
          <Input
            id={passwordId}
            type={showPassword ? "text" : "password"}
            className="pr-10"
            {...register("password")}
          />
          <button
            type="button"
            aria-label={showPassword ? "Hide password" : "Show password"}
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute inset-y-0 right-2 flex cursor-pointer items-center text-muted-foreground hover:text-foreground"
          >
            {showPassword ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="mt-1 text-destructive text-xs">
            {errors.password.message}
          </p>
        )}
      </div>

      {formError && (
        <p className="text-center text-destructive text-sm" role="alert">
          {formError}
        </p>
      )}

      <Button
        type="submit"
        disabled={loading}
        className={cn("w-full justify-center", loading ? "opacity-80" : "")}
      >
        {loading ? "Signing in..." : "Sign in"}
      </Button>

      <p className="text-center text-sm">
        Don’t have an account?{" "}
        <a className="text-primary hover:underline" href="/register">
          Sign up
        </a>
      </p>
    </form>
  );
}
