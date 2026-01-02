import Link from "next/link";

export default function NotFound() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center text-center">
      <h1 className="text-6xl font-bold tracking-tight md:text-8xl">404</h1>
      <h2 className="mt-4 text-2xl font-semibold md:text-3xl">
        Page Not Found
      </h2>
      <Link href="/" className="mt-6 rounded-md bg-black px-4 py-2 text-white">
        Go Home
      </Link>
    </div>
  );
}
