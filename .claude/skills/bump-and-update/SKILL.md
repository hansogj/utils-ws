---
name: bump-and-update
description: Bump every workspace package version by patch, then refresh external dependencies (minor first, then majors), verifying build + pre-commit pipeline after each step. Commits locally; never pushes. Use when the user asks to "update deps", "bump and update", or refresh the workspace's dependency baseline.
---

# Bump and update

Refresh this workspace's dependency baseline. Patch-bump every package first, then update external deps in two passes (minor → major), verifying after each pass. Commit locally at the end; **do not push** — that's the user's call.

## Pre-flight

1. **Refuse to start on a dirty working tree.** Run `git status`. If anything is modified or untracked (besides this skill), stop and tell the user to commit or stash first. The verification steps depend on knowing the changes came from this skill alone.
2. **Confirm the workspace shape.** Expect `package.json` at root with scripts `pre-commit`, `build`, `post:update`. If they don't exist, this skill is in the wrong repo — stop and report.

## Step 1 — Patch-bump every workspace package

Bump in-place, no git tag, no commit:

```bash
for pkg in packages/*/; do
    (cd "$pkg" && pnpm version patch --no-git-tag-version)
done
pnpm run ws:version:list
```

The bump applies to **every** package, including any marked deprecated (e.g. immer-reduxer) — keep the versions ticking forward unless the user has explicitly excluded one. Use the workspace `ws:version:list` output to sanity-check.

Do **not** use `pnpm run ws:version:set:all` — it calls `gitCommitTagPush` which pushes immediately, and we don't push.

## Step 2 — Minor dep updates

Workspace's `pnpm run update` uses `-i` (interactive) which can't run from a skill. Use ncu non-interactively instead:

```bash
npx npm-check-updates --peer --target minor
pnpm run post:update
```

`.ncurc.json` has `upgrade: true`, so the first command writes the changes immediately — there is no separate "dry run then apply" step. It also already sets `root: true` and `workspaces: true`; do **not** pass `--root --workspaces` on the CLI — in this ncu version those flags suppress traversal and the run reports "No dependencies." Rely on the rc file.

`post:update` deletes node_modules and runs `pnpm i` cleanly.

Note `--peer` makes ncu honor peer-dependency constraints, so it'll skip upgrades that would break them. That's expected — those candidates will resurface in the majors pass.

## Step 3 — Verify minors

Run both:

```bash
pnpm run pre-commit
pnpm run build
```

If anything fails: **stop, do not proceed to majors.** Report what broke; let the user decide whether to revert specific packages or fix forward.

## Step 4 — Major dep updates

```bash
npx npm-check-updates --peer --target latest
pnpm run post:update
```

## Step 5 — Verify majors

Same as Step 3:

```bash
pnpm run pre-commit
pnpm run build
```

If failures appear, diagnose:
- Identify the failing dep(s) from the error.
- Try reverting just that dep's bump in `package.json` (preserve everything else), then `pnpm i` and rerun verification.
- If you can't recover, stop and report. Don't commit a half-broken state.

## Step 6 — Commit locally

```bash
git add -A
git commit -m "chore: bump workspace versions (patch) + refresh deps"
```

The pre-commit hook will run again here — that's a third verification pass and intended.

## Step 7 — Report

Tell the user:
- New version of each workspace package (`pnpm run ws:version:list`).
- Summary of what dep ranges moved (group minor vs major).
- Anything ncu refused to upgrade and why (peer constraints).
- Explicitly state: **not pushed**. The user pushes when ready.

## Gotchas

- `.ncurc.json` writes on read — there is no dry-run mode in this repo.
- `ws:version:set:all` is **not** safe for this skill (it pushes); use the per-package loop instead.
- The workspace's `update` and `update:majors` scripts are interactive — bypass them with the raw `npx npm-check-updates` invocation above.
- `eslint` major bumps are typically blocked by `@typescript-eslint/*` peer constraints. If `--target latest` skips eslint, that's why; flag it to the user as a known follow-up rather than trying to force it.
