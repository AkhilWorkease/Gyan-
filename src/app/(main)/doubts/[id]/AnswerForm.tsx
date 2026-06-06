"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../../post/[id]/page.module.css";

export default function AnswerForm({ doubtId }: { doubtId: string }) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/doubts/${doubtId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      if (res.ok) {
        setContent("");
        router.refresh();
      } else {
        alert("Failed to submit answer");
      }
    } catch (err) {
      alert("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.commentForm}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your answer..."
        className="input-field"
        rows={3}
        required
      />
      <div className={styles.commentActions}>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting || !content.trim()}
        >
          {isSubmitting ? "Posting..." : "Post Answer"}
        </button>
      </div>
    </form>
  );
}
