import NextAuth from 'next-auth';

import { authOptions } from 'server';

console.log('here in route');
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
