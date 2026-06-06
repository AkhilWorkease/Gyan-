import React from "react";
import prisma from "@/lib/prisma";
import styles from "../admin.module.css";
import { deleteDoubt } from "../actions";

export default async function DoubtsPage() {
  const doubts = await prisma.doubt.findMany({
    include: { author: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <header className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Doubts</h1>
        <p className={styles.pageDescription}>Manage user doubts.</p>
      </header>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {doubts.map((doubt) => (
              <tr key={doubt.id}>
                <td>{doubt.title}</td>
                <td>{doubt.author?.name || doubt.author?.email || "Unknown"}</td>
                <td>{new Date(doubt.createdAt).toLocaleDateString()}</td>
                <td>
                  <form action={async () => {
                    "use server";
                    await deleteDoubt(doubt.id);
                  }}>
                    <button type="submit" className={`${styles.actionButton} ${styles.btnDanger}`}>
                      Delete
                    </button>
                  </form>
                </td>
              </tr>
            ))}
            {doubts.length === 0 && (
              <tr>
                <td colSpan={4} style={{ textAlign: "center", padding: "2rem" }}>
                  No doubts found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
