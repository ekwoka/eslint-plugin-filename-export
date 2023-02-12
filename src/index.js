const { basename, extname } = require('node:path');

module.exports = {
  rules: {
    'match-named-export': {
      meta: {
        type: 'suggestion',
      },
      create: function (context) {
        const transformers = makeTransformers(context.options[0] ?? {});
        return {
          Program: function (node) {
            const filename = context.getFilename();
            const filenameSansExt = basename(filename, extname(filename));
            if (
              ['index', 'types'].includes(filenameSansExt) ||
              /\.(test|spec|stories)$/.test(filenameSansExt)
            )
              return;
            if (
              node.body.find((item) => item.type === 'ExportDefaultDeclaration')
            )
              return;
            const namedExports = node.body.filter(
              (item) => item.type === 'ExportNamedDeclaration'
            );
            if (!namedExports.length) return;
            const matchingExport = namedExports
              .flatMap(getExportedNames)
              .some((name) => compare([name, filenameSansExt], transformers));
            if (!matchingExport)
              context.report(node, 'Filename does not match any named exports');
          },
        };
      },
    },
    'match-default-export': {
      meta: {
        type: 'suggestion',
      },
      create: function (context) {
        const transformers = makeTransformers(context.options[0] ?? {});
        return {
          Program: function (node) {
            const filename = context.getFilename();
            const filenameSansExt = basename(filename, extname(filename));
            if (
              ['index', 'types'].includes(filenameSansExt) ||
              /\.(test|spec|stories)$/.test(filenameSansExt)
            )
              return;

            const defaultExport = node.body.find(
              (item) => item.type === 'ExportDefaultDeclaration'
            );
            if (!defaultExport) return;
            const defaultName =
              defaultExport.declaration?.id?.name ??
              defaultExport.declaration?.name;
            if (!defaultName) return;
            const isMatching = compare(
              [defaultName, filenameSansExt],
              transformers
            );
            if (!isMatching)
              context.report(node, 'Filename does not match default export');
          },
        };
      },
    },
  },
};

const getExportedNames = (exported) => {
  const names = [];
  if (exported.declaration)
    names.push(
      ...(exported.declaration.declarations ?? [])
        .concat(arrayWrap(exported.declaration))
        .map((declaration) => declaration.id?.name)
        .filter(Boolean)
    );
  if (exported.specifiers)
    names.push(
      ...exported.specifiers.map((specifier) => specifier.exported.name)
    );
  return names;
};

const arrayWrap = (value) => (Array.isArray(value) ? value : [value]);

const compare = (names, transformers) =>
  names
    .map((string) => transformers.reduce((acc, fn) => fn(acc), string))
    .reduce((name, filename) => name === filename);

const makeTransformers = (options) => {
  const transformers = [];
  if (options.stripextra)
    transformers.push((name) => name.replace(/[^a-zA-Z0-9]/g, ''));
  if (options.casing !== 'strict')
    transformers.push((name) => name.toLowerCase());
  return transformers;
};
