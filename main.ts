import ky from "ky";
import { DOMParser } from "dom";
import type { Element } from "dom";

const _AORECO_URL_FIRST =
  "https://bluearchive.wikiru.jp/?Twitter%E9%80%A3%E8%BC%89/%E3%81%82%E3%81%8A%E3%81%AF%E3%82%8B%E3%83%AC%E3%82%B3%E3%83%BC%E3%83%89/001%EF%BD%9E010%E8%A9%B1";

const _JA_URL_FIRST =
  "https://bluearchive.wikiru.jp/?Twitter%E9%80%A3%E8%BC%89/%E3%81%B6%E3%82%8B%E3%83%BC%E3%81%82%E3%83%BC%E3%81%8B%E3%81%84%E3%81%B6%E3%81%A3%EF%BC%81/001%EF%BD%9E010%E8%A9%B1";

const _EN_URL_FIRST =
  "https://bluearchive.wikiru.jp/?Twitter%E9%80%A3%E8%BC%89/English/Official+4-Panel+Manga%28%E5%85%AC%E5%BC%8F4%E3%82%B3%E3%83%9E%E6%BC%AB%E7%94%BB%29/001%EF%BD%9E010";

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
  const title = body.querySelector(`h2#content_1_${index}`)?.textContent;
  const students = [
    ...body.querySelectorAll(`#rgn_description${index + 1} > p > a`),
  ].map((node) => node.textContent);
  const href = body.querySelector(`#rgn_content${index + 1} > blockquote > a`)
    ?.getAttribute("href") ?? undefined;

  return { title, students, href };
};

const main = async () => {
  const res = await ky(BU_URL);
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

  console.log(JSON.stringify(panels, null, 2));
};

main();
