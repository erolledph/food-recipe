# The Cook Book - Food Recipe Blog

A simple, elegant food recipe blog built with Next.js that uses **GitHub as a CMS**. Share your favorite recipes with automatic ISR (Incremental Static Regeneration) and SEO optimization.

## ✨ Features

### Core Features
- **GitHub CMS**: All recipes stored as markdown files in GitHub
- **ISR (Incremental Static Regeneration)**: Automatic updates without rebuilding
- **Responsive Design**: Mobile-friendly with Tailwind CSS v3
- **Dark Mode**: Full dark/light theme support
- **Fast Performance**: Optimized page load times
- **SEO Optimized**: Meta tags, Open Graph, structured data
- **Simple & Clean**: Minimalist design focused on content

### Advanced Features
- **Full-Text Search**: Search across all recipes
- **Automatic Indexing**: IndexNow integration for search engine updates
- **Image Optimization**: Automatic compression and display
- **Comment System**: Firebase-powered comments (optional)
- **Newsletter Subscriptions**: Email collection (optional)

## 🛠 Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS v3, Radix UI components
- **Content**: GitHub (markdown files)
- **Deployment**: Cloudflare Pages (Edge Runtime)
- **Optional**: Firebase Firestore for comments & storage

## 📋 Prerequisites

- Node.js 20+
- npm or yarn
- GitHub account with a repository
- Cloudflare account (for deployment)

## 🚀 Quick Start

### 1. Clone Repository
```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
npm install
```

### 2. Configure Environment Variables
Create `.env.local`:
```env
GITHUB_OWNER=your-username
GITHUB_REPO=your-repo-name
GITHUB_TOKEN=ghp_xxxxxxxxxxxxx
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_INDEXNOW_KEY=your-indexnow-key
```

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📚 Documentation

- **[README.md](./README.md)** - This file

## 📝 How It Works

1. **Create Recipes**: Write markdown files in the `posts/` folder with recipe content
2. **Auto-Save**: Recipes are stored in your GitHub repository
3. **ISR Updates**: Automatic updates every hour
4. **Live**: New recipes appear automatically on your site

## 🔧 Available Scripts

```bash
npm run dev         # Development server
npm run build       # Production build
npm run start       # Production server
npm run cf:build    # Build for Cloudflare Pages
npm run preview     # Preview Cloudflare build
npm run deploy      # Deploy to Cloudflare Pages
```

## 📊 Performance

- **TTFB**: ~50ms (cached)
- **FCP**: <200ms
- **Core Web Vitals**: 90+/100
- **Lighthouse Score**: 95+

## 🚀 Deploy to Cloudflare Pages

1. Push code to GitHub
2. Create Pages project in Cloudflare dashboard
3. Connect your GitHub repository
4. Add environment variables in Cloudflare
5. Deploy!

See [SETUP.md](./SETUP.md) for detailed deployment instructions.

## 🔒 Security

- Environment variables for sensitive data
- No secrets committed to repository
- GitHub token with limited scope

## 📝 License

MIT License

---

**Built with ❤️ using Next.js and GitHub CMS**
