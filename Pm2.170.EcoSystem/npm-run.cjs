// PM2용 실행 스크립트. 프로젝트 폴더(cwd)에서 args로 받은 npm 스크립트를 차례로 실행합니다.
//   args: ["build", "start"]  →  npm run build가 성공하면 npm run start
// 마지막 스크립트(서버)가 끝나면 같은 종료 코드로 끝나므로 PM2가 다시 띄웁니다.
// PM2는 Windows에서 앱을 콘솔 없이 실행합니다. npm을 숨긴 창으로 띄워야 콘솔 창이 새로 뜨지 않습니다.
"use strict";
const { spawn, spawnSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

// 터미널과 같은 npm을 씁니다. 전역으로 설치한 npm이 있으면 그것을, 없으면 Node.js에 딸린 npm을 씁니다.
const npm = [
  process.env.APPDATA && path.join(process.env.APPDATA, "npm", "node_modules", "npm", "bin", "npm-cli.js"),
  path.join(path.dirname(process.execPath), "node_modules", "npm", "bin", "npm-cli.js"),
].find((file) => file && fs.existsSync(file));
const npmRun = (script) => [process.execPath, [npm, "run", script], { stdio: "inherit", windowsHide: true }];

const scripts = process.argv.slice(2);
if (!npm || !scripts.length) {
  console.error(npm ? "실행할 npm 스크립트를 args에 적어 주세요." : "npm을 찾지 못했습니다.");
  process.exit(1);
}

for (const script of scripts.slice(0, -1)) {
  const { status } = spawnSync(...npmRun(script));
  if (status !== 0) process.exit(status ?? 1);
}

spawn(...npmRun(scripts.at(-1)))
  .on("error", () => process.exit(1))
  .on("exit", (code) => process.exit(code ?? 1));
