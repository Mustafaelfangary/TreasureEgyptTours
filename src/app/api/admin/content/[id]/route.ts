import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET /api/admin/content/[id] - Get content by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !['ADMIN', 'MANAGER'].includes(session.user.role)) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const content = await prisma.pageContent.findUnique({
      where: { id: params.id },
    });

    if (!content) {
      return new NextResponse('Content not found', { status: 404 });
    }

    return NextResponse.json(content);
  } catch (error) {
    console.error('Error fetching content:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// PUT /api/admin/content/[id] - Update content
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !['ADMIN', 'MANAGER'].includes(session.user.role)) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const data = await request.json();
    
    // Check if content exists
    const existingContent = await prisma.pageContent.findUnique({
      where: { id: params.id },
    });

    if (!existingContent) {
      return new NextResponse('Content not found', { status: 404 });
    }

    // Check if key is being updated and if it already exists
    if (data.key && data.key !== existingContent.key) {
      const keyExists = await prisma.pageContent.findFirst({
        where: { key: data.key, id: { not: params.id } },
      });

      if (keyExists) {
        return new NextResponse(
          JSON.stringify({ 
            message: 'Content with this key already exists',
            existingContent: keyExists,
          }), 
          { status: 400 }
        );
      }
    }

    const updatedContent = await prisma.pageContent.update({
      where: { id: params.id },
      data: {
        key: data.key,
        title: data.title,
        content: data.content,
        contentType: data.contentType,
        page: data.page,
        section: data.section,
        order: data.order,
        isActive: data.isActive,
        metadata: data.metadata,
      },
    });

    return NextResponse.json(updatedContent);
  } catch (error) {
    console.error('Error updating content:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// DELETE /api/admin/content/[id] - Delete content
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !['ADMIN', 'MANAGER'].includes(session.user.role)) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Check if content exists
    const existingContent = await prisma.pageContent.findUnique({
      where: { id: params.id },
    });

    if (!existingContent) {
      return new NextResponse('Content not found', { status: 404 });
    }

    // Delete the content
    await prisma.pageContent.delete({
      where: { id: params.id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting content:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
