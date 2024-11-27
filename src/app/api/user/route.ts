import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';

export async function GET() {
  // obtener el userid desde el auth()  en caso de que sea null el usuario no puede inicar sesion
  const { userId } = await auth();

  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const user = await currentUser();

  return NextResponse.json({ user: user }, { status: 200 });
}