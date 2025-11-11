import { execSync } from "node:child_process";
import { rmSync, existsSync } from "node:fs";

const authPath = "./apps/auth-service";
const buildInfo = `${authPath}/tsconfig.build.tsbuildinfo`;
const distPath = `${authPath}/dist`;

console.log("🧹 Cleaning old build cache...");

if (existsSync(buildInfo)) rmSync(buildInfo);
if (existsSync(distPath)) rmSync(distPath, { recursive: true, force: true });

console.log("🏗️ Building auth-service...");
execSync(`npx tsc -b ${authPath}`, { stdio: "inherit" });

console.log("✅ Auth service build complete!");
