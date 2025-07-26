import { ESLintUtils } from '@typescript-eslint/utils';

import plugin, { DefaultMessageIds, NamedMessageIds } from '../src';

export const ruleTester = new ESLintUtils.RuleTester({
  parser: '@typescript-eslint/parser',
});

export const matchNamedExportRule = plugin.rules['match-named-export'];
export const matchDefaultExportRule = plugin.rules['match-default-export'];
export const WithStrictCasing = [
  {
    casing: 'strict',
  },
] as const;
export const WhileStrippingExtra = [
  {
    stripextra: true,
  },
] as const;

export const messageId = <T extends NamedMessageIds | DefaultMessageIds>(
  messageId: T,
) => [
  {
    messageId,
  },
];

const utils = {
  ruleTester,
};

export default utils;
