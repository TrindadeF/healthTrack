import Link from "next/link";
import styles from "./Header.module.css";

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <h1 className={styles.logo}>
          <Link href="/">HealthTrack</Link>
        </h1>
        <nav>
          <ul className={styles.navList}>
            <li>
              <Link href="/patients/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link href="/patients/history">Histórico</Link>
            </li>
            <li>
              <Link href="/auth/login">Login</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
