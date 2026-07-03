import AuthForm from "../components/AuthForm";

export default function SignupPage() {
  return (
    <main className="flex-grow flex items-center justify-center py-16 shell">
      <AuthForm mode="signup" />
    </main>
  );
}
