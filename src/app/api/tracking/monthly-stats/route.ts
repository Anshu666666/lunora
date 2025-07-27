// app/api/tracking/monthly-stats/route.ts

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { auth, getAuth } from '@clerk/nextjs/server';

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
    // Get listening data for the last 30 days
    const currentMonthData = await prisma.listeningSession.aggregate({
      _sum: {
        duration_listened: true,
      },
      where: {
        user_id: userId,
        session_start: {
          gte: startDateCurrentMonth,
          lt: endDate,
        },
      },
    });

    // Get listening data for the 30 days before that
    const previousMonthData = await prisma.listeningSession.aggregate({
      _sum: {
        duration_listened: true,
      },
      where: {
        user_id: userId,
        session_start: {
          gte: startDatePreviousMonth,
          lt: startDateCurrentMonth,
        },
      },
    });

    const currentMonthTotal = currentMonthData._sum.duration_listened || 0;
    const previousMonthTotal = previousMonthData._sum.duration_listened || 0;

    // Calculate percentage change
    let percentageChange = 0;
    if (previousMonthTotal > 0) {
      percentageChange = ((currentMonthTotal - previousMonthTotal) / previousMonthTotal) * 100;
    } else if (currentMonthTotal > 0) {
      // If previous month was 0, any listening is infinite growth, show 100%
      percentageChange = 100;
    }

    return NextResponse.json({
      currentMonthTotal,
      percentageChange,
    });

  } catch (error) {
    console.error("Error fetching monthly stats:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
