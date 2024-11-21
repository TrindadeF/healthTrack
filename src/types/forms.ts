export interface RegisterFormData {
  email: string;
  password: string;
  role: "doctor" | "patient";
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
}

export interface DoctorProfile {
  id: string;
  name: string;
  email: string;
  hospital: string;
}

export interface PatientProfile {
  id: string;
  name: string;
  email: string;
  hospital: string;
  nextAppointment: string | null;
}
