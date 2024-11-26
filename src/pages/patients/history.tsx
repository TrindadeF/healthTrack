import { useEffect, useState } from "react";
import api from "../../services/api";
import { Diagnosis } from "@/types/forms";
import "@/styles/global.css";

const PatientHistoryPage = () => {
  const [history, setHistory] = useState<Diagnosis[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.get("/user/my-diagnoses");
        setHistory(response.data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Erro desconhecido.");
        }
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="historyContainer">
      <h1 className="title">Histórico de Saúde</h1>
      {error && <p className="error">{error}</p>}
      {history.length === 0 ? (
        <p className="emptyMessage">Não há registros de saúde.</p>
      ) : (
        <ul className="historyGrid">
          {history.map((record) => (
            <li key={record.id} className="historyCard">
              <p>
                <strong>Descrição:</strong> {record.description}
              </p>
              <p>
                <strong>Data:</strong>{" "}
                {new Date(record.date).toLocaleDateString()}
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
