import AuthForm from "@/components/AuthForm";

const SignupPage = () => {
  return (
    <section id="auth-page">
      <div className="header">
        <h1>Sign Up</h1>
        <p>Create an account connected to MongoDB for DevEvents.</p>
      </div>

      <AuthForm mode="signup" />
    </section>
  );
};

export default SignupPage;
