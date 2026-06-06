"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "../../new/page.module.css";

export default function EditForm({ post }: { post: any }) {
  const router = useRouter();
  
  const [title, setTitle] = useState(post.title || "");
  const [symptom, setSymptom] = useState(post.symptom || "");
  const [remedy, setRemedy] = useState(post.remedy || "");
  const [content, setContent] = useState(post.content || "");
  const [categoryId, setCategoryId] = useState(post.categoryId || "");
  
  // Convert existing tags array to comma separated string
  const initialTags = post.tags ? post.tags.map((t: any) => t.name).join(", ") : "";
  const [tags, setTags] = useState(initialTags);
  
  const [categories, setCategories] = useState<{id: string, name: string}[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/categories")
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const tagsArray = tags.split(",").map((t: string) => t.trim()).filter((t: string) => t.length > 0);
      const res = await fetch(`/api/posts/${post.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, symptom, remedy, content, categoryId, tags: tagsArray }),
      });

      if (!res.ok) {
        throw new Error("Failed to update post");
      }

      router.push(`/post/${post.id}`);
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
        <h1 className={styles.title}>Edit Observation</h1>
        <p className={styles.subtitle}>Update the details of your clinical experience.</p>
        
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
              <label htmlFor="categoryId">Category</label>
              <select
                id="categoryId"
                className="input-field"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
              >
                <option value="">Select a category...</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            
            <div className={styles.inputGroup}>
              <label htmlFor="tags">Tags (Comma-separated)</label>
              <input
                id="tags"
                className="input-field"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g. skin, herbal"
              />
            </div>
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
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
