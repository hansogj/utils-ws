[![example workflow](https://github.com/hansogj/utils-ws/actions/workflows/build.yml/badge.svg)](https://github.com/hansogj/utils-ws/actions/workflows/build.yml/badge.svg)

# Various frontend utils and polyfills

This libs are using [npm workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces) to achieve mono-repo multi-packages

## Workspaces

- [find-js](./packages/find-js/README.md)
- [abonnement-js](./packages/abonnement-js/README.md)
- [array.utils](./packages/array.utils/README.md)
- [maybe](./packages/maybe/README.md)
- [git-prompt](./packages/git-prompt/README.md)

[//]: <> (package-list-placeholder-do-not-remove)

### Deprecated

No longer maintained. Pin an existing version if you need them; do not adopt them for new projects.

- [immer-reduxer](./packages/immer-reduxer/README.md)

## Install

```bash
pnpm i --frozen-lockfile
```

## Add new package

```bash
pnpm run generate -- "<name-of-package>"
```

Dependencies & devDependencies are installed into your new package with

```bash
cd  packages/<target>
pnpm add some-package
cd -
```

To in make internal dependencies, go to target package and do:

```bash
cd packages/<target>
pnpm add --workspace <name-of-package>
cd -
```

## Test & Build

From root run

```bash
pnpm run build
pnpm run test
```

`build` must run before `test` — the unit tests resolve internal dependencies through each package's `main` (`dist/index.js`), so a clean checkout needs to be built first. CI and the pre-commit hook both follow this order.

## Integration harness

End-to-end verification that the published packages work in three consumption modes — CommonJS, TypeScript/ESM and plain `<script>` tags. Lives under `apps/` (workspace-linked, not installed from npm) with shared helpers under `harness/shared`.

```bash
pnpm run harness:build      # builds shared + all three apps
pnpm run harness:test       # jest in web-cs + web-ts (web-js has no tests)
pnpm run harness:e2e        # Playwright headless against all three apps (CI runs this; not in pre-commit)
pnpm web-ts serve           # http://localhost:3113
pnpm web-cs serve           # http://localhost:4114
pnpm web-js start           # http://localhost:2112 (needs `pnpm web-js build` first)

# Run all three in containers (tears down any existing instance first)
docker compose -f harness/docker/docker-compose.yml down && \
  docker compose -f harness/docker/docker-compose.yml up
```

Versions shown in the apps come from a single source of truth: `harness/shared/scripts/build-deps.js` reads `packages/<pkg>/package.json` for every workspace package and writes `harness/shared/src/deps.json`. The generator runs automatically on `pnpm i` via the `prepare` script.

The Playwright suite lives in `harness/e2e/` — it boots http-servers for the three built apps via `playwright.config.ts`'s `webServer` block and asserts on the rendered DOM (heading, version list, success/error `<pre>` counts). Catches build-time regressions that the in-process jest tests miss — e.g. the tree-shaking-vs-polyfill issue that surfaced during the array.utils modernization.

## Testing helper: `shouldIt`

[`harness/shared/src/should-it.js`](./harness/shared/src/should-it.js) is a small, framework-agnostic helper for writing branch-driven test names — `should X` / `should not X` — that only register the relevant branch. Useful when a single parametrised describe needs to assert one thing in the positive case and a different thing in the negative case, without an ugly `if` ladder.

The implementation is intentionally tiny and **not published as a package** — it's shipped alongside the harness lib so any workspace consumer can `require('shared')` it (the harness apps already do). It works with Jest, Vitest, and any runner exposing a `test(name, fn, timeout)` signature.

```ts
import { createShouldIt } from 'shared';

const should = createShouldIt(test); // pass your runner's `test`

describe.each([
  ['<ul><li>1</li></ul>', true],
  ['<div>no list</div>', false],
])('find("li") in %s', (template, hasItems) => {
  beforeEach(() => { document.body.innerHTML = template; });

  should('return at least one element', hasItems).then(() =>
    expect(find('li').length).toBeGreaterThan(0)
  );
  should('return any elements', hasItems).dont(() =>
    expect(find('li')).toHaveLength(0)
  );
});
```

`should(description, condition).then(body)` registers `should <description>` only when `condition` is true; `.dont(body)` registers `should not <description>` only when it's false. `.then(body, toBe)` appends `JSON.stringify(toBe)` to the label for parametrised expectations.

A bare `shouldIt` export is also available — it resolves the runner's `test` via global lookup at call time, for codebases that already rely on Jest's / Vitest's global injection. Prefer the explicit `createShouldIt(test)` factory in new code.

A `might(condition: boolean)` helper is also exported — returns `'should'` or `'should not'` — handy for building dynamic describe labels independently of the chain.

## Versioning

The pnpm-script _ws:version:set:all_ will ensure all packages are updated with same strategy, and git tagging is done right

```bash
pnpm run ws:version:set:all <strategy: major|minor|patch....>

```

Changing version to a single workspace package, simply enter the package and do

```bash
cd packages/<target>
pnpm version <strategy: major|minor|patch....>
../../scripts/ws-scripts.sh gitCommitTagPush
cd -
```

## Publish

```bash
pnpm run build
cd packages/<target>
pnpm publish
cd -

```

or

```bash
pnpm run build
pnpm -r publish --access=public

```
