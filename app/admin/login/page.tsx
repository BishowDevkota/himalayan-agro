import AdminLoginClient from "../../components/admin/AdminLoginClient";

export const metadata = {
  title: "Admin sign in — Himalayan",
  description: "Administrator sign in for Himalayan — restricted access.",
};

export default function AdminLoginPage() {
  return <AdminLoginClient from="/admin" />;
}
