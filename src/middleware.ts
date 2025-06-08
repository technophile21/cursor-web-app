import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware() {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: '/signin',
    },
  }
);

// Specify which routes should be protected
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/protected/:path*",
    "/playground/:path*",
  ],
}; 