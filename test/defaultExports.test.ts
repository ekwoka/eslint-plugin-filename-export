import {
  WhileStrippingExtra,
  WithStrictCasing,
  matchDefaultExportRule,
  messageId,
  ruleTester,
} from './utils';

describe('match-default-export', () => {
  ruleTester.run(
    'filename must match a default export',
    matchDefaultExportRule,
    {
      valid: [
        {
          name: 'export default function',
          filename: 'passingtest.js',
          code: `
            export default function passingtest() {
              return 'pass'
            }
          `,
        },
        {
          name: 'export default class',
          filename: 'passingtest.js',
          code: `
            export default class passingtest {
              constructor() {
                return 'pass'
              }
            }
          `,
        },
        {
          name: 'export default variable',
          filename: 'passingtest.js',
          code: `
              const passingtest = 'pass'
              export default passingtest
            `,
        },
        {
          name: 'export default unnamed',
          filename: 'passingtest.js',
          code: `
              export default 'pass'
            `,
        },
        {
          name: 'export default unnamed object',
          filename: 'passingtest.js',
          code: `
              export default {
                passingtest: 'pass'
              }
            `,
        },
        {
          name: 'export default unnamed function',
          filename: 'passingtest.js',
          code: `
              export default function() {
                return 'pass'
              }
            `,
        },
        {
          name: 'export default unnamed class',
          filename: 'passingtest.js',
          code: `
              export default class {
                constructor() {
                  return 'pass'
                }
              }
            `,
        },
      ],
      invalid: [
        {
          name: 'export default named non-matching',
          filename: 'failingtest.js',
          code: `
            export default function passingtest() {
              return 'pass'
            }
          `,
          errors: messageId('defaultExportDoesNotMatch'),
        },
        {
          name: 'export default variable non-matching',
          filename: 'failingtest.js',
          code: `
              const passingtest = 'pass'
              export default passingtest
            `,
          errors: messageId('defaultExportDoesNotMatch'),
        },
      ],
    }
  );
  ruleTester.run('option: casing', matchDefaultExportRule, {
    valid: [
      {
        name: 'strict: passingTest.js === passingTest',
        filename: 'passingTest.js',
        code: `
            const passingTest = 'pass'
            export default passingTest
          `,
        options: WithStrictCasing,
      },
      {
        name: 'loose: passingTest.js == passingtest',
        filename: 'passingTest.js',
        code: `
            const passingtest = 'pass'
            export default passingtest
          `,
      },
    ],
    invalid: [
      {
        name: 'strict: passingtest.js !== passingTest',
        filename: 'passingtest.js',
        code: `
            const passingTest = 'pass'
            export default passingTest
          `,
        options: WithStrictCasing,
        errors: messageId('defaultExportDoesNotMatch'),
      },
    ],
  });
  ruleTester.run('options: stripextra', matchDefaultExportRule, {
    valid: [
      {
        name: 'true: stripped_export.js == strippedexport',
        filename: 'stripped_export.js',
        code: `
            const strippedexport = 'passes'
            export default strippedexport
          `,
        options: WhileStrippingExtra,
      },
    ],
    invalid: [
      {
        name: 'false: stripped_export.js !== strippedexport',
        filename: 'stripped_export.js',
        code: `
            const strippedexport = 'fails'
            export default strippedexport
          `,
        errors: messageId('defaultExportDoesNotMatch'),
      },
    ],
  });
});
