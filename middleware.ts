import { authMiddleware } from "@clerk/nextjs";

// ✅ Ensure login & signup pages are public
export default authMiddleware({
  publicRoutes: ["/", "/login(.*)", "/signup(.*)"],
});

// ✅ Middleware applies to all routes except Next.js system routes
export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
