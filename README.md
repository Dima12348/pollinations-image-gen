# 🌸 Pollinations Studio — AI Image Generator

Advanced AI image generator powered by [Pollinations.ai](https://pollinations.ai). Multiple models, style presets, batch generation, AI prompt enhancement, and more.

![Built with Pollinations](https://img.shields.io/badge/Built%20with-Pollinations-8a2be2?style=for-the-badge&logoColor=white&labelColor=6a0dad)

## ✨ Features

- **AI Prompt Enhancement** — Enhance your prompts using GPT, Gemini, or Mistral
- **Multiple AI Models** — Flux, Flux Realism, Flux Anime, Flux 3D, Flux Cablyai, Turbo
- **12 Style Presets** — Cinematic, Oil Painting, Anime, Pixel Art, Cyberpunk, and more
- **Batch Generation** — Generate 2-8 images at once with different seeds
- **Negative Prompts** — Specify what to exclude from generation
- **16 Prompt Templates** — Pre-built prompts for common scenarios
- **Advanced Settings** — Custom width/height, enhancement model selection
- **Gallery with Search** — Browse, search, export/import your generations
- **Dark/Light Theme** — Toggle with `T` key
- **Keyboard Shortcuts** — Power user workflow
- **PWA Support** — Install as app on mobile/desktop
- **Share Support** — Share images directly to social media
- **Responsive Design** — Works perfectly on all devices
- **No Signup Required** — Start generating immediately

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Enter` | Generate image |
| `E` | Enhance prompt |
| `D` | Download image |
| `C` | Copy URL |
| `R` | Regenerate (new seed) |
| `T` | Toggle theme |
| `?` | Show shortcuts |
| `1-4` | Switch tabs |

## 🚀 Quick Start

1. Clone the repository:
```bash
git clone https://github.com/Dima12348/pollinations-image-gen.git
cd pollinations-image-gen
```

2. Open `index.html` in your browser, or serve locally:
```bash
python -m http.server 8000
# or
npx serve .
```

3. Open `http://localhost:8000` and start generating!

## 🎨 Supported Models

| Model | Description |
|-------|-------------|
| `flux` | High quality general-purpose model |
| `flux-realism` | Photorealistic images |
| `flux-anime` | Anime and manga style |
| `flux-3d` | 3D rendered style |
| `flux-cablyai` | Cablyai style variant |
| `turbo` | Fast generation |

## 🎭 Style Presets

Cinematic · Oil Painting · Watercolor · Anime · Pixel Art · Photo Real · 3D Render · Comic · Minimalist · Dark Fantasy · Cyberpunk

## 📦 Deployment

Deploy as a static site to:
- [GitHub Pages](https://pages.github.com) (free)
- [Netlify](https://netlify.com) (free)
- [Vercel](https://vercel.com) (free)
- [Cloudflare Pages](https://pages.cloudflare.com) (free)

## 🛠️ Tech Stack

- HTML5 + CSS3 (Custom Properties, Grid, Flexbox)
- Vanilla JavaScript (ES6+)
- Pollinations.ai API (`image.pollinations.ai` + `text.pollinations.ai`)
- LocalStorage for gallery persistence
- PWA with Web App Manifest

## 🔒 Privacy

- No data sent to any server except Pollinations.ai for generation
- Gallery stored locally in your browser
- No cookies, tracking, or analytics

## 📜 License

MIT License — see [LICENSE](LICENSE)

## 🌐 About

Powered by [Pollinations.ai](https://pollinations.ai) — Open-source generative AI platform.
Created by [@Dima12348](https://github.com/Dima12348)
