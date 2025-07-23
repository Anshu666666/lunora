// app/api/tracking/favorite-song/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
    const { userId } = await auth();
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 1. Find the UserProgress record with the highest listening time
    const favoriteSongProgress = await prisma.userProgress.findFirst({
        where: {
            user_id: userId,
        },
        // Order by the total time listened in descending order
        orderBy: {
            total_duration_listened: 'desc',
        },
        // Include the song's title in the result
        include: {
            song: {
                select: {
                    title: true,
                },
            },
        },
    });

    // 2. Handle the case where the user has no listening history
    if (!favoriteSongProgress) {
        return NextResponse.json({ favoriteSong: "No listening history yet" });
    }

    // 3. Return the title of the favorite song
    return NextResponse.json({
        favoriteSong: favoriteSongProgress.song.title,
    });
}
