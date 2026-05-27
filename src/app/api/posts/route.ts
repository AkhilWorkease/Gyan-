import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { title, symptom, remedy, content } = body;

    if (!content) {
      return new NextResponse("Content is required", { status: 400 });
    }

    const post = await prisma.post.create({
      data: {
        title,
        symptom,
        remedy,
        content,
        authorId: session.user.id,
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("Create post error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
