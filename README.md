[<img src="https://img.shields.io/npm/v/eslint-plugin-filename-export?style=for-the-badge">](https://www.npmjs.com/package/eslint-plugin-filename-export)
<img src="https://img.shields.io/npm/dt/eslint-plugin-filename-export?style=for-the-badge" >
[<img src="https://img.shields.io/bundlephobia/minzip/eslint-plugin-filename-export?style=for-the-badge">](https://bundlephobia.com/package/eslint-plugin-filename-export)

# eslint-plugin-filename-export

This plugin enforces that the filename matches to a named export. This rule ignores index files, and currently has no configuration options.

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
