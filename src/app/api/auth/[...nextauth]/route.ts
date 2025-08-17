import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { jwtDecode } from "jwt-decode";

// Define the JWT payload interface
interface JwtPayload {
  id: string;
  userEmail: string;
  [key: string]: any;
}

// Extend the built-in session types
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

const handler = NextAuth({
  providers: [
    // Only add Google provider if credentials are available
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET ? [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      })
    ] : []),
    CredentialsProvider({
      name: "Admin Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("[Admin Login] Starting authorize function");
        if (!credentials?.email || !credentials?.password) {
          console.log("[Admin Login] Missing credentials:", credentials);
          return null;
        }
      
        try {
          console.log("[Admin Login] Sending request to backend:", credentials.email);
      
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/admin/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userEmail: credentials.email,
              password: credentials.password,
            }),
          });
      
          console.log("[Admin Login] Response status:", res.status);
      
          const data = await res.json().catch(() => null);
          console.log("[Admin Login] Response data:", data);
      
          if (!res.ok || !data?.token) {
            console.log("[Admin Login] Invalid response or missing token");
            return null;
          }
      
          let decoded: JwtPayload;
          try {
            decoded = jwtDecode<JwtPayload>(data.token);
            console.log("[Admin Login] Decoded JWT:", decoded);
          } catch (decodeError) {
            console.error("[Admin Login] JWT decode failed:", decodeError);
            return null;
          }
      
          // Map fields from JWT payload
          const adminUser = {
            id: decoded.id,
            email: decoded.userEmail,
            role: "admin",
            token: data.token,
          };
      
          console.log("[Admin Login] Returning admin user object:", adminUser);
          return adminUser;
      
        } catch (err) {
          console.error("[Admin Login] Exception during authorize:", err);
          return null;
        }
      }
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },

  pages: {
    error: "/auth/error",
  },

  callbacks: {

    async jwt({ token, user, account, trigger, session }) {
      if (user) {
        // Google login
        if (account?.provider === "google") {
          token.role = "user";
          token.id = user.id;
    
          // Fetch from DB on login
          try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}api/users/phone`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email: user.email }),
            });
    
            if (res.ok) {
              const dbUser = await res.json();
              token.phone = dbUser?.phone || null;
            }
          } catch (error) {
            console.error("[JWT] Error fetching user phone:", error);
            token.phone = null;
          }
        } else {
          // Admin login
          token.role = (user as any).role || "user";
          token.id = (user as any).id;
          token.token = (user as any).token;
        }
      }
    
      // ✅ Allow `session.update()` to set new phone
      if (trigger === "update" && session?.phone !== undefined) {
        token.phone = session.phone;
      }
    
      return token;
    },
    

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.token = token.token as string;
        session.user.phone = token.phone || null; 
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
