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

        // Group by category and count
        const categoryCount = progressData.reduce((acc, entry) => {
            const category = entry.song?.category || 'Unknown';
            acc[category] = (acc[category] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        // Format the data for the pie chart
        const chartData = Object.entries(categoryCount).map(([category, count]) => ({
            name: category,
            value: count
        }));

        const totalSongs = chartData.reduce((sum, item) => sum + item.value, 0);

        return NextResponse.json({
            chartData,
            totalSongs
        }, { status: 200 });

    } catch (error) {
        console.error("Failed to fetch songs by genre:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}