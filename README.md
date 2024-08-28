[<img src="https://img.shields.io/npm/v/eslint-plugin-filename-export?label=%20&style=for-the-badge&logo=pnpm&logoColor=white">](https://www.npmjs.com/package/eslint-plugin-filename-export)
<img src="https://img.shields.io/npm/dt/eslint-plugin-filename-export?style=for-the-badge&logo=npm&logoColor=white" >
[<img src="https://img.shields.io/bundlephobia/minzip/eslint-plugin-filename-export?style=for-the-badge&logo=esbuild&logoColor=white">](https://bundlephobia.com/package/eslint-plugin-filename-export)

# eslint-plugin-filename-export

This plugin enforces that the filename matches a named export or default export when a name is provided. It can be set to be case-sensitive or case-insensitive.

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
    "filename-export/match-named-export": "error",
    "filename-export/match-default-export": "error"
  }
}
```

## Rules

- `filename-export/match-named-export` - Enforces that the filename matches to a named export.
- `filename-export/match-default-export` - Enforces that filenames match the name of the default export.

These rules ignore index files, test/spec files, and files with no relevant exports by default. Additionally, the `match-named-export` rule will ignore files with a default export.

If you want to add additional filename exemptions, use the ESLint's building filename overrides.

## Options

Both of these rules have the following available options:

- `casing`:

  - `strict`: Filenames must match in case to the exports
  - `loose`: Filenames do not need to match case (`default`)

- `stripextra`:
  - `true`: Filenames will be stripped of any non-alphanumeric characters (to allow filenames like `great_function.ts` to match `greatfunction`)
  - `false`: Filenames will not be stripped of any extra characters (`default`)

These can be passed as a second item in an array to the rule as follows

```json
"filename-export/match-named-export": [
  "error",
  {
    "casing": "strict",
    "sripextra": true
  }
]
```

## Roadmap

This plugin is mainly being produced for personal use. If you are interested in using it but need additional features, please open an issue and I will consider adding them.

Pull requests will also be evaluated and merged as appropriate.
