import { PrismaClient } from '@prisma/client';
import { getAuth, auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const sessionCount = await prisma.listeningSession.count({
            where: {
                user_id: userId,
             },
        });

        return NextResponse.json({ totalSessions: sessionCount }, { status: 200 });

    } catch (error) {
        console.error("Failed to fetch total sessions:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}