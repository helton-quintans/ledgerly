"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type FormValues = z.infer<typeof schema>;

export default function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const emailId = useId();
  const passwordId = useId();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormValues) {
    setLoading(true);
    try {
      // TODO: call API route /api/auth/login
      await new Promise((r) => setTimeout(r, 600));
      router.push("/");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor={emailId}>
          Email
        </label>
        <Input id={emailId} type="email" {...register("email")} />
        {errors.email && (
          <p className="mt-1 text-xs text-destructive">
            {errors.email.message}
          </p>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between">
          <label
            className="block text-sm font-medium mb-1"
            htmlFor={passwordId}
          >
            Password
          </label>
          <a
            className="text-sm text-primary hover:underline"
            href="/forgot-password"
          >
            Forgot your password?
          </a>
        </div>
        <Input id={passwordId} type="password" {...register("password")} />
        {errors.password && (
          <p className="mt-1 text-xs text-destructive">
            {errors.password.message}
          </p>
        )}
      </div>

      <Button type="submit" className={cn(loading ? "opacity-80" : "")}>
        Login
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
