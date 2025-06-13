# @tscb/builder-swc

TypeScript build tool based on SWC.

## Introduction

`@tscb/builder-swc` is a TypeScript build tool that integrates SWC, supporting high-performance code compilation, type generation, and automatic export file generation. It's suitable for projects that need extreme performance and modern syntax support.

## Features

- Ultra-fast code transformation using SWC
- Automatic type declaration file generation
- Support for multiple entry files
- Extensible build configuration

## Installation

```sh
pnpm add -D @tscb/builder-swc
```

## Usage

Configure the build command in package.json:

```json
{
  "scripts": {
    "build": "tscb-builder-swc"
  }
}
```

Or run directly from the command line:

```sh
pnpm tscb-builder-swc
```

## Configuration

The build tool automatically reads configuration files and entry files from the project. For detailed configuration, refer to `@tscb/builder-core` and `@tscb/plugin-swc`.

## Dependencies

- [@tscb/builder-core](../builder-core)
- [@tscb/plugin-swc](../plugin-swc)

## License

MIT License
