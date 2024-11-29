import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/router";
import { FaHome, FaUserAlt, FaSignOutAlt, FaBars } from "react-icons/fa";
import styles from "./toolbar.module.css";

const Toolbar: React.FC = () => {
  const { user, logout } = useAuth();
  const router = useRouter();

  if (!user) return null;

  return (
    <div className={styles.sidebarContainer}>
      <div className={styles.trigger}>
        <FaBars />
      </div>

      <div className={styles.sidebar}>
        <div className={styles.icon} onClick={() => router.push("/")}>
          <FaHome />
          <span className={styles.tooltip}>Home</span>
        </div>
        <div className={styles.icon} onClick={() => router.push("/profile")}>
          <FaUserAlt />
          <span className={styles.tooltip}>Perfil</span>
        </div>
        <div className={styles.icon} onClick={logout}>
          <FaSignOutAlt />
          <span className={styles.tooltip}>Logout</span>
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
