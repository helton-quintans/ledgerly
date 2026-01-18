"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const schema = z.object({
  email: z.string().email("Enter a valid email address"),
});

type FormValues = z.infer<typeof schema>;

export default function ForgotPasswordForm() {
  const emailId = useId();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormValues) {
    setLoading(true);
    try {
      // TODO: call API route /api/auth/forgot-password
      await new Promise((r) => setTimeout(r, 800));
      setSubmittedEmail(data.email);
      setSent(true);
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="space-y-4">
        <div className="rounded-2xl border border-primary/20 bg-muted/60 p-4 text-sm text-muted-foreground">
          <p className="font-medium text-foreground">Check your inbox</p>
          <p className="mt-1">
            We emailed reset instructions to{" "}
            <span className="font-medium text-foreground">
              {submittedEmail}
            </span>
            . The link expires in 15 minutes.
          </p>
        </div>

        <Button className="w-full" asChild>
          <Link href="/login">Return to login</Link>
        </Button>

        <Button
          type="button"
          variant="ghost"
          className="w-full"
          onClick={() => setSent(false)}
        >
          Send another email
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium" htmlFor={emailId}>
          Email address
        </label>
        <Input
          id={emailId}
          type="email"
          autoComplete="email"
          {...register("email")}
        />
        {errors.email && (
          <p className="mt-1 text-xs text-destructive">
            {errors.email.message}
          </p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Sending..." : "Send reset link"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Remembered your password?{" "}
        <Link className="text-primary hover:underline" href="/login">
          Back to login
        </Link>
      </p>
    </form>
  );
}
