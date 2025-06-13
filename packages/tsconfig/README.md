# @tscb/tsconfig

Unified TypeScript configuration solution.

## Introduction

`@tscb/tsconfig` provides reusable TypeScript configuration files for various scenarios (such as base.json, types-only.json), used to unify and simplify TypeScript configuration management in multi-package repositories.

## Contents

- `base.json`: Basic configuration, suitable for most TypeScript projects
- `types-only.json`: Configuration for generating type declarations only

## Usage

Inherit in tsconfig.json using the `extends` field:

```json
{
  "extends": "@tscb/tsconfig/base.json"
}
```

## License

MIT License
