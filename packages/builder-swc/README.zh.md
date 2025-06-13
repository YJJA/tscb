# @tscb/builder-swc

基于 SWC 的 TypeScript 构建工具。

## 简介

`@tscb/builder-swc` 是一个集成 SWC 的 TypeScript 构建工具，支持高性能的代码编译、类型生成和导出文件自动生成，适用于需要极致性能和现代语法支持的项目。

## 特性

- 使用 SWC 进行极速代码转换
- 自动生成类型声明文件
- 支持多入口文件
- 可扩展的构建配置

## 安装

```sh
pnpm add -D @tscb/builder-swc
```

## 用法

在 package.json 中配置构建命令：

```json
{
  "scripts": {
    "build": "tscb-builder-swc"
  }
}
```

或直接在命令行运行：

```sh
pnpm tscb-builder-swc
```

## 配置

构建工具会自动读取项目中的配置文件和入口文件。详细配置可参考 `@tscb/builder-core` 和 `@tscb/plugin-swc`。

## 依赖

- [@tscb/builder-core](../builder-core)
- [@tscb/plugin-swc](../plugin-swc)

## 许可证

MIT License
