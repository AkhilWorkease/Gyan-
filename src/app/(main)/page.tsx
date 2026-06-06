import prisma from "@/lib/prisma";
import styles from "./page.module.css";
import Link from "next/link";
import { Search } from "lucide-react";
import PostCard from "@/components/PostCard";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ q?: string, categoryId?: string }>;
}) {
  const { q, categoryId } = await searchParams;
  const query = q || "";

  const searchTerms = query.split(" ").filter(term => term.trim().length > 0);

  const whereClause: any = {};

  if (searchTerms.length > 0) {
    whereClause.AND = searchTerms.map(term => ({
      OR: [
        { symptom: { contains: term } },
        { remedy: { contains: term } },
        { title: { contains: term } },
        { content: { contains: term } },
        { author: { name: { contains: term } } },
        { author: { specialty: { contains: term } } },
        { author: { bio: { contains: term } } },
        { tags: { some: { name: { contains: term } } } },
        { category: { name: { contains: term } } }
      ],
    }));
  }

  if (categoryId) {
    whereClause.categoryId = categoryId;
  }

  const posts = await prisma.post.findMany({
    where: Object.keys(whereClause).length > 0 ? whereClause : undefined,
    include: {
      author: true,
      category: true,
      tags: true,
      _count: {
        select: { comments: true, likes: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

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
                placeholder="Search by symptom, remedy, tag..."
                className={`input-field ${styles.searchInput}`}
              />
              <select name="categoryId" defaultValue={categoryId} className={`input-field ${styles.categorySelect}`}>
                <option value="">All Categories</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
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
            {posts.map((post: any, i: number) => (
              <div key={post.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
                <PostCard post={post} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
