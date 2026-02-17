import AdminLoginClient from "../../components/admin/AdminLoginClient";

export const metadata = {
  title: "Admin sign in — Himalaya",
  description: "Administrator sign in for Himalaya — restricted access.",
};

export default function AdminLoginPage() {
  return <AdminLoginClient from="/admin" />;
}
