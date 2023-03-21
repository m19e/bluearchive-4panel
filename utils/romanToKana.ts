interface ITree {
  [key: string]: ITree | string;
}

const tree: ITree = {
  a: "ア",
  i: "イ",
  u: "ウ",
  e: "エ",
  o: "オ",
  k: {
    a: "カ",
    i: "キ",
    u: "ク",
    e: "ケ",
    o: "コ",
    y: { a: "キャ", i: "キィ", u: "キュ", e: "キェ", o: "キョ" },
  },
  s: {
    a: "サ",
    i: "シ",
    u: "ス",
    e: "セ",
    o: "ソ",
    h: { a: "シャ", i: "シ", u: "シュ", e: "シェ", o: "ショ" },
    y: { a: "シャ", i: "シィ", u: "シュ", e: "シェ", o: "ショ" },
  },
  t: {
    a: "タ",
    i: "チ",
    u: "ツ",
    e: "テ",
    o: "ト",
    h: { a: "テャ", i: "ティ", u: "テュ", e: "テェ", o: "テョ" },
    y: { a: "チャ", i: "チィ", u: "チュ", e: "チェ", o: "チョ" },
    s: { a: "ツァ", i: "ツィ", u: "ツ", e: "ツェ", o: "ツォ" },
  },
  c: {
    a: "カ",
    i: "シ",
    u: "ク",
    e: "セ",
    o: "コ",
    h: { a: "チャ", i: "チ", u: "チュ", e: "チェ", o: "チョ" },
    y: { a: "チャ", i: "チィ", u: "チュ", e: "チェ", o: "チョ" },
  },
  q: {
    a: "クァ",
    i: "クィ",
    u: "ク",
    e: "クェ",
    o: "クォ",
  },
  n: {
    a: "ナ",
    i: "ニ",
    u: "ヌ",
    e: "ネ",
    o: "ノ",
    n: "ン",
    y: { a: "ニャ", i: "ニィ", u: "ニュ", e: "ニェ", o: "ニョ" },
  },
  h: {
    a: "ハ",
    i: "ヒ",
    u: "フ",
    e: "ヘ",
    o: "ホ",
    y: { a: "ヒャ", i: "ヒィ", u: "ヒュ", e: "ヒェ", o: "ヒョ" },
  },
  f: {
    a: "ファ",
    i: "フィ",
    u: "フ",
    e: "フェ",
    o: "フォ",
    y: { a: "フャ", u: "フュ", o: "フョ" },
  },
  m: {
    a: "マ",
    i: "ミ",
    u: "ム",
    e: "メ",
    o: "モ",
    y: { a: "ミャ", i: "ミィ", u: "ミュ", e: "ミェ", o: "ミョ" },
  },
  y: { a: "ヤ", i: "イ", u: "ユ", e: "イェ", o: "ヨ" },
  r: {
    a: "ラ",
    i: "リ",
    u: "ル",
    e: "レ",
    o: "ロ",
    y: { a: "リャ", i: "リィ", u: "リュ", e: "リェ", o: "リョ" },
  },
  w: { a: "ワ", i: "ウィ", u: "ウ", e: "ウェ", o: "ヲ" },
  g: {
    a: "ガ",
    i: "ギ",
    u: "グ",
    e: "ゲ",
    o: "ゴ",
    y: { a: "ギャ", i: "ギィ", u: "ギュ", e: "ギェ", o: "ギョ" },
  },
  z: {
    a: "ザ",
    i: "ジ",
    u: "ズ",
    e: "ゼ",
    o: "ゾ",
    y: { a: "ジャ", i: "ジィ", u: "ジュ", e: "ジェ", o: "ジョ" },
  },
  j: {
    a: "ジャ",
    i: "ジ",
    u: "ジュ",
    e: "ジェ",
    o: "ジョ",
    y: { a: "ジャ", i: "ジィ", u: "ジュ", e: "ジェ", o: "ジョ" },
  },
  d: {
    a: "ダ",
    i: "ヂ",
    u: "ヅ",
    e: "デ",
    o: "ド",
    h: { a: "デャ", i: "ディ", u: "デュ", e: "デェ", o: "デョ" },
    y: { a: "ヂャ", i: "ヂィ", u: "ヂュ", e: "ヂェ", o: "ヂョ" },
  },
  b: {
    a: "バ",
    i: "ビ",
    u: "ブ",
    e: "ベ",
    o: "ボ",
    y: { a: "ビャ", i: "ビィ", u: "ビュ", e: "ビェ", o: "ビョ" },
  },
  v: {
    a: "ヴァ",
    i: "ヴィ",
    u: "ヴ",
    e: "ヴェ",
    o: "ヴォ",
    y: { a: "ヴャ", i: "ヴィ", u: "ヴュ", e: "ヴェ", o: "ヴョ" },
  },
  p: {
    a: "パ",
    i: "ピ",
    u: "プ",
    e: "ペ",
    o: "ポ",
    y: { a: "ピャ", i: "ピィ", u: "ピュ", e: "ピェ", o: "ピョ" },
  },
  x: {
    a: "ァ",
    i: "ィ",
    u: "ゥ",
    e: "ェ",
    o: "ォ",
    y: {
      a: "ャ",
      i: "ィ",
      u: "ュ",
      e: "ェ",
      o: "ョ",
    },
    t: {
      u: "ッ",
      s: {
        u: "ッ",
      },
    },
  },
  l: {
    a: "ァ",
    i: "ィ",
    u: "ゥ",
    e: "ェ",
    o: "ォ",
    y: {
      a: "ャ",
      i: "ィ",
      u: "ュ",
      e: "ェ",
      o: "ョ",
    },
    t: {
      u: "ッ",
      s: {
        u: "ッ",
      },
    },
  },
};

export const convertRomanToKana = (original: string) => {
  const str = original.replace(
    /[Ａ-Ｚａ-ｚ]/,
    (s) => String.fromCharCode(s.charCodeAt(0) - 65248),
  ).toLowerCase(); // 全角→半角→小文字
  let result = "";
  let tmp = "";
  let index = 0;
  const len = str.length;
  let node = tree;
  const push = (char: string, toRoot = true) => {
    result += char;
    tmp = "";
    node = toRoot ? tree : node;
  };
  while (index < len) {
    const char = str.charAt(index);
    if (char.match(/[a-z]/)) { // 英数字以外は考慮しない
      if (char in node) {
        const next = node[char];
        if (typeof next === "string") {
          push(next);
        } else {
          tmp += original.charAt(index);
          node = next;
        }
        index++;
        continue;
      }
      const prev = str.charAt(index - 1);
      if (prev && (prev === "n" || prev === char)) { // 促音やnへの対応
        push(prev === "n" ? "ン" : "ッ", false);
      }
      if (node !== tree && char in tree) { // 今のノードがルート以外だった場合、仕切り直してチェックする
        push(tmp);
        continue;
      }
    }
    push(tmp + char);
    index++;
  }
  tmp = tmp.replace(/n$/, "ン"); // 末尾のnは変換する
  push(tmp);
  return result;
};
