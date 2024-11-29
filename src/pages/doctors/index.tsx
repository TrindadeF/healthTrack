/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import api from "../../services/api";
import { DoctorProfile, PatientProfile } from "@/types/forms";

const DoctorsPage = () => {
  const [doctor, setDoctor] = useState<DoctorProfile | null>(null);
  const [patients, setPatients] = useState<PatientProfile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDoctorData = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Usuário não autenticado.");
          setLoading(false);
          return;
        }

        const doctorResponse = await api.get("/user/logged", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDoctor(doctorResponse.data);

        const patientsResponse = await api.get("/user/patients", {
          params: { role: "patient" }, 
          headers: { Authorization: `Bearer ${token}` },
        });
        setPatients(patientsResponse.data);
      } catch (err) {
        console.error("Erro detalhado:", err);
        setError("Erro ao buscar dados do médico ou pacientes.");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorData();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <p className="text-gray-500">Carregando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
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
              key={patient.uid}
              className="border rounded-lg p-4 shadow-md flex flex-col justify-between"
            >
              <div>
                <h3 className="text-lg font-semibold text-blue-500">
                  {patient.name}
                </h3>
                <p className="text-gray-600">
                  <strong>Email:</strong> {patient.email}
                </p>
                <p className="text-gray-600">
                  <strong>Próxima consulta:</strong>{" "}
                  {patient.nextAppointment
                    ? new Date(patient.nextAppointment).toLocaleString()
                    : "Não agendado"}
                </p>
              </div>

              <button
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                onClick={() => {
                  console.log(`Adicionar diagnóstico para: ${patient.name}`);
                }}
              >
                Adicionar Diagnóstico
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorsPage;
