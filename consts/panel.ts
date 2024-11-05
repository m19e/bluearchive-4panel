import jaPanels from "/docs/panels/ja.json" with { type: "json" };
import enPanels from "/docs/panels/en.json" with { type: "json" };
import aoharuPanels from "/docs/panels/aoharu.json" with { type: "json" };

import { Panel } from "/types/panel.ts";

export const JA_PANELS = jaPanels as Panel[];
export const EN_PANELS = enPanels as Panel[];
export const AOHARU_RECORD_PANELS = aoharuPanels as Panel[];
