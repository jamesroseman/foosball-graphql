import fs from 'fs';

export const readSchema = (localPath: string) => fs.readFileSync(localPath, "utf8");
