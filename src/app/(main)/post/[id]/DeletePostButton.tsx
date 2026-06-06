"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import styles from "./page.module.css";

export default function DeletePostButton({ postId }: { postId: string }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this observation?")) return;
    
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/posts/${postId}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/");
        router.refresh();
      } else {
        alert("Failed to delete post");
        setIsDeleting(false);
      }
    } catch (e) {
      alert("An error occurred");
      setIsDeleting(false);
    }
  };

  return (
    <button 
      className={styles.deleteBtn} 
      onClick={handleDelete}
      disabled={isDeleting}
      title="Delete post"
    >
      <Trash2 size={18} />
    </button>
  );
}
