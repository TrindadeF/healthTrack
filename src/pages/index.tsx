import Link from "next/link";
import styles from "../styles/Home.module.css";

const Home = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Bem-vindo ao HealthTrack</h1>
      <p className={styles.description}>
        Gerencie sua saúde de forma simples e eficiente.
      </p>

      <div className={styles.links}>
        <Link href="/auth/login">
          <div className={styles.card}>
            <h2>Login &rarr;</h2>
            <p>Acesse sua conta e gerencie seus dados de saúde.</p>
          </div>
        </Link>

        <Link href="/auth/register">
          <div className={styles.card}>
            <h2>Registrar &rarr;</h2>
            <p>Crie sua conta para começar a usar o sistema.</p>
          </div>
        </Link>

        <Link href="/patients/dashboard">
          <div className={styles.card}>
            <h2>Dashboard &rarr;</h2>
            <p>Veja informações e relatórios de saúde.</p>
          </div>
        </Link>

        <Link href="/patients/history">
          <div className={styles.card}>
            <h2>Histórico &rarr;</h2>
            <p>Consulte seu histórico de diagnósticos e tratamentos.</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Home;
