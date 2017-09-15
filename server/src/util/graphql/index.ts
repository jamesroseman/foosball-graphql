import * as fs from "fs";

export const readSchema: (localPath: string) => string =
  (localPath: string) => fs.readFileSync(localPath, "utf8");
