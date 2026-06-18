---
name: harness-redeploy
description: Tear down + rebuild + redeploy the docker harness stack against the current branch state, freeing ports first and verifying all three apps respond before reporting. Use after any change that affects what `apps/web-{cs,ts,js}` or the published packages emit — e.g. a package modernization, dependency bump, or anything that changes the `dist/` shape — so you can sanity-check the rendered apps in the browser.
---

# Harness redeploy

Bring the docker harness stack (`harness/docker/docker-compose.yml`) cleanly back up against whatever's currently checked out. Three containers: `harness-web-cs-1` (port 4114), `harness-web-ts-1` (port 3113), `harness-web-js-1` (port 2112).

## Pre-flight

1. **Free the harness ports.** Local `pnpm web-* serve|start` and Playwright e2e runs both bind 2112/3113/4114; if they're still alive docker compose can't bind. Kill them first:

    ```bash
    pkill -f 'http-server -p 211[2]' 2>/dev/null
    pkill -f 'http-server -p 311[3]' 2>/dev/null
    pkill -f 'http-server -p 411[4]' 2>/dev/null
    pkill -f 'webpack serve' 2>/dev/null
    sleep 1
    ss -tlnp 2>/dev/null | grep -E ':(2112|3113|4114)' || echo "(ports free)"
    ```

    If the ports are STILL bound after this, check `docker ps -a` — there may be containers from another project (we hit this once with leftover `package-test-utils-*` containers). Stop+remove those by name before continuing.

2. **Check for non-harness containers on these ports.** If any container outside the `harness-*` project name family is bound to 2112/3113/4114, stop and surface it to the user — don't unilaterally kill containers from other projects.

## Steps

```bash
docker compose -f harness/docker/docker-compose.yml down
docker compose -f harness/docker/docker-compose.yml build --no-cache
docker compose -f harness/docker/docker-compose.yml up -d
```

`--no-cache` is intentional: cached layers have bitten us when `dist/` filenames changed (e.g. the `.umd.js` → `.js` harmonization). The bake takes ~1–2 minutes; that's the price.

## Verify

```bash
until curl -sf http://localhost:4114/ > /dev/null \
   && curl -sf http://localhost:3113/ > /dev/null \
   && curl -sf http://localhost:2112/ > /dev/null; do
    sleep 1
done
for port in 4114 3113 2112; do
    echo "  http://localhost:$port — $(curl -s -o /dev/null -w '%{http_code}' http://localhost:$port/)"
done
```

All three should report `200`. If any returns 404/500 or the loop spins past ~30s, something's wrong — surface it to the user with `docker logs harness-web-<X>-1`.

## Report

Tell the user:

- The three URLs are up:
  - CommonJS:  http://localhost:4114
  - TypeScript: http://localhost:3113
  - Dinosaur JS (script tags): http://localhost:2112
- One sentence on what's running: "containers rebuilt against `<branch-or-commit>` with `<files-of-interest>`" if you can name the change being verified.
- Ask the user to open the URLs in a browser and confirm:
  - heading shows `<h1>` per app
  - version list (`<ul data-ul>`) shows four `@hansogj/*@v…` entries
  - `#verification` has only green `pre.success` rows (no red `pre.error`)

Don't auto-tear-down afterwards — leave the stack running so the user can inspect. `docker compose -f harness/docker/docker-compose.yml down` is a separate explicit step when they're done.

## Gotchas

- **Old http-server processes**: most common cause of port conflicts. The preflight `pkill` covers the patterns we use; if a user has their own server bound, surface it.
- **`name: harness`** in `docker-compose.yml`: the project name is fixed so the containers are always `harness-web-{cs,ts,js}-1`. Don't rename. If `docker compose down` reports "no containers found" but ports are still bound, you're probably hitting containers from a sibling repo's compose file with a different project name.
- **Cache poisoning**: `--no-cache` is non-negotiable. Without it, a stale `dist/` baked into a previous image layer will silently serve the wrong content even when the source has changed.
- **Playwright e2e and docker mutually exclude**: both bind the same ports. Don't run them at the same time. CI runs e2e against `http-server` (lighter), not docker.
