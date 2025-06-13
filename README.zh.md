# TSCB

TSCB 是一个多模块的 TypeScript 构建工具集，支持多种主流构建后端（Babel、esbuild、SWC），并提供统一的构建工具和插件体系。

## 包含内容

- `@tscb/builder-babel`：基于 Babel 的 TypeScript 构建工具
- `@tscb/builder-esbuild`：基于 esbuild 的 TypeScript 构建工具
- `@tscb/builder-swc`：基于 swc 的 TypeScript 构建工具
- `@tscb/builder-core`：构建流程通用工具库
- `@tscb/babel-adapter`：Babel 插件适配
- `@tscb/esbuild-adapter`：esbuild 插件适配
- `@tscb/swc-adapter`：swc 插件适配
- `@tscb/tsconfig`：统一的 TypeScript 配置
- `example`：示例项目

## 适用场景

- 需要灵活切换不同构建后端的 TypeScript 项目
- 希望自定义构建流程或集成第三方插件
- 追求高效、现代化的 TypeScript 构建体验

## 快速开始

请参考各子包下的 README.md 获取详细用法和配置说明。

## 许可证

MIT License
