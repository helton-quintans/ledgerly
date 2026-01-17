import OAuthButtons from "../components/OAuthButtons";
import RegisterForm from "./RegisterForm";

export default function RegisterPage() {
  return (
    <div>
      <div className="space-y-4">
        <h2 className="text-center font-semibold text-lg">
          Create your account
        </h2>
        <p className="text-center text-muted-foreground text-sm">
          Sign up with Google or keep going with email
        </p>
      </div>

      <div className="mt-6 space-y-4">
        <OAuthButtons />

        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-muted-foreground/30" />
          <span className="text-muted-foreground text-xs">
            Or continue with
          </span>
          <div className="h-px flex-1 bg-muted-foreground/30" />
        </div>

        <RegisterForm />
      </div>
    </div>
  );
}
