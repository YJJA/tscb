# @tscb/builder-babel

基于 Babel 的 TypeScript 构建工具。

## 简介

`@tscb/builder-babel` 是一个用于 TypeScript 项目的构建工具，集成了 Babel 作为代码转换器，支持类型生成、代码编译和导出文件的自动生成。适用于需要自定义构建流程或希望利用 Babel 插件生态的项目。

## 特性

- 使用 Babel 进行代码转换
- 自动生成类型声明文件
- 支持多入口文件
- 可扩展的构建配置

## 安装

```sh
pnpm add -D @tscb/builder-babel
```

## 用法

在 package.json 中配置构建命令：

```json
{
  "scripts": {
    "build": "tscb-builder-babel"
  }
}
```

或直接在命令行运行：

```sh
pnpm tscb-builder-babel
```

## 配置

构建工具会自动读取项目中的配置文件和入口文件。详细配置可参考 `@tscb/builder-core` 和 `@tscb/plugin-babel`。

## 依赖

- [@tscb/builder-core](../builder-core)
- [@tscb/plugin-babel](../plugin-babel)

## 许可证

MIT License
