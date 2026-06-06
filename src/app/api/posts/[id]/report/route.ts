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
    const postId = resolvedParams.id;
    const body = await req.json();
    const { reason } = body;

    if (!reason) {
      return new NextResponse("Reason is required", { status: 400 });
    }

    const report = await prisma.report.create({
      data: {
        reason,
        postId,
        reporterId: session.user.id,
      },
    });

    return NextResponse.json(report, { status: 201 });
  } catch (error) {
    console.error("Create report error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
