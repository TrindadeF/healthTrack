/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import api from "../../services/api";
import { toast, ToastContainer } from "react-toastify";
import Modal from "@/components/SharedComponents/Modal";

interface Appointment {
  id: string;
  doctorId: string;
  patientId: string;
  date: string;
  time: string;
  doctor?: { name: string; email: string; hospital: string };
}

const PatientAppointmentsPage = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Usuário não autenticado.");
          return;
        }

        const patientId = localStorage.getItem("patientId");
        const response = await api.get(`/appointment/patient/${patientId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setAppointments(response.data);
      } catch (error) {
        toast.error("Erro ao buscar consultas. Tente novamente mais tarde.");
      }
    };

    fetchAppointments();
  }, []);

  return (
    <div className="container mx-auto p-10">
      <ToastContainer position="top-right" autoClose={3000} />

      <h1 className="text-2xl font-bold mb-6">Minhas Consultas</h1>

      <div className="mt-6">
        {appointments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {appointments.map((appointment) => (
              <div
                key={appointment.id}
                className="border rounded-lg p-4 shadow-md"
              >
                <p>
                  <strong>Médico:</strong>{" "}
                  {appointment.doctor?.name || "Desconhecido"}
                </p>
                <p>
                  <strong>Email:</strong>{" "}
                  {appointment.doctor?.email || "Não informado"}
                </p>
                <p>
                  <strong>Hospital:</strong>{" "}
                  {appointment.doctor?.hospital || "Não informado"}
                </p>
                <p>
                  <strong>Data:</strong> {appointment.date}
                </p>
                <p>
                  <strong>Hora:</strong> {appointment.time}
                </p>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-4"
                  onClick={() => {
                    setSelectedAppointment(appointment);
                    setIsModalOpen(true);
                  }}
                >
                  Detalhes
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">
            Você ainda não possui consultas agendadas.
          </p>
        )}
      </div>

      {isModalOpen && selectedAppointment && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Detalhes da Consulta"
        >
          <div>
            <p>
              <strong>Médico:</strong>{" "}
              {selectedAppointment.doctor?.name || "Desconhecido"}
            </p>
            <p>
              <strong>Email:</strong>{" "}
              {selectedAppointment.doctor?.email || "Não informado"}
            </p>
            <p>
              <strong>Hospital:</strong>{" "}
              {selectedAppointment.doctor?.hospital || "Não informado"}
            </p>
            <p>
              <strong>Data:</strong> {selectedAppointment.date}
            </p>
            <p>
              <strong>Hora:</strong> {selectedAppointment.time}
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default PatientAppointmentsPage;
