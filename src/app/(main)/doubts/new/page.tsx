"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../../post/new/page.module.css";

export default function NewDoubtPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) {
      setError("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/doubts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });

      if (res.ok) {
        router.push("/doubts");
        router.refresh();
      } else {
        const data = await res.text();
        setError(data || "Something went wrong.");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={`glass-panel ${styles.formCard}`}>
        <h1 className={styles.title}>Ask a Doubt</h1>
        <p className={styles.subtitle}>Post your question to the community</p>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="title">Title <span className={styles.required}>*</span></label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="E.g., Which potency of Arnica should I use for..."
              className="input-field"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="content">Details <span className={styles.required}>*</span></label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Provide more context for your question..."
              className="input-field"
              rows={8}
              required
            />
          </div>

          <div className={styles.formActions}>
            <button
              type="button"
              onClick={() => router.back()}
              className="btn btn-secondary"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Posting..." : "Ask Question"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
