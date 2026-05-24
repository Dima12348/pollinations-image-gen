const API_BASE = 'https://image.pollinations.ai/prompt';

const promptInput = document.getElementById('prompt');
const modelSelect = document.getElementById('model');
const ratioSelect = document.getElementById('ratio');
const seedInput = document.getElementById('seed');
const generateBtn = document.getElementById('generateBtn');
const btnText = generateBtn.querySelector('.btn-text');
const btnLoading = generateBtn.querySelector('.btn-loading');
const resultSection = document.getElementById('resultSection');
const generatedImage = document.getElementById('generatedImage');
const imageInfo = document.getElementById('imageInfo');
const downloadBtn = document.getElementById('downloadBtn');
const copyBtn = document.getElementById('copyBtn');
const galleryGrid = document.getElementById('galleryGrid');

const aspectSizes = {
  '1:1': { width: 1024, height: 1024 },
  '16:9': { width: 1024, height: 576 },
  '9:16': { width: 576, height: 1024 },
  '4:3': { width: 1024, height: 768 },
  '3:4': { width: 768, height: 1024 }
};

let gallery = JSON.parse(localStorage.getItem('pollinations-gallery') || '[]');

function buildImageUrl(prompt, model, ratio, seed) {
  const size = aspectSizes[ratio] || aspectSizes['1:1'];
  const encodedPrompt = encodeURIComponent(prompt);
  const seedParam = seed !== '' ? `&seed=${seed}` : `&seed=${Math.floor(Math.random() * 1000000)}`;
  const timestamp = Date.now();
  return `${API_BASE}/${encodedPrompt}?width=${size.width}&height=${size.height}&model=${model}${seedParam}&nologo=true&t=${timestamp}`;
}

function showLoading(loading) {
  generateBtn.disabled = loading;
  btnText.hidden = loading;
  btnLoading.hidden = !loading;
}

function addToGallery(item) {
  gallery.unshift(item);
  if (gallery.length > 12) gallery = gallery.slice(0, 12);
  localStorage.setItem('pollinations-gallery', JSON.stringify(gallery));
  renderGallery();
}

function renderGallery() {
  galleryGrid.innerHTML = gallery.map((item, i) => `
    <div class="gallery-item" data-index="${i}" title="${item.prompt}">
      <img src="${item.url}" alt="${item.prompt}" loading="lazy">
    </div>
  `).join('');

  galleryGrid.querySelectorAll('.gallery-item').forEach(el => {
    el.addEventListener('click', () => {
      const item = gallery[el.dataset.index];
      generatedImage.src = item.url;
      imageInfo.textContent = `"${item.prompt}" | Model: ${item.model}`;
      resultSection.hidden = false;
      resultSection.scrollIntoView({ behavior: 'smooth' });
    });
  });
}

async function generateImage() {
  const prompt = promptInput.value.trim();
  if (!prompt) {
    promptInput.focus();
    return;
  }

  showLoading(true);

  const model = modelSelect.value;
  const ratio = ratioSelect.value;
  const seed = seedInput.value;

  const url = buildImageUrl(prompt, model, ratio, seed);

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Generation failed');

    const blob = await response.blob();
    const imageUrl = URL.createObjectURL(blob);

    generatedImage.src = imageUrl;
    imageInfo.textContent = `"${prompt}" | Model: ${model} | Ratio: ${ratio}`;
    resultSection.hidden = false;

    const galleryItem = { url: imageUrl, prompt, model, ratio, timestamp: Date.now() };
    addToGallery(galleryItem);

    resultSection.scrollIntoView({ behavior: 'smooth' });
  } catch (error) {
    alert('Failed to generate image. Please try again.');
    console.error(error);
  } finally {
    showLoading(false);
  }
}

async function downloadImage() {
  const src = generatedImage.src;
  if (!src) return;

  try {
    const response = await fetch(src);
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pollinations-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch {
    window.open(src, '_blank');
  }
}

function copyUrl() {
  const src = generatedImage.src;
  if (!src) return;

  navigator.clipboard.writeText(src).then(() => {
    const original = copyBtn.innerHTML;
    copyBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> Copied!';
    setTimeout(() => copyBtn.innerHTML = original, 2000);
  });
}

generateBtn.addEventListener('click', generateImage);
downloadBtn.addEventListener('click', downloadImage);
copyBtn.addEventListener('click', copyUrl);

promptInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    generateImage();
  }
});

renderGallery();
