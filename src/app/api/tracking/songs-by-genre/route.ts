import { PrismaClient } from '@prisma/client';
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
    try {
        const { userId } = await auth();


        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }


        // Get user progress with song category
        const progressData = await prisma.userProgress.findMany({
            where: {
                user_id: userId
            },
            include: {
                song: {
                    select: {
                        category: true
                    }
                }
            }
        });

        console.log('Progress data found:', progressData.length, 'records');
        console.log('Sample data:', progressData[0]);

        // Group by category and sum total duration listened
        const categoryDuration = progressData.reduce((acc, entry) => {
            const category = entry.song?.category || 'Unknown';
            const duration = entry.total_duration_listened || 0;
            acc[category] = (acc[category] || 0) + duration;
            return acc;
        }, {} as Record<string, number>);

        // Format the data for the pie chart (convert seconds to minutes for better readability)
        const chartData = Object.entries(categoryDuration).map(([category, totalSeconds]) => ({
            name: category,
            value: Math.round(totalSeconds / 60 * 100) / 100 // Convert to minutes and round to 2 decimal places
        }));

        const totalMinutes = chartData.reduce((sum, item) => sum + item.value, 0);

        return NextResponse.json({
            chartData,
            totalMinutes: Math.round(totalMinutes * 100) / 100
        }, { status: 200 });

    } catch (error) {
        console.error("Failed to fetch songs by genre:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}