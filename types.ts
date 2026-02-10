
export interface Medication {
  type: string;
  name: string;
  dosage: string;
  route: string;
  frequency: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
}

export interface Prescription {
  hospital_name: string;
  patient: Patient;
  diagnosis: string;
  medications: Medication[];
  advice: string[];
  prescriber: string;
  timestamp?: string;
}

export interface GenerationConfig {
  count: number;
}
