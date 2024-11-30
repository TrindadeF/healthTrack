import { useEffect, useState } from "react";
import api from "../../services/api";
import { Diagnosis, DoctorProfile } from "@/types/forms";

interface DiagnosisWithDoctor extends Diagnosis {
  doctor: DoctorProfile;
}

const PatientHistoryPage = () => {
  const [history, setHistory] = useState<DiagnosisWithDoctor[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const response = await api.get("/user/my-diagnoses");
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
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <p className="text-gray-500 text-center">Carregando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <p className="text-red-500 text-center">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Histórico de Saúde
      </h1>
      {history.length === 0 ? (
        <p className="text-gray-500 text-center">Não há registros de saúde.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {history.map((record) => (
            <div
              key={record.id}
              className="border rounded-lg p-4 shadow-md bg-white hover:shadow-lg transition"
            >
              <h2 className="text-lg font-bold text-blue-600 mb-2">
                Diagnóstico
              </h2>
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
              <div className="mt-4 border-t pt-4">
                <h3 className="text-md font-bold text-gray-800">
                  Médico Responsável
                </h3>
                <p>
                  <strong>Nome:</strong> {record.doctor.name}
                </p>
                <p>
                  <strong>Email:</strong> {record.doctor.email}
                </p>
                <p>
                  <strong>Hospital:</strong> {record.doctor.hospital}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientHistoryPage;
