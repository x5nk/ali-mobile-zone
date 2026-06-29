import { createFileRoute } from "@tanstack/react-router";
import { eq } from "drizzle-orm";

export const Route = createFileRoute("/api/auth/me")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const { db, initDb } = await import("../../../server/db");
        const { users } = await import("../../../server/db/schema");
        const { verifyToken } = await import("../../../server/auth/jwt");
        initDb();

        try {
          const cookieHeader = request.headers.get("Cookie") || "";
          const token = cookieHeader
            .split(";")
            .find((c) => c.trim().startsWith("token="))
            ?.split("=")[1]
            ?.trim();

          if (!token) {
            return Response.json({ user: null });
          }

          const payload = verifyToken(token);
          if (!payload) {
            return Response.json({ user: null });
          }

          const user = db.select().from(users).where(eq(users.id, payload.userId)).get();
          if (!user) {
            return Response.json({ user: null });
          }

          return Response.json({
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
            },
          });
        } catch (error) {
          console.error("Me error:", error);
          return Response.json({ user: null });
        }
      },
    },
  },
});
