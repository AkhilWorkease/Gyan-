"use client";

import Link from "next/link";
import { Stethoscope, User, LogOut, Menu, X, ShieldCheck } from "lucide-react";
import styles from "./Navbar.module.css";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

export default function Navbar() {
  const { data: session, status } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <header className={styles.header}>
      <div className={`container ${styles.navContainer}`}>
        <Link href="/" className={styles.logo} onClick={() => setIsMobileMenuOpen(false)}>
          <div className={styles.logoIcon}>
            <Stethoscope size={24} color="white" />
          </div>
          <span className={styles.logoText}>Gyan</span>
        </Link>
        
        {/* Mobile menu toggle */}
        <button 
          className={styles.mobileMenuBtn} 
          onClick={toggleMobileMenu}
          aria-label="Toggle navigation menu"
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Navigation Links */}
        <nav className={`${styles.navLinks} ${isMobileMenuOpen ? styles.mobileOpen : ''}`}>
          <Link href="/" className={styles.navLink} onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
          <Link href="/doubts" className={styles.navLink} onClick={() => setIsMobileMenuOpen(false)}>Doubts</Link>
          
          {status === "loading" ? null : session ? (
            <>
              {session.user?.role === "ADMIN" && (
                <Link href="/admin" className={styles.navLink} onClick={() => setIsMobileMenuOpen(false)}>
                  <ShieldCheck size={18} style={{ display: 'inline', marginRight: '4px' }} />
                  Admin
                </Link>
              )}
              <Link href={`/profile`} className={styles.navLink} onClick={() => setIsMobileMenuOpen(false)}>
                <User size={18} style={{ display: 'inline', marginRight: '4px' }} />
                Profile
              </Link>
              <button onClick={() => { signOut(); setIsMobileMenuOpen(false); }} className={`btn btn-secondary ${styles.logoutBtn}`}>
                <LogOut size={16} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn btn-secondary" onClick={() => setIsMobileMenuOpen(false)}>Log In</Link>
              <Link href="/signup" className="btn btn-primary" onClick={() => setIsMobileMenuOpen(false)}>Sign Up</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
