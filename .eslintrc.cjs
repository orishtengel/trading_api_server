/* eslint-env node */
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['./tsconfig.json'],
    tsconfigRootDir: __dirname,
  },
  plugins: ['@typescript-eslint', 'import'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'prettier',
  ],
  settings: {
    'import/resolver': {
      typescript: {
        project: './tsconfig.json',
      },
    },
  },
  rules: {
    'import/no-cycle': 'error',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }
    ],
  },
  overrides: [
    {
      files: ['src/controller/**/*.ts'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            paths: [
              { name: '@service/*', message: 'Controllers must not import services' },
              { name: '@data/*', message: 'Controllers must not import data layer' },
            ],
            patterns: [
              { group: ['@service/*'], message: 'Controllers must not import services' },
              { group: ['@data/*'], message: 'Controllers must not import data layer' },
            ],
          },
        ],
      },
    },
    {
      files: ['src/manager/**/*.ts'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            paths: [
              { name: '@data/*', message: 'Managers must not import data layer directly' },
              { name: '@controller/*', message: 'Managers must not import controllers' },
            ],
            patterns: [
              { group: ['@data/*'], message: 'Managers must not import data layer directly' },
              { group: ['@controller/*'], message: 'Managers must not import controllers' },
            ],
          },
        ],
      },
    },
    {
      files: ['src/service/**/*.ts'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            paths: [
              { name: '@controller/*', message: 'Services must not import controllers' },
              { name: '@manager/*', message: 'Services must not import managers' },
              { name: '@service/*', message: 'Services must not import other services' },
            ],
            patterns: [
              { group: ['@controller/*'], message: 'Services must not import controllers' },
              { group: ['@manager/*'], message: 'Services must not import managers' },
              { group: ['@service/*'], message: 'Services must not import other services' },
            ],
          },
        ],
      },
    },
    {
      files: ['src/data/**/*.ts'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            paths: [
              { name: '@controller/*', message: 'Data must not import upper layers' },
              { name: '@manager/*', message: 'Data must not import upper layers' },
              { name: '@service/*', message: 'Data must not import upper layers' },
            ],
            patterns: [
              { group: ['@controller/*'], message: 'Data must not import upper layers' },
              { group: ['@manager/*'], message: 'Data must not import upper layers' },
              { group: ['@service/*'], message: 'Data must not import upper layers' },
            ],
          },
        ],
      },
    },
  ],
}; 