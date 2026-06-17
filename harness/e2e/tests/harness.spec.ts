import { test, expect, type Page } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const deps = JSON.parse(
  fs.readFileSync(
    path.resolve(__dirname, '..', '..', 'shared', 'src', 'deps.json'),
    'utf8',
  ),
) as Record<string, string>;

const expectedDepsList = Object.entries(deps).map(([name, version]) => `${name}@v${version}`);

const servers = [
  { name: 'web-cs', url: 'http://localhost:4114/', heading: 'CommonJS Context!', testCount: 6 },
  { name: 'web-ts', url: 'http://localhost:3113/', heading: 'Typescript Context!', testCount: 6 },
  { name: 'web-js', url: 'http://localhost:2112/', heading: 'Dinosaur Javascript!', testCount: 5 },
] as const;

const assertHarness = async (page: Page, opts: { heading: string; testCount: number }) => {
  // Heading
  await expect(page.locator('h1')).toHaveText(opts.heading);

  // Dependency list — generated from harness/shared/src/deps.json, must match
  // the registry of workspace packages 1:1, in deterministic order.
  const items = page.locator('[data-ul] li');
  await expect(items).toHaveCount(expectedDepsList.length);
  for (let i = 0; i < expectedDepsList.length; i += 1) {
    await expect(items.nth(i)).toHaveText(expectedDepsList[i]);
  }

  // Verification area — wait for the "After all" summary to land, then assert
  // no error <pre> elements anywhere in the verification block.
  const summary = page.locator(
    `#verification pre.success:has-text("expect to have ran ${opts.testCount} tests")`,
  );
  await expect(summary).toBeVisible({ timeout: 10_000 });
  await expect(page.locator('#verification pre.error')).toHaveCount(0);
};

for (const { name, url, heading, testCount } of servers) {
  test(`${name} renders heading + version list + green test suite`, async ({ page }) => {
    await page.goto(url);
    await assertHarness(page, { heading, testCount });
  });
}
