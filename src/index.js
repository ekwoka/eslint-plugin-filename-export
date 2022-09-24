const { basename, extname } = require('node:path');

module.exports = {
  rules: {
    'match-named-export': {
      create: function (context) {
        return {
          Program: function (node) {
            const filename = context.getFilename();
            const filenameSansExt = basename(filename, extname(filename)).toLowerCase();
            if (['index', 'types'].includes(filenameSansExt) || /\.(test|spec|stories)$/.test(filenameSansExt)) return;
            const namedExports = node.body.filter((item) => item.type === 'ExportNamedDeclaration');
            if (!namedExports.length) return;
            const matchingExport = namedExports.find((item) => {
              const name = item.declaration?.declarations?.[0]?.id?.name?.toLowerCase() || '';
              return name === filenameSansExt;
            });
            if (!matchingExport) context.report(node, 'Filename does not match any exports');
          }
        };
      }
    }
  }
};
