export function parseCsv(text: string): Record<string, string>[] {
  const [headerLine, ...dataLines] = text
    .split("\n")
    .map((l) => l.trimEnd())
    .filter((l) => l.length > 0);

  const headers = headerLine.split(",");

  return dataLines.map((line) => {
    const values = line.split(",");
    return Object.fromEntries(headers.map((h, i) => [h, values[i] ?? ""]));
  });
}
