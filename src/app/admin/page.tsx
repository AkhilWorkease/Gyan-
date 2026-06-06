import React from "react";
import prisma from "@/lib/prisma";
import styles from "./admin.module.css";
import { Users, FileText, HelpCircle, Flag } from "lucide-react";

export default async function AdminDashboard() {
  const [usersCount, postsCount, doubtsCount, reportsCount] = await Promise.all([
    prisma.user.count(),
    prisma.post.count(),
    prisma.doubt.count(),
    prisma.report.count(),
  ]);

  return (
    <div>
      <header className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Dashboard</h1>
        <p className={styles.pageDescription}>Overview of the Gyan platform metrics.</p>
      </header>

      <div className={styles.statsGrid}>
        <div className={styles.card}>
          <div className={styles.statCard}>
            <Users className="w-8 h-8 text-primary mb-2" />
            <span className={styles.statValue}>{usersCount}</span>
            <span className={styles.statLabel}>Total Users</span>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.statCard}>
            <FileText className="w-8 h-8 text-primary mb-2" />
            <span className={styles.statValue}>{postsCount}</span>
            <span className={styles.statLabel}>Total Posts</span>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.statCard}>
            <HelpCircle className="w-8 h-8 text-primary mb-2" />
            <span className={styles.statValue}>{doubtsCount}</span>
            <span className={styles.statLabel}>Total Doubts</span>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.statCard}>
            <Flag className="w-8 h-8 text-primary mb-2" />
            <span className={styles.statValue}>{reportsCount}</span>
            <span className={styles.statLabel}>Total Reports</span>
          </div>
        </div>
      </div>
    </div>
  );
}
