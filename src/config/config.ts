import * as dotenv from "dotenv";
import { Enviroment } from "../models/env";

dotenv.config();

function env(): Enviroment {
  const TOKEN: string = process.env.TOKEN || "";
  return { TOKEN };
}

export { env };
