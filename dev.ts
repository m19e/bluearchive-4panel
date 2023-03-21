import ky from "ky";
import { DOMParser } from "dom";

import { AOHARU_RECORD_PANELS, EN_PANELS, JA_PANELS } from "/consts/panel.ts";
import { EN_STUDENTS } from "/consts/student.ts";
import { Panel } from "/types/panel.ts";
import { getHtmlUtf8, sleep, writeJSON } from "/utils/tools.ts";
import { convertRomanToKana } from "/utils/romanToKana.ts";

const getStudents = (
  panels: Panel[],
) => [...new Set(panels.map((p) => p.students).flat())];

const getEnCharacters = async () => {
  const res = await ky("https://bluearchive.wiki/wiki/Characters");
  const html = await getHtmlUtf8(res);
  const dom = new DOMParser().parseFromString(html, "text/html");
  if (!dom) {
    throw new Error("DOM parse failed");
  }

  const tds = dom.querySelectorAll("tbody > tr > td:nth-child(2)");
  const students = [...tds].map((s) => s.textContent).filter((t) => t);
  console.log(students);

  await writeJSON("out/students.en.json", students);
};

const getJaCharacters = async () => {
  const res = await ky(
    "https://bluearchive.wikiru.jp/?%E3%82%AD%E3%83%A3%E3%83%A9%E3%82%AF%E3%82%BF%E3%83%BC%E4%B8%80%E8%A6%A7",
  );
  const html = await getHtmlUtf8(res);
  const dom = new DOMParser().parseFromString(html, "text/html");
  if (!dom) {
    throw new Error("DOM parse failed");
  }

  const tds = dom.querySelectorAll(
    "#sortabletable1 > tbody > tr > td:nth-child(3)",
  );
  const students = [...tds].map((s) => s.textContent).filter((t) => t);
  console.log(students.length, students);

  await writeJSON("out/students.ja.json", students);
  await sleep(5000);
};

const anotherWear: { [key: string]: string } = {
  "Shun (Kid)": "シュン（幼女）",
};

const exceptions: { [key: string]: string } = {
  "Hatsune Miku": "初音ミク",
  "Kanna": "カンナ",
  "Mari": "マリー",
  "Pina": "フィーナ",
};

const getStudentKanaFromRoman = (roman: string) => {
  const [name] = roman.split(" (");
  return anotherWear[roman] || exceptions[name] || convertRomanToKana(name);
};

console.log(
  JSON.stringify(
    [...new Set(EN_STUDENTS.map(getStudentKanaFromRoman))],
    null,
    2,
  ),
);
