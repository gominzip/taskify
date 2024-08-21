import { readFileSync, writeFileSync } from "fs";

class FileHandler {
  static readFile(filePath) {
    const data = readFileSync(filePath, "utf-8");
    return JSON.parse(data);
  }

  static writeFile(filePath, data) {
    writeFileSync(filePath, JSON.stringify(data, null, 2));
  }
}

export default FileHandler;
