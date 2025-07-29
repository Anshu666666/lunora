// src/app/api/tracking/total-sessions/route.ts

import { prisma } from "@/lib/prisma";
import { getAuth, auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const { userId } = await auth();


        if (!userId) {
            // Use NextResponse for consistent error handling
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const sessionCount = await prisma.listeningSession.count({
            where: {
                user_id: userId,
                timerCompleted: true, // Count sessions where the timer finished
            },
        });

        // Return a successful response using NextResponse
        return NextResponse.json({ totalSessions: sessionCount }, { status: 200 });

    } catch (error) {
        console.error("Failed to fetch total sessions:", error);
        // Return a generic server error response
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
