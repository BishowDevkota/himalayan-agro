import { notFound } from "next/navigation";

export default function AdminUserDetail() {
  // Soft-disabled: render 404 so the detail page is not accessible.
  notFound();
}
