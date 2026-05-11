// ESLint v9 flat config — see https://eslint.org/docs/latest/use/configure/configuration-files
// Migrated from .eslintrc.cjs on 2026-05-11 (v3.7.1) when v9.0 deprecated legacy format.
// Same rule set as before; only the config shape changed.

module.exports = [
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'commonjs',
      globals: {
        // Node globals (replaces `env: { node, commonjs }` from legacy config).
        console: 'readonly',
        process: 'readonly',
        require: 'readonly',
        module: 'readonly',
        exports: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        Buffer: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        setImmediate: 'readonly',
      },
    },
    rules: {
      'no-empty': ['warn', { allowEmptyCatch: false }],
      'consistent-return': 'warn',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-console': 'off',
      'prefer-const': 'warn',
    },
  },
  {
    // Skip the same trees TOON validator does.
    ignores: ['node_modules/', '.claude/', '.aura/', 'coverage/', 'dist/', 'build/'],
  },
];
