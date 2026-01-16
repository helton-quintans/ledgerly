"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";

function TextInput({ id, label, type, value, onChange }: any) {
  return (
    <label htmlFor={id} className="block">
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        className="w-full mt-2 px-3 py-2 border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
      />
    </label>
  );
}

export default function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [show, setShow] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await signIn("credentials", { email, password, redirect: false });
    // next-auth returns an object (if redirect:false) with error or ok
    // `res` can be undefined in some builds, so guard it
    // @ts-ignore
    if (res && (res as any).error) {
      // show human message if available
      setError((res as any).error as string);
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <TextInput id="email" label="Email" type="email" value={email} onChange={(e: any) => setEmail(e.target.value)} />

      <div>
        <label htmlFor="password" className="block">
          <span className="text-sm font-medium text-muted-foreground">Senha</span>
          <div className="relative mt-2">
            <input
              id="password"
              type={show ? "text" : "password"}
              value={password}
              onChange={(e: any) => setPassword(e.target.value)}
              className="w-full pr-10 px-3 py-2 border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              className="absolute inset-y-0 right-0 px-3 flex items-center text-muted-foreground hover:text-foreground cursor-pointer"
              aria-label={show ? "Ocultar senha" : "Mostrar senha"}
            >
              <span aria-hidden>{show ? "🙈" : "👁️"}</span>
            </button>
          </div>
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full inline-flex items-center justify-center px-4 py-2 bg-primary text-white rounded-md disabled:opacity-60"
      >
        {loading ? "Entrando..." : "Entrar"}
      </button>
      {error ? <p className="text-sm text-red-600 mt-2">{error}</p> : null}
    </form>
  );
}
