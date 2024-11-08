# 照片打印排版工具

这是一个基于 [Next.js](https://nextjs.org) 开发的照片打印排版工具，帮助用户轻松实现照片在不同尺寸打印纸张上的智能排版。

## 主要功能

- 支持多种照片尺寸输入（例如：1寸、2寸、证件照等）
- 支持多种打印纸张规格（A4、A3等）
- 智能排版预览：实时查看照片在纸张上的排列效果
- 自动优化排版：最大化利用纸张空间，减少浪费
- 支持自定义边距和间距设置

## 开始使用

安装依赖：

```bash
bun install
```

启动开发服务器：

```bash
bun dev
```

访问 [http://localhost:3000](http://localhost:3000) 开始使用工具。

## 项目结构

```
src/
  ├── components/
  │   └── Preview.tsx      # 排版预览组件
  ├── store/
  │   └── previewStore.ts  # 排版状态管理
  └── ...
```

## 技术栈

- [Next.js](https://nextjs.org/) - React 框架
- [Bun](https://bun.sh/) - 现代 JavaScript 运行时和包管理器
- TypeScript - 提供类型安全
- Canvas API - 实现照片排版预览
- Zustand - 轻量级状态管理

## 使用说明

1. 选择打印纸张尺寸
2. 上传需要打印的照片
3. 设置照片尺寸和数量
4. 调整边距和间距（可选）
5. 查看预览效果
6. 导出打印方案

## 开发

本项目使用 TypeScript 开发，确保类型安全。修改 `src/components` 和 `src/store` 中的文件进行功能开发。

## 部署

推荐使用 [Vercel 平台](https://vercel.com/new) 进行部署。

## 贡献指南

欢迎提交 Issue 和 Pull Request 来帮助改进这个工具。

## 许可证

MIT License
