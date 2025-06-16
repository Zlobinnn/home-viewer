import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/prisma/prisma-client'

// GET /api/apartments/[id] - получить квартиру по ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const apartment = await prisma.apartment.findUnique({
      where: { id: parseInt(id) },
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
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to fetch apartment' },
      { status: 500 }
    )
  }
}

// PUT /api/apartments/[id] - обновить квартиру
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();
    
    // Удаляем id из данных, если он там есть
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _, cityId: __, city: ___, ...updateData } = data;

    const updatedApartment = await prisma.apartment.update({
      where: { id: parseInt(id) },
      data: updateData
    });
    
    return NextResponse.json(updatedApartment);
  } catch (error) {
    console.error("Ошибка при обновлении квартиры:", error);
    return NextResponse.json(
      { error: 'Apartment update failed' },
      { status: 400 }
    );
  }
}

// DELETE /api/apartments/[id] - удалить квартиру
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.apartment.delete({
      where: { id: parseInt(id) }
    })
    return NextResponse.json(
      { message: 'Apartment deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Apartment deletion failed' },
      { status: 400 }
    )
  }
}