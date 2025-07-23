// /api/tracking/end-session/route.ts

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
        durationListened, // This is the total duration for the session
        lastPosition,
    } = await req.json();

    // 1. Update the ListeningSession as before
    const session = await prisma.listeningSession.update({
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

    // 2. Perform a final, precise update on UserProgress
    const progress = await prisma.userProgress.findUnique({
        where: { user_id_song_id: { user_id: userId, song_id: songId } },
        include: { song: true },
    });

    if (progress) {
        // This is a simplified logic. A more robust solution would calculate the
        // delta since the last 5s tick. For now, we set the total listened time
        // based on all sessions for that song. This part can be enhanced further.
        const allSessionsForSong = await prisma.listeningSession.aggregate({
            _sum: { duration_listened: true },
            where: { user_id: userId, song_id: songId },
        });
        
        const totalListened = allSessionsForSong._sum.duration_listened ?? 0;
        const songDuration = progress.song.duration ?? 0;
        const completionPercentage = songDuration > 0 ? Math.min((totalListened / songDuration) * 100, 100) : 0;

        await prisma.userProgress.update({
            where: { id: progress.id },
            data: {
                total_duration_listened: totalListened,
                completion_percentage: completionPercentage,
                last_updated: new Date(),
            },
        });
    }
    
    return NextResponse.json({ success: true });
}
