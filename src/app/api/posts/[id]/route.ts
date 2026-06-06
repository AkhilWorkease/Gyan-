import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: postId } = await params;
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return new NextResponse("Not Found", { status: 404 });
    }

    if (post.authorId !== session.user.id) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    await prisma.post.delete({
      where: { id: postId },
    });

    return new NextResponse("Post deleted successfully", { status: 200 });
  } catch (error) {
    console.error("Delete post error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: postId } = await params;
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return new NextResponse("Not Found", { status: 404 });
    }

    if (post.authorId !== session.user.id) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const { title, symptom, remedy, content, categoryId, tags } = await request.json();

    if (!content) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    await prisma.post.update({
      where: { id: postId },
      data: {
        title,
        symptom,
        remedy,
        content,
        categoryId: categoryId || null,
        tags: {
          set: [], // Clear existing tags
          connectOrCreate: tags?.map((tag: string) => ({
            where: { name: tag },
            create: { name: tag }
          })) || []
        }
      },
    });

    return new NextResponse("Post updated successfully", { status: 200 });
  } catch (error) {
    console.error("Update post error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
