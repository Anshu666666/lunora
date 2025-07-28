import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();

    console.log('User ID from auth:', userId);

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(req.url);
    const requestedUserId = url.searchParams.get('userId');

    console.log('Requested User ID:', requestedUserId);

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

  console.log('Found progress entries:', progress.length);
  console.log('Progress data:', progress);

  // ✅ Format progress response to match expected structure

const formattedProgress = progress.map((entry) => ({
    songId: entry.song_id,
    songTitle: entry.song.title,
    songDuration: entry.song.duration,
    totalDurationListened: entry.total_duration_listened,
    completionPercentage: entry.completion_percentage, // <-- Changed to camelCase
    lastUpdated: entry.last_updated,
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

// AFTER (The fixed code)
const initialStats = {
    totalSongs: 0,
    totalDuration: 0,
    totalListened: 0,
    overallCompletion: 0,
};

const stats = songs.reduce((acc, item) => {
    acc.totalSongs += 1;
    acc.totalDuration += item.song.duration ?? 0;
    acc.totalListened += item.total_duration_listened ?? 0;
    acc.overallCompletion += item.completion_percentage ?? 0;
    return acc;
}, initialStats); // <-- Correctly pass the initial value object here


  if (stats.totalSongs > 0) {
    stats.overallCompletion = stats.overallCompletion / stats.totalSongs;
  }

  return NextResponse.json({
    progress: formattedProgress,
    stats,
  });
  } catch (error) {
    console.error('Error in user-progress API:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
