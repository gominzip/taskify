import { readFileSync } from "fs";

class FileHandler {
  static readFile(filePath) {
    const data = readFileSync(filePath, "utf-8");
    return JSON.parse(data);
  }

  static async writeFile(filePath, data) {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  }
}

export default FileHandler;
