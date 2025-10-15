import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { generatedCode, penalties, timeTaken } = await request.json();

    if (!generatedCode || timeTaken === undefined) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const gameResult = await prisma.gameResult.create({
      data: {
        generatedCode,
        penalties: penalties.join(', '),
        timeTaken: timeTaken,
      },
    });

    return NextResponse.json({ message: 'Result saved', id: gameResult.id }, { status: 201 });
  } catch (error) {
    console.error('API Error saving game result:', error);
    return NextResponse.json({ message: 'Failed to save result' }, { status: 500 });
  }
}

// Optional: Implement GET (Read) to complete the CRUD requirement
export async function GET() {
  try {
    const results = await prisma.gameResult.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
    });
    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error('API Error fetching game results:', error);
    return NextResponse.json({ message: 'Failed to fetch results' }, { status: 500 });
  }
}