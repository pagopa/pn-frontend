const base = require('../../jest.config.base.js');

module.exports = {
  ...base,
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
};
