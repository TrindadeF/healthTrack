import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/router";

const Toolbar = () => {
  const { user, logout } = useAuth();
  const router = useRouter();

  if (!user) return null;

  return (
    <div style={styles.toolbar}>
      <button style={styles.button} onClick={() => router.push("/")}>
        Home
      </button>
      <button style={styles.button} onClick={() => router.push("/profile")}>
        Perfil
      </button>
      <button style={styles.button} onClick={logout}>
        Logout
      </button>
    </div>
  );
};

const styles = {
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px 20px",
    background: "#007BFF",
    color: "white",
  },
  button: {
    background: "transparent",
    border: "none",
    color: "white",
    fontSize: "16px",
    cursor: "pointer",
    padding: "5px 10px",
  },
};

export default Toolbar;
