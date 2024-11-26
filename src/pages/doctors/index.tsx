import { useEffect, useState } from "react";
import api from "../../services/api";
import { DoctorProfile } from "@/types/forms";

const DoctorsPage = () => {
  const [doctors, setDoctors] = useState<DoctorProfile[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await api.get("/users", {
          params: { role: "medico" },
        });
        setDoctors(response.data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Erro desconhecido.");
        }
      }
    };

    fetchDoctors();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Lista de Médicos</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {doctors.length > 0 ? (
          doctors.map((doctor) => (
            <li key={doctor.uid}>
              <strong>{doctor.name}</strong> - {doctor.hospital}
            </li>
          ))
        ) : (
          <p>Nenhum médico encontrado.</p>
        )}
      </ul>
    </div>
  );
};

export default DoctorsPage;
