/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import api from "../../services/api";
import { DoctorProfile } from "@/types/forms";
import styles from "./profile.module.css";

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
    return <p className={styles.error}>{error}</p>;
  }

  if (!profile) {
    return <p className={styles.loading}>Carregando...</p>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Perfil do Médico</h1>
      <div className={styles.profileCard}>
        <div className={styles.avatar}>
          <img
            src={`https://api.dicebear.com/6.x/initials/svg?seed=${profile.name}`}
            alt={`Avatar de ${profile.name}`}
          />
        </div>
        <div className={styles.info}>
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
    </div>
  );
};

export default DoctorProfilePage;
