import { prisma } from '@/prisma/prisma-client';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { apartmentId, rating, userToken } = await request.json();

    if (
      typeof apartmentId !== 'number' ||
      typeof rating !== 'number' ||
      typeof userToken !== 'string'
    ) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    // Проверим, есть ли уже рейтинг от этого пользователя для этой квартиры
    const existingRating = await prisma.rating.findUnique({
      where: {
        userToken_apartmentId: {
          userToken,
          apartmentId,
        },
      },
    });

    if (existingRating) {
      // Обновим рейтинг
      const updatedRating = await prisma.rating.update({
        where: {
          id: existingRating.id,
        },
        data: {
          rating,
        },
      });
      return NextResponse.json(updatedRating);
    } else {
      // Создадим новый рейтинг
      const newRating = await prisma.rating.create({
        data: {
          apartmentId,
          rating,
          userToken,
        },
      });
      return NextResponse.json(newRating);
    }
  } catch (error) {
    console.error('Failed to rate apartment:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
