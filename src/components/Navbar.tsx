"use client";

import Link from "next/link";
import { Stethoscope, User, LogOut } from "lucide-react";
import styles from "./Navbar.module.css";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <header className={styles.header}>
      <div className={`container ${styles.navContainer}`}>
        <Link href="/" className={styles.logo}>
          <div className={styles.logoIcon}>
            <Stethoscope size={24} color="white" />
          </div>
          <span className={styles.logoText}>Gyan</span>
        </Link>
        <nav className={styles.navLinks}>
          <Link href="/" className={styles.navLink}>Home</Link>
          
          {status === "loading" ? null : session ? (
            <>
              <Link href={`/profile`} className={styles.navLink}>
                <User size={18} style={{ display: 'inline', marginRight: '4px' }} />
                Profile
              </Link>
              <button onClick={() => signOut()} className={`btn btn-secondary ${styles.logoutBtn}`}>
                <LogOut size={16} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn btn-secondary">Log In</Link>
              <Link href="/signup" className="btn btn-primary">Sign Up</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
