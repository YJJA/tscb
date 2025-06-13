# Example Project

This directory serves as an example project for the TSCB build toolchain, demonstrating how to use different build backends (Babel, esbuild, SWC) for multi-format builds of TypeScript projects.

## Directory Structure

- `src/`: Source code directory
- `lib/esm/`: ESM format output
- `lib/commonjs/`: CommonJS format output
- `lib/types/`: Type declaration output

## Build Commands

```sh
pnpm builder-babel
pnpm builder-esbuild
pnpm builder-swc
```

## Configuration

Entry files are configured in the `x-build` field of package.json, and the build tools will automatically identify and process them.

## License

MIT License
