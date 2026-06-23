"use client";
import { useSearchParams } from "next/navigation";
import LoginForm from "./LoginForm";

export default function LoginClient() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  return <LoginForm error={error} />;
}
