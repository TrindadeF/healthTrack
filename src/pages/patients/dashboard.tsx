import { useEffect, useState } from "react";
import api from "../../services/api";
import { PatientProfile } from "@/types/forms";

const PatientDashboard = () => {
  const [profile, setProfile] = useState<PatientProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatientProfile = async () => {
      try {
        const response = await api.get("/patients/profile");
        setProfile(response.data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Erro desconhecido.");
        }
      }
    };

    fetchPatientProfile();
  }, []);

  if (error) {
    return (
      <div className="container">
        <p className="error">{error}</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container">
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Bem-vindo, {profile.name}</h1>
      <div className="card">
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
      <button>Agendar Consulta</button>
    </div>
  );
};

export default PatientDashboard;
