# 🌸 Pollinations Studio - AI Image Generator

Advanced AI image generator powered by [Pollinations.ai](https://pollinations.ai). Multiple models, style presets, batch generation, AI prompt enhancement, Image-to-Image editing, and more.

![Built with Pollinations](https://img.shields.io/badge/Built%20with-Pollinations-8a2be2?style=for-the-badge&logoColor=white&labelColor=6a0dad)

## Features

### Core Generation
- **AI Prompt Enhancement** - Enhance prompts using GPT, Gemini, or Mistral
- **Multiple AI Models** - Flux, Flux Realism, Flux Anime, Flux 3D, Flux Cablyai, Flux Kontext, Turbo, Sana
- **12 Style Presets** - Cinematic, Oil Painting, Anime, Pixel Art, Cyberpunk, and more
- **Negative Prompts** - Specify what to exclude from generation
- **16 Prompt Templates** - Pre-built prompts for common scenarios

### New Features
- **Image-to-Image (Img2Img)** - Upload a photo and transform it with AI using Flux Kontext
- **Prompt History** - Automatically saves your recent prompts
- **Saved Prompts** - Star and save your favorite prompts for quick reuse
- **Compare Mode** - Generate same prompt with different models side-by-side
- **Transformation Strength** - Control how much the AI changes your source image

### Gallery & Organization
- **Batch Generation** - Generate 2-8 images at once with different seeds
- **Gallery with Search** - Browse, search, export/import your generations
- **Advanced Settings** - Custom width/height, enhancement model selection

### User Experience
- **Dark/Light Theme** - Toggle with `T` key
- **PWA Support** - Install as app on mobile/desktop
- **Share Support** - Share images directly to social media
- **Responsive Design** - Works perfectly on all devices
- **No Signup Required** - Start generating immediately

## Quick Start

1. Clone the repository:
```bash
git clone https://github.com/Dima12348/pollinations-image-gen.git
cd pollinations-image-gen
```

2. Open `index.html` in your browser, or serve locally:
```bash
python -m http.server 8000
```

3. Open `http://localhost:8000` and start generating!

## Supported Models

| Model | Description | Use Case |
|-------|-------------|----------|
| `flux` | High quality general-purpose | Default choice |
| `flux-realism` | Photorealistic images | Photos, portraits |
| `flux-anime` | Anime and manga style | Anime art |
| `flux-3d` | 3D rendered style | 3D art, renders |
| `flux-cablyai` | Cablyai style variant | Stylized art |
| `flux-kontext` | Image-to-image editing | Photo editing, style transfer |
| `turbo` | Fast generation | Quick iterations |
| `sana` | Ultra-fast generation | Rapid prototyping |

## Img2Img Usage

1. Go to the **Img2Img** tab
2. Upload or drag-drop your source image
3. Describe the changes you want
4. Adjust **Transformation Strength** (lower = closer to original)
5. Click **Transform Image**

## Deployment

Deploy as a static site to:
- [GitHub Pages](https://pages.github.com) (free)
- [Netlify](https://netlify.com) (free)
- [Vercel](https://vercel.com) (free)

## Tech Stack

- HTML5 + CSS3 (Custom Properties, Grid, Flexbox)
- Vanilla JavaScript (ES6+)
- Pollinations.ai API (`image.pollinations.ai` + `text.pollinations.ai`)
- LocalStorage for gallery/history persistence
- PWA with Web App Manifest

## Privacy

- No data sent to any server except Pollinations.ai for generation
- Gallery, history, and saved prompts stored locally in your browser
- No cookies, tracking, or analytics

## License

MIT License