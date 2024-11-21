import { useEffect, useState } from "react";
import api from "../../services/api";
import { DoctorProfile } from "@/types/forms";

const DoctorsPage = () => {
  const [doctors, setDoctors] = useState<DoctorProfile[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await api.get("/doctors");
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
    <div>
      <h1>Lista de Médicos</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {doctors.map((doctor) => (
          <li key={doctor.id}>
            <strong>{doctor.name}</strong> - {doctor.hospital}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DoctorsPage;
