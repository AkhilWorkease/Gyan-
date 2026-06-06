import prisma from "@/lib/prisma";
import Link from "next/link";
import { User, MessageCircle } from "lucide-react";
import styles from "../page.module.css";

export default async function DoubtsPage() {
  const doubts = await prisma.doubt.findMany({
    include: {
      author: true,
      _count: {
        select: { comments: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className={styles.homeContainer}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Doubt Clearing</h1>
          <p className={styles.heroSubtitle}>
            Ask questions and help fellow practitioners by clearing their doubts.
          </p>
        </div>
      </section>

      <section className={styles.feed}>
        <div className={styles.feedHeader}>
          <h2>Recent Doubts</h2>
          <Link href="/doubts/new" className="btn btn-primary">
            Ask a Doubt
          </Link>
        </div>

        {doubts.length === 0 ? (
          <div className={`glass-panel ${styles.emptyState}`}>
            <p>No doubts posted yet. Ask the first question!</p>
          </div>
        ) : (
          <div className={styles.postList}>
            {doubts.map((doubt: any) => (
              <div key={doubt.id} className={`glass-panel`}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                  <User size={24} />
                  <div>
                    <div style={{ fontWeight: 600 }}>{doubt.author.name}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      {new Date(doubt.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </div>
                  </div>
                </div>
                <h3 style={{ marginBottom: '10px', fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {doubt.title}
                </h3>
                <p style={{ marginBottom: '20px', color: 'var(--text-secondary)' }}>
                  {doubt.content.length > 150 ? doubt.content.substring(0, 150) + '...' : doubt.content}
                </p>
                <div style={{ display: 'flex', gap: '15px' }}>
                  <Link href={`/doubts/${doubt.id}`} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '0.5rem 1rem' }}>
                    <MessageCircle size={18} />
                    <span>{doubt._count.comments} Answers</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
