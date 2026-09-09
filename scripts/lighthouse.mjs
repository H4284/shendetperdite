import { spawn } from "node:child_process";
import { once } from "node:events";
import { setTimeout as delay } from "node:timers/promises";

const PORT = 3001;
const URL = `http://127.0.0.1:${PORT}`;

function run(command, args, extra = {}) {
  const child = spawn(command, args, {
    stdio: "inherit",
    shell: process.platform === "win32",
    ...extra,
  });
  return child;
}

async function waitForServer() {
  for (let i = 0; i < 40; i += 1) {
    try {
      const response = await fetch(URL);
      if (response.ok) return;
    } catch {
      // retry
    }
    await delay(500);
  }
  throw new Error(`Server did not start on ${URL}`);
}

async function main() {
  const server = run("npx", ["next", "start", "-p", String(PORT)]);
  try {
    await waitForServer();
    const lighthouse = run("npx", [
      "--yes",
      "lighthouse",
      URL,
      "--only-categories=performance,accessibility",
      "--form-factor=mobile",
      "--screenEmulation.mobile",
      "--output=json",
      "--output-path=lighthouse-epic1.json",
      "--chrome-flags=--headless --no-sandbox",
      "--quiet",
    ]);
    const [code] = await once(lighthouse, "exit");
    if (code !== 0 && code !== null) {
      throw new Error(`Lighthouse exited with code ${code}`);
    }
  } finally {
    server.kill();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
