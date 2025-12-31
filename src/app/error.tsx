"use client";

import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-center">
      <h1 className="text-6xl font-bold tracking-tight md:text-8xl">
        500
      </h1>
      <h2 className="mt-4 text-2xl font-semibold md:text-3xl">
        Something went wrong
      </h2>
      <button
        onClick={reset}
        className="mt-6 rounded-md bg-black px-4 py-2 text-white"
      >
        Try again
      </button>
    </div>
  );
}
