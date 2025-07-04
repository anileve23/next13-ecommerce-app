module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "react"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "next/core-web-vitals"
  ],
  rules: {
    // Customize rules if needed
  },
  settings: {
    react: {
      version: "detect"
    }
  }
};
