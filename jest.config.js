/** @type {import('jest').Config} */
const config = {
  verbose: true,
  testEnvironment: "node",
  testMatch: ["**/**/*.test.js"],
  forceExit: true,
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
  coveragePathIgnorePatterns: ["/node_modules/", "/config/"],
  collectCoverage: true,
  coverageReporters: ["json", "html"],
};

module.exports = config;
