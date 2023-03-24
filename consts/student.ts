import enJson from "/out/students.en.json" assert { type: "json" };
import jaJson from "/out/students.ja.json" assert { type: "json" };

import { StudentData } from "/types/panel.ts";

export const EN_STUDENTS = enJson as StudentData;
export const JA_STUDENTS = jaJson as StudentData;
