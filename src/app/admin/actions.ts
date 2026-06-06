"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
}


export async function deleteUser(userId: string) {
  await requireAdmin();
  await prisma.user.delete({
    where: { id: userId },
  });
  revalidatePath("/admin/users");
}

export async function deletePost(postId: string) {
  await requireAdmin();
  await prisma.post.delete({
    where: { id: postId },
  });
  revalidatePath("/admin/posts");
  revalidatePath("/admin/reports");
}

export async function deleteDoubt(doubtId: string) {
  await requireAdmin();
  await prisma.doubt.delete({
    where: { id: doubtId },
  });
  revalidatePath("/admin/doubts");
}

export async function createCategory(name: string) {
  await requireAdmin();
  await prisma.category.create({
    data: { name },
  });
  revalidatePath("/admin/categories");
}

export async function deleteCategory(categoryId: string) {
  await requireAdmin();
  await prisma.category.delete({
    where: { id: categoryId },
  });
  revalidatePath("/admin/categories");
}

export async function deleteReport(reportId: string) {
  await requireAdmin();
  await prisma.report.delete({
    where: { id: reportId },
  });
  revalidatePath("/admin/reports");
}
