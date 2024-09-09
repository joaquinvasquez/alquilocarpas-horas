module.exports = {
  env: {
    es6: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 2023,
    sourceType: 'module',
  },
  extends: ['eslint:recommended', 'google'],
  rules: {
    'semi': ['error', 'never'],
    'no-restricted-globals': ['error', 'name', 'length'],
    'prefer-arrow-callback': 'error',
    'object-curly-spacing': ['error', 'always'],
    'linebreak-style': 0,
    'max-len': ['error', { code: 120 }],
  },
  overrides: [
    {
      files: ['**/*.spec.*'],
      env: {
        mocha: true,
      },
      rules: {},
    },
  ],
  globals: {},
}
