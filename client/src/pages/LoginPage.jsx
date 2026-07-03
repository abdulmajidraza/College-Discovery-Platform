import AuthForm from "../components/AuthForm";

export default function LoginPage() {
  return (
    <main className="flex-grow flex items-center justify-center py-16 shell">
      <AuthForm mode="login" />
    </main>
  );
}
