import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/auth/logout")({
  server: {
    handlers: {
      POST: async () => {
        const headers = new Headers();
        headers.set("Set-Cookie", "token=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0");

        return Response.json({ success: true }, { headers });
      },
    },
  },
});
