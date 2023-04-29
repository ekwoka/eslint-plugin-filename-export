import {
  AST_NODE_TYPES,
  ESLintUtils,
  TSESTree,
} from '@typescript-eslint/utils';

import { basename, extname } from 'node:path';

import { DefaultMessageIds, NamedMessageIds, Options } from './types';

const createRule = ESLintUtils.RuleCreator(
  () => 'https://github.com/ekwoka/eslint-plugin-filename-export'
);

export = {
  rules: {
    'match-named-export': createRule<Options, NamedMessageIds>({
      name: 'match-named-export',
      defaultOptions: [
        {
          stripextra: false,
          casing: 'loose',
        },
      ],
      meta: {
        docs: {
          description: 'Enforce filename matches named export',
          recommended: 'error',
        },
        messages: {
          noMatchingExport: 'Filename does not match any named exports',
        },
        type: 'suggestion',
        schema: [
          {
            type: 'object',
            properties: {
              stripextra: {
                type: 'boolean',
              },
              casing: {
                enum: ['strict', 'loose'],
              },
            },
          },
        ],
      },
      create(context) {
        const transformers = makeTransformers(context.options[0] ?? {});
        return {
          Program(node) {
            const filename = context.getFilename();
            const filenameSansExt = basename(filename, extname(filename));
            if (
              ['index', 'types'].includes(filenameSansExt) ||
              /\.(test|spec|stories)$/.test(filenameSansExt)
            )
              return;
            if (
              node.body.find(
                (item) => item.type === AST_NODE_TYPES.ExportDefaultDeclaration
              )
            )
              return;
            const namedExports =
              node.body.filter<TSESTree.ExportNamedDeclaration>(
                (item): item is TSESTree.ExportNamedDeclaration =>
                  item.type === AST_NODE_TYPES.ExportNamedDeclaration
              );
            if (!namedExports.length) return;
            const matchingExport = namedExports
              .flatMap((exp) => getExportedNames(exp))
              .some((name) => compare([name, filenameSansExt], transformers));
            if (!matchingExport)
              context.report({
                messageId: 'noMatchingExport',
                node,
              });
          },
        };
      },
    }),
    'match-default-export': createRule<Options, DefaultMessageIds>({
      name: 'match-default-export',
      defaultOptions: [
        {
          stripextra: false,
          casing: 'loose',
        },
      ],
      meta: {
        docs: {
          description: 'Enforce filename matches named export',
          recommended: 'error',
        },
        messages: {
          defaultExportDoesNotMatch:
            'Filename does not match the default export',
        },
        type: 'suggestion',
        schema: [
          {
            type: 'object',
            properties: {
              stripextra: {
                type: 'boolean',
              },
              casing: {
                enum: ['strict', 'loose'],
              },
            },
          },
        ],
      },
      create(context) {
        const transformers = makeTransformers(context.options[0] ?? {});
        return {
          Program(node) {
            const filename = context.getFilename();
            const filenameSansExt = basename(filename, extname(filename));
            if (
              ['index', 'types'].includes(filenameSansExt) ||
              /\.(test|spec|stories)$/.test(filenameSansExt)
            )
              return;

            const defaultExport = node.body.find(
              (item): item is TSESTree.ExportDefaultDeclaration =>
                item.type === AST_NODE_TYPES.ExportDefaultDeclaration
            );
            if (!defaultExport) return;
            const declaration = defaultExport.declaration;
            if (!('name' in declaration || 'id' in declaration)) return;
            const defaultName = getName(declaration);
            if (!defaultName) return;
            const isMatching = compare(
              [defaultName, filenameSansExt],
              transformers
            );
            if (!isMatching)
              context.report({
                messageId: 'defaultExportDoesNotMatch',
                node,
              });
          },
        };
      },
    }),
  },
};

const getName = (
  exported: TSESTree.ExportDeclaration | TSESTree.VariableDeclarator
): string | null => {
  if ('name' in exported) return exported.name;
  if ('id' in exported && exported.id)
    if ('name' in exported.id) return exported.id.name;
    else if ('value' in exported.id) return exported.id.value;
  return null;
};

const getExportedNames = (exported: TSESTree.ExportNamedDeclaration) => {
  if (exported.declaration)
    return getNamesFromDeclarations(exported.declaration);
  if (exported.specifiers) return getNamesFromSpecifiers(exported.specifiers);
  return [];
};

const getNamesFromDeclarations = (
  declaration: TSESTree.NamedExportDeclarations
): string[] => {
  if ('declarations' in declaration && declaration.declarations)
    return declaration.declarations.map(
      (declaration) => getName(declaration) ?? ''
    );
  return [getName(declaration) ?? ''];
};

const getNamesFromSpecifiers = (
  specifiers: TSESTree.ExportSpecifier[]
): string[] => specifiers.map((specifier) => specifier.exported.name);

const compare = (
  names: string[],
  transformers: ((name: string) => string)[]
) => {
  const [name, filename] = names.map((string) =>
    transformers.reduce((acc, fn) => fn(acc), string)
  );
  return name === filename;
};

const makeTransformers = (options: Options[0]) => {
  const transformers: ((name: string) => string)[] = [];
  if (options.stripextra)
    transformers.push((name) => name.replace(/[^a-zA-Z0-9]/g, ''));
  if (options.casing !== 'strict')
    transformers.push((name) => name.toLowerCase());
  return transformers;
};
