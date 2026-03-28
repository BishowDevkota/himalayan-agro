import type { Metadata } from "next";
import React from "react";
import DistributorShell from "../components/distributor/DistributorShell";

export const metadata: Metadata = {
  title: "Store",
};

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return <DistributorShell>{children}</DistributorShell>;
}
