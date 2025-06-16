import { NextResponse } from 'next/server'
import { prisma } from '@/prisma/prisma-client'

// GET /api/apartments/[id] - получить квартиру по ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const apartment = await prisma.apartment.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        city: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    if (!apartment) {
      return NextResponse.json(
        { error: 'Apartment not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(apartment)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch apartment' },
      { status: 500 }
    )
  }
}

// PUT /api/apartments/[id] - обновить квартиру
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const data = await request.json()

  try {
    const updatedApartment = await prisma.apartment.update({
      where: { id: parseInt(params.id) },
      data: {
        ...data,
        cityId: data.cityId ? parseInt(data.cityId) : undefined,
        rooms: data.rooms ? parseInt(data.rooms) : undefined,
        floor: data.floor ? parseInt(data.floor) : undefined,
        totalFloors: data.totalFloors ? parseInt(data.totalFloors) : undefined,
        price: data.price ? parseFloat(data.price) : undefined,
        area: data.area ? parseFloat(data.area) : undefined
      }
    })
    return NextResponse.json(updatedApartment)
  } catch (error) {
    console.error("Ошибка при обновлении квартиры:", error);
    return NextResponse.json(
      { error: 'Apartment update failed' },
      { status: 400 }
    )
  }
}

// DELETE /api/apartments/[id] - удалить квартиру
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.apartment.delete({
      where: { id: parseInt(params.id) }
    })
    return NextResponse.json(
      { message: 'Apartment deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Apartment deletion failed' },
      { status: 400 }
    )
  }
}