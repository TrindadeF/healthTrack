/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import api from "../../services/api";
import Modal from "@/components/SharedComponents/Modal";
import { toast, ToastContainer } from "react-toastify";

interface Patient {
  _id: string;
  id: string;
  name: string;
  email: string;
}

interface Appointment {
  id: string;
  doctorId: string;
  date: string;
  time: string;
  patientId: Patient;
}

const DoctorAppointmentsPage = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    patientId: "",
    date: "",
    time: "",
  });

  const [loading, setLoading] = useState(true);

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

        const doctorId = doctorResponse.data.id;
        if (!doctorId) {
          toast.error("ID do médico não encontrado.");
          return;
        }

        const appointmentsResponse = await api.get(
          `/appointment/doctor/${doctorId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log("Consultas retornadas:", appointmentsResponse.data);
        setAppointments(appointmentsResponse.data);

        const patientsResponse = await api.get(`/user/patients`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Pacientes retornados:", patientsResponse.data);
        setPatients(patientsResponse.data);
      } catch (error) {
        toast.error("Erro ao buscar dados. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddOrUpdateAppointment = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Usuário não autenticado.");
        return;
      }

      if (!formData.patientId || !formData.date || !formData.time) {
        toast.error("Todos os campos são obrigatórios.");
        return;
      }

      const doctorId = localStorage.getItem("doctorId");
      if (!doctorId) {
        toast.error("ID do médico não encontrado.");
        return;
      }

      const selectedPatient = patients.find(
        (patient) => patient.id === formData.patientId
      );

      if (!selectedPatient) {
        toast.error("Paciente não encontrado.");
        return;
      }

      const appointmentData = {
        patientId: selectedPatient,
        date: formData.date,
        time: formData.time,
        doctorId,
      };

      if (selectedAppointment) {
        await api.put(
          `/appointment/${selectedAppointment.id}`,
          appointmentData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAppointments((prev) =>
          prev.map((appt) =>
            appt.id === selectedAppointment.id
              ? { ...appt, ...appointmentData }
              : appt
          )
        );
        toast.success("Consulta atualizada com sucesso!");
      } else {
        const response = await api.post(`/appointment/`, appointmentData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(response.data);
        setAppointments((prev) => [
          { ...response.data.savedAppointment, patientId: selectedPatient },
          ...prev,
        ]);
        toast.success("Consulta criada com sucesso!");
      }

      setIsModalOpen(false);
      setFormData({ patientId: "", date: "", time: "" });
      setSelectedAppointment(null);
    } catch (error) {
      toast.error("Erro ao salvar a consulta.");
    }
  };

  const handleDeleteAppointment = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Usuário não autenticado.");
        return;
      }

      await api.delete(`/appointment/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAppointments((prev) => prev.filter((appt) => appt.id !== id));
      toast.success("Consulta excluída com sucesso!");
    } catch (error) {
      toast.error("Erro ao excluir a consulta.");
    }
  };

  if (loading) {
    return <p>Carregando...</p>;
  }

  return (
    <div className="container mx-auto p-10">
      <ToastContainer position="top-right" autoClose={3000} />

      <h1 className="text-2xl font-bold mb-6">Consultas</h1>

      <button
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        onClick={() => {
          setFormData({ patientId: "", date: "", time: "" });
          setSelectedAppointment(null);
          setIsModalOpen(true);
        }}
      >
        Adicionar Consulta
      </button>

      <div className="mt-6">
        {appointments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {appointments.map((appointment) => (
              <div
                key={appointment.id}
                className="border rounded-lg p-4 shadow-md"
              >
                <p>
                  <strong>Paciente:</strong>{" "}
                  {appointment.patientId.name || "Desconhecido"}
                </p>
                <p>
                  <strong>Email:</strong>{" "}
                  {appointment.patientId.email || "Não informado"}
                </p>
                <p>
                  <strong>Data:</strong> {appointment.date}
                </p>
                <p>
                  <strong>Hora:</strong> {appointment.time}
                </p>
                <div className="flex gap-2 mt-2">
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    onClick={() => {
                      setFormData({
                        patientId: appointment.patientId.id,
                        date: appointment.date,
                        time: appointment.time,
                      });
                      setSelectedAppointment(appointment);
                      setIsModalOpen(true);
                    }}
                  >
                    Editar
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    onClick={() => handleDeleteAppointment(appointment.id)}
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>Nenhuma consulta encontrada.</p>
        )}
      </div>

      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedAppointment(null);
            setFormData({ patientId: "", date: "", time: "" });
          }}
          title={selectedAppointment ? "Editar Consulta" : "Adicionar Consulta"}
        >
          <div>
            <label>Paciente</label>
            <select
              className="w-full border rounded p-2"
              value={formData.patientId}
              onChange={(e) =>
                setFormData({ ...formData, patientId: e.target.value })
              }
            >
              <option value="">Selecione</option>
              {patients.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.name}
                </option>
              ))}
            </select>

            <label>Data</label>
            <input
              type="date"
              className="w-full border rounded p-2"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
            />

            <label>Hora</label>
            <input
              type="time"
              className="w-full border rounded p-2"
              value={formData.time}
              onChange={(e) =>
                setFormData({ ...formData, time: e.target.value })
              }
            />

            <div className="mt-4">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={handleAddOrUpdateAppointment}
              >
                {selectedAppointment ? "Atualizar" : "Criar Consulta"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default DoctorAppointmentsPage;
