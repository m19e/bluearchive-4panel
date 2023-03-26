import jaPanels from "/out/panels/ja.json" assert { type: "json" };
import enPanels from "/out/panels/en.json" assert { type: "json" };
import aoharuPanels from "/out/panels/aoharu.json" assert { type: "json" };

import { Panel } from "/types/panel.ts";

export const JA_PANELS = jaPanels as Panel[];

export const EN_PANELS = enPanels as Panel[];

export const AOHARU_RECORD_PANELS = aoharuPanels as Panel[];
