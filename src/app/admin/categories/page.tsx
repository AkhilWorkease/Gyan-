import React from "react";
import prisma from "@/lib/prisma";
import styles from "../admin.module.css";
import { createCategory, deleteCategory } from "../actions";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { posts: true } } },
  });

  return (
    <div>
      <header className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Categories</h1>
        <p className={styles.pageDescription}>Manage post categories.</p>
      </header>

      <div className={styles.card} style={{ marginBottom: "2rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>Add New Category</h2>
        <form action={async (formData) => {
          "use server";
          const name = formData.get("name") as string;
          if (name) await createCategory(name);
        }} style={{ display: "flex", gap: "1rem" }}>
          <input
            type="text"
            name="name"
            placeholder="Category Name"
            required
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "6px",
              border: "1px solid var(--border-color)",
              background: "transparent",
              color: "var(--text-color)",
              flex: 1
            }}
          />
          <button type="submit" className={`${styles.actionButton} ${styles.btnPrimary}`}>
            Add Category
          </button>
        </form>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Posts Count</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id}>
                <td>{category.name}</td>
                <td>{category._count.posts}</td>
                <td>
                  <form action={async () => {
                    "use server";
                    await deleteCategory(category.id);
                  }}>
                    <button type="submit" className={`${styles.actionButton} ${styles.btnDanger}`}>
                      Delete
                    </button>
                  </form>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={3} style={{ textAlign: "center", padding: "2rem" }}>
                  No categories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
