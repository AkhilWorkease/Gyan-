"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import styles from "./page.module.css";

export default function CommentForm({ postId }: { postId: string }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  if (!session) {
    return (
      <div className={styles.loginPrompt}>
        <p>Please log in to leave a comment.</p>
        <button onClick={() => router.push("/login")} className="btn btn-secondary">
          Log In
        </button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    setLoading(true);
    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      if (res.ok) {
        setContent("");
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.commentForm}>
      <textarea
        className={`input-field ${styles.commentInput}`}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Share your thoughts..."
        rows={3}
        required
      />
      <div className={styles.commentActions}>
        <button disabled={loading || !content.trim()} type="submit" className="btn btn-primary">
          {loading ? "Posting..." : "Post Comment"}
        </button>
      </div>
    </form>
  );
}
