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
};
