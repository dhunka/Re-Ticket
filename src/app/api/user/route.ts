// app/api/get-user.ts
import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';

export async function GET() {
  // Get the userId from auth() -- if null, the user is not signed in
  const { userId } = await auth();

  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const user = await currentUser();

  return NextResponse.json({ user: user }, { status: 200 });
}