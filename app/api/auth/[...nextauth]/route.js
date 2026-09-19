// File: app/api/auth/[...nextauth]/route.js
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { compare } from 'bcryptjs';

export const authOptions = {
    pages: {
        signIn: '/login',
    },
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.username || !credentials?.password) return null;

                const user = await db.query.users.findFirst({
                    where: eq(users.username, credentials.username)
                });

                if (!user) return null;

                const passwordsMatch = await compare(credentials.password, user.password);
                if (!passwordsMatch) return null;

                const userRole = (user.role || '').trim().toLowerCase();

                return {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    namaLengkap: user.namaLengkap,
                    role: userRole,
                };
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                const role = (user.role || '').trim().toLowerCase();
                token.id = user.id;
                token.role = role;
                token.email = user.email;
                token.namaLengkap = user.namaLengkap;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                const role = (token.role || '').trim().toLowerCase();
                session.user.id = token.id;
                session.user.role = role;
                session.user.email = token.email;
                session.user.namaLengkap = token.namaLengkap;
            }
            return session;
        }
    },
    session: { strategy: 'jwt' },
    secret: process.env.NEXTAUTH_SECRET,
    debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
