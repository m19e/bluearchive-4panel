// TODO add 'highlander' 'wild_hunt'
export const SCHOOLS = {
  kivotos: { id: "kivotos", ja: "キヴォトス", en: "Kivotos" },
  prime_student_council: {
    id: "prime_student_council",
    ja: "連邦生徒会",
    en: "Prime Student Council",
  },
  abydos: { id: "abydos", ja: "アビドス", en: "Abydos" },
  gehenna: { id: "gehenna", ja: "ゲヘナ", en: "Gehenna" },
  millennium: { id: "millennium", ja: "ミレニアム", en: "Millennium" },
  trinity: { id: "trinity", ja: "トリニティ", en: "Trinity" },
  hyakkiyako: { id: "hyakkiyako", ja: "百鬼夜行", en: "Hyakkiyako" },
  shanhaijing: { id: "shanhaijing", ja: "山海経", en: "Shanhaijing" },
  red_winter: { id: "red_winter", ja: "レッドウィンター", en: "Red Winter" },
  valkyrie: { id: "valkyrie", ja: "ヴァルキューレ", en: "Valkyrie" },
  arius: { id: "arius", ja: "アリウス", en: "Arius" },
  srt: { id: "srt", ja: "SRT", en: "SRT" },
  kronos: { id: "kronos", ja: "クロノス", en: "Kronos" },
  // TODO フロント側も合わせて'other_students'に修正(fandom側に合わせる対応)
  others_students: {
    id: "others_students",
    ja: "不明",
    en: "Others Students",
  },
  etc: { id: "etc", ja: "その他", en: "ETC" },
} as const;
