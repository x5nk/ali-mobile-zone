import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Sign Up — Ali Mobile Zone" }] }),
  component: SignupPage,
});

function SignupPage() {
  const { signup } = useAuth();
  const navigate = Route.useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password) {
      toast.error("Name, email, and password are required");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setSubmitting(true);
    const result = await signup(name, email, password);
    setSubmitting(false);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Account created successfully");
      navigate({ to: "/" });
    }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-navy p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
        <h1 className="text-3xl font-extrabold text-navy">Create account</h1>
        <p className="mt-2 text-sm text-muted-foreground">Sign up to save your cart and checkout faster.</p>

        <label className="mt-6 block text-sm font-semibold text-navy">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="John Doe"
          className="mt-2 w-full rounded-2xl border border-border bg-secondary px-4 py-3 text-sm outline-none focus:border-gold focus:bg-white"
        />

        <label className="mt-4 block text-sm font-semibold text-navy">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="mt-2 w-full rounded-2xl border border-border bg-secondary px-4 py-3 text-sm outline-none focus:border-gold focus:bg-white"
        />

        <label className="mt-4 block text-sm font-semibold text-navy">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="mt-2 w-full rounded-2xl border border-border bg-secondary px-4 py-3 text-sm outline-none focus:border-gold focus:bg-white"
        />

        <label className="mt-4 block text-sm font-semibold text-navy">Confirm password</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••••"
          className="mt-2 w-full rounded-2xl border border-border bg-secondary px-4 py-3 text-sm outline-none focus:border-gold focus:bg-white"
        />

        <button disabled={submitting} className="mt-6 w-full rounded-2xl bg-navy px-4 py-3 text-sm font-bold text-white transition hover:bg-navy-light disabled:opacity-50">{submitting ? "Creating account..." : "Sign up"}</button>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          Already have an account? <Link to="/login" className="font-semibold text-navy hover:text-gold">Login</Link>
        </p>
      </form>
    </div>
  );
}
