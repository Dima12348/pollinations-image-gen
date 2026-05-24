# AI Image Generator

A free, open-source AI image generator powered by [Pollinations.ai](https://pollinations.ai). Generate stunning images from text prompts with no signup required.

![Built with Pollinations](https://img.shields.io/badge/Built%20with-Pollinations-8a2be2?style=for-the-badge&logoColor=white&labelColor=6a0dad)

## Features

- **Multiple AI Models** - Choose from Flux, Flux Realism, Flux Anime, Flux 3D, and Turbo
- **Aspect Ratios** - Generate images in 1:1, 16:9, 9:16, 4:3, and 3:4 formats
- **Seed Control** - Use seeds for reproducible results
- **Image Gallery** - Browse your recent generations (saved locally)
- **Download & Share** - Save images or copy URLs directly
- **Mobile Friendly** - Responsive design works on all devices
- **No Signup** - Start generating immediately, completely free

## Pollinations API

This app uses the Pollinations.ai Image API:

```
https://image.pollinations.ai/prompt/{prompt}?width=1024&height=1024&model=flux
```

### Supported Models

| Model | Description |
|-------|-------------|
| `flux` | High quality general-purpose model |
| `flux-realism` | Photorealistic images |
| `flux-anime` | Anime and manga style |
| `flux-3d` | 3D rendered style |
| `turbo` | Fast generation |

## How to Run Locally

1. Clone the repository:
```bash
git clone https://github.com/Dima12348/pollinations-image-gen.git
cd pollinations-image-gen
```

2. Open `index.html` in your browser, or serve with any static file server:
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .
```

3. Open `http://localhost:8000` in your browser

## Deployment

This is a static site that can be deployed to:
- **GitHub Pages** (free)
- **Netlify** (free)
- **Vercel** (free)
- **Cloudflare Pages** (free)

## Tech Stack

- HTML5
- CSS3 (Custom Properties, Grid, Flexbox)
- Vanilla JavaScript (ES6+)
- Pollinations.ai API
- LocalStorage for gallery persistence

## Privacy

- No data is sent to any server except Pollinations.ai for image generation
- Gallery is stored locally in your browser
- No cookies or tracking

## License

MIT License - see [LICENSE](LICENSE) for details

## Credits

- Built with [Pollinations.ai](https://pollinations.ai) - Open-source AI platform
- Created by [@Dima12348](https://github.com/Dima12348)
