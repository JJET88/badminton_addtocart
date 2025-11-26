import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";


export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          // Prevent case when credentials are missing
          if (!credentials?.email || !credentials?.password) {
            return null;
          }


          // 1) Find user from database with Prisma
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });


          if (!user) {
            // Case when user is not found
            return null;
          }


          // 2) Verify password with bcrypt (compare with hash in DB)
          const isValid = await bcrypt.compare(
            credentials.password,
            user.password
          );


          if (!isValid) {
            return null;
          }


          // 3) Return user object according to the example format
          return {
            id: user.id.toString(),
            name: user.name,
            email: user.email,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // On first login, user will be passed in
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      // Bind id to session.user
      if (token?.id) {
        session.user.id = token.id;
      }
      return session;
    },
  },
});

