import jaPanels from "/docs/panels/ja.json" assert { type: "json" };
import enPanels from "/docs/panels/en.json" assert { type: "json" };
import aoharuPanels from "/docs/panels/aoharu.json" assert { type: "json" };

import { Panel } from "/types/panel.ts";

export const JA_PANELS = jaPanels as Panel[];
export const EN_PANELS = enPanels as Panel[];
export const AOHARU_RECORD_PANELS = aoharuPanels as Panel[];
