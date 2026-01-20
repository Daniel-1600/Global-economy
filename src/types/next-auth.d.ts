import { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Extends the built-in session types
   */
  interface Session {
    user: {
      /** The OAuth provider used for login */
      provider?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  /** Extends the built-in JWT types */
  interface JWT {
    provider?: string;
    picture?: string;
  }
}
