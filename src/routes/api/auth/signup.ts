import { createFileRoute } from "@tanstack/react-router";
import { eq } from "drizzle-orm";

export const Route = createFileRoute("/api/auth/signup")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { db, initDb } = await import("../../../server/db");
        const { users } = await import("../../../server/db/schema");
        const { hashPassword } = await import("../../../server/auth/password");
        const { signToken } = await import("../../../server/auth/jwt");
        initDb();

        try {
          const body = await request.json();
          const { name, email, password } = body;

          if (!name || !email || !password) {
            return Response.json(
              { error: "Name, email, and password are required" },
              { status: 400 }
            );
          }

          if (password.length < 6) {
            return Response.json(
              { error: "Password must be at least 6 characters" },
              { status: 400 }
            );
          }

          const existingUser = db.select().from(users).where(eq(users.email, email)).get();
          if (existingUser) {
            return Response.json(
              { error: "An account with this email already exists" },
              { status: 409 }
            );
          }

          const passwordHash = await hashPassword(password);
          const result = db.insert(users).values({ name, email, passwordHash }).returning().get();

          const token = signToken({ userId: result.id, email: result.email });

          const headers = new Headers();
          headers.set("Set-Cookie", `token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800`);

          return Response.json(
            {
              user: {
                id: result.id,
                name: result.name,
                email: result.email,
              },
            },
            { headers }
          );
        } catch (error) {
          console.error("Signup error:", error);
          return Response.json({ error: "Internal server error" }, { status: 500 });
        }
      },
    },
  },
});
