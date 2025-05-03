import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { supabaseApiKeyService } from '@/services/supabaseApiKeyService';

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: '/',
  },
  callbacks: {
    async signIn({ user }) {
      if (user?.email) {
        try {
          await supabaseApiKeyService.upsertUser({
            email: user.email,
            name: user.name,
            image: user.image,
          });
        } catch (e) {
          console.error('Failed to upsert user:', e);
        }
      }
      return true;
    },
  },
});

export { handler as GET, handler as POST }; 