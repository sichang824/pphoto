<div align="center">

<img src="public/logo.png" alt="PPhoto Logo" width="200"/>

# PPhoto

✨ 照片打印排版工具

🚀 智能 · 高效 · 零浪费 —— 重新定义您的照片打印体验！

PPhoto 是一个简单高效的照片打印排版工具，帮助您快速整理照片、智能排版、多格式打印。无需登录，完全免费，可在线使用或本地部署。

[English](./README.en.md) | 简体中文

</div>

## 功能特点

- [x] 支持多种照片尺寸输入（例如：1 寸、2 寸、证件照等）
- [x] 支持多种打印纸张规格（A4、A3 等）
- [x] 智能排版预览：实时查看照片在纸张上的排列效果
- [x] 自动优化排版：最大化利用纸张空间，减少浪费
- [x] 支持自定义边距和间距设置
- [x] 支持批量选择图片
- [x] 双面打印，自动翻转（需要打印机支持）
- [x] 支持 PDF 导出，默认为纸张尺寸
- [x] 明信片模式，双面自动排版，可以选择多种样式
- [x] 模板保存和导出

## 📋 系统要求

- Node.js 16.x 或更高版本
- Bun 1.0 或更高版本
- 现代浏览器（支持现代 JavaScript 和 Canvas API）

## 🚀 开始使用

### 安装依赖

```bash
bun install
```

### 启动开发服务器

```bash
bun dev
```

访问 [http://localhost:3000](http://localhost:3000) 开始使用工具。

## 📁 项目结构

```
src/
  ├── app/                       # 应用页面
  │   ├── layout.tsx             # 应用布局
  │   ├── (root)/                # 主路由
  │   ├── (editor)/              # 编辑器路由
  │   └── globals.css            # 全局样式
  ├── components/                # 组件目录
  │   ├── Preview.tsx            # 排版预览组件
  │   ├── PreviewItem.tsx        # 预览项目组件
  │   ├── SettingsPanel.tsx      # 设置面板组件
  │   ├── PaperPreview.tsx       # 纸张预览组件
  │   ├── BacksidePaperPreview.tsx # 背面预览组件
  │   ├── PhotoSize.tsx          # 照片尺寸组件
  │   ├── PhotoSizeList.tsx      # 照片尺寸列表
  │   ├── BacksidePrintStyleList.tsx # 背面打印样式列表
  │   ├── ui/                    # UI组件
  │   └── postcard/              # 明信片模板组件
  ├── store/                     # 状态管理
  │   ├── previewStore.ts        # 排版状态管理
  │   └── languageStore.ts       # 语言状态管理
  ├── types/                     # 类型定义
  │   ├── index.ts               # 通用类型
  │   └── template.ts            # 模板类型
  ├── lib/                       # 工具库
  │   ├── PageCalculator.ts      # 页面计算工具
  │   ├── utils.ts               # 通用工具函数
  │   ├── i18n.ts                # 国际化工具
  │   └── print-img.tsx          # 打印图片工具
  └── locales/                   # 国际化文件
```

## 💻 技术栈

- [Next.js 15](https://nextjs.org/) - React 框架，使用 App Router
- [React 19](https://react.dev/) - 用户界面库
- [TypeScript](https://www.typescriptlang.org/) - 提供类型安全
- [Tailwind CSS](https://tailwindcss.com/) - 原子化 CSS 框架
- [Zustand](https://github.com/pmndrs/zustand) - 轻量级状态管理
- [i18next](https://www.i18next.com/) - 国际化解决方案
- [jsPDF](https://github.com/parallax/jsPDF) - PDF 生成库
- [html-to-image](https://github.com/bubkoo/html-to-image) - HTML 转图片工具
- [dnd-kit](https://dndkit.com/) - 拖拽排序功能
- [Radix UI](https://www.radix-ui.com/) - 无样式组件库

## 📝 使用说明

1. 选择打印纸张尺寸（A4、A3 等）
2. 上传需要打印的照片（支持 JPEG、PNG 格式）
3. 设置照片尺寸（1 寸、2 寸等）和数量
4. 调整边距和间距（可选）
5. 查看预览效果
6. 导出打印方案（PDF 格式）

## 👨‍💻 开发

本项目使用 TypeScript 开发，确保类型安全。修改 `src/components` 和 `src/store` 中的文件进行功能开发。

### 开发工作流

1. Fork 项目
2. 创建您的功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交您的更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建一个 Pull Request

## 🚀 部署

推荐使用 [Vercel 平台](https://vercel.com/new) 进行部署：

1. 导入您的 Git 仓库
2. 设置您的环境变量（如需要）
3. 点击部署

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request 来帮助改进这个工具。在提交 PR 前，请确保您已测试所有功能并保持代码风格一致。

## 📄 许可证

本项目采用自定义许可证。允许个人免费使用，但禁止商业用途。详细条款请查看 [LICENSE](./LICENSE) 文件。

主要条款：

- ✅ 允许个人免费使用
- ✅ 允许用于学习目的
- ✅ 允许修改和分发
- ❌ 禁止商业使用
