import React from "react";
import prisma from "@/lib/prisma";
import styles from "../admin.module.css";
import { deleteUser } from "../actions";

export default async function UsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <header className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Users</h1>
        <p className={styles.pageDescription}>Manage registered users.</p>
      </header>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name || "N/A"}</td>
                <td>{user.email}</td>
                <td>
                  <span
                    style={{
                      padding: "0.25rem 0.5rem",
                      borderRadius: "4px",
                      background: user.role === "ADMIN" ? "var(--primary)" : "var(--border-color)",
                      color: user.role === "ADMIN" ? "white" : "inherit",
                      fontSize: "0.75rem",
                      fontWeight: "bold",
                    }}
                  >
                    {user.role}
                  </span>
                </td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>
                  <div style={{ display: "flex", gap: "0.5rem" }}>

                    <form action={async () => {
                      "use server";
                      await deleteUser(user.id);
                    }}>
                      <button type="submit" className={`${styles.actionButton} ${styles.btnDanger}`}>
                        Delete
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", padding: "2rem" }}>
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
