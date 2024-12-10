module.exports = {
    ci: {
      upload: {
        target: "temporary-public-storage",
      },
      collect: {
        staticDistDir: "dist",
        maxAutodiscoverUrls: 10,
      },
      assert: {
        preset: 'lighthouse:recommended',
        assertions: {
          "categories:performance": ["error", {"minScore": 0.95}],
          "categories:seo": ["error", {"minScore": 1}],
          "unused-javascript": "off",
        }
      },
    },
  };
