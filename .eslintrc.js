module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  plugins: [
    'react',
    'react-hooks',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: 'babel-eslint',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    'react/forbid-prop-types': 0,
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
    'react/sort-prop-types': [1, { callbacksLast: true, noSortAlphabetically: true }],
    'react/jsx-sort-default-props': 1,
    'react/jsx-no-bind': [2],
    'react/jsx-boolean-value': 2,
    'react/jsx-handler-names': 2,
    'react/destructuring-assignment': 0,
    'react/forbid-foreign-prop-types': 0,
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'semi': 2,
    'comma-dangle': ['error', {
      'arrays': 'always-multiline',
      'objects': 'always-multiline',
      'imports': 'always-multiline',
      'exports': 'always-multiline',
      'functions': 'never',
    }],
    'quotes': [2, 'single', { 'avoidEscape': true }],
    'no-inline-comments': [0],
    'keyword-spacing': [2],
    'space-infix-ops': [2],
  },
};
