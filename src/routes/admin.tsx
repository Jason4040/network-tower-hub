import { createFileRoute } from "@tanstack/react-router";
import AdminDashboard from "../components/AdminDashboard";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Portfolio Editor | Irumva Jason" },
      { name: "description", content: "Edit Irumva Jason's portfolio content." },
    ],
  }),
  component: AdminDashboard,
});
