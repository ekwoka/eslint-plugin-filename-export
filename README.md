[<img src="https://img.shields.io/npm/v/eslint-plugin-filename-export?style=for-the-badge">](https://www.npmjs.com/package/eslint-plugin-filename-export)
<img src="https://img.shields.io/npm/dt/eslint-plugin-filename-export?style=for-the-badge" >
[<img src="https://img.shields.io/bundlephobia/minzip/eslint-plugin-filename-export?style=for-the-badge">](https://bundlephobia.com/package/eslint-plugin-filename-export)

# eslint-plugin-filename-export

This plugin enforces that the filename matches to a named export. This rule ignores index files, spec files, and files with no named exports, and currently has no configuration options.

## Installation

Install with your package manager of choice:

```bash
pnpm i -D eslint-plugin-filename-export
```

Add to your ESLint config:

```json
{
  "plugins": ["eslint-plugin-filename-export"],
  "rules": {
    "filename-export/match-named-export": "error"
  }
}
```

## Rules

`filename-export/match-named-export` - Enforces that the filename matches to a named export.

This rule ignores index files, test/spec files, and files that have no named exports.

## Roadmap

This plugin is mainly being produced for personal use. If you are interested in using it, but need additional features, please open an issue and I will consider adding them.
