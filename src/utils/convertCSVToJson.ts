export const convertCSVToJson = (csvData: string): Record<string, string>[] => {
  const lines: string[] = csvData.split("\n");

  const headers: string[] = lines[0].split(",");
  const result: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const obj: Record<string, string> = {};
    const currentLine: string[] = lines[i].split(",");

    for (let j = 0; j < headers.length; j++) {
      obj[headers[j].trim()] = currentLine[j]?.trim() || ""; // Use optional chaining and provide a default value
    }

    result.push(obj);
  }

  return result;
};
