import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: postId } = await params;
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userId = session.user.id;

    // Check if like exists
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    if (existingLike) {
      // Unlike
      await prisma.like.delete({
        where: {
          id: existingLike.id,
        },
      });
      return NextResponse.json({ message: "Unliked" }, { status: 200 });
    } else {
      // Like
      await prisma.like.create({
        data: {
          userId,
          postId,
        },
      });
      return NextResponse.json({ message: "Liked" }, { status: 201 });
    }
  } catch (error) {
    console.error("Like error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
