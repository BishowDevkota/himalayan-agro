import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      role?: "user" | "admin" | "vendor" | "employee" | "outlet-admin";
      employeeRole?: "accountant" | "shopkeeper" | string;
      outletId?: string;
      outletName?: string;
      outletSlug?: string;
      permissions?: string[];
    };
  }
  interface User {
    id?: string;
    role?: "user" | "admin" | "vendor" | "employee" | "outlet-admin";
    employeeRole?: "accountant" | "shopkeeper" | string;
    outletId?: string;
    outletName?: string;
    outletSlug?: string;
    permissions?: string[];
  }
}