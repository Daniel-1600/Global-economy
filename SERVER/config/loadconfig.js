import yaml from "js-yaml";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const config = yaml.load(
  fs.readFileSync(path.join(__dirname, "indicators.yaml"), "utf8")
);

export default config;