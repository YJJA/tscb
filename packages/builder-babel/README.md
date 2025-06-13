# @tscb/builder-babel

TypeScript build tool based on Babel.

## Introduction

`@tscb/builder-babel` is a build tool for TypeScript projects that integrates Babel as a code transformer, supporting type generation, code compilation, and automatic export file generation. It's suitable for projects that need customized build processes or want to leverage the Babel plugin ecosystem.

## Features

- Code transformation using Babel
- Automatic type declaration file generation
- Support for multiple entry files
- Extensible build configuration

## Installation

```sh
pnpm add -D @tscb/builder-babel
```

## Usage

Configure the build command in package.json:

```json
{
  "scripts": {
    "build": "tscb-builder-babel"
  }
}
```

Or run directly from the command line:

```sh
pnpm tscb-builder-babel
```

## Configuration

The build tool automatically reads configuration files and entry files from the project. For detailed configuration, refer to `@tscb/builder-core` and `@tscb/plugin-babel`.

## Dependencies

- [@tscb/builder-core](../builder-core)
- [@tscb/plugin-babel](../plugin-babel)

## License

MIT License
