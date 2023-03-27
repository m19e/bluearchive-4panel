import { SCHOOLS } from "/consts/school.ts";

export type Panel = {
  id: string;
  title: string;
  students: string[];
  href: string;
  deleted?: boolean;
};

export type SchoolID = keyof typeof SCHOOLS;
export type Student = { id: string; ja: string; en: string; school: SchoolID };
export type StudentData = Record<string, Student>;

export type FandomStudent = {
  id: string;
  ja: string;
  en: string;
  club: string | null;
  school: string | null;
};
export type FandomStudentData = Record<string, FandomStudent>;
