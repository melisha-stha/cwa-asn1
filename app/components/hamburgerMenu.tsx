// This HamburgerMenu component is adapted from the Week 3 CSE3CWA lab example.

'use client'
import { useState } from 'react';
import styles from './hamburgerMenu.module.css';


const HamburgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={styles.container}>
      <div className={styles.hamburger} onClick={toggleMenu}>
        <div className={`${styles.bar} ${isOpen ? styles.open1 : ''}`}></div>
        <div className={`${styles.bar} ${isOpen ? styles.open2 : ''}`}></div>
        <div className={`${styles.bar} ${isOpen ? styles.open3 : ''}`}></div>
    </div>

      <nav className={isOpen ? styles.menuOpen : styles.menu}>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/about">About</a></li>
          <li><a href="/tabs">Tabs</a></li>
          <li><a href="/prelab-qns">Pre-lab Questions</a></li>
          <li><a href="/court-room">Court Room</a></li>
          <li><a href="/coding-races">Coding Races</a></li>
        </ul>
      </nav>
    </div>
  );
};

export default HamburgerMenu;