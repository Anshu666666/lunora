import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const url = new URL(req.url);
  const requestedUserId = url.searchParams.get('userId');

  if (requestedUserId !== userId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // ✅ Get user progress data
  const progress = await prisma.userProgress.findMany({
    where: {
      user_id: userId,
    },
    orderBy: {
      last_updated: 'desc',
    },
    include: {
      song: {
        select: {
          title: true,
          duration: true,
        },
      },
    },
  });

  // ✅ Format progress response to match expected structure
  const formattedProgress = progress.map((entry) => ({
    song_id: entry.song_id,
    song_title: entry.song.title,
    song_duration: entry.song.duration,
    total_duration_listened: entry.total_duration_listened,
    completion_percentage: entry.completion_percentage,
    last_updated: entry.last_updated,
  }));

  // ✅ Calculate stats
  const songs = await prisma.userProgress.findMany({
    where: {
      user_id: userId,
    },
    include: {
      song: true,
    },
  });

  const stats = songs.reduce(
    (acc, item) => {
      acc.total_songs += 1;
      acc.total_duration += item.song.duration ?? 0;
      acc.total_listened += item.total_duration_listened;
      acc.overall_completion += item.completion_percentage;
      return acc;
    },
    {
      total_songs: 0,
      total_duration: 0,
      total_listened: 0,
      overall_completion: 0,
    }
  );

  if (stats.total_songs > 0) {
    stats.overall_completion = stats.overall_completion / stats.total_songs;
  }

  return NextResponse.json({
    progress: formattedProgress,
    stats,
  });
}
