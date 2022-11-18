module.exports = {
  root: true,
  extends: ["custom"],
  plugins: ["testing-library"],
  overrides: [
    // Only uses Testing Library lint rules in test files
    {
      files: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"],
      extends: ["plugin:testing-library/react"],
    },
  ],
  rules: {
    "import/no-restricted-paths": [
      "error",
      {
        zones: [
          {
            target: "./src/core",
            from: "./src/components",
          },
          {
            target: "./src/core",
            from: "./src/lib",
          },
          {
            target: "./src/core",
            from: "./src/pages",
          },
          {
            target: "./src/lib",
            from: "./src/pages",
          },
          {
            target: "./src/components",
            from: "./src/pages",
          },
        ],
      },
    ],
  },
};
