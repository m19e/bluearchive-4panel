import { SCHOOLS } from "/consts/school.ts";

export type Panel = {
  id: string;
  title: string;
  students: string[];
  href: string;
};

export type SchoolID = keyof typeof SCHOOLS;
export type Student = { id: string; ja: string; en: string; school: SchoolID };
export type StudentData = Record<string, Student>;
