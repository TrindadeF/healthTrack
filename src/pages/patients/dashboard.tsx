import { useEffect, useState } from "react";
import api from "../../services/api";
import { PatientProfile, DoctorProfile } from "@/types/forms";
import Modal from "@/components/SharedComponents/Modal";
import styles from "./dashboard.module.css";

const PatientDashboard = () => {
  const [profile, setProfile] = useState<PatientProfile | null>(null);
  const [doctors, setDoctors] = useState<DoctorProfile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

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

  const handleOpenModal = async () => {
    setIsModalOpen(true);
    try {
      const response = await api.get("/user/doctors");
      setDoctors(response.data);
    } catch (err) {
      console.error("Erro ao buscar médicos:", err);
      setError("Erro ao buscar médicos.");
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setDoctors([]);
  };

  const handleScheduleAppointment = (doctorId: string) => {
    console.log(`Consulta agendada com o médico de ID: ${doctorId}`);
    alert("Consulta agendada com sucesso!");
    handleCloseModal();
  };

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
        <button className={styles.actionButton} onClick={handleOpenModal}>
          Agendar Consulta
        </button>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Agendar Consulta"
      >
        {doctors.length === 0 ? (
          <p className={styles.loading}>Carregando médicos...</p>
        ) : (
          <ul className={styles.doctorList}>
            {doctors.map((doctor) => (
              <li key={doctor.uid} className={styles.doctorCard}>
                <p>
                  <strong>Nome:</strong> {doctor.name}
                </p>
                <p>
                  <strong>Email:</strong> {doctor.email}
                </p>
                <p>
                  <strong>Hospital:</strong> {doctor.hospital}
                </p>
                <button
                  className={styles.scheduleButton}
                  onClick={() => handleScheduleAppointment(doctor.uid)}
                >
                  Escolher
                </button>
              </li>
            ))}
          </ul>
        )}
      </Modal>
    </div>
  );
};

export default PatientDashboard;
