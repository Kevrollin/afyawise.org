// Lighthouse CI: run with `npm run build && npm run qa:lhci` (starts the Node preview server itself).
// Mobile emulation (default Lighthouse preset: simulated slow 4G, 4x CPU). Assertions = the quality bar.
const routes = [
  '/',
  '/programs',
  '/programs/maternal-child-health',
  '/impact',
  '/partner',
  '/donate',
  '/get-involved',
  '/contact',
  '/about',
];

module.exports = {
  ci: {
    collect: {
      startServerCommand: 'npm run preview',
      startServerReadyPattern: 'Server listening',
      url: routes.map((r) => `http://127.0.0.1:4321${r}`),
      numberOfRuns: 1,
      settings: { chromeFlags: '--headless=new' },
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.95 }],
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'categories:best-practices': ['error', { minScore: 0.95 }],
        'categories:seo': ['error', { minScore: 0.95 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 1800 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.05 }],
        'total-byte-weight': ['error', { maxNumericValue: 512000 }],
      },
    },
    upload: { target: 'filesystem', outputDir: 'qa/lhci' },
  },
};
