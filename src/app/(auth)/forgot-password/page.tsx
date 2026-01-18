import ForgotPasswordForm from "./ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-center text-lg font-semibold">Forgot password?</h2>
        <p className="text-center text-sm text-muted-foreground">
          Enter the email associated with your Ledgerly account and we will send
          a secure link to reset your password.
        </p>
      </div>

      <ForgotPasswordForm />
    </div>
  );
}
