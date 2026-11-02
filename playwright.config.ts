import { defineConfig, devices } from '@playwright/test';

/**
 * End-to-end tests run against the production build (Node adapter). Build first: `npm run build`.
 * The test server uses the "log" mail provider (no email is sent) and a high rate limit.
 */
export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { outputFolder: 'qa/playwright-report', open: 'never' }]],
  outputDir: 'test-results',
  use: {
    baseURL: 'http://127.0.0.1:4321',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'node dist/server/entry.mjs',
    url: 'http://127.0.0.1:4321',
    reuseExistingServer: false,
    timeout: 60_000,
    env: {
      HOST: '127.0.0.1',
      PORT: '4321',
      MAIL_PROVIDER: 'log',
      RATE_LIMIT_PER_HOUR: '1000',
    },
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
});
