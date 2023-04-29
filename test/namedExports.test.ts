import {
  WhileStrippingExtra,
  WithStrictCasing,
  matchNamedExportRule,
  messageId,
  ruleTester,
} from './utils';

describe('match-named-export', () => {
  ruleTester.run('filename must match a named export', matchNamedExportRule, {
    valid: [
      {
        name: 'export const',
        filename: 'passingtest.js',
        code: `
            export const passingtest = 'pass';
          `,
      },
      {
        name: 'export let',
        filename: 'passingtest.js',
        code: `
            export let passingtest = 'pass';
          `,
      },
      {
        name: 'export var',
        filename: 'passingtest.js',
        code: `
            export var passingtest = 'pass';
          `,
      },
      {
        name: 'export function',
        filename: 'passingtest.js',
        code: `
            export function passingtest() {
              return 'pass'
            }
          `,
      },
      {
        name: 'export class',
        filename: 'passingtest.js',
        code: `
            export class passingtest {
              constructor() {
                return 'pass'
              }
            }
          `,
      },
      {
        name: 'export type',
        filename: 'passingtest.ts',
        code: `
            export type passingtest = 'pass';
          `,
      },
      {
        name: 'export interface',
        filename: 'passingtest.ts',
        code: `
            export interface passingtest {
              pass: string;
            }
          `,
      },
      {
        name: 'export enum',
        filename: 'passingtest.ts',
        code: `
            export enum passingtest {
              yes,
              no
            }
          `,
      },
      {
        name: 'export namespace',
        filename: 'passingtest.ts',
        code: `
            export namespace passingtest {
              export const pass = 'pass';
            }
          `,
      },
      {
        name: 'export declare',
        filename: 'passingtest.ts',
        code: `
            export declare const passingtest = 'passing';
          `,
      },
      {
        name: 'many exports',
        filename: 'passingtest.ts',
        code: `
            export class NotThisOne {
              constructor() {
                return 'fail'
              }
            }
            export const passingtest = 'pass';
            export let passingtest2 = 'fail';
            export var passingtest3 = 'fail';
            export function passingtest4() {
              return 'fail'
            }
          `,
      },
      {
        name: 'object of exports',
        filename: 'passingtest.ts',
        code: `
            const passingtest = 'pass';
            const otherItem = 'fail';
            export {
              passingtest,
              otherItem
            }
          `,
      },
      {
        name: 'export from',
        filename: 'passingtest.ts',
        code: `
            export { passingtest } from './otherfile';
            export const failing = false;
          `,
      },
    ],
    invalid: [
      {
        name: 'no matching export',
        filename: 'failingtest.js',
        code: `
            export const thisTestFails = () => {
              console.log('fails');
            };
          `,
        errors: messageId('noMatchingExport'),
      },
      {
        name: 'export *',
        filename: 'passingtest.ts',
        code: `
            export * from './otherfile';
            export const failing = true;
          `,
        errors: messageId('noMatchingExport'),
      },
      {
        name: 'export * as',
        filename: 'passingtest.ts',
        code: `
            export * as passingtest from './otherfile';
            export const failing = false;
          `,
        errors: messageId('noMatchingExport'),
      },
      {
        name: 'object of exports with wrong name',
        filename: 'failingtest.ts',
        code: `
            const passingtest = 'pass';
            const otherItem = 'fail';
            export {
              passingtest,
              otherItem as failing
            }
          `,
        errors: messageId('noMatchingExport'),
      },
    ],
  });
  ruleTester.run('options: casing', matchNamedExportRule, {
    valid: [
      {
        name: 'strict: strictlyCased.js === strictlyCased',
        filename: 'strictlyCased.js',
        code: `
            export const strictlyCased = () => {
              console.log('passes');
            };
          `,
        options: WithStrictCasing,
      },
      {
        name: 'loose: looselyCased.js == looselycased',
        filename: 'looselyCased.js',
        code: `
            export const looselycased = () => {
              console.log('passes');
            };
          `,
      },
    ],
    invalid: [
      {
        name: 'strict: strictlyCased.js !== strictlycased',
        filename: 'strictlyCased.js',
        code: `
            export const strictlycased = () => {
              console.log('fails');
            }
          `,
        options: WithStrictCasing,
        errors: messageId('noMatchingExport'),
      },
    ],
  });
  ruleTester.run('options: stripextra', matchNamedExportRule, {
    valid: [
      {
        name: 'true: stripped_export.js == strippedexport',
        filename: 'stripped_export.js',
        code: `
        export const strippedexport = () => {
          console.log('passes');
        }
      `,
        options: WhileStrippingExtra,
      },
    ],
    invalid: [
      {
        name: 'false: stripped_export.js !== strippedexport',
        filename: 'stripped_export.js',
        code: `
        export const strippedexport = () => {
          console.log('fails');
        }
      `,
        errors: messageId('noMatchingExport'),
      },
    ],
  });
  ruleTester.run('ignores some situations', matchNamedExportRule, {
    valid: [
      {
        name: 'files with default exports',
        filename: 'defaultExport.js',
        code: `
            export default () => {};
            export const thisdoesnotmatch = () => {}
          `,
      },
      {
        name: 'files with no exports',
        filename: 'noExports.js',
        code: `
            console.log('no exports');
          `,
      },
      {
        name: '.stories.js files',
        filename: 'ignore.stories.js',
        code: `
            export const story = () => {};
          `,
      },
      {
        name: '.test.js files',
        filename: 'ignore.test.js',
        code: `
            export const test = () => {};
          `,
      },
      {
        name: '.spec.js files',
        filename: 'ignore.spec.js',
        code: `
            export const spec = () => {};
          `,
      },
      {
        name: 'index files',
        filename: 'index.js',
        code: `
            export const anything = () => {};
          `,
      },
      {
        name: 'types files',
        filename: 'types.ts',
        code: `
            export type User = string;
          `,
      },
    ],
    invalid: [
      {
        name: 'd.ts files',
        filename: 'types.d.ts',
        code: `
            export declare type User = string;
          `,
        errors: messageId('noMatchingExport'),
      },
    ],
  });
});
