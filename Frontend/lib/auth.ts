export const AUTH_COOKIE_NAME = "emerald_session";
export const ADMIN_AUTH_COOKIE_NAME = "emerald_admin_session";

export const DEFAULT_AUTH_REDIRECT = "/User/Home";
export const DEFAULT_ADMIN_AUTH_REDIRECT = "/Admin/report";

export const PROTECTED_PATH_PREFIXES = [
  "/User/Booking",
  "/User/State",
  "/User/Payment",
  "/User/Ticket",
  "/User/Profile",
  "/User/Profile-edit",
];

export function isProtectedPath(pathname: string) {
  return PROTECTED_PATH_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

export function isAdminPath(pathname: string) {
  return pathname.startsWith("/Admin");
}

export function isAdminPublicPath(pathname: string) {
  return pathname === "/Admin/login";
}
