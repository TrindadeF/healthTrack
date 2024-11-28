import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import api from "../../services/api";
import { DoctorProfile } from "@/types/forms";

const DoctorProfilePage = () => {
  const [profile, setProfile] = useState<DoctorProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Usuário não autenticado. Redirecionando...");
          setTimeout(() => router.push("/auth/login"), 2000);
          return;
        }

        const response = await api.get("/user/logged", {
          params: { uid: localStorage.getItem("uid") },
        });

        if (response.status === 200) {
          setProfile(response.data);
        } else {
          setError("Erro ao buscar dados do usuário.");
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Erro desconhecido.");
        }
      }
    };

    fetchProfile();
  }, [router]);

  if (error) {
    return <p className="error">{error}</p>;
  }

  if (!profile) {
    return <p className="loading">Carregando...</p>;
  }

  return (
    <div className="container">
      <h1 className="title">Perfil do Médico</h1>
      <div className="profileCard">
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
    </div>
  );
};

export default DoctorProfilePage;
