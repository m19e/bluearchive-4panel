import ky from "ky";
import { DOMParser } from "dom";
import type { Element } from "dom";

import { BASE_URL, JA_URL_FIRST } from "/consts/url.ts";

const getHtmlUtf8 = async (res: Response): Promise<string> => {
  const resBuf = await res.arrayBuffer();
  const text = new TextDecoder().decode(resBuf);

  // convert to UTF-8 if charset is Shift-JIS
  return text.includes("text/html; charset=Shift_JIS")
    ? new TextDecoder("shift-jis").decode(resBuf)
    : text;
};

type Panel = {
  title: string;
  students: string[];
  href: string;
};

const getPanel = (body: Element, index: number): Partial<Panel> => {
  const rgn = index + 1;

  const title = body.querySelector(`h2#content_1_${index}`)?.textContent;
  const students = [
    ...body.querySelectorAll(`#rgn_description${rgn} > p > a`),
  ].map((node) => node.textContent);
  const href = body.querySelector(`#rgn_content${rgn} > blockquote > a`)
    ?.getAttribute("href") ?? undefined;

  return { title, students, href };
};

const getPage = async (url: string) => {
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

  const count = body.querySelectorAll("h2").length;
  const panels = [...Array(count)].map((_, index) => {
    return getPanel(body, index);
  });

  const nextHref = body.querySelector("li.navi_right > a")?.getAttribute(
    "href",
  ) ?? "";
  console.log(new URL(nextHref, BASE_URL).href);

  return { panels };
};

const main = async () => {
  const { panels } = await getPage(JA_URL_FIRST);

  console.log(panels.map((p) => JSON.stringify(p)));
};

main();
