import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import EditForm from "./EditForm";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/login");
  }

  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      tags: true,
    }
  });

  if (!post) {
    notFound();
  }

  if (post.authorId !== session.user.id) {
    redirect("/"); // Unauthorized to edit
  }

  return <EditForm post={post} />;
}
