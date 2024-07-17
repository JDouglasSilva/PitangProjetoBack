module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.ts'],
  collectCoverage: true, 
  collectCoverageFrom: [
    'src/**/*.ts', 
    '!src/**/*.d.ts', 
  ],
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "src/server.ts",
    "src/scripts/"
  ],
  coverageDirectory: 'coverage', 
  coverageReporters: ['text', 'lcov'], 
};
