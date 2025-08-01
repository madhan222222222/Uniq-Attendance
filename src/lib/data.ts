// This file now primarily contains type definitions and static data
// that doesn't need to live in a database, like locations.
// The main data (students, staff, batches) is now fetched from Firestore.

export type Student = {
  id: string;
  name: string;
  email: string;
  location: string;
};

export type Staff = {
  id: string;
  name: string;
  email: string;
  location: string;
  role: 'admin' | 'staff';
};

export type Batch = {
  id: string;
  name: string;
  location: string;
  timings: string;
  studentIds: string[];
};

export const locations = [
  "Chennai", "Madurai", "Trichy", "Salem", "Pondicherry", 
  "Thirunelveli", "Bangalore", "Coimbatore", "Tirupati"
];

export const knownAbsenceReasons = [
  "Sickness",
  "Family Emergency",
  "Doctor's Appointment",
  "Travel",
  "Extracurricular Activity",
].join(', ');


// Mock data is no longer needed here as it will be in Firestore.
// You would typically have a script to seed your Firestore database with initial data.
export const students: Student[] = [];
export const staff: Staff[] = [];
export const batches: Batch[] = [];
