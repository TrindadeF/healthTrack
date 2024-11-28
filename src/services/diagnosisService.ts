import api from "./api";

export const createDiagnosis = async (data: {
  patientId: string;
  doctorId: string;
  description: string;
  medications: string[];
  exams: string[];
}) => {
  const response = await api.post("/diagnoses", data);
  return response.data;
};

export const getDiagnosisByPatient = async (patientId: string) => {
  const response = await api.get(`/diagnoses/${patientId}`);
  return response.data;
};
