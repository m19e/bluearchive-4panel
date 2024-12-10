import { AOHARU_RECORD_URL, EN_URL, JA_URL } from "/consts/url.ts";
import { AOHARU_RECORD_PANELS, EN_PANELS, JA_PANELS } from "/consts/panel.ts";
import { writeJSON } from "/utils/tools.ts";
import { getPage } from "/mods/getPage.ts";

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
