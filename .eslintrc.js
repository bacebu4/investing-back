module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
    jest: true,
  },
  extends: ['airbnb-base'],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    'import/prefer-default-export': 0,
    'max-classes-per-file': 0,
    'no-console': 0,
    'object-curly-newline': 0,
  },
};
