---
name: bump-and-update
description: Bump every workspace package version (default `patch`) and, in patch mode, refresh external dependencies (minor → majors) with verification. Pre-release modes (`prepatch`/`prerelease`/`preminor`/`premajor`) bump only and leave changes uncommitted for external verification. Never pushes. Use when the user asks to "update deps", "bump and update", or prepare a pre-release candidate.
---

# Bump and update

Two modes, selected by the first arg passed to the skill (default `patch`):

| Mode | Bump | Dep refresh | Local commit | Push |
|---|---|---|---|---|
| `patch` (default) | yes | yes (minor → majors) | yes | no |
| `prepatch` / `prerelease` / `preminor` / `premajor` | yes | **no** | **no** (leaves changes uncommitted) | no |

Pre-release modes exist so the user can produce candidate versions (e.g. `0.5.3-0`), verify them externally via a test-util runner, and then either discard, finalize, or iterate — all from a working-tree state.

The skill **never** pushes in either mode.

## Pre-flight

1. **Refuse to start on a dirty working tree.** Run `git status`. If anything is modified or untracked, stop and tell the user to commit or stash first.
2. **Confirm the workspace shape.** Expect `package.json` at root with scripts `pre-commit`, `build`, `post:update`. If they don't exist, this skill is in the wrong repo — stop and report.
3. **Determine mode** from args. Default is `patch`. Accept `patch`, `prepatch`, `prerelease`, `preminor`, `premajor`. Anything else: ask the user.

## Step 1 — Bump every workspace package

Bump in-place, no git tag, no commit. `BUMP` is the mode arg.

```bash
for pkg in packages/*/; do
    (cd "$pkg" && pnpm version "$BUMP" --no-git-tag-version)
done
pnpm run ws:version:list
```

Applies to **every** package, including any marked deprecated (e.g. immer-reduxer) — keep versions ticking forward unless the user has explicitly excluded one.

Do **not** use `pnpm run ws:version:set:all` — it calls `gitCommitTagPush` which pushes immediately.

---

**If `BUMP` is a pre-release mode (prepatch/prerelease/preminor/premajor), STOP HERE.** Jump to the pre-release Report section. Do not run dep updates, do not commit.

---

## Step 2 — Minor dep updates (patch mode only)

The workspace's `pnpm run update` uses `-i` (interactive) which can't run from a skill. Use ncu non-interactively:

```bash
npx npm-check-updates --peer --target minor
pnpm run post:update
```

`.ncurc.json` has `upgrade: true`, so the first command writes the changes immediately — there is no separate "dry run then apply" step. It also already sets `root: true` and `workspaces: true`; do **not** pass `--root --workspaces` on the CLI — in this ncu version those flags suppress traversal and the run reports "No dependencies." Rely on the rc file.

`post:update` deletes `node_modules` and runs `pnpm i` cleanly.

`--peer` makes ncu honor peer-dependency constraints, so it'll skip upgrades that would break them. That's expected — those candidates will resurface in the majors pass.

## Step 3 — Verify minors

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

```bash
pnpm run pre-commit
pnpm run build
```

If failures appear, diagnose:
- Identify the failing dep(s) from the error.
- Try reverting just that dep's bump in `package.json` (preserve everything else), then `pnpm i` and rerun verification.
- If you can't recover, stop and report. Don't commit a half-broken state.

## Step 6 — Commit locally (patch mode)

```bash
git add -A
git commit -m "chore: bump workspace versions (patch) + refresh deps"
```

The pre-commit hook runs again here — that's a third verification pass and intended.

## Step 7 — Report

### Patch mode

Tell the user:
- New version of each workspace package (`pnpm run ws:version:list`).
- Summary of what dep ranges moved (group minor vs major).
- Anything ncu refused to upgrade and why (peer constraints).
- Explicitly state: **not pushed**. The user pushes when ready.

### Pre-release mode

Tell the user:
- New pre-release version of each package (`pnpm run ws:version:list`).
- Changes are **uncommitted** in the working tree — ready for external verification.
- Next steps the user can take:
  - Run their test-util runner against the candidate.
  - If pass: commit the bump (`git add -A && git commit -m "chore: <pkg> <version> candidate"`), or finalize by re-running this skill with `patch`.
  - If fail: `git restore .` to discard, then iterate.
  - To bump the pre-release counter (e.g. `0.5.3-0` → `0.5.3-1`), re-run with `prerelease`.

## Gotchas

- `.ncurc.json` writes on read — there is no dry-run mode in this repo.
- `ws:version:set:all` is **not** safe for this skill (it pushes); use the per-package loop instead.
- The workspace's `update` and `update:majors` scripts are interactive — bypass them with the raw `npx npm-check-updates` invocation above.
- `eslint` major bumps are typically blocked by `@typescript-eslint/*` peer constraints. If `--target latest` skips eslint, that's why; flag it as a known follow-up rather than trying to force it.
- Pre-release modes never run dep updates, even partial. If the user wants both a pre-release and a dep refresh, that's two separate invocations: first `prepatch` for the candidate, then `patch` (against a clean tree) for the dep refresh.
