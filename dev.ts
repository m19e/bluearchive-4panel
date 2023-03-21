import ky from "ky";
import { DOMParser } from "dom";

import { AOHARU_RECORD_PANELS, EN_PANELS, JA_PANELS } from "/consts/panel.ts";
import { Panel } from "/types/panel.ts";
import { getHtmlUtf8, sleep, writeJSON } from "/utils/tools.ts";

const getStudents = (
  panels: Panel[],
) => [...new Set(panels.map((p) => p.students).flat())];

// console.log(getStudents([...JA_PANELS, ...EN_PANELS, ...AOHARU_RECORD_PANELS]));

const res = await ky("https://bluearchive.wiki/wiki/Characters");
const html = await getHtmlUtf8(res);
const dom = new DOMParser().parseFromString(html, "text/html");
if (!dom) {
  throw new Error("DOM parse failed");
}

const tds = dom.querySelectorAll("tbody > tr > td:nth-child(2)");
const students = [...tds].map((s) => s.textContent);
console.log(students);

await writeJSON("out/students.en.json", students);
