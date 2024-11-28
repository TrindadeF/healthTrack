// Define tipos reutilizáveis
export type UserRole = "medico" | "paciente";

export interface RegisterFormData {
  hospital?: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface Diagnosis {
  id: string;
  description: string;
  date: string;
  medications: string[];
  exams: string[];
  patientId: string;
  doctorId: string;
}

export interface DoctorProfile {
  uid: string;
  name: string;
  email: string;
  hospital: string;
}

export interface PatientProfile {
  uid: string;
  name: string;
  email: string;
  hospital: string;
  nextAppointment: string | null;
}
