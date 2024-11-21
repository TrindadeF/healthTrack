import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <p>
          &copy; {new Date().getFullYear()} HealthTrack. Todos os direitos
          reservados.
        </p>
        <p>
          Desenvolvido por{" "}
          <a
            href="https://github.com/TrindadeF"
            target="_blank"
            rel="noopener noreferrer"
          >
            TrindadeF
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
