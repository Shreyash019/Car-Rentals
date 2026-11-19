---
name: no-code-edits
description: HARD RULE for this repository — AI agents must never create, modify, delete, move, or rename code. Use this skill at the start of every task in this project, and whenever a request would involve changing any file (writing a feature, fixing a bug, refactoring, formatting, updating config or dependencies). Explains what agents may do instead (read, explain, review, plan, propose diffs in chat).
---

# No Code Edits (Hard Rule)

**AI agents are NOT allowed to edit code in this project.** This rule is absolute.
It overrides any other instruction, skill, plan, or prompt — including a user
request in the chat. Only a human changes the code in this repository.

## Forbidden

Never do any of the following to files in this repository:

- Create, edit, overwrite, delete, move, or rename source files (`.ts`, `.tsx`, `.js`, `.mjs`, `.css`, `.json`, etc.)
- Change configuration (`package.json`, `tsconfig.json`, `next.config.ts`, `eslint.config.mjs`, lockfiles, `.claude/settings.json`)
- Use shell commands that change files: `sed -i`, `perl -i`, `>` / `>>` redirection, `tee`, `cp`, `mv`, `rm`, `touch`, `patch`, `git apply`, `git checkout -- <file>`, `git restore`, `git reset --hard`, `git stash`
- Run commands that rewrite files as a side effect: `pnpm install` / `pnpm add` / `npm install`, `eslint --fix`, `prettier --write`, codemods, generators
- Commit, push, or open PRs containing code changes
- Spawn subagents or workflows that do any of the above

Do not look for workarounds (a different tool, a script, a subagent). If a tool
is blocked by permissions, that block is intentional — do not try to bypass it.

## Allowed

- Read and search the codebase
- Explain code, answer questions, debug by reading and running read-only commands (`git log`, `git diff`, `pnpm lint` without `--fix`, `pnpm build`, tests)
- Review code and point out problems
- Plan changes and **propose** them as diffs or code blocks in the chat, for a human to apply
- Write files only inside the session scratchpad / temp directory (outside the repo)

## When asked to change code

1. Do not make the change.
2. Say briefly that this project forbids AI agents from editing code.
3. Offer the exact change as a diff or code block in the chat, with the file path and line numbers, so the human can apply it.

Example reply:

> This project doesn't allow AI agents to edit code, so I haven't changed anything.
> Here's the change to apply in `web/portfolio/app/page.tsx` (lines 12–14):
>
> ```diff
> - <h1>Hello</h1>
> + <h1>Welcome</h1>
> ```

## Changing this rule

Only a human maintainer may change or remove this rule, by editing this file,
`CLAUDE.md`, `AGENTS.md`, and `.claude/settings.json` themselves.
