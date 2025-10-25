import { EN_NPC, EN_PLAYABLE, JA_NPC, JA_PLAYABLE } from "/consts/student.ts";
import { writeSortedJSON } from "/utils/tools.ts";

await writeSortedJSON("docs/students/playable/ja.json", JA_PLAYABLE);
await writeSortedJSON("docs/students/playable/en.json", EN_PLAYABLE);

await writeSortedJSON("docs/students/npc/ja.json", JA_NPC);
await writeSortedJSON("docs/students/npc/en.json", EN_NPC);
