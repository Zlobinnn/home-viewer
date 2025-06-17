import { prisma } from '@/prisma/prisma-client'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/cities - получить все города
export async function GET() {
  try {
    const cities = await prisma.city.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        date: true,
        _count: {
          select: { apartments: true }
        }
      }
    })
    return NextResponse.json(cities)
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to fetch cities' },
      { status: 500 }
    )
  }
}

// POST /api/cities - создать новый город
export async function POST(request: NextRequest) {
  const { name, description } = await request.json()

  try {
    const city = await prisma.city.create({
      data: { name, description }
    })
    return NextResponse.json(city, { status: 201 })
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'City creation failed' },
      { status: 400 }
    )
  }
}