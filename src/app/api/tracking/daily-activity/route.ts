// app/api/tracking/daily-activity/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';
// Import date-fns for easy date manipulation
import { subMonths, eachDayOfInterval, format, startOfDay } from 'date-fns';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
    const { userId } = await auth();
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 1. Define the date range for the last 3 months
    const endDate = new Date();
    const startDate = startOfDay(subMonths(endDate, 3));

    // 2. Fetch all listening sessions within this date range
    const sessions = await prisma.listeningSession.findMany({
        where: {
            user_id: userId,
            session_end: {
                gte: startDate,
                lte: endDate,
            },
        },
        select: {
            duration_listened: true,
            session_end: true,
        },
    });

    // 3. Group sessions by date and sum the duration in minutes
    const aggregatedData: { [key: string]: number } = {};
    sessions.forEach(session => {
        if (session.session_end) {
            const dateKey = format(session.session_end, 'yyyy-MM-dd');
            const durationInMinutes = (session.duration_listened || 0) / 60;
            
            if (!aggregatedData[dateKey]) {
                aggregatedData[dateKey] = 0;
            }
            aggregatedData[dateKey] += durationInMinutes;
        }
    });

    // 4. Create a complete dataset for every day in the last 3 months
    const dateInterval = eachDayOfInterval({ start: startDate, end: endDate });
    const chartData = dateInterval.map(day => {
        const dateKey = format(day, 'yyyy-MM-dd');
        return {
            date: dateKey,
            // Round to the nearest whole number for cleaner display
            minutesListened: Math.round(aggregatedData[dateKey] || 0),
        };
    });

    return NextResponse.json(chartData);
}
