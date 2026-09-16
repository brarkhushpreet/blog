import dotenv from "dotenv";
import { resolve } from "node:path";

const appEnv = resolve(process.cwd(), ".env");
const rootEnv = resolve(process.cwd(), "../../.env");

dotenv.config({ path: rootEnv });
dotenv.config({ path: appEnv, override: true });
