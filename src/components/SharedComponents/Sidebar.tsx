import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/router";
import {
  FaHome,
  FaUserAlt,
  FaSignOutAlt,
  FaBars,
  FaHistory,
  FaBell,
} from "react-icons/fa";
import styles from "./Sidebar.module.css";

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const router = useRouter();

  if (!user) return null;

  const userProfileRoute =
    user.role === "paciente" ? "/patients/dashboard" : "/doctors/profile";
  const userHistoryRoute =
    user.role === "paciente" ? "/patients/history" : "/doctors/";
  const userNotificationsRoute =
    user.role === "paciente"
      ? "/patients/notifications"
      : "/doctors/notifications";

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

        <div
          className={styles.icon}
          onClick={() => router.push(userProfileRoute)}
        >
          <FaUserAlt />
          <span className={styles.tooltip}>Perfil</span>
        </div>

        <div
          className={styles.icon}
          onClick={() => router.push(userHistoryRoute)}
        >
          <FaHistory />
          <span className={styles.tooltip}>
            {user.role === "paciente" ? "Histórico" : "Pacientes"}
          </span>
        </div>

        <div
          className={styles.icon}
          onClick={() => router.push(userNotificationsRoute)}
        >
          <FaBell />
          <span className={styles.tooltip}>Notificações</span>
        </div>

        <div className={styles.icon} onClick={logout}>
          <FaSignOutAlt />
          <span className={styles.tooltip}>Logout</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
