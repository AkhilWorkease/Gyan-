import prisma from "@/lib/prisma";
import styles from "./page.module.css";
import Link from "next/link";
import { Search } from "lucide-react";
import PostCard from "@/components/PostCard";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q || "";

  const searchTerms = query.split(" ").filter(term => term.trim().length > 0);

  const posts = await prisma.post.findMany({
    where: searchTerms.length > 0
      ? {
          AND: searchTerms.map(term => ({
            OR: [
              { symptom: { contains: term } },
              { remedy: { contains: term } },
              { title: { contains: term } },
              { content: { contains: term } },
              { author: { name: { contains: term } } },
              { author: { specialty: { contains: term } } },
              { author: { bio: { contains: term } } },
            ],
          })),
        }
      : undefined,
    include: {
      author: true,
      _count: {
        select: { comments: true, likes: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className={styles.homeContainer}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Collective Knowledge of Homeopathy</h1>
          <p className={styles.heroSubtitle}>
            Share clinical observations and build a global knowledge base.
          </p>

          <form className={styles.searchForm}>
            <div className={styles.searchWrapper}>
              <Search className={styles.searchIcon} size={20} />
              <input
                type="text"
                name="q"
                defaultValue={query}
                placeholder="Search by symptom, remedy, or doctor name..."
                className={`input-field ${styles.searchInput}`}
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Search
            </button>
          </form>
        </div>
      </section>

      <section className={styles.feed}>
        <div className={styles.feedHeader}>
          <h2>{query ? "Search Results" : "Recent Updates"}</h2>
          <Link href="/post/new" className="btn btn-primary">
            Share Observation
          </Link>
        </div>

        {posts.length === 0 ? (
          <div className={`glass-panel ${styles.emptyState}`}>
            <p>No observations found. Be the first to share!</p>
          </div>
        ) : (
          <div className={styles.postList}>
            {posts.map((post: any) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
