import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import styles from "./page.module.css";
import Link from "next/link";
import { User, MessageCircle } from "lucide-react";
import CommentForm from "./CommentForm";
import DeletePostButton from "./DeletePostButton";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      author: true,
      comments: {
        include: {
          author: true,
        },
        orderBy: { createdAt: "asc" },
      },
      _count: {
        select: { likes: true },
      },
    },
  });

  if (!post) {
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
              <Link href={`/profile/${post.author.id}`} className={styles.authorName}>
                {post.author.name}
              </Link>
              <span className={styles.specialty}>{post.author.specialty}</span>
              <span className={styles.date}>
                {new Date(post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </span>
            </div>
          </div>
          {session?.user?.id === post.author.id && (
            <DeletePostButton postId={post.id} />
          )}
        </div>

        <div className={styles.body}>
          {post.title && <h1 className={styles.title}>{post.title}</h1>}
          <div className={styles.tags}>
            {post.symptom && (
              <span className={styles.tag}>Symptom: {post.symptom}</span>
            )}
            {post.remedy && (
              <span className={styles.tag}>Remedy: {post.remedy}</span>
            )}
          </div>
          <p className={styles.content}>{post.content}</p>
        </div>
      </div>

      <div className={styles.commentsSection}>
        <div className={styles.commentsHeader}>
          <MessageCircle size={24} />
          <h2>Comments ({post.comments.length})</h2>
        </div>

        <CommentForm postId={post.id} />

        <div className={styles.commentList}>
          {post.comments.map((comment: any) => (
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
