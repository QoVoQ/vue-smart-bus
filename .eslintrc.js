module.exports = {
  root: true,
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
    'jest/globals': true
  },
  plugins: ['jest'],
  extends: [
    'standard',
    'plugin:jest/recommended'
  ],
  rules: {
    'space-before-function-paren': [2, 'never']
  }
}
