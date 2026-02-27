import type { NextAuthConfig } from "next-auth"
 
export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isLoginPage = nextUrl.pathname.startsWith('/login');
      
      if (!isLoggedIn && !isLoginPage) {
        // Redirect unauthenticated users to login page if they are not already there
        return false;
      } else if (isLoggedIn && isLoginPage) {
        // Redirect logged-in users away from the login page to the dashboard
        return Response.redirect(new URL('/', nextUrl));
      }
      
      return true;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig