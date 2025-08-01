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
  password?: string;
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

export const students: Student[] = [
  { id: "s1", name: "Aarav Kumar", email: "aarav@example.com", location: "Chennai" },
  { id: "s2", name: "Diya Sharma", email: "diya@example.com", location: "Bangalore" },
  { id: "s3", name: "Rohan Patel", email: "rohan@example.com", location: "Madurai" },
  { id: "s4", name: "Priya Singh", email: "priya@example.com", location: "Chennai" },
  { id: "s5", name: "Aditya Verma", email: "aditya@example.com", location: "Coimbatore" },
  { id: "s6", name: "Ananya Reddy", email: "ananya@example.com", location: "Tirupati" },
];

export const staff: Staff[] = [
  { id: "st1", name: "Mr. Ramesh", email: "ramesh@example.com", location: "Chennai", role: 'admin', password: 'password' },
  { id: "st2", name: "Ms. Sunita", email: "sunita@example.com", location: "Bangalore", role: 'staff', password: 'password' },
];

export const batches: Batch[] = [
  { id: "b1", name: "Morning Physics", location: "Chennai", timings: "8:00 AM - 10:00 AM", studentIds: ["s1", "s4"] },
  { id: "b2", name: "Evening Maths", location: "Bangalore", timings: "5:00 PM - 7:00 PM", studentIds: ["s2"] },
  { id: "b3", name: "Weekend Chemistry", location: "Madurai", timings: "10:00 AM - 1:00 PM", studentIds: ["s3"] },
  { id: "b4", name: "Afternoon Biology", location: "Chennai", timings: "2:00 PM - 4:00 PM", studentIds: ["s1", "s4"] },
];

export const knownAbsenceReasons = [
  "Sickness",
  "Family Emergency",
  "Doctor's Appointment",
  "Travel",
  "Extracurricular Activity",
].join(', ');
