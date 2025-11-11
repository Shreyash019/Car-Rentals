#!/usr/bin/env node
import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const __dirname = path.resolve();
const type = process.argv[2];
const name = process.argv[3];

if (!type || !name) {
  console.log("\nUsage:");
  console.log("  npm run create:app <type> <name>");
  console.log("\nTypes:");
  console.log("  next     → Next.js frontend");
  console.log("  nest     → Nest.js backend");
  console.log("  go       → Go microservice");
  console.log("  python   → Python worker\n");
  process.exit(1);
}

const appDir = path.join(__dirname, "apps", name);
if (fs.existsSync(appDir)) {
  console.error(`❌ '${name}' already exists under /apps`);
  process.exit(1);
}

fs.mkdirSync(path.join(__dirname, "apps"), { recursive: true });

console.log(`\n🚀 Creating ${type.toUpperCase()} app '${name}' ...\n`);

try {
  switch (type) {
    case "next":
      execSync(`npx create-next-app@latest apps/${name} --typescript --use-npm`, { stdio: "inherit" });
      break;

    case "nest":
      execSync(`npx @nestjs/cli new apps/${name} --package-manager npm --skip-git`, { stdio: "inherit" });
      break;

    case "go":
      fs.mkdirSync(appDir, { recursive: true });
      process.chdir(appDir);
      execSync(`go mod init ${name}`, { stdio: "inherit" });
      execSync(`echo 'package main\n\nfunc main() { println("Hello from ${name}") }' > main.go`);
      break;

    case "python":
      fs.mkdirSync(appDir, { recursive: true });
      process.chdir(appDir);
      execSync(`python -m venv venv && echo 'print("Hello from ${name}")' > main.py`, { stdio: "inherit", shell: true });
      break;

    default:
      console.error("❌ Unsupported type. Use: next | nest | go | python");
      process.exit(1);
  }
} catch (err) {
  console.error("❌ Project generation failed:", err.message);
  process.exit(1);
}

// back to repo root
process.chdir(__dirname);

// Adjust workspace package name if Node-based
if (["next", "nest"].includes(type)) {
  const pkgPath = path.join(appDir, "package.json");
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
  pkg.name = `@apps/${name}`;
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
}

// add workspace entry
const rootPkgPath = path.join(__dirname, "package.json");
const rootPkg = JSON.parse(fs.readFileSync(rootPkgPath, "utf8"));
if (!rootPkg.workspaces.includes(`apps/${name}`)) {
  rootPkg.workspaces.push(`apps/${name}`);
  fs.writeFileSync(rootPkgPath, JSON.stringify(rootPkg, null, 2));
}

console.log(`\n✅ '${name}' created successfully under /apps.`);
console.log("📦 Run 'npm install' to link workspace.\n");
