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
  const [diagnosis, setDiagnosis] = useState({
    description: "",
    medications: "",
    exams: "",
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Usuário não autenticado.");
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
        setError("Erro ao buscar dados do médico ou pacientes.");
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
        setError("Usuário não autenticado.");
        toast.error("Usuário não autenticado. Faça login novamente.");
        return;
      }

      await api.post(
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

      setIsModalOpen(false);
      toast.success("Diagnóstico adicionado com sucesso!");
    } catch (err) {
      setError("Erro ao adicionar diagnóstico.");
      toast.error("Erro ao adicionar diagnóstico. Tente novamente.");
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

      <h2 className="text-xl font-bold text-gray-800 mb-4">Pacientes</h2>
      {patients.length === 0 ? (
        <p className="text-gray-500">Nenhum paciente associado.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {patients.map((patient) => (
            <div
              key={patient.id}
              className="border rounded-lg p-4 shadow-md flex flex-col justify-between"
            >
              <div>
                <h3 className="text-lg font-semibold text-blue-500">
                  {patient.name}
                </h3>
                <p className="text-gray-600">
                  <strong>Email:</strong> {patient.email}
                </p>
              </div>

              <button
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                onClick={() => {
                  setSelectedPatient(patient);
                  setIsModalOpen(true);
                }}
              >
                Adicionar Diagnóstico
              </button>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Adicionar Diagnóstico"
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
              onClick={handleAddDiagnosis}
            >
              Salvar Diagnóstico
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default DoctorsPage;
