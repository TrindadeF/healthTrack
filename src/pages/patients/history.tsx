import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import { Diagnosis, DoctorProfile } from "@/types/forms";
import styles from "./history.module.css";

interface DiagnosisWithDoctor extends Diagnosis {
  doctor: DoctorProfile;
}

const PatientHistoryPage = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState<DiagnosisWithDoctor[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        if (!user) {
          setError("Usuário não autenticado.");
          return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
          setError("Token não encontrado.");
          return;
        }

        const response = await api.get(`/diagnoses/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Dados recebidos:", response.data);
        setHistory(response.data);
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

    fetchHistory();
  }, [user]);

  if (loading) {
    return (
      <div className={styles.historyContainer}>
        <p className={styles.emptyMessage}>Carregando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.historyContainer}>
        <p className={styles.error}>{error}</p>
      </div>
    );
  }

  return (
    <div className={styles.historyContainer}>
      <h1 className={styles.title}>Histórico de Saúde</h1>
      {history.length === 0 ? (
        <p className={styles.emptyMessage}>Não há registros de saúde.</p>
      ) : (
        <ul className={styles.historyGrid}>
          {history.map((record) => (
            <li key={record.id} className={styles.historyCard}>
              <p>
                <strong>Médico:</strong> {record.doctorId.name}
              </p>
              <p>
                <strong>Hospital:</strong> {record.doctorId.hospital}
              </p>
              <p>
                <strong>Descrição:</strong> {record.description}
              </p>
              <p>
                <strong>Data:</strong>{" "}
                {new Date(record.createdAt).toLocaleDateString()}
              </p>
              <p>
                <strong>Medicamentos:</strong> {record.medications.join(", ")}
              </p>
              <p>
                <strong>Exames:</strong> {record.exams.join(", ")}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PatientHistoryPage;
