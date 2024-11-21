import { useEffect, useState } from "react";
import api from "../../services/api";
import { DoctorProfile } from "@/types/forms";

const DoctorProfilePage = () => {
  const [profile, setProfile] = useState<DoctorProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/doctors/profile");
        setProfile(response.data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Erro desconhecido.");
        }
      }
    };

    fetchProfile();
  }, []);

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  if (!profile) {
    return <p>Carregando...</p>;
  }

  return (
    <div>
      <h1>Perfil do Médico</h1>
      <p>
        <strong>Nome:</strong> {profile.name}
      </p>
      <p>
        <strong>Email:</strong> {profile.email}
      </p>
      <p>
        <strong>Hospital:</strong> {profile.hospital}
      </p>
    </div>
  );
};

export default DoctorProfilePage;
