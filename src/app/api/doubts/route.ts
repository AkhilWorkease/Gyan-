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

    const { title, content } = await req.json();

    if (!title || !content) {
      return new NextResponse("Title and content are required", { status: 400 });
    }

    const doubt = await prisma.doubt.create({
      data: {
        title,
        content,
        authorId: session.user.id,
      },
    });

    return NextResponse.json(doubt, { status: 201 });
  } catch (error) {
    console.error("Create doubt error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
