module.exports = {
    ci: {
      upload: {
        target: "temporary-public-storage",
      },
      assert: {
        preset: 'lighthouse:recommended',
        assertions: {
          "categories:performance": ["warn", {"minScore": 0.95}],
          "categories:seo": ["error", {"minScore": 1}],
        }
      },
    },
  staticDistDir: "./dist",
  };
