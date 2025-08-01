// app/api/tracking/monthly-sessions/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { auth } from '@clerk/nextjs/server';

const prisma = new PrismaClient();

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  // Define date ranges
  const endDate = new Date();
  const startDateCurrentMonth = new Date();
  startDateCurrentMonth.setDate(endDate.getDate() - 30);

  const startDatePreviousMonth = new Date();
  startDatePreviousMonth.setDate(endDate.getDate() - 60);

  try {
    // Get session count for the last 30 days
    const currentMonthTotal = await prisma.listeningSession.count({
      where: {
        user_id: userId,
        session_start: {
          gte: startDateCurrentMonth,
          lt: endDate,
        },
        timerCompleted: true,
      },
    });

    // Get session count for the 30 days before that
    const previousMonthTotal = await prisma.listeningSession.count({
      where: {
        user_id: userId,
        session_start: {
          gte: startDatePreviousMonth,
          lt: startDateCurrentMonth,
        },
        timerCompleted: true,
      },
    });

    // Calculate percentage change
    let percentageChange = 0;
    if (previousMonthTotal > 0) {
      percentageChange = (currentMonthTotal - previousMonthTotal);
    } else if (currentMonthTotal > 0) {
      // If previous month was 0, any listening is infinite growth, show 100%
      percentageChange = currentMonthTotal;
    }

    return NextResponse.json({
      currentMonthTotal,
      percentageChange,
    });
  } catch (error) {
    console.error("Error fetching monthly session stats:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
