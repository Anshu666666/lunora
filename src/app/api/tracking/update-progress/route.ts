// /api/tracking/update-progress/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    const { userId } = await auth();
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // The request body is now simpler
    const { songId } = await req.json();

    if (!songId) {
        return NextResponse.json({ error: 'Song ID is required' }, { status: 400 });
    }

    // 1. Upsert the progress, incrementing by a fixed interval (5s)
    const userProgress = await prisma.userProgress.upsert({
        where: {
            user_id_song_id: { user_id: userId, song_id: songId },
        },
        update: {
            total_duration_listened: {
                increment: 5,
            },
            last_updated: new Date(),
        },
        create: {
            user_id: userId,
            song_id: songId,
            total_duration_listened: 5,
        },
        include: { song: true }, // Include song data to get its duration
    });

    // 2. Calculate completion percentage on the backend
    const songDuration = userProgress.song.duration;
    if (songDuration && songDuration > 0) {
        const completionPercentage = Math.min(
            (userProgress.total_duration_listened / songDuration) * 100,
            100
        );

        // 3. Update the progress entry with the correct percentage
const updatedProgress = await prisma.userProgress.update({
        where: {
            id: userProgress.id,
        },
        data: {
            completion_percentage: completionPercentage,
        },
        include: { song: true },
    });

    // Convert UTC to IST before sending to client
    const utcDate = new Date(updatedProgress.last_updated);
    const istDate = new Date(
        utcDate.getTime() + (5.5 * 60 * 60 * 1000)
    );

    return NextResponse.json({
        success: true,
        // Include both UTC and IST times for reference
        last_updated_utc: updatedProgress.last_updated,
        last_updated_ist: istDate.toISOString(),
    });
    }


}
