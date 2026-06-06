import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Users, FileText, HelpCircle, Tags, Flag, ShieldCheck } from "lucide-react";
import styles from "./admin.module.css";
import React from "react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    redirect("/");
  }

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/posts", label: "Posts", icon: FileText },
    { href: "/admin/doubts", label: "Doubts", icon: HelpCircle },
    { href: "/admin/categories", label: "Categories", icon: Tags },
    { href: "/admin/reports", label: "Reports", icon: Flag },
  ];

  return (
    <div className={styles.adminLayout}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarTitle}>
          <ShieldCheck className="w-6 h-6 text-primary" />
          Gyan Admin
        </div>
        <nav>
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className={styles.navLink}>
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          ))}
        </nav>
        
        <div style={{ marginTop: "auto", paddingTop: "2rem", borderTop: "1px solid var(--border-color)" }}>
          <Link href="/" className={styles.navLink} style={{ color: "var(--primary)" }}>
            <ShieldCheck className="w-5 h-5" />
            Back to User Site
          </Link>
        </div>
      </aside>
      <main className={styles.mainContent}>
        <div style={{ marginBottom: '2rem', padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', borderRadius: '8px', color: '#ef4444', fontWeight: 'bold' }}>
          ⚠️ You are currently in the Admin Panel
        </div>
        {children}
      </main>
    </div>
  );
}
