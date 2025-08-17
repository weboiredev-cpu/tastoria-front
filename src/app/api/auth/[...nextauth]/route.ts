import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  id: string;
  userEmail: string;
  [key: string]: any;
}

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      email?: string | null;
      name?: string | null;
      image?: string | null;
      role?: string;
      token?: string;
      phone?: string | null;
    }
  }

  interface User {
    id?: string;
    email?: string;
    role?: string;
    token?: string;
    phone?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
    token?: string;
    phone?: string | null;
  }
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const handler = NextAuth({
  providers: [
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),

    CredentialsProvider({
      name: "Admin Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const res = await fetch(`${API_URL}/api/admin/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userEmail: credentials.email,
              password: credentials.password,
            }),
          });

          const data = await res.json();
          if (!res.ok || !data?.token) return null;

          const decoded = jwtDecode<JwtPayload>(data.token);
          return {
            id: decoded.id,
            email: decoded.userEmail,
            role: "admin",
            token: data.token,
          };
        } catch (err) {
          console.error("[Admin Login] Error:", err);
          return null;
        }
      },
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },

  pages: {
    error: "/auth/error",
  },

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google" && user?.email) {
        // 1. Save or update user on backend
        try {
          await fetch(`${API_URL}/api/users/auth`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: user.email,
              name: user.name,
              image: user.image,
            }),
          });
        } catch (err) {
          console.error("[signIn] Error syncing user:", err);
        }

        // 2. Check for phone number
        try {
          const res = await fetch(`${API_URL}/api/users/check`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: user.email }),
          });

          if (res.ok) {
            const dbUser = await res.json();
            if (!dbUser?.phone) return "/profile-setup";
          }
        } catch (err) {
          console.error("[signIn] Error checking phone:", err);
        }
      }

      return true;
    },

    async jwt({ token, user, account, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || "user";
        token.token = (user as any).token;

        try {
          const endpoint =
            token.role === "admin"
              ? `${API_URL}/api/admin/check`
              : `${API_URL}/api/users/check`;

          const res = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: user.email }),
          });

          if (res.ok) {
            const dbUser = await res.json();
            token.phone = dbUser?.phone || null;
          } else {
            token.phone = null;
          }
        } catch (err) {
          console.error("[jwt] Error fetching phone:", err);
          token.phone = null;
        }
      }

      if (trigger === "update" && session?.phone !== undefined) {
        token.phone = session.phone;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.token = token.token;
        session.user.phone = token.phone || null;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
