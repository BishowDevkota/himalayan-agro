export const EMPLOYEE_ROLE_PERMISSIONS: Record<string, string[]> = {
  accountant: ["payments:read", "payments:write"],
  product_manager: [
    "products:read",
    "products:write",
    "vendors:read",
    "vendors:approve",
    "categories:read",
    "categories:write",
  ],
  reporter: ["news:read", "news:write", "news:delete"],
};

export const EMPLOYEE_ROLES = Object.keys(EMPLOYEE_ROLE_PERMISSIONS);

export function normalizePermissions(permissions: string[] = []) {
  const normalized = permissions.map((p) => String(p || "").trim()).filter(Boolean);
  return Array.from(new Set(normalized));
}

export function getDefaultPermissionsForRole(role: string) {
  return EMPLOYEE_ROLE_PERMISSIONS[role] ? [...EMPLOYEE_ROLE_PERMISSIONS[role]] : [];
}

export function resolvePermissionsForEmployee(role: string, permissions?: string[]) {
  if (Array.isArray(permissions) && permissions.length > 0) {
    return normalizePermissions(permissions);
  }
  return normalizePermissions(getDefaultPermissionsForRole(role));
}

export function hasPermission(user: any, permission: string) {
  if (!user) return false;
  if (user.role === "admin") return true;
  const perms = Array.isArray(user.permissions) ? user.permissions : [];
  if (perms.includes("*")) return true;
  return perms.includes(permission);
}

export function permissionForAdminApi(pathname: string, method: string) {
  if (!pathname.startsWith("/api/admin")) return null;

  if (pathname.startsWith("/api/admin/news")) {
    if (method === "GET") return "news:read";
    if (method === "DELETE") return "news:delete";
    return "news:write";
  }

  if (pathname.startsWith("/api/admin/upload")) {
    return ["products:write", "news:write"];
  }

  if (pathname.startsWith("/api/admin/payment-requests")) {
    return method === "GET" ? "payments:read" : "payments:write";
  }

  if (pathname.startsWith("/api/admin/vendors")) {
    return method === "GET" ? "vendors:read" : "vendors:approve";
  }

  if (pathname.startsWith("/api/admin/products")) {
    return method === "GET" ? "products:read" : "products:write";
  }

  if (pathname.startsWith("/api/admin/categories")) {
    return method === "GET" ? "categories:read" : "categories:write";
  }

  return null;
}

export function adminLandingForPermissions(permissions: string[] = []) {
  if (permissions.includes("news:read")) return "/admin/news";
  if (permissions.includes("payments:read")) return "/admin/payment-requests";
  if (permissions.includes("products:read")) return "/admin/products";
  if (permissions.includes("vendors:read")) return "/admin/vendor";
  if (permissions.includes("categories:read")) return "/admin/categories";
  return "/admin/dashboard";
}
