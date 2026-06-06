import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const resolvedParams = await params;
    const doubtId = resolvedParams.id;
    const { content } = await req.json();

    if (!content) {
      return new NextResponse("Content is required", { status: 400 });
    }

    const comment = await prisma.doubtComment.create({
      data: {
        content,
        doubtId,
        authorId: session.user.id,
      },
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error("Create doubt comment error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
