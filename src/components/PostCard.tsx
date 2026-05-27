"use client";

import Link from "next/link";
import { User, MessageCircle, Heart, Trash2 } from "lucide-react";
import styles from "./PostCard.module.css";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type PostCardProps = {
  post: {
    id: string;
    title: string | null;
    symptom: string | null;
    remedy: string | null;
    content: string;
    createdAt: Date;
    author: {
      id: string;
      name: string | null;
      specialty: string | null;
    };
    _count: {
      comments: number;
      likes: number;
    };
  };
};

export default function PostCard({ post }: PostCardProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [likes, setLikes] = useState(post._count.likes);
  const [isLiked, setIsLiked] = useState(false); // We would check if current user liked it in reality
  const [isDeleting, setIsDeleting] = useState(false);

  const handleLike = async () => {
    if (!session) return;
    
    // Optimistic UI update
    if (isLiked) {
      setLikes((prev) => prev - 1);
      setIsLiked(false);
    } else {
      setLikes((prev) => prev + 1);
      setIsLiked(true);
    }

    try {
      await fetch(`/api/posts/${post.id}/like`, { method: "POST" });
    } catch (e) {
      // Revert if error
      if (isLiked) {
        setLikes((prev) => prev + 1);
        setIsLiked(true);
      } else {
        setLikes((prev) => prev - 1);
        setIsLiked(false);
      }
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this observation?")) return;
    
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/posts/${post.id}`, { method: "DELETE" });
      if (res.ok) {
        router.refresh();
      } else {
        alert("Failed to delete post");
      }
    } catch (e) {
      alert("An error occurred");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className={`glass-panel ${styles.card}`}>
      <div className={styles.header}>
        <div className={styles.authorInfo}>
          <div className={styles.avatar}>
            <User size={20} />
          </div>
          <div className={styles.meta}>
            <Link href={`/profile/${post.author.id}`} className={styles.authorName}>
              {post.author.name}
            </Link>
            <span className={styles.date}>
              {new Date(post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </span>
          </div>
        </div>
        {session?.user?.id === post.author.id && (
          <button 
            className={styles.deleteBtn} 
            onClick={handleDelete}
            disabled={isDeleting}
            title="Delete post"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>

      <div className={styles.body}>
        {post.title && <h3 className={styles.title}>{post.title}</h3>}
        <p className={styles.content}>{post.content}</p>
        
        <div className={styles.tags}>
          {post.symptom && (
            <span className={styles.tag}>Symptom: {post.symptom}</span>
          )}
          {post.remedy && (
            <span className={styles.tag}>Remedy: {post.remedy}</span>
          )}
        </div>
      </div>

      <div className={styles.footer}>
        <button 
          className={`${styles.actionBtn} ${isLiked ? styles.liked : ""}`}
          onClick={handleLike}
        >
          <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
          <span>{likes} Likes</span>
        </button>
        <Link href={`/post/${post.id}`} className={styles.actionBtn}>
          <MessageCircle size={18} />
          <span>{post._count.comments} Comments</span>
        </Link>
      </div>
    </div>
  );
}
