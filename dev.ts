import ky from "ky";
import { DOMParser } from "dom";
import type { Node } from "dom";

import { EN_STUDENTS, JA_STUDENTS } from "/consts/student.ts";
import { AOHARU_RECORD_PANELS, EN_PANELS, JA_PANELS } from "/consts/panel.ts";
import { Panel, SchoolID, StudentData } from "/types/panel.ts";
import { getHtmlUtf8, sleep, writeJSON } from "/utils/tools.ts";
import { convertRomanToKana } from "/utils/romanToKana.ts";

const INITIAL_STUDENT_DATA: StudentData = {};

const getStudents = (
  panels: Panel[],
) => [...new Set(panels.map((p) => p.students).flat())];

const anotherWear: Record<string, string> = {
  "Shun (Kid)": "シュン（幼女）",
};

const exceptions: Record<string, string> = {
  "Hatsune Miku": "初音ミク",
  "Kanna": "カンナ",
  "Mari": "マリー",
  "Pina": "フィーナ",
  "GSC President": "連邦生徒会長",
  "Master Shiba": "柴大将",
};

const getStudentKanaFromRoman = (roman: string) => {
  const [name] = roman.split(" (");
  return anotherWear[roman] || exceptions[name] || convertRomanToKana(name);
};

const exceptionIds: Record<string, string> = {
  "Shun (Kid)": "shun_kid",
  "Hatsune Miku": "hatsune_miku",
};

const toID = (en: string) => en.split(" ").join("_").toLowerCase();

const convertSchoolToID = (school: string) => toID(school) as SchoolID;

const getEnCharacters = async () => {
  const res = await ky("https://bluearchive.wiki/wiki/Characters");
  const html = await getHtmlUtf8(res);
  const dom = new DOMParser().parseFromString(html, "text/html");
  if (!dom) {
    throw new Error("DOM parse failed");
  }

  const tbody = dom.querySelector("tbody")!;
  const count = tbody?.querySelectorAll("tr")!.length;
  const students = [...Array(count - 1)].map((_, index) => {
    const n = index + 2;
    const name = tbody.querySelector(
      `tr:nth-child(${n}) > td:nth-child(2)`,
    )!.textContent;
    const school = tbody.querySelector(
      `tr:nth-child(${n}) > td:nth-child(4)`,
    )!.textContent;
    return { name, school };
  });

  const en_keyed = students.reduce(
    (prev, { name, school }) => {
      const en = anotherWear[name] ? name : name.split(" (")[0];
      const id = exceptionIds[name] ?? en.toLowerCase();
      const ja = getStudentKanaFromRoman(name);

      prev[id] = { id, ja, en, school: convertSchoolToID(school) };

      return prev;
    },
    INITIAL_STUDENT_DATA,
  );

  await writeJSON("out/students.en.json", en_keyed);
  await sleep(5000);
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

const convertEnDataToJa = (en: StudentData) => {
  const ja = Object.values(en).reduce(
    (prev, student) => {
      prev[student.ja] = student;
      return prev;
    },
    INITIAL_STUDENT_DATA,
  );

  return ja;
};

const terror: Record<string, any> = {
  "Shiroko Terror": {
    id: "shiroko_terror",
    ja: "シロコ＊テラー",
    en: "Shiroko Terror",
    club: undefined,
  },
  "A.R.O.N.A": {
    id: "plana",
    ja: "プラナ",
    en: "Plana",
    club: "SCHALE",
  },
};

const rejectEn: Record<string, string> = {
  "Kanna": "Kanna",
  "Nao": "Nao",
  "Pei": "Pei",
  "Reizyo": "Reizyo",
  "Sensei": "先生",
  "Phrenapates": "プレナパテス",
  "Nyanten-maru": "ニャン天丸",
  "Master Shiba": "柴大将",
};

const NPC_URL = "https://bluearchive.fandom.com/wiki/Category:NPC";
const npcSelector =
  " #mw-content-text > div.mw-parser-output > h2, div[style$='border:2px solid 02D3FB !important; border-radius:5px; border: 2px solid #02D3FB; display:inline-block; position:relative; height:100px; width:115px; overflow:hidden; vertical-align:middle; margin-top:2px; margin-bottom:2px; transform: skewX(-10deg); margin-left: 8px; margin-right: -7px;']";

const res = await ky(NPC_URL);
const html = await getHtmlUtf8(res);
const dom = new DOMParser().parseFromString(html, "text/html");
if (!dom) {
  throw new Error("DOM parse failed");
}

const getSchoolFromNode = (node: Node) => {
  const { firstChild } = node;
  const en = firstChild.textContent;
  const id = toID(en);
  return { type: "school", id, en };
};

let currentSchool = { type: "school", id: "init", en: "Initial" };

console.log(
  [...dom.querySelectorAll(npcSelector)].map((node) => {
    const { nodeName } = node;
    if (nodeName === "H2") {
      const school = getSchoolFromNode(node);
      currentSchool = school;

      return school;
    }

    const data = [...node.childNodes].filter((n) => n.textContent.trim()).map((
      n,
    ) => n.textContent).reverse();

    const [en, club] = data;
    if (terror[en]) return terror[en];

    const id = toID(en);
    const ja = getStudentKanaFromRoman(en);

    return { type: "student", id, ja, en, club, school: currentSchool.id };
  }).filter(({ type, en, club }) =>
    type === "student" && club !== "Gematria" && !(rejectEn[en])
  ),
);
