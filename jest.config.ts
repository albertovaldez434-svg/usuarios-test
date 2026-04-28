import type { Config } from 'jest';

const config: Config = {
  preset: 'jest-preset-angular',

  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],

  testEnvironment: 'jsdom',

  transform: {
    '^.+\\.(ts|mjs|js|html)$': 'jest-preset-angular',
  },

  moduleFileExtensions: ['ts', 'html', 'js', 'json'],

  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
};

export default config;