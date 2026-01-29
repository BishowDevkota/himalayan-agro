import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      role?: "user" | "admin";
    };
  }
  interface User {
    id?: string;
    role?: "user" | "admin";
  }
}