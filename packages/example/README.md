# 示例项目 example

本目录为 TSCB 构建工具链的示例项目，演示如何使用不同构建后端（Babel、esbuild、SWC）进行 TypeScript 项目的多格式构建。

## 目录结构

- `src/`：源代码目录
- `lib/esm/`：ESM 格式输出
- `lib/commonjs/`：CommonJS 格式输出
- `lib/types/`：类型声明输出

## 构建命令

```sh
pnpm builder-babel
pnpm builder-esbuild
pnpm builder-swc
```

## 配置说明

在 package.json 的 `x-build` 字段配置入口文件，构建工具会自动识别并处理。

## 许可证

MIT License
