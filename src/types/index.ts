export interface Subject {
  id: string;
  name: string;
  creditHours: number;
  grade: string;
  semesterId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Semester {
  id: number;
  name: string;
  year: number;
  subjects: Subject[];
  gpa: number;
}

export interface GPAData {
  semesters: Semester[];
  cgpa: number;
  totalCredits: number;
  totalQualityPoints: number;
}

export interface GradeScale {
  [key: string]: number;
}

export interface SubjectTemplate {
  name: string;
  creditHours: number;
  category: string;
}