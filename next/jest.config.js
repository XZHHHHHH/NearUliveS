/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom',   // you already installed this
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],

  transform: {
    // tell ts‑jest to use the new tsconfig
    '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: 'tsconfig.jest.json' }],
  },
};
