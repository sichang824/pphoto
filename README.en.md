# Photo Printing Layout Tool

This is a photo printing layout tool developed based on [Next.js](https://nextjs.org), helping users easily achieve intelligent layout of photos on different sized printing papers. With simple operations, you can optimize photo layouts, save paper, and achieve professional printing results.

## Features

- [x] Support for multiple photo size inputs (e.g., 1-inch, 2-inch, ID photos, etc.)
- [x] Support for various printing paper specifications (A4, A3, etc.)
- [x] Intelligent layout preview: View the arrangement effect of photos on paper in real-time
- [x] Automatic layout optimization: Maximize the use of paper space, reduce waste
- [x] Support for custom margin and spacing settings
- [x] Support for batch photo selection
- [x] Double-sided printing, automatic flipping (requires printer support)
- [x] Support for PDF export, default to paper size
- [x] Postcard mode, automatic double-sided layout, multiple styles available
- [x] Template saving and export

## 📋 System Requirements

- Node.js 16.x or higher
- Bun 1.0 or higher
- Modern browser (supporting modern JavaScript and Canvas API)

## 🚀 Getting Started

### Install Dependencies

```bash
bun install
```

### Start the Development Server

```bash
bun dev
```

Visit [http://localhost:3000](http://localhost:3000) to start using the tool.

## 📁 Project Structure

```
src/
  ├── app/                       # Application pages
  │   ├── layout.tsx             # Application layout
  │   ├── (root)/                # Main route
  │   ├── (editor)/              # Editor route
  │   └── globals.css            # Global styles
  ├── components/                # Components directory
  │   ├── Preview.tsx            # Layout preview component
  │   ├── PreviewItem.tsx        # Preview item component
  │   ├── SettingsPanel.tsx      # Settings panel component
  │   ├── PaperPreview.tsx       # Paper preview component
  │   ├── BacksidePaperPreview.tsx # Backside preview component
  │   ├── PhotoSize.tsx          # Photo size component
  │   ├── PhotoSizeList.tsx      # Photo size list
  │   ├── BacksidePrintStyleList.tsx # Backside print style list
  │   ├── ui/                    # UI components
  │   └── postcard/              # Postcard template components
  ├── store/                     # State management
  │   ├── previewStore.ts        # Layout state management
  │   └── languageStore.ts       # Language state management
  ├── types/                     # Type definitions
  │   ├── index.ts               # Common types
  │   └── template.ts            # Template types
  ├── lib/                       # Library
  │   ├── PageCalculator.ts      # Page calculation utility
  │   ├── utils.ts               # Common utility functions
  │   ├── i18n.ts                # Internationalization utility
  │   └── print-img.tsx          # Print image utility
  └── locales/                   # Internationalization files
```

## 💻 Tech Stack

- [Next.js 15](https://nextjs.org/) - React framework, using App Router
- [React 19](https://react.dev/) - UI library
- [TypeScript](https://www.typescriptlang.org/) - Provides type safety
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Zustand](https://github.com/pmndrs/zustand) - Lightweight state management
- [i18next](https://www.i18next.com/) - Internationalization solution
- [jsPDF](https://github.com/parallax/jsPDF) - PDF generation library
- [html-to-image](https://github.com/bubkoo/html-to-image) - HTML to image tool
- [dnd-kit](https://dndkit.com/) - Drag and drop sorting functionality
- [Radix UI](https://www.radix-ui.com/) - Unstyled component library

## 📝 Usage Instructions

1. Select printing paper size (A4, A3, etc.)
2. Upload photos to be printed (supports JPEG, PNG formats)
3. Set photo size (1-inch, 2-inch, etc.) and quantity
4. Adjust margins and spacing (optional)
5. View preview effect
6. Export printing plan (PDF format)

## 👨‍💻 Development

This project is developed using TypeScript to ensure type safety. Modify files in `src/components` and `src/store` for feature development.

### Development Workflow

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Create a Pull Request

## 🚀 Deployment

Recommended to deploy using the [Vercel platform](https://vercel.com/new):

1. Import your Git repository
2. Set up your environment variables (if needed)
3. Click deploy

## 🤝 Contribution Guidelines

Issues and Pull Requests are welcome to help improve this tool. Before submitting a PR, please ensure you have tested all features and maintained consistent code style.

## 📄 License

This project uses a custom license. Personal use is free, but commercial use is prohibited. For detailed terms, please check the [LICENSE](./LICENSE) file.

Main terms:

- ✅ Free for personal use
- ✅ Allowed for learning purposes
- ✅ Allowed for modification and distribution
- ❌ Commercial use prohibited
