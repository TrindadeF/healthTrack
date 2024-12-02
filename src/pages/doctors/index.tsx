/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import api from "../../services/api";
import { DoctorProfile, PatientProfile } from "@/types/forms";
import Modal from "@/components/SharedComponents/Modal";
import { toast, ToastContainer } from "react-toastify";

const DoctorsPage = () => {
  const [doctor, setDoctor] = useState<DoctorProfile | null>(null);
  const [patients, setPatients] = useState<PatientProfile[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<PatientProfile | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [diagnoses, setDiagnoses] = useState<any[]>([]);
  const [currentDiagnosis, setCurrentDiagnosis] = useState<any | null>(null);
  const [diagnosis, setDiagnosis] = useState({
    description: "",
    medications: "",
    exams: "",
  });

  useEffect(() => {
    const fetchDoctorData = async () => {
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

        const diagnosesResponse = await api.get(
          `/diagnoses/${doctorResponse.data.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setDiagnoses(diagnosesResponse.data);
      } catch (err) {
        toast.error("Erro ao buscar dados. Tente novamente mais tarde.");
      }
    };

    fetchDoctorData();
  }, []);

  const handleAddDiagnosis = async () => {
    if (!selectedPatient || !doctor) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Usuário não autenticado. Faça login novamente.");
        return;
      }

      const response = await api.post(
        "/diagnoses/",
        {
          patientId: selectedPatient.id,
          doctorId: doctor.id,
          description: diagnosis.description,
          medications: diagnosis.medications.split(","),
          exams: diagnosis.exams.split(","),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setDiagnoses([response.data.diagnosis, ...diagnoses]);
      setIsModalOpen(false);
      toast.success("Diagnóstico adicionado com sucesso!");
    } catch (err) {
      toast.error("Erro ao adicionar diagnóstico. Tente novamente.");
    }
  };

  const handleDeleteDiagnosis = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Usuário não autenticado. Faça login novamente.");
        return;
      }

      await api.delete(`/diagnoses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setDiagnoses(diagnoses.filter((diag) => diag.id !== id));
      toast.success("Diagnóstico excluído com sucesso!");
    } catch (err) {
      toast.error("Erro ao excluir diagnóstico.");
    }
  };

  const handleEditDiagnosis = (diagnosis: any) => {
    setCurrentDiagnosis(diagnosis);
    setDiagnosis({
      description: diagnosis.description,
      medications: diagnosis.medications.join(", "),
      exams: diagnosis.exams.join(", "),
    });
    setIsModalOpen(true);
  };

  const handleUpdateDiagnosis = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token || !currentDiagnosis) {
        toast.error("Erro ao autenticar ou encontrar o diagnóstico.");
        return;
      }

      const response = await api.put(
        `/diagnoses/${currentDiagnosis.id}`,
        {
          description: diagnosis.description,
          medications: diagnosis.medications.split(","),
          exams: diagnosis.exams.split(","),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setDiagnoses(
        diagnoses.map((diag) =>
          diag.id === currentDiagnosis.id ? response.data.diagnosis : diag
        )
      );

      setIsModalOpen(false);
      setCurrentDiagnosis(null);
      toast.success("Diagnóstico atualizado com sucesso!");
    } catch (err) {
      toast.error("Erro ao atualizar diagnóstico.");
    }
  };

  return (
    <div className="container mx-auto p-10">
      <ToastContainer position="top-right" autoClose={3000} />

      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Perfil do Médico
      </h1>

      {doctor && (
        <div className="border rounded-lg p-6 shadow-md mb-6">
          <h2 className="text-xl font-semibold text-blue-600">{doctor.name}</h2>
          <p className="text-gray-600">
            <strong>Hospital:</strong> {doctor.hospital}
          </p>
          <p className="text-gray-600">
            <strong>Email:</strong> {doctor.email}
          </p>
        </div>
      )}

      <h2 className="text-xl font-bold text-gray-800 mb-4">Diagnósticos</h2>
      {diagnoses.length === 0 ? (
        <p className="text-gray-500">Nenhum diagnóstico registrado.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {diagnoses.map((diag) => (
            <div
              key={diag.id}
              className="border rounded-lg p-4 shadow-md flex flex-col justify-between"
            >
              <p>
                <strong>Descrição:</strong> {diag.description}
              </p>
              <p>
                <strong>Paciente:</strong> {diag.patientId}
              </p>
              <div className="flex justify-between mt-4">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                  onClick={() => handleEditDiagnosis(diag)}
                >
                  Editar
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                  onClick={() => handleDeleteDiagnosis(diag.id)}
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setCurrentDiagnosis(null);
          }}
          title={
            currentDiagnosis ? "Editar Diagnóstico" : "Adicionar Diagnóstico"
          }
        >
          <div>
            <label>Descrição</label>
            <textarea
              className="w-full border rounded p-2"
              value={diagnosis.description}
              onChange={(e) =>
                setDiagnosis({ ...diagnosis, description: e.target.value })
              }
            ></textarea>

            <label>Medicamentos (separados por vírgula)</label>
            <input
              className="w-full border rounded p-2"
              value={diagnosis.medications}
              onChange={(e) =>
                setDiagnosis({ ...diagnosis, medications: e.target.value })
              }
            />

            <label>Exames (separados por vírgula)</label>
            <input
              className="w-full border rounded p-2"
              value={diagnosis.exams}
              onChange={(e) =>
                setDiagnosis({ ...diagnosis, exams: e.target.value })
              }
            />

            <button
              className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              onClick={
                currentDiagnosis ? handleUpdateDiagnosis : handleAddDiagnosis
              }
            >
              {currentDiagnosis
                ? "Atualizar Diagnóstico"
                : "Salvar Diagnóstico"}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default DoctorsPage;
