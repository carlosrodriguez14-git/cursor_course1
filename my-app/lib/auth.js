import GoogleProvider from "next-auth/providers/google";
import { createSupabaseServerClient } from "./supabase/server";

async function ensureUserRecord({ user, profile, account }) {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
    console.warn("Supabase env vars missing; skipping user insert.");
    return;
  }

  const email = user?.email || profile?.email;
  if (!email) {
    console.warn("User email missing; skipping user insert.");
    return;
  }

  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase
    .from("users")
    .select("id")
    .eq("email", email)
    .limit(1);

  if (error) {
    console.error("Supabase user lookup error", error);
    return;
  }

  if (Array.isArray(data) && data.length > 0) {
    return;
  }

  const { error: insertError } = await supabase.from("users").insert({
    email,
    name: user?.name || profile?.name || null,
    image: user?.image || profile?.picture || null,
  });

  if (insertError) {
    console.error("Supabase user insert error", insertError);
  }
}

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: { scope: "openid email profile" },
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, profile, account }) {
      try {
        await ensureUserRecord({ user, profile, account });
      } catch (error) {
        console.error("User insert on sign-in failed", error);
      }
      return true;
    },
    async jwt({ token, profile }) {
      if (profile?.picture) {
        token.picture = profile.picture;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.picture) {
        session.user.image = token.picture;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
