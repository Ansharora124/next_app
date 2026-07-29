import AuthForm from "@/components/AuthForm";

const LoginPage = () => {
  return (
    <section id="auth-page">
      <div className="header">
        <h1>Login</h1>
        <p>Welcome back. Sign in to manage your DevEvents account.</p>
      </div>

      <AuthForm mode="login" />
    </section>
  );
};

export default LoginPage;
