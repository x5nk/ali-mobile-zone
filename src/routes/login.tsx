import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Login — Ali Mobile Zone" }] }),
  component: LoginPage,
});

function LoginPage() {
  const { user, login } = useAuth();
  const navigate = Route.useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      navigate({ to: "/profile" });
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      toast.error("Email and password are required");
      return;
    }
    setSubmitting(true);
    const result = await login(email, password);
    setSubmitting(false);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Logged in successfully");
      navigate({ to: "/" });
    }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-navy p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
        <h1 className="text-3xl font-extrabold text-navy">Welcome back</h1>
        <p className="mt-2 text-sm text-muted-foreground">Login to manage your orders and save your account details.</p>

        <label className="mt-6 block text-sm font-semibold text-navy">Email</label>
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

        <button disabled={submitting} className="mt-6 w-full rounded-2xl bg-navy px-4 py-3 text-sm font-bold text-white transition hover:bg-navy-light disabled:opacity-50">{submitting ? "Logging in..." : "Login"}</button>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          Don't have an account? <Link to="/signup" className="font-semibold text-navy hover:text-gold">Sign up</Link>
        </p>
      </form>
    </div>
  );
}
