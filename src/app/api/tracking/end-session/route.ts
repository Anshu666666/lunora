import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const {
    sessionId,
    songId,
    sessionEnd,
    durationListened,
    lastPosition,
  } = await req.json();

  // ✅ End the listening session
  await prisma.listeningSession.updateMany({
    where: {
      id: sessionId,
      user_id: userId,
    },
    data: {
      session_end: new Date(sessionEnd),
      duration_listened: durationListened,
      last_position: lastPosition,
    },
  });

  return NextResponse.json({ success: true });
}
