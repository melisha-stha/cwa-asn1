'use client'
import { useState } from 'react';
import Image from 'next/image';
import styles from './navbar.module.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        {/* Left side - Logo and Title */}
        <div className={styles.navLeft}>
          <div className={styles.logoContainer}>
            <Image 
              src="/latrobe-logo.svg" 
              alt="Latrobe University Logo" 
              width={60} 
              height={45}
              className={styles.logo}
            />
            <div className={styles.titleContainer}>
              <h1 className={styles.title}>CSE3CWA Assignment 2</h1>
              <p className={styles.studentNo}>Student No. 21923855</p>
            </div>
          </div>
        </div>

        {/* Right side - Desktop Navigation */}
        <div className={styles.navRight}>
          <ul className={styles.navLinks}>
            <li><a href="/" className={styles.navLink}>Home</a></li>
            <li><a href="/tabs" className={styles.navLink}>Tabs</a></li>
            <li><a href="/prelab-qns" className={styles.navLink}>Pre-lab Questions</a></li>
            <li><a href="/court-room" className={styles.navLink}>Court Room</a></li>
            <li><a href="/about" className={styles.navLink}>About</a></li>
          </ul>

          {/* Hamburger Menu - Only visible on mobile */}
          <div className={styles.hamburgerContainer}>
            <div className={styles.hamburger} onClick={toggleMenu}>
              <div className={`${styles.bar} ${isMenuOpen ? styles.open1 : ''}`}></div>
              <div className={`${styles.bar} ${isMenuOpen ? styles.open2 : ''}`}></div>
              <div className={`${styles.bar} ${isMenuOpen ? styles.open3 : ''}`}></div>
            </div>

            {/* Mobile Menu */}
            <nav className={isMenuOpen ? styles.mobileMenuOpen : styles.mobileMenu}>
              <ul>
                <li><a href="/" onClick={() => setIsMenuOpen(false)}>Home</a></li>
                <li><a href="/tabs" onClick={() => setIsMenuOpen(false)}>Tabs</a></li>
                <li><a href="/prelab-qns" onClick={() => setIsMenuOpen(false)}>Pre-lab Questions</a></li>
                <li><a href="/court-room" onClick={() => setIsMenuOpen(false)}>Court Room</a></li>
                <li><a href="/about" onClick={() => setIsMenuOpen(false)}>About</a></li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;