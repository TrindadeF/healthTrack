/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import api from "../../services/api";
import { DoctorProfile, PatientProfile } from "@/types/forms";
import Modal from "@/components/SharedComponents/Modal";
import { toast, ToastContainer } from "react-toastify";
import styles from "./index.module.css";

const DoctorsPage = () => {
  const [doctor, setDoctor] = useState<DoctorProfile | null>(null);
  const [patients, setPatients] = useState<PatientProfile[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<PatientProfile | null>(
    null
  );
  const [diagnoses, setDiagnoses] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [diagnosisForm, setDiagnosisForm] = useState({
    description: "",
    medications: "",
    exams: "",
  });
  const [currentDiagnosis, setCurrentDiagnosis] = useState<any | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Usuário não autenticado.");
          return;
        }

        const doctorResponse = await api.get("/user/logged", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDoctor(doctorResponse.data);

        const patientsResponse = await api.get("/user/patients", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPatients(patientsResponse.data);
      } catch (err) {
        toast.error("Erro ao buscar dados. Tente novamente mais tarde.");
      }
    };

    fetchData();
  }, []);

  const handleOpenPatientModal = async (patient: PatientProfile) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Usuário não autenticado.");
        return;
      }

      setSelectedPatient(patient);

      const response = await api.get(`/diagnoses/${patient.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setDiagnoses(response.data);
      setIsModalOpen(true);
    } catch (err) {
      toast.error("Erro ao buscar diagnósticos do paciente.");
    }
  };

  const handleAddDiagnosis = async () => {
    if (!selectedPatient || !doctor) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Usuário não autenticado.");
        return;
      }

      const response = await api.post(
        "/diagnoses/",
        {
          patientId: selectedPatient.id,
          doctorId: doctor.id,
          description: diagnosisForm.description,
          medications: diagnosisForm.medications.split(","),
          exams: diagnosisForm.exams.split(","),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setDiagnoses([response.data.diagnosis, ...diagnoses]);
      setDiagnosisForm({ description: "", medications: "", exams: "" });
      toast.success("Diagnóstico adicionado com sucesso!");
    } catch (err) {
      toast.error("Erro ao adicionar diagnóstico.");
    }
  };

  const handleDeleteDiagnosis = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Usuário não autenticado.");
        return;
      }

      await api.delete(`/diagnoses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setDiagnoses(diagnoses.filter((diag) => diag._id !== id));
      toast.success("Diagnóstico excluído com sucesso!");
    } catch (err) {
      toast.error("Erro ao excluir diagnóstico.");
    }
  };

  const handleEditDiagnosis = (diagnosis: any) => {
    setCurrentDiagnosis(diagnosis);
    setDiagnosisForm({
      description: diagnosis.description,
      medications: diagnosis.medications.join(", "),
      exams: diagnosis.exams.join(", "),
    });
  };

  const handleUpdateDiagnosis = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token || !currentDiagnosis) {
        toast.error("Erro ao autenticar ou encontrar o diagnóstico.");
        return;
      }

      const response = await api.put(
        `/diagnoses/${currentDiagnosis._id}`,
        {
          description: diagnosisForm.description,
          medications: diagnosisForm.medications.split(","),
          exams: diagnosisForm.exams.split(","),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setDiagnoses(
        diagnoses.map((diag) =>
          diag._id === currentDiagnosis._id ? response.data.diagnosis : diag
        )
      );

      setCurrentDiagnosis(null);
      setDiagnosisForm({ description: "", medications: "", exams: "" });
      toast.success("Diagnóstico atualizado com sucesso!");
    } catch (err) {
      toast.error("Erro ao atualizar diagnóstico.");
    }
  };

  return (
    <div className="container mx-auto p-10">
      <ToastContainer position="top-right" autoClose={3000} />

      <h1 className="text-2xl font-bold text-gray-800 mb-6">Pacientes</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {patients.map((patient) => (
          <div
            key={patient.id}
            className="border rounded-lg p-4 shadow-md flex flex-col justify-between"
          >
            <h3 className="text-lg font-semibold text-blue-500">
              {patient.name}
            </h3>
            <p className="text-gray-600">
              <strong>Email:</strong> {patient.email}
            </p>
            <button
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
              onClick={() => handleOpenPatientModal(patient)}
            >
              Visualizar Detalhes
            </button>
          </div>
        ))}
      </div>

      {isModalOpen && selectedPatient && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedPatient(null);
            setDiagnoses([]);
          }}
          title={`Detalhes de ${selectedPatient?.name || "Paciente"}`}
        >
          <div className={styles.modalContainer}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Informações do Paciente</h2>
              <button
                className={styles.closeButton}
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedPatient(null);
                  setDiagnoses([]);
                }}
              >
                ✕
              </button>
            </div>

            <div className={styles.modalContent}>
              {selectedPatient ? (
                <div className={styles.patientInfo}>
                  <p>
                    <strong>Nome:</strong> {selectedPatient.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {selectedPatient.email}
                  </p>
                </div>
              ) : (
                <p className={styles.noPatientInfo}>
                  Informações do paciente não disponíveis.
                </p>
              )}

              <h3>Diagnósticos</h3>
              {diagnoses.length > 0 ? (
                <ul className={styles.diagnosisList}>
                  {diagnoses.map((diag) => (
                    <li key={diag.id} className={styles.diagnosisCard}>
                      <p>
                        <strong>Descrição:</strong> {diag.description}
                      </p>
                      <p>
                        <strong>Medicamentos:</strong>{" "}
                        {diag.medications.join(", ")}
                      </p>
                      <p>
                        <strong>Exames:</strong> {diag.exams.join(", ")}
                      </p>
                      <div className={styles.diagnosisActions}>
                        <button
                          className={`${styles.actionButton} ${styles.editButton}`}
                          onClick={() => handleEditDiagnosis(diag)}
                        >
                          Editar
                        </button>
                        <button
                          className={`${styles.actionButton} ${styles.deleteButton}`}
                          onClick={() => handleDeleteDiagnosis(diag._id)}
                        >
                          Excluir
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className={styles.noDiagnosisMessage}>
                  Este paciente ainda não possui diagnósticos registrados.
                </p>
              )}

              <div className={styles.addDiagnosisForm}>
                <h3>
                  {currentDiagnosis
                    ? "Editar Diagnóstico"
                    : "Adicionar Diagnóstico"}
                </h3>
                <label>Descrição</label>
                <textarea
                  className={styles.textarea}
                  value={diagnosisForm.description}
                  onChange={(e) =>
                    setDiagnosisForm({
                      ...diagnosisForm,
                      description: e.target.value,
                    })
                  }
                ></textarea>

                <label>Medicamentos (separados por vírgula)</label>
                <input
                  className={styles.input}
                  value={diagnosisForm.medications}
                  onChange={(e) =>
                    setDiagnosisForm({
                      ...diagnosisForm,
                      medications: e.target.value,
                    })
                  }
                />

                <label>Exames (separados por vírgula)</label>
                <input
                  className={styles.input}
                  value={diagnosisForm.exams}
                  onChange={(e) =>
                    setDiagnosisForm({
                      ...diagnosisForm,
                      exams: e.target.value,
                    })
                  }
                />

                <button
                  className={styles.saveButton}
                  onClick={
                    currentDiagnosis
                      ? handleUpdateDiagnosis
                      : handleAddDiagnosis
                  }
                >
                  {currentDiagnosis
                    ? "Atualizar Diagnóstico"
                    : "Adicionar Diagnóstico"}
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default DoctorsPage;
