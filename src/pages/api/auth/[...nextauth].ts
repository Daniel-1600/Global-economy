import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    // Google OAuth Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),

    // Email/Password Credentials Provider
    CredentialsProvider({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "your@email.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // In a real app, you would validate against a database
        // For demo purposes, we'll accept any email/password with some validation
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Demo: Accept any valid email format with password length >= 6
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (
          emailRegex.test(credentials.email) &&
          credentials.password.length >= 6
        ) {
          // Return a user object
          return {
            id: credentials.email,
            name: credentials.email.split("@")[0], // Use email username as display name
            email: credentials.email,
            image: null, // No profile pic for email login
          };
        }

        return null;
      },
    }),
  ],

  // Custom pages
  pages: {
    signIn: "/login",
    error: "/login",
  },

  // Session configuration
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  // Callbacks
  callbacks: {
    async jwt({ token, user, account }) {
      // Persist the OAuth provider and user data to the token
      if (account && user) {
        token.provider = account.provider;
        token.picture = user.image || undefined;
      }
      return token;
    },
    async session({ session, token }) {
      // Add custom fields to the session
      if (session.user) {
        session.user.provider = token.provider as string;
      }
      return session;
    },
  },

  // Secret for JWT encryption
  secret: process.env.NEXTAUTH_SECRET || "your-secret-key-change-in-production",
};

export default NextAuth(authOptions);
