/** @type {import('@commitlint/types').UserConfig} */
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'docs', 'test', 'refactor', 'chore', 'perf'],
    ],
    'scope-enum': [
      2,
      'always',
      [
        'finance',
        'planning',
        'portfolio',
        'insights',
        'identity',
        'administration',
        'shared-kernel',
        'app',
        'infra',
        'docs',
      ],
    ],
  },
};
