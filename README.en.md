<div align="center">

<img src="public/logo.png" alt="PPhoto Logo" width="200"/>

# PPhoto

✨ Photo Printing Layout Tool

🚀 Smart · Efficient · Zero Waste — Redefining Your Photo Printing Experience!

PPhoto is a simple and efficient photo printing layout tool that helps you quickly organize photos, intelligently layout them, and print in multiple formats. No login required. Completely free for personal use. Available online or can be self-hosted.

English | [简体中文](./README.md)

</div>

## ✨ Features

- [x] Supports various photo sizes (e.g., 1-inch, 2-inch, ID photos, etc.)
- [x] Supports multiple paper formats (A4, A3, etc.)
- [x] Intelligent layout preview in real-time
- [x] Auto-optimization of layout to reduce paper waste
- [x] Custom margin and spacing
- [x] Batch photo selection
- [x] Double-sided printing with auto flipping (printer-dependent)
- [x] PDF export with paper size matching
- [x] Postcard mode: automatic double-sided layout, multiple styles
- [x] Save and export templates

## 📋 System Requirements

- Node.js 16.x or higher
- Bun 1.0 or higher
- Modern browser (supporting JavaScript and Canvas API)

## 🚀 Getting Started

### Install dependencies

```bash
bun install
```

### Start the development server

```bash
bun dev
```

Visit [http://localhost:3000](http://localhost:3000) to start using the tool.

## 📁 Project Structure

```
src/
  ├── app/                       # App pages
  ├── components/                # UI components
  ├── store/                     # State management
  ├── types/                     # Type definitions
  ├── lib/                       # Utilities
  └── locales/                   # i18n translations
```

## 💻 Tech Stack

- [Next.js 15](https://nextjs.org/) - React framework (App Router)
- [React 19](https://react.dev/) - UI library
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Zustand](https://github.com/pmndrs/zustand) - Lightweight state management
- [i18next](https://www.i18next.com/) - Internationalization
- [jsPDF](https://github.com/parallax/jsPDF) - PDF generation
- [html-to-image](https://github.com/bubkoo/html-to-image) - Convert HTML to image
- [dnd-kit](https://dndkit.com/) - Drag and drop sorting
- [Radix UI](https://www.radix-ui.com/) - Unstyled UI components

## 📝 Usage Guide

1. Select paper size (e.g., A4, A3)
2. Upload photos (JPEG, PNG supported)
3. Set photo size and quantity
4. Customize margin and spacing (optional)
5. Preview layout
6. Export as PDF

## 👨‍💻 Development

This project is built with TypeScript for type safety. Modify files under `src/components` and `src/store` for feature development.

### Development Workflow

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Create a Pull Request

## 🚀 Deployment

Recommended platform: [Vercel](https://vercel.com/new)

Steps:

1. Import your Git repository
2. Configure environment variables if needed
3. Click deploy

## 🤝 Contribution Guide

Issues and PRs are welcome! Please test all features and maintain code consistency before submitting.

## 📄 License

This project adopts a **dual license strategy**:

- ✅ Free for personal and educational use
- ❌ Commercial use is strictly **prohibited** unless a commercial license is obtained

For commercial licensing, please contact: **[zhaoanke@163.com](mailto:zhaoanke@163.com)**

See [LICENSE](./LICENSE) for full terms.
