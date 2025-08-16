import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  return NextResponse.json(
    { message: 'Endpoint not yet implemented.' },
    { status: 501 } // 501 means "Not Implemented"
  );
}