import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { sessionId, songId, currentTime, duration } = await req.json();

  // ✅ Update listening session
  await prisma.listeningSession.updateMany({
    where: {
      id: sessionId,
      user_id: userId,
    },
    data: {
      last_position: currentTime,
      duration_listened: {
        increment: 5,
      },
    },
  });

  // ✅ Compute completion percentage
  const completionPercentage = Math.min((currentTime / duration) * 100, 100);

  // ✅ Upsert user progress
  await prisma.userProgress.upsert({
    where: {
      user_id_song_id: {
        user_id: userId,
        song_id: songId,
      },
    },
    update: {
      total_duration_listened: {
        increment: 5,
      },
      completion_percentage: completionPercentage,
      last_updated: new Date(),
    },
    create: {
      id: crypto.randomUUID(),
      user_id: userId,
      song_id: songId,
      total_duration_listened: currentTime,
      completion_percentage: completionPercentage,
      last_updated: new Date(),
    },
  });

  return NextResponse.json({ success: true });
}
