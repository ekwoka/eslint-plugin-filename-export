const { basename, extname } = require("node:path");

module.exports = {
  rules: {
    "match-named-export": {
      create: function (context) {
        return {
          Program: function (node) {
            const filename = context.getFilename();
            const filenameSansExt = basename(filename, extname(filename));
            if (filenameSansExt.toLowerCase() === "index") return;
            const matchingExport = node.body.find((item) => {
              if (item.type !== "ExportNamedDeclaration") return false;
              const name = item.declaration.declarations[0].id.name;
              if (name.toLowerCase() === filenameSansExt.toLowerCase())
                return true;
              return false;
            });
            if (!matchingExport)
              context.report(node, "Filename does not match any exports");
          },
        };
      },
    },
  },
};
