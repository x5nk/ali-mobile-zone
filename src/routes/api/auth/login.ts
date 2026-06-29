import { createFileRoute } from "@tanstack/react-router";
import { eq } from "drizzle-orm";

export const Route = createFileRoute("/api/auth/login")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { db, initDb } = await import("../../../server/db");
        const { users } = await import("../../../server/db/schema");
        const { verifyPassword } = await import("../../../server/auth/password");
        const { signToken } = await import("../../../server/auth/jwt");
        initDb();

        try {
          const body = await request.json();
          const { email, password } = body;

          if (!email || !password) {
            return Response.json(
              { error: "Email and password are required" },
              { status: 400 }
            );
          }

          const user = db.select().from(users).where(eq(users.email, email)).get();
          if (!user) {
            return Response.json(
              { error: "Invalid email or password" },
              { status: 401 }
            );
          }

          const valid = await verifyPassword(password, user.passwordHash);
          if (!valid) {
            return Response.json(
              { error: "Invalid email or password" },
              { status: 401 }
            );
          }

          const token = signToken({ userId: user.id, email: user.email });

          const headers = new Headers();
          headers.set("Set-Cookie", `token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800`);

          return Response.json(
            {
              user: {
                id: user.id,
                name: user.name,
                email: user.email,
              },
            },
            { headers }
          );
        } catch (error) {
          console.error("Login error:", error);
          return Response.json({ error: "Internal server error" }, { status: 500 });
        }
      },
    },
  },
});
