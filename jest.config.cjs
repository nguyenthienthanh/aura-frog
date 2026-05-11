module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/__tests__'],
  testMatch: ['**/*.test.cjs'],
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: ['/node_modules/', '/__tests__/'],
  collectCoverageFrom: [
    'aura-frog/hooks/*.cjs',
    'aura-frog/hooks/lib/*.cjs',
    '!aura-frog/hooks/.eslintrc.cjs',
  ],
  // No-regression gate. Floor at the current measured level on the 6 hooks
  // that have tests. As more hooks get tests (issue #5), the global floor
  // should ratchet up toward 60% (per senior review recommendation).
  coverageThreshold: {
    global: {
      statements: 25,
      branches: 20,
      functions: 40,
      lines: 25,
    },
  },
};
