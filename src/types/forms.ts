// Define os papéis de usuário possíveis
export type UserRole = "medico" | "paciente";

export interface RegisterFormData {
  hospital: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  cpf: string;
  crm: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface Diagnosis {
  _id: string;
  description: string;
  date: string;
  medications: string[];
  exams: string[];
  patientId: string;
  doctorId: DoctorDetails;
  createdAt: Date;
}

export interface DoctorDetails {
  id: string;
  name: string;
  email: string;
  hospital: string;
}

export interface DoctorProfile {
  id: string;
  uid: string;
  name: string;
  email: string;
  hospital: string;
}

export interface PatientProfile {
  id: string;
  uid: string;
  name: string;
  email: string;
  hospital: string;
}
