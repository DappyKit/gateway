module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts'],
  testTimeout: 100000,
  globalSetup: './test/setup.ts',
}
