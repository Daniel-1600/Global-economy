import fs from "node:fs";
import path from "node:path";
import * as yaml from "js-yaml";

interface ContinentConfig {
  name: string;
  countries: string[];
}

interface Indicator {
  code: string;
  name: string;
  category: string;
  unit: string;
}

export interface AppConfig {
  continents: Record<string, ContinentConfig>;
  indicators: Indicator[];
}

const configPath = path.join(process.cwd(), "config", "indicators.yaml");
const config = yaml.load(fs.readFileSync(configPath, "utf8")) as AppConfig;

export default config;
