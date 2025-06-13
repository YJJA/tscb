# @tscb/builder-esbuild

TypeScript build tool based on esbuild.

## Introduction

`@tscb/builder-esbuild` is a TypeScript build tool that integrates esbuild, supporting high-performance code compilation, type generation, and automatic export file generation. It's suitable for projects that pursue maximum build speed.

## Features

- Ultra-fast code transformation using esbuild
- Automatic type declaration file generation
- Support for multiple entry files
- Extensible build configuration

## Installation

```sh
pnpm add -D @tscb/builder-esbuild
```

## Usage

Configure the build command in package.json:

```json
{
  "scripts": {
    "build": "tscb-builder-esbuild"
  }
}
```

Or run directly from the command line:

```sh
pnpm tscb-builder-esbuild
```

## Configuration

The build tool automatically reads configuration files and entry files from the project. For detailed configuration, refer to `@tscb/builder-core` and `@tscb/plugin-esbuild`.

## Dependencies

- [@tscb/builder-core](../builder-core)
- [@tscb/plugin-esbuild](../plugin-esbuild)

## License

MIT License
