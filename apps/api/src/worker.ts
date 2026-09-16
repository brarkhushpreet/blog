import { httpServerHandler } from "cloudflare:node";
import app from "./app.js";

const workerPort = 4000;

app.listen(workerPort);

export default httpServerHandler({ port: workerPort });
