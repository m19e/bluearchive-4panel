import ky from "ky";
import { DOMParser } from "dom";
import type { Node } from "dom";

import { JA_NPC, JA_PLAYABLE } from "/consts/student.ts";
import {
  FandomStudent,
  FandomStudentData,
  Panel,
  SchoolID,
  StudentData,
} from "/types/panel.ts";
import { getHtmlUtf8, sleep, writeSortedJSON } from "/utils/tools.ts";
import { convertRomanToKana } from "/utils/romanToKana.ts";

// TODO remove unused
const getStudents = (
  panels: Panel[],
) => [...new Set(panels.map((p) => p.students).flat())];

const anotherWear: Record<string, string> = {
  "Shun (Kid)": "シュン（幼女）",
};

// TODO 連邦生徒会長とカイザープレジデントがid衝突している
// TODO fix 'Sミィンg Pロフェッソr'
// TODO fix 'ケy'
const exceptions: Record<string, string> = {
  "Hatsune Miku": "初音ミク",
  "Kanna": "カンナ",
  "Mari": "マリー",
  "Pina": "フィーナ",
  "President": "連邦生徒会長",
  "Shiroko＊Terror": "シロコ＊テラー",
  "Smiling Professor": "ニヤニヤ教授",
  "Key": "ケイ",
};

const getStudentKanaFromRoman = (roman: string) => {
  const [name] = roman.split(" (");
  return anotherWear[roman] || exceptions[name] || convertRomanToKana(name);
};

const exceptionIds: Record<string, string> = {
  "Shun (Kid)": "shun_kid",
  "Hatsune Miku": "hatsune_miku",
};

// FIXME rename correctly
const toID = (en: string) => en.split(" ").join("_").toLowerCase();

const convertSchoolToID = (school: string) => toID(school) as SchoolID;

const getCharacters = async () => {
  const res = await ky("https://bluearchive.wiki/wiki/Characters");
  const html = await getHtmlUtf8(res);
  const dom = new DOMParser().parseFromString(html, "text/html");
  if (!dom) {
    throw new Error("DOM parse failed");
  }

  const tbody = dom.querySelector("tbody")!;
  const count = tbody?.querySelectorAll("tr").length;
  const students = [...Array(count - 1)].map((_, index) => {
    const n = index + 2;
    const name = tbody.querySelector(
      `tr:nth-child(${n}) > td:nth-child(2)`,
    )!.textContent;
    const sch = tbody.querySelector(
      `tr:nth-child(${n}) > td:nth-child(4)`,
    )!.textContent;

    // unify wild_hunt phrase
    const school = sch === "Wildhunt" ? "Wild Hunt" : sch;

    return { name, school };
  });

  // filter tokiwadai and sakugawa students
  const filtered = students.filter(({ school }) => {
    const id = toID(school);
    return id !== "tokiwadai" && id !== "sakugawa";
  });

  const en = filtered.reduce(
    (prev, { name, school }) => {
      const en = anotherWear[name] ? name : name.split(" (")[0];
      const id = exceptionIds[name] ?? en.toLowerCase();
      const ja = getStudentKanaFromRoman(name);

      prev[id] = { id, ja, en, school: convertSchoolToID(school) };

      return prev;
    },
    {} as StudentData,
  );
  const ja = Object.values(en).reduce(
    (prev, student) => {
      prev[student.ja] = student;
      return prev;
    },
    {} as StudentData,
  );

  await sleep(5000);

  return { ja, en };
};

// TODO trim quotes
const terror: FandomStudentData = {
  Sora: {
    id: "sora",
    ja: "ソラ",
    en: "Sora",
    club: "Angel 24",
    school: "other_students",
  },
  Plana: {
    id: "plana",
    ja: "プラナ",
    en: "Plana",
    club: "SCHALE",
    school: "schale",
  },
};

// TODO reject 'hoshino terror'
const rejectEn: Record<string, string> = {
  "Kanna": "Kanna",
  "Nao": "Nao",
  "Pei": "Pei",
  "Reizyo": "Reizyo",
  "Sensei": "先生",
  "Phrenapates": "プレナパテス",
  "Nyanten-maru": "ニャン天丸",
  "Master Shiba": "柴大将",
  "Barbara": "バルバラ",
  "Owner of Suzume": "スズメ亭の女将",
  "Hoshino Terror": "ホシノ＊テラー",
};

const getSchoolFromNode = (node: Node) => {
  const { firstChild } = node;
  const en = firstChild.textContent;
  const id = toID(en);
  return { id, en };
};

const getStudentFromNode = (
  node: Node,
  currentSchool: { id: string; en: string },
): FandomStudent => {
  const data = [...node.childNodes].filter((n) => n.textContent.trim()).map((
    n,
  ) => n.textContent).reverse();

  const [en, cl] = data;
  if (terror[en]) return terror[en];

  const id = toID(en);
  const ja = getStudentKanaFromRoman(en);
  const club = cl ?? null;
  const school = currentSchool.id;

  return { id, ja, en, club, school };
};

const NPC_URL = "https://bluearchive.fandom.com/wiki/Category:NPC";
const npcSelector =
  " #mw-content-text > div.mw-parser-output > h2, div[style$='border:2px solid 02D3FB !important; border-radius:5px; border: 2px solid #02D3FB; display:inline-block; position:relative; height:100px; width:115px; overflow:hidden; vertical-align:middle; margin-top:2px; margin-bottom:2px; transform: skewX(-10deg); margin-left: 8px; margin-right: -7px;']";

const getNPCsFromFandom = async () => {
  const res = await ky(NPC_URL);
  const html = await getHtmlUtf8(res);
  const dom = new DOMParser().parseFromString(html, "text/html");
  if (!dom) {
    throw new Error("DOM parse failed");
  }

  let currentSchool = { id: "", en: "" };
  let students: FandomStudent[] = [];

  dom.querySelectorAll(npcSelector).forEach((node) => {
    if (node.nodeName === "H2") {
      const school = getSchoolFromNode(node);
      currentSchool = school;
      return;
    }

    students = [...students, getStudentFromNode(node, currentSchool)];
  });

  // TODO update non-student filter
  const filtered = students.filter(({ en, club, school }) =>
    school !== "other_characters" &&
    school !== "other_non-student_characters" &&
    school !== "non-student_npcs" && !(rejectEn[en])
  );

  const en = filtered.reduce(
    (prev, student) => {
      prev[student.id] = student;
      return prev;
    },
    {} as FandomStudentData,
  );
  const ja = filtered.reduce(
    (prev, student) => {
      prev[student.ja] = student;
      return prev;
    },
    {} as FandomStudentData,
  );

  return { ja, en };
};

type Data = Record<string, any>;
const checkShouldUpdate = (data1: Data, data2: Data) => {
  return Object.keys(data1).length !== Object.keys(data2).length;
};

// TODO sort json
const playable = await getCharacters();
if (checkShouldUpdate(playable.ja, JA_PLAYABLE)) {
  console.log("update: PLAYABLE");
  await writeSortedJSON("docs/students/playable/ja.json", playable.ja);
  await writeSortedJSON("docs/students/playable/en.json", playable.en);
} else {
  console.log("skip: same playable count");
}

const npcs = await getNPCsFromFandom();
if (checkShouldUpdate(npcs.ja, JA_NPC)) {
  console.log("update: NPC");
  await writeSortedJSON("docs/students/npc/ja.json", npcs.ja);
  await writeSortedJSON("docs/students/npc/en.json", npcs.en);
} else {
  console.log("skip: same npc count");
}
