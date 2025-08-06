import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

// Define custom types
type AdminUser = {
  id: string;
  email: string;
  role: string;
};

// This would typically come from an environment variable
const ADMIN_EMAIL = "admin@example.com";
const ADMIN_PASSWORD = "admin123"; // In production, use proper hashing

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials): Promise<AdminUser | null> {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Check if credentials match admin credentials
        if (credentials.email === ADMIN_EMAIL && credentials.password === ADMIN_PASSWORD) {
          return {
            id: "1",
            email: ADMIN_EMAIL,
            role: "admin"
          };
        }

        return null;
      }
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/admin/signin", // for Google sign-in
    error: "/auth/error",
  },

  callbacks: {
    async signIn({ user }) {
      return true;
    },
    async session({ session, token }) {
      if (session?.user) {
        (session.user as any).role = token.role;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as AdminUser).role;
      }
      return token;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) return url;
      if (url.startsWith("/")) return new URL(url, baseUrl).toString();
      return baseUrl;
    },
  },
});

export { handler as GET, handler as POST };
