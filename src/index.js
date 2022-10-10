const { basename, extname } = require('node:path');

module.exports = {
  rules: {
    'match-named-export': {
      meta: {
        type: 'suggestion',
      },
      create: function (context) {
        const compare = compareFunctions[context.options[0]?.casing ?? 'loose'];
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
            const matchingExport = namedExports.find((item) => {
              const name = item.declaration?.declarations?.[0]?.id?.name ?? '';
              return compare(name, filenameSansExt);
            });
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
        const compare = compareFunctions[context.options[0]?.casing ?? 'loose'];
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
            const isMatching = compare(defaultName, filenameSansExt);
            if (!isMatching)
              context.report(node, 'Filename does not match default export');
          },
        };
      },
    },
  },
};

const compareFunctions = {
  strict: (a, b) => a === b,
  loose: (a, b) => a.toLowerCase() === b.toLowerCase(),
};
