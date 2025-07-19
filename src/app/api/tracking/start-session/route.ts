import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { songId, sessionStart } = await req.json();

  // ✅ Use native UUID generator
  const sessionId = crypto.randomUUID();

  // ✅ Insert new listening session using Prisma
  await prisma.listeningSession.create({
    data: {
      id: sessionId,
      user_id: userId,
      song_id: songId,
      session_start: new Date(sessionStart),
    },
  });

  return NextResponse.json({ sessionId });
}
