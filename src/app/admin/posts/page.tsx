import React from "react";
import prisma from "@/lib/prisma";
import styles from "../admin.module.css";
import { deletePost } from "../actions";

export default async function PostsPage() {
  const posts = await prisma.post.findMany({
    include: { author: true, category: true, _count: { select: { reports: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <header className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Posts</h1>
        <p className={styles.pageDescription}>Manage user posts.</p>
      </header>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Category</th>
              <th>Reports</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id}>
                <td>{post.title || "Untitled"}</td>
                <td>{post.author?.name || post.author?.email || "Unknown"}</td>
                <td>{post.category?.name || "None"}</td>
                <td>
                  <span style={{ color: post._count.reports > 0 ? "#ef4444" : "inherit" }}>
                    {post._count.reports}
                  </span>
                </td>
                <td>{new Date(post.createdAt).toLocaleDateString()}</td>
                <td>
                  <form action={async () => {
                    "use server";
                    await deletePost(post.id);
                  }}>
                    <button type="submit" className={`${styles.actionButton} ${styles.btnDanger}`}>
                      Delete
                    </button>
                  </form>
                </td>
              </tr>
            ))}
            {posts.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: "2rem" }}>
                  No posts found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
