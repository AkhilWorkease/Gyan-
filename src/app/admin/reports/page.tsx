import React from "react";
import prisma from "@/lib/prisma";
import styles from "../admin.module.css";
import { deleteReport, deletePost } from "../actions";
import Link from "next/link";

export default async function ReportsPage() {
  const reports = await prisma.report.findMany({
    include: { post: true, reporter: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <header className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Reports</h1>
        <p className={styles.pageDescription}>Review user reports.</p>
      </header>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Reason</th>
              <th>Reporter</th>
              <th>Post Title</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report.id}>
                <td>{report.reason}</td>
                <td>{report.reporter?.name || report.reporter?.email || "Unknown"}</td>
                <td>
                  {report.post ? (
                    <Link href={`/post/${report.post.id}`} target="_blank" style={{ color: "var(--primary)", textDecoration: "underline" }}>
                      {report.post.title || "Untitled"}
                    </Link>
                  ) : "Deleted Post"}
                </td>
                <td>{new Date(report.createdAt).toLocaleDateString()}</td>
                <td>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <form action={async () => {
                      "use server";
                      await deleteReport(report.id);
                    }}>
                      <button type="submit" className={`${styles.actionButton} ${styles.btnSecondary}`}>
                        Dismiss
                      </button>
                    </form>
                    {report.post && (
                      <form action={async () => {
                        "use server";
                        await deletePost(report.post.id);
                      }}>
                        <button type="submit" className={`${styles.actionButton} ${styles.btnDanger}`}>
                          Delete Post
                        </button>
                      </form>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {reports.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", padding: "2rem" }}>
                  No reports found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
