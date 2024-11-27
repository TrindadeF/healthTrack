export interface RegisterFormData {
  hospital?: string;
  name: string;
  email: string;
  password: string;
  role: "medico" | "paciente";
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
