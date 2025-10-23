import enPlay from "/docs/students/playable/en.json" with { type: "json" };
import jaPlay from "/docs/students/playable/ja.json" with { type: "json" };
import jaNpc from "/docs/students/npc/ja.json" with { type: "json" };
import enNpc from "/docs/students/npc/en.json" with { type: "json" };

import { FandomStudentData, StudentData } from "/types/panel.ts";

export const EN_PLAYABLE = enPlay as StudentData;
export const JA_PLAYABLE = jaPlay as StudentData;
export const JA_NPC = jaNpc as FandomStudentData;
export const EN_NPC = enNpc as FandomStudentData;
