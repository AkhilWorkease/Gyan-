import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import styles from "../../post/[id]/page.module.css";
import Link from "next/link";
import { User, MessageCircle } from "lucide-react";
import AnswerForm from "./AnswerForm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function DoubtPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  const doubt = await prisma.doubt.findUnique({
    where: { id },
    include: {
      author: true,
      comments: {
        include: {
          author: true,
        },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!doubt) {
    notFound();
  }

  return (
    <div className={styles.container}>
      <div className={`glass-panel ${styles.postCard}`}>
        <div className={styles.header}>
          <div className={styles.authorInfo}>
            <div className={styles.avatar}>
              <User size={24} />
            </div>
            <div className={styles.meta}>
              <Link href={`/profile/${doubt.author.id}`} className={styles.authorName}>
                {doubt.author.name}
              </Link>
              <span className={styles.specialty}>{doubt.author.specialty}</span>
              <span className={styles.date}>
                {new Date(doubt.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </span>
            </div>
          </div>
        </div>

        <div className={styles.body}>
          <h1 className={styles.title}>{doubt.title}</h1>
          <p className={styles.content}>{doubt.content}</p>
        </div>
      </div>

      <div className={styles.commentsSection}>
        <div className={styles.commentsHeader}>
          <MessageCircle size={24} />
          <h2>Answers ({doubt.comments.length})</h2>
        </div>

        <AnswerForm doubtId={doubt.id} />

        <div className={styles.commentList}>
          {doubt.comments.map((comment: any) => (
            <div key={comment.id} className={styles.commentCard}>
              <div className={styles.commentAvatar}>
                <User size={16} />
              </div>
              <div className={styles.commentContent}>
                <div className={styles.commentMeta}>
                  <Link href={`/profile/${comment.author.id}`} className={styles.commentAuthor}>
                    {comment.author.name}
                  </Link>
                  <span className={styles.commentDate}>
                    {new Date(comment.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                </div>
                <p className={styles.commentText}>{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
