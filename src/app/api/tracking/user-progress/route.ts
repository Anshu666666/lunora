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


const totalSongsInDb = await prisma.song.count();
  const totalDurationResult = await prisma.song.aggregate({
    _sum: {
      duration: true,
    },
  });
  const totalDurationInDb = totalDurationResult._sum.duration ?? 0;

// AFTER (The fixed code)
const initialStats = {
    totalSongs: totalSongsInDb,
    totalDuration: totalDurationInDb,
    totalListened: 0,
    overallCompletion: 0,
};

const userStats = progress.reduce(
    (acc, item) => {
      acc.totalListened += item.total_duration_listened ?? 0;
      acc.overallCompletion += item.completion_percentage ?? 0;
      return acc;
    },
    { totalListened: 0, overallCompletion: 0 }
  );

    const finalStats = {
      ...initialStats,
      totalListened: userStats.totalListened,
      overallCompletion: userStats.overallCompletion,
    };

    // 5. Calculate overall completion percentage based on the total number of songs
    if (finalStats.totalSongs > 0) {
      finalStats.overallCompletion = finalStats.overallCompletion / finalStats.totalSongs;
    }

  return NextResponse.json({
    progress: formattedProgress,
    stats: finalStats,
  });
  } catch (error) {
    console.error('Error in user-progress API:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
