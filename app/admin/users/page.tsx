import { notFound } from "next/navigation";

export default function AdminUsersPage() {
  // Soft-disabled: render 404 so user-management UI is not accessible.
  notFound();
}
