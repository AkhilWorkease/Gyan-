"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import styles from "./page.module.css";

export default function NewPost() {
  const { data: session } = useSession();
  const router = useRouter();
  
  const [title, setTitle] = useState("");
  const [symptom, setSymptom] = useState("");
  const [remedy, setRemedy] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!session) {
    return (
      <div className={styles.unauthorized}>
        <h2>You must be logged in to share an observation.</h2>
        <button onClick={() => router.push("/login")} className="btn btn-primary">
          Log In
        </button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, symptom, remedy, content }),
      });

      if (!res.ok) {
        throw new Error("Failed to create post");
      }

      router.push("/");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={`glass-panel ${styles.formCard}`}>
        <h1 className={styles.title}>Share an Observation</h1>
        <p className={styles.subtitle}>Contribute to the collective knowledge base.</p>
        
        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="title">Title (Optional)</label>
            <input
              id="title"
              className="input-field"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Brief summary of your observation"
            />
          </div>

          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label htmlFor="symptom">Symptom</label>
              <input
                id="symptom"
                className="input-field"
                value={symptom}
                onChange={(e) => setSymptom(e.target.value)}
                placeholder="e.g. Chronic Migraine"
              />
            </div>
            
            <div className={styles.inputGroup}>
              <label htmlFor="remedy">Remedy</label>
              <input
                id="remedy"
                className="input-field"
                value={remedy}
                onChange={(e) => setRemedy(e.target.value)}
                placeholder="e.g. Belladonna"
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="content">Observation Details</label>
            <textarea
              id="content"
              className={`input-field ${styles.textarea}`}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Describe your clinical experience in detail..."
              required
              rows={8}
            />
          </div>

          <div className={styles.actions}>
            <button type="button" onClick={() => router.back()} className="btn btn-secondary">
              Cancel
            </button>
            <button disabled={loading} type="submit" className="btn btn-primary">
              {loading ? "Publishing..." : "Publish Observation"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
