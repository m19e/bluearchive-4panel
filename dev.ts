import ky from "ky";
import { DOMParser } from "dom";

import { EN_STUDENTS } from "/consts/student.ts";
import { Panel } from "/types/panel.ts";
import { getHtmlUtf8, sleep, writeJSON } from "/utils/tools.ts";
import { convertRomanToKana } from "/utils/romanToKana.ts";

const SCHOOLS = {
  abydos: { id: "abydos", ja: "アビドス", en: "Abydos" },
  gehenna: { id: "gehenna", ja: "ゲヘナ", en: "Gehenna" },
  trinity: { id: "trinity", ja: "トリニティ", en: "Trinity" },
  millennium: { id: "millennium", ja: "ミレニアム", en: "Millennium" },
  shanhaijing: { id: "shanhaijing", ja: "山海経", en: "Shanhaijing" },
  red_winter: { id: "red_winter", ja: "レッドウィンター", en: "Red Winter" },
  srt: { id: "srt", ja: "SRT特殊学園", en: "SRT" },
  valkyrie: { id: "valkyrie", ja: "ヴァルキューレ", en: "Valkyrie" },
  arius: { id: "arius", ja: "アリウス", en: "Arius" },
  hyakkiyako: { id: "hyakkiyako", ja: "百鬼夜行", en: "Hyakkiyako" },
  etc: { id: "etc", ja: "その他", en: "ETC" },
} as const;

type SchoolID = keyof typeof SCHOOLS;
type Student = { id: string; ja: string; en: string; school: SchoolID };
type StudentData = Record<string, Student>;

const getStudents = (
  panels: Panel[],
) => [...new Set(panels.map((p) => p.students).flat())];

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

const exceptionIds: { [key: string]: string } = {
  "Shun (Kid)": "shun_kid",
  "Hatsune Miku": "hatsune_miku",
};

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

      prev[id] = { id, ja, en, school: convertSchoolToID(school) as SchoolID };

      return prev;
    },
    {} as StudentData,
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

const convertSchoolToID = (school: string) =>
  school.split(" ").join("_").toLowerCase();

const convert = () => {
  const ja = Object.values(EN_STUDENTS as StudentData).reduce(
    (prev, student) => {
      prev[student.ja] = student;
      return prev;
    },
    {} as StudentData,
  );
  console.log(ja);
};

convert();
