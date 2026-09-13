import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import AdminDashboard from "../components/admin/AdminDashboard";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { isAdminSession, startAdminSession, verifyAdminPassword } from "../lib/admin-auth";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ title: "Admin | Irumva Jason" }, { name: "robots", content: "noindex, nofollow" }],
  }),
  component: AdminRoute,
});

function AdminRoute() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setAuthed(isAdminSession());
  }, []);

  if (!authed) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4">
        <form
          className="w-full max-w-sm space-y-4 border border-border p-6"
          onSubmit={async (event: FormEvent) => {
            event.preventDefault();
            const ok = await verifyAdminPassword(password);
            if (!ok) {
              setError("Access denied");
              return;
            }
            startAdminSession();
            setAuthed(true);
          }}
        >
          <p className="label-tech text-accent">RESTRICTED</p>
          <h1 className="font-display text-xl">Admin access</h1>
          <Input
            type="password"
            autoComplete="current-password"
            className="rounded-none"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            aria-label="Admin password"
          />
          {error ? <p className="text-sm text-accent">{error}</p> : null}
          <Button type="submit" className="w-full rounded-none bg-accent text-accent-foreground">
            Enter
          </Button>
        </form>
      </main>
    );
  }

  return <AdminDashboard />;
}
