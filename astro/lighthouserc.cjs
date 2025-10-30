module.exports = {
    ci: {
      upload: {
        target: "temporary-public-storage",
      },
      collect: {
        numberOfRuns: 3,
        maxAutodiscoverUrls: 10,
        startServerCommand: "npm run build && npm run serve:cf",
        startServerReadyTimeout: 120000,
        startServerReadyPattern: "Ready on.*http://localhost:8787.*",
        url: ["http://localhost:8787/"],
      },
      assert: {
        preset: 'lighthouse:recommended',
        assertions: {
          "categories:performance": ["error", {"minScore": 0.95}],
          "categories:seo": ["error", {"minScore": 1}],
          "unused-javascript": "off",
          "uses-responsive-images": "warn",
        }
      },
    },
  };
