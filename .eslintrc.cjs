module.exports = {
  env: {
    node: true,
    commonjs: true,
    es2022: true,
  },
  parserOptions: {
    ecmaVersion: 2022,
  },
  rules: {
    'no-empty': ['warn', { allowEmptyCatch: false }],
    'consistent-return': 'warn',
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'no-console': 'off',
    'prefer-const': 'warn',
  },
};
