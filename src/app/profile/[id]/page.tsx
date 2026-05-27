import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import PostCard from "@/components/PostCard";
import styles from "./page.module.css";
import { User } from "lucide-react";

export default async function Profile({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      posts: {
        include: {
          author: true,
          _count: {
            select: { comments: true, likes: true },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!user) {
    notFound();
  }

  return (
    <div className={styles.container}>
      <div className={`glass-panel ${styles.profileHeader}`}>
        <div className={styles.avatarLarge}>
          <User size={64} />
        </div>
        <div className={styles.profileInfo}>
          <h1 className={styles.name}>{user.name}</h1>
          {user.specialty && <p className={styles.specialty}>{user.specialty}</p>}
          <p className={styles.memberSince}>
            Member since {new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </p>
          {user.bio && <p className={styles.bio}>{user.bio}</p>}
        </div>
      </div>

      <div className={styles.postsSection}>
        <h2 className={styles.sectionTitle}>Shared Observations ({user.posts.length})</h2>
        {user.posts.length === 0 ? (
          <div className={styles.emptyState}>This doctor hasn't shared any observations yet.</div>
        ) : (
          <div className={styles.postList}>
            {user.posts.map((post: any) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
