# @tscb/tsconfig

统一的 TypeScript 配置方案。

## 简介

`@tscb/tsconfig` 提供了多种场景下可复用的 TypeScript 配置文件（如 base.json、types-only.json），用于统一和简化多包仓库的 TypeScript 配置管理。

## 包含内容

- `base.json`：基础配置，适用于大多数 TypeScript 项目
- `types-only.json`：仅生成类型声明的配置

## 用法

在 tsconfig.json 中通过 `extends` 字段继承：

```json
{
  "extends": "@tscb/tsconfig/base.json"
}
```

## 许可证

MIT License
