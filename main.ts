import ky from "ky";
import { DOMParser } from "dom";
import type { Element } from "dom";

import { AOHARU_RECORD_URL, BASE_URL, EN_URL, JA_URL } from "/consts/url.ts";
import { AOHARU_RECORD_PANELS, EN_PANELS, JA_PANELS } from "/consts/panel.ts";
import { Panel } from "/types/panel.ts";
import { getHtmlUtf8, sleep, writeJSON } from "/utils/tools.ts";

const deletedURL =
  "https://bluearchive.wikiru.jp/?Twitter%E9%80%A3%E8%BC%89/%E3%81%B6%E3%82%8B%E3%83%BC%E3%81%82%E3%83%BC%E3%81%8B%E3%81%84%E3%81%B6%E3%81%A3%EF%BC%81/041%EF%BD%9E050%E8%A9%B1";

const deletedPanel: Panel = {
  id: "41",
  title: "折衷案",
  students: ["エイミ", "ヒマリ"],
  href: "https://bluearchive.jp/comics/41/1",
  deleted: true,
};

const mark = "†";

const parseJaTitle = (original: string) => {
  if (original.includes("予告")) {
    return { id: "0", title: "予告" };
  }
  const text = original.split(mark).join("").trim();
  const [ep, ...other] = text.split(/\s+/);
  const id = ep.replace(/[^0-9]/g, "");
  const title = other.join(" ") || "無題";
  return { id, title };
};
const en1stPanel = {
  "id": "10001",
  "title": "1st Anniversary Special Episode",
  "students": [
    "ホシノ",
    "ノノミ",
    "シロコ",
    "セリカ",
    "アヤネ",
    "モモイ",
    "ミドリ",
    "アリス",
    "ユズ",
    "ヒフミ",
    "ハナコ",
    "アズサ",
    "コハル",
    "アロナ",
  ],
  "href": "https://twitter.com/en_bluearchive/status/1590179580379566084",
};

const parseEnTitle = (original: string) => {
  if (original.includes("1st Anniversary Special Episode")) {
    return en1stPanel;
  }
  const text = original.split(mark).join("").trim();
  const [ep, title] = text.split(/:\s+/);
  const id = ep.replace(/[^0-9]/g, "");
  return { id, title: title || "No Title" };
};

const getPanelCanDeleted = (body: Element, index: number): Partial<Panel> => {
  if (index === 0) {
    return deletedPanel;
  }

  const h2 = body.querySelector(`h2#content_1_${index}`)?.textContent!;
  const { id, title } = parseJaTitle(h2);
  const students = [
    ...body.querySelectorAll(`#rgn_description${index} > p > a`),
  ].map((node) => node.textContent);
  const href = body.querySelector(`#rgn_content${index} > blockquote > a`)
    ?.getAttribute("href") ?? undefined;

  return { id, title, students, href };
};

const getPanel = (
  body: Element,
  index: number,
  options: { isEnglish: boolean },
): Partial<Panel> => {
  const rgn = index + 1;

  const h2 = body.querySelector(`h2#content_1_${index}`)?.textContent!;
  const { id, title } = options.isEnglish ? parseEnTitle(h2) : parseJaTitle(h2);
  const students = [
    ...body.querySelectorAll(`#rgn_description${rgn} > p > a`),
  ].map((node) => node.textContent);
  const href = body.querySelector(`#rgn_content${rgn} > blockquote > a`)
    ?.getAttribute("href") ?? undefined;

  return { id, title, students, href };
};

const getPage = async (
  url: string,
) => {
  const res = await ky(url);
  const html = await getHtmlUtf8(res);
  const dom = new DOMParser().parseFromString(html, "text/html");
  if (!dom) {
    throw new Error("DOM parse failed");
  }
  const body = dom.querySelector("#body");
  if (!body) {
    throw new Error("#body is not found");
  }

  const isDeleted = url === deletedURL;
  const isEnglish = url.includes("English");

  const count = body.querySelectorAll("h2").length;
  const panels = [...Array(count)].map((_, index) => {
    return isDeleted
      ? getPanelCanDeleted(body, index)
      : getPanel(body, index, { isEnglish });
  });

  const nextAnchor = body.querySelector("li.navi_right > a");
  if (nextAnchor === null) {
    return { panels, nextUrl: undefined };
  }
  const nextHref = nextAnchor.getAttribute("href") ?? "";
  const nextUrl = new URL(nextHref, BASE_URL).href;

  await sleep(1000);

  return { panels, nextUrl };
};

const getMultiPage = async (firstUrl: string) => {
  let result = [];
  let next: string | undefined = undefined;

  console.log("Access to", firstUrl);

  const firstPage = await getPage(firstUrl);
  result = firstPage.panels;
  next = firstPage.nextUrl;

  while (next) {
    const { panels, nextUrl } = await getPage(next);
    result = [...result, ...panels];
    next = nextUrl;
  }

  console.log("Panels count:", result.length);

  return result;
};

const checkShouldUpdate = (arr1: any[], arr2: any[]) => {
  return arr1.length !== arr2.length;
};

const jaPanels = await getMultiPage(JA_URL);
if (checkShouldUpdate(jaPanels, JA_PANELS)) {
  console.log("update: JA_PANELS");
  await writeJSON("docs/panels/ja.json", jaPanels);
} else {
  console.log("skip: same panels/ja count");
}

const enPanels = await getMultiPage(EN_URL);
if (checkShouldUpdate(enPanels, EN_PANELS)) {
  console.log("update: EN_PANELS");
  await writeJSON("docs/panels/en.json", enPanels);
} else {
  console.log("skip: same panels/en count");
}

const aoharuPanels = await getMultiPage(AOHARU_RECORD_URL);
if (checkShouldUpdate(aoharuPanels, AOHARU_RECORD_PANELS)) {
  console.log("update: AOHARU_RECORD_PANELS");
  await writeJSON("docs/panels/aoharu.json", aoharuPanels);
} else {
  console.log("skip: same panels/aoharu count");
}
