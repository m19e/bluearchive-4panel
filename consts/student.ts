import enPlay from "/out/students/playable/en.json" assert { type: "json" };
import jaPlay from "/out/students/playable/ja.json" assert { type: "json" };
import jaNpc from "/out/students/npc/ja.json" assert { type: "json" };

import { FandomStudentData, StudentData } from "/types/panel.ts";

export const EN_PLAYABLE = enPlay as StudentData;
export const JA_PLAYABLE = jaPlay as StudentData;
export const JA_NPC = jaNpc as FandomStudentData;
