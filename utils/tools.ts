export const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const getHtmlUtf8 = async (res: Response): Promise<string> => {
  const resBuf = await res.arrayBuffer();
  const text = new TextDecoder().decode(resBuf);

  // convert to UTF-8 if charset is Shift-JIS
  return text.includes("text/html; charset=Shift_JIS")
    ? new TextDecoder("shift-jis").decode(resBuf)
    : text;
};

export const writeJSON = async (filepath: string, input: any) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(JSON.stringify(input));
  await Deno.writeFile(filepath, data);
};
