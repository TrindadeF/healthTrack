import { useEffect, useState } from "react";
import api from "../../services/api"; // Seu serviço API para comunicação com o backend
import { DoctorProfile } from "@/types/forms"; // Tipo para os dados dos médicos

const DoctorsPage = () => {
  const [doctor, setDoctor] = useState<DoctorProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        // Recuperar o token de autenticação do localStorage (ou de onde ele estiver armazenado)
        const token = localStorage.getItem("token");

        if (!token) {
          setError("Usuário não autenticado.");
          return;
        }

        // Chama a API para buscar os dados do usuário logado (médico)
        const response = await api.get("/user/logged", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setDoctor(response.data); // Salva os dados do médico no estado
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message); // Define a mensagem de erro se falhar na requisição
        } else {
          setError("Erro desconhecido.");
        }
      }
    };

    fetchDoctorData(); // Chama a função de busca ao carregar o componente
  }, []); // [] significa que a requisição será feita apenas uma vez, ao montar o componente

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        Perfil do Médico
      </h1>

      {error ? (
        <p className="text-red-500">{error}</p> // Exibe o erro, caso haja algum
      ) : doctor ? (
        <div className="border rounded-lg p-6 shadow-md">
          <h2 className="text-xl font-semibold text-blue-600">{doctor.name}</h2>
          <p className="text-gray-600">
            <strong>Hospital:</strong> {doctor.hospital}
          </p>
          <p className="text-gray-600">
            <strong>Email:</strong> {doctor.email}
          </p>
        </div>
      ) : (
        <p className="text-gray-500">Carregando dados do médico...</p>
      )}
    </div>
  );
};

export default DoctorsPage;
