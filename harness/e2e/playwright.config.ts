import { defineConfig } from '@playwright/test';
import path from 'node:path';

const repoRoot = path.resolve(__dirname, '..', '..');

// Spin up the three harness apps via their http-server `start` scripts.
// They serve the BUILT dist/, so `pnpm run harness:build` must have run first
// (the root `harness:e2e` script enforces this).
const startCommand = (app: string, port: number) => ({
  command: `pnpm --filter ${app} start`,
  cwd: repoRoot,
  url: `http://localhost:${port}/`,
  timeout: 60_000,
  reuseExistingServer: !process.env.CI,
});

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['list']] : 'list',
  use: {
    trace: 'on-first-retry',
  },
  webServer: [
    startCommand('web-cs', 4114),
    startCommand('web-ts', 3113),
    startCommand('web-js', 2112),
  ],
});
