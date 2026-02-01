"use client";
import LoginForm from "./LoginForm";
import { useSearchParams } from "next/navigation";

export default function LoginClient() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  return <LoginForm error={error} />;
}
