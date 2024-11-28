import { useEffect, useState } from "react";
import api from "../../services/api";
import { PatientProfile } from "@/types/forms";
import styles from "./dashboard.module.css";

const PatientDashboard = () => {
  const [profile, setProfile] = useState<PatientProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPatientProfile = async () => {
      try {
        const response = await api.get("/user/logged");
        setProfile(response.data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Erro desconhecido.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPatientProfile();
  }, []);

  if (loading) {
    return (
      <div className={styles.container}>
        <p className={styles.loading}>Carregando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <p className={styles.error}>{error}</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className={styles.container}>
        <p className={styles.error}>Perfil do paciente não encontrado.</p>
      </div>
    );
  }

  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.header}>
        <h1 className={styles.title}>Bem-vindo, {profile.name}</h1>
      </header>
      <div className={styles.card}>
        <p>
          <strong>Email:</strong> {profile.email}
        </p>
        <p>
          <strong>Hospital:</strong> {profile.hospital}
        </p>
        {profile.nextAppointment ? (
          <p>
            <strong>Próxima consulta:</strong>{" "}
            {new Date(profile.nextAppointment).toLocaleString()}
          </p>
        ) : (
          <p>Sem consultas agendadas.</p>
        )}
      </div>
      <div className={styles.actions}>
        <button
          className={styles.actionButton}
          onClick={() => {
            console.log("Abrindo fluxo para agendar consulta...");
          }}
        >
          Agendar Consulta
        </button>
      </div>
    </div>
  );
};

export default PatientDashboard;
