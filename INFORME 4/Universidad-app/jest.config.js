/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  testTimeout: 20000,
  roots: ['<rootDir>/tests'],
  testMatch: ['**/*.test.js'],
};
