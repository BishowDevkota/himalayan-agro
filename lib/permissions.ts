export const EMPLOYEE_ROLE_PERMISSIONS: Record<string, string[]> = {
  accountant: ["payments:read", "payments:write", "orders:read", "orders:write"],
  shopkeeper: ["products:read", "products:write", "categories:read", "categories:write"],
};

const LEGACY_EMPLOYEE_ROLE_PERMISSIONS: Record<string, string[]> = {
  product_manager: ["products:read", "products:write"],
  reporter: ["news:read", "news:write", "news:delete"],
};

export const EMPLOYEE_ROLES = Object.keys(EMPLOYEE_ROLE_PERMISSIONS);

export function normalizePermissions(permissions: string[] = []) {
  const normalized = permissions.map((p) => String(p || "").trim()).filter(Boolean);
  return Array.from(new Set(normalized));
}

export function getDefaultPermissionsForRole(role: string) {
  if (EMPLOYEE_ROLE_PERMISSIONS[role]) return [...EMPLOYEE_ROLE_PERMISSIONS[role]];
  if (LEGACY_EMPLOYEE_ROLE_PERMISSIONS[role]) return [...LEGACY_EMPLOYEE_ROLE_PERMISSIONS[role]];
  return [];
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

  if (pathname.startsWith("/api/admin/distributors")) {
    return method === "GET" ? "distributors:read" : "distributors:approve";
  }

  if (pathname.startsWith("/api/admin/products")) {
    return method === "GET" ? "products:read" : "products:write";
  }

  if (pathname.startsWith("/api/admin/categories")) {
    return method === "GET" ? "categories:read" : "categories:write";
  }

  if (pathname.startsWith("/api/admin/orders")) {
    return method === "GET" ? "orders:read" : "orders:write";
  }

  return null;
}

export function adminLandingForPermissions(permissions: string[] = []) {
  if (permissions.includes("orders:read")) return "/admin/orders";
  if (permissions.includes("products:read")) return "/admin/products";
  if (permissions.includes("payments:read")) return "/admin/payment-requests";
  if (permissions.includes("news:read")) return "/admin/news";
  if (permissions.includes("distributors:read")) return "/admin/distributor";
  if (permissions.includes("categories:read")) return "/admin/categories";
  return "/admin/dashboard";
}

export function outletEmployeeLandingPath(user: any) {
  const slug = user?.outletSlug;
  const employeeRole = user?.employeeRole;

  if (!slug || !employeeRole) return "/employee";
  if (employeeRole === "accountant") return `/admin/outlet-${slug}/accountant`;
  if (employeeRole === "shopkeeper") return `/admin/outlet-${slug}/shopkeeper`;
  return "/employee";
}

export function outletEmployeeSectionPath(slug: string, employeeRole: string, section: "order" | "product" | "categories") {
  if (!slug || !employeeRole) return "/employee";
  return `/admin/outlet-${slug}/${employeeRole}/${section}`;
}
