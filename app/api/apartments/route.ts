import { prisma } from '@/prisma/prisma-client'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/apartments - получить все квартиры (с фильтрацией по городу)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const cityId = searchParams.get('cityId')

  try {
    const apartments = await prisma.apartment.findMany({
      where: cityId ? { cityId: parseInt(cityId) } : {},
      include: {
        city: {
          select: {
            name: true
          }
        },
        ratings: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    return NextResponse.json(apartments)
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to fetch apartments' },
      { status: 500 }
    )
  }
}

// POST /api/apartments - создать новую квартиру
export async function POST(request: Request) {
  const data = await request.json()

  try {
    const apartment = await prisma.apartment.create({
      data: {
        ...data,
      }
    })
    return NextResponse.json(apartment, { status: 201 })
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Apartment creation failed' },
      { status: 400 }
    )
  }
}