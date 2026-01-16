import AuthForm from "../components/AuthForm";
import OAuthButton from "../components/OAuthButton";

export default function LoginPage() {
  return (
    <div className="w-full max-w-md sm:max-w-md lg:max-w-lg bg-card px-6 py-8 sm:px-8 sm:py-10 rounded-lg shadow-lg mx-auto">
      <h1 className="text-2xl font-semibold mb-2">Entrar</h1>
      <p className="text-sm text-muted-foreground mb-6">Acesse sua conta para continuar.</p>

      <AuthForm />

      <div className="mt-4">
        <OAuthButton provider="google" label="Entrar com Google" />
      </div>
    </div>
  );
}
