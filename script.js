const API_BASE = 'https://image.pollinations.ai/prompt';
const TEXT_API = 'https://text.pollinations.ai/openai';

const $ = id => document.getElementById(id);

// Elements
const promptInput = $('prompt');
const negativeInput = $('negativePrompt');
const modelSelect = $('model');
const ratioSelect = $('ratio');
const seedInput = $('seed');
const generateBtn = $('generateBtn');
const resultSection = $('resultSection');
const generatedImage = $('generatedImage');
const imageInfo = $('imageInfo');
const downloadBtn = $('downloadBtn');
const copyBtn = $('copyBtn');
const shareBtn = $('shareBtn');
const regenerateBtn = $('regenerateBtn');
const enhanceBtn = $('enhanceBtn');
const galleryGrid = $('galleryGrid');
const gallerySearch = $('gallerySearch');
const batchGenerateBtn = $('batchGenerateBtn');
const batchGrid = $('batchGrid');
const templatesGrid = $('templatesGrid');
const apiKeyInput = $('apiKey');
const settingsBtn = $('settingsBtn');
const settingsOverlay = $('settingsOverlay');
const closeSettings = $('closeSettings');

const aspectSizes = {
  '1:1': { width: 1024, height: 1024 },
  '16:9': { width: 1024, height: 576 },
  '9:16': { width: 576, height: 1024 },
  '4:3': { width: 1024, height: 768 },
  '3:4': { width: 768, height: 1024 },
  '21:9': { width: 1024, height: 439 }
};

const templates = [
  { name: '🌆 Cityscape', prompt: 'A futuristic city skyline at sunset with flying cars and neon lights, cyberpunk style' },
  { name: '🐉 Fantasy Creature', prompt: 'A majestic dragon made of crystal and light, soaring through clouds, epic fantasy art' },
  { name: '🌌 Space Scene', prompt: 'An astronaut floating in space near a colorful nebula, photorealistic, 8k' },
  { name: '🏰 Medieval Castle', prompt: 'A grand medieval castle on a cliff overlooking the sea, dramatic storm clouds, oil painting' },
  { name: '🐱 Cute Animal', prompt: 'An adorable fluffy kitten wearing a tiny top hat, studio photography, bokeh background' },
  { name: '🌺 Botanical', prompt: 'Exotic tropical flowers in a magical garden, soft watercolor style, dreamy lighting' },
  { name: '🤖 Robot', prompt: 'A friendly humanoid robot in a workshop, steampunk aesthetic, warm lighting, detailed' },
  { name: '🏔️ Landscape', prompt: 'A serene mountain lake reflecting snow-capped peaks, golden hour, National Geographic style' },
  { name: '🎭 Portrait', prompt: 'A mysterious woman with galaxy patterns in her hair, digital art, vibrant colors' },
  { name: '🍕 Food', prompt: 'A gourmet pizza with fresh ingredients, food photography, shallow depth of field, appetizing' },
  { name: '🏎️ Vehicle', prompt: 'A sleek concept car on a winding mountain road, automotive photography, dynamic angle' },
  { name: '🎪 Abstract', prompt: 'Flowing liquid metal abstract sculpture, iridescent colors, gallery lighting, 3D render' },
  { name: '🌊 Underwater', prompt: 'A coral reef teeming with colorful fish, sunlight filtering through water, nature photography' },
  { name: '🌙 Night Scene', prompt: 'A cozy cabin in snowy mountains under northern lights, warm interior glow, peaceful' },
  { name: '🎮 Game Art', prompt: 'A pixel art RPG character standing in a magical forest, 16-bit style, vibrant palette' },
  { name: '✈️ Steampunk', prompt: 'A steampunk airship floating above Victorian London, brass and copper details, atmospheric' },
];

let gallery = JSON.parse(localStorage.getItem('pollinations-gallery') || '[]');
let promptHistory = JSON.parse(localStorage.getItem('pollinations-history') || '[]');
let savedPrompts = JSON.parse(localStorage.getItem('pollinations-saved') || '[]');
let currentImageUrl = null;
let currentPromptStyle = '';
let uploadedImageBase64 = null;

// Theme
function initTheme() {
  const saved = localStorage.getItem('pollinations-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('pollinations-theme', next);
}

// Settings Panel
function openSettings() {
  settingsOverlay.style.display = 'flex';
  settingsOverlay.hidden = false;
  document.body.style.overflow = 'hidden';
}

function closeSettingsPanel() {
  settingsOverlay.style.display = 'none';
  settingsOverlay.hidden = true;
  document.body.style.overflow = '';
}

function initSettings() {
  const savedKey = localStorage.getItem('pollinations-api-key') || '';
  if (apiKeyInput) apiKeyInput.value = savedKey;

  const saveApiKeyBtn = $('saveApiKey');
  const apiKeyStatus = $('apiKeyStatus');

  if (saveApiKeyBtn) {
    saveApiKeyBtn.addEventListener('click', () => {
      const key = apiKeyInput.value.trim();
      localStorage.setItem('pollinations-api-key', key);
      apiKeyStatus.textContent = '✅ API key saved!';
      apiKeyStatus.className = 'api-status success';
      setTimeout(() => { apiKeyStatus.textContent = ''; }, 2000);
    });
  }

  const savedWidth = localStorage.getItem('pollinations-width') || '1024';
  const savedHeight = localStorage.getItem('pollinations-height') || '1024';
  const savedNologo = localStorage.getItem('pollinations-nologo') !== 'false';
  const savedEnhance = localStorage.getItem('pollinations-enhance') === 'true';

  if ($('widthInput')) $('widthInput').value = savedWidth;
  if ($('heightInput')) $('heightInput').value = savedHeight;
  if ($('nologo')) $('nologo').checked = savedNologo;
  if ($('enhancePrompt')) $('enhancePrompt').checked = savedEnhance;

  if ($('widthInput')) $('widthInput').addEventListener('change', () => {
    localStorage.setItem('pollinations-width', $('widthInput').value);
  });
  if ($('heightInput')) $('heightInput').addEventListener('change', () => {
    localStorage.setItem('pollinations-height', $('heightInput').value);
  });
  if ($('nologo')) $('nologo').addEventListener('change', () => {
    localStorage.setItem('pollinations-nologo', $('nologo').checked);
  });
  if ($('enhancePrompt')) $('enhancePrompt').addEventListener('change', () => {
    localStorage.setItem('pollinations-enhance', $('enhancePrompt').checked);
  });

  settingsBtn.addEventListener('click', openSettings);
  closeSettings.addEventListener('click', closeSettingsPanel);
  settingsOverlay.addEventListener('click', (e) => {
    if (e.target === settingsOverlay) closeSettingsPanel();
  });
}

// Tabs
function initTabs() {
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      $('tab-' + tab.dataset.tab).classList.add('active');
    });
  });

  // History sub-tabs
  document.querySelectorAll('.history-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.history-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderHistory(tab.dataset.history);
    });
  });
}

// Style presets
function initPresets() {
  document.querySelectorAll('.preset').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.preset').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentPromptStyle = btn.dataset.style;
    });
  });
}

// Templates
function renderTemplates() {
  templatesGrid.innerHTML = templates.map((t, i) => `
    <div class="template-card" data-index="${i}">
      <h3>${t.name}</h3>
      <p>${t.prompt}</p>
      <div class="template-actions">
        <button class="btn-small use-template">Use</button>
        <button class="btn-small save-template">⭐ Save</button>
      </div>
    </div>
  `).join('');

  templatesGrid.querySelectorAll('.use-template').forEach((btn, i) => {
    btn.addEventListener('click', () => {
      const t = templates[i];
      promptInput.value = t.prompt;
      document.querySelector('[data-tab="generate"]').click();
      promptInput.focus();
    });
  });

  templatesGrid.querySelectorAll('.save-template').forEach((btn, i) => {
    btn.addEventListener('click', () => {
      const t = templates[i];
      addToSavedPrompts(t.prompt);
      btn.textContent = '✅ Saved';
      btn.disabled = true;
    });
  });
}

// Build URL
function buildImageUrl(prompt, model, ratio, seed, imageBase64 = null) {
  const size = aspectSizes[ratio] || aspectSizes['1:1'];
  const w = $('widthInput') ? $('widthInput').value : size.width;
  const h = $('heightInput') ? $('heightInput').value : size.height;
  const fullPrompt = prompt + currentPromptStyle;
  const neg = negativeInput ? negativeInput.value.trim() : '';
  const encodedPrompt = encodeURIComponent(fullPrompt);
  const seedParam = seed !== '' && seed !== null ? `&seed=${seed}` : `&seed=${Math.floor(Math.random() * 1000000)}`;
  const nologo = $('nologo') && $('nologo').checked ? '&nologo=true' : '';
  const negParam = neg ? `&negative=${encodeURIComponent(neg)}` : '';
  const enhanceParam = $('enhancePrompt') && $('enhancePrompt').checked ? '&enhance=true' : '';
  const imageParam = imageBase64 ? `&image=${encodeURIComponent(imageBase64)}` : '';

  return `${API_BASE}/${encodedPrompt}?width=${w}&height=${h}&model=${model}${seedParam}${nologo}${negParam}${enhanceParam}${imageParam}&t=${Date.now()}`;
}

// Loading state
function showLoading(btn, loading) {
  btn.disabled = loading;
  btn.querySelector('.btn-text').hidden = loading;
  btn.querySelector('.btn-loading').hidden = !loading;
}

// Prompt History
function addToHistory(prompt, model) {
  const entry = { prompt, model, timestamp: Date.now() };
  promptHistory.unshift(entry);
  if (promptHistory.length > 100) promptHistory = promptHistory.slice(0, 100);
  localStorage.setItem('pollinations-history', JSON.stringify(promptHistory));
}

function addToSavedPrompts(prompt) {
  if (savedPrompts.includes(prompt)) return;
  savedPrompts.unshift(prompt);
  if (savedPrompts.length > 50) savedPrompts = savedPrompts.slice(0, 50);
  localStorage.setItem('pollinations-saved', JSON.stringify(savedPrompts));
}

function renderHistory(type = 'recent') {
  const list = $('historyList');
  const empty = $('emptyHistory');

  if (type === 'saved') {
    if (savedPrompts.length === 0) {
      list.innerHTML = '';
      empty.hidden = false;
      return;
    }
    empty.hidden = true;
    list.innerHTML = savedPrompts.map((p, i) => `
      <div class="history-item">
        <div class="history-text">${p}</div>
        <div class="history-actions">
          <button class="btn-small use-history" data-prompt="${encodeURIComponent(p)}">Use</button>
          <button class="btn-small btn-danger remove-saved" data-index="${i}">✕</button>
        </div>
      </div>
    `).join('');
  } else {
    if (promptHistory.length === 0) {
      list.innerHTML = '';
      empty.hidden = false;
      return;
    }
    empty.hidden = true;
    list.innerHTML = promptHistory.map((h, i) => `
      <div class="history-item">
        <div class="history-text">${h.prompt}</div>
        <div class="history-meta">
          <span class="history-model">${h.model}</span>
          <span class="history-date">${new Date(h.timestamp).toLocaleString()}</span>
        </div>
        <div class="history-actions">
          <button class="btn-small use-history" data-prompt="${encodeURIComponent(h.prompt)}">Use</button>
          <button class="btn-small save-history" data-prompt="${encodeURIComponent(h.prompt)}">⭐</button>
        </div>
      </div>
    `).join('');
  }

  list.querySelectorAll('.use-history').forEach(btn => {
    btn.addEventListener('click', () => {
      promptInput.value = decodeURIComponent(btn.dataset.prompt);
      document.querySelector('[data-tab="generate"]').click();
      promptInput.focus();
    });
  });

  list.querySelectorAll('.save-history').forEach(btn => {
    btn.addEventListener('click', () => {
      addToSavedPrompts(decodeURIComponent(btn.dataset.prompt));
      btn.textContent = '✅';
      btn.disabled = true;
    });
  });

  list.querySelectorAll('.remove-saved').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.index);
      savedPrompts.splice(idx, 1);
      localStorage.setItem('pollinations-saved', JSON.stringify(savedPrompts));
      renderHistory('saved');
    });
  });
}

// Gallery
function addToGallery(item) {
  gallery.unshift(item);
  if (gallery.length > 50) gallery = gallery.slice(0, 50);
  localStorage.setItem('pollinations-gallery', JSON.stringify(gallery));
  renderGallery();
}

function renderGallery(filter = '') {
  const filtered = filter
    ? gallery.filter(g => g.prompt.toLowerCase().includes(filter.toLowerCase()))
    : gallery;

  if (filtered.length === 0) {
    galleryGrid.innerHTML = '';
    $('emptyGallery').hidden = false;
    return;
  }
  $('emptyGallery').hidden = true;

  galleryGrid.innerHTML = filtered.map((item, i) => `
    <div class="gallery-item" data-index="${i}" title="${item.prompt}">
      <img src="${item.url}" alt="${item.prompt}" loading="lazy">
      <div class="gallery-item-info">
        <span class="gallery-item-model">${item.model}</span>
        <span class="gallery-item-date">${new Date(item.timestamp).toLocaleDateString()}</span>
      </div>
    </div>
  `).join('');

  galleryGrid.querySelectorAll('.gallery-item').forEach(el => {
    el.addEventListener('click', () => {
      const item = filtered[el.dataset.index];
      generatedImage.src = item.url;
      currentImageUrl = item.url;
      imageInfo.textContent = `"${item.prompt}" | Model: ${item.model} | ${item.ratio}`;
      resultSection.hidden = false;
      document.querySelector('[data-tab="generate"]').click();
      resultSection.scrollIntoView({ behavior: 'smooth' });
    });
  });
}

// Generate
async function generateImage() {
  const prompt = promptInput.value.trim();
  if (!prompt) { promptInput.focus(); return; }

  showLoading(generateBtn, true);
  resultSection.hidden = true;

  const model = modelSelect.value;
  const ratio = ratioSelect.value;
  const seed = seedInput.value;
  const url = buildImageUrl(prompt, model, ratio, seed);

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);

    const response = await fetch(url, { signal: controller.signal, mode: 'cors' });
    clearTimeout(timeoutId);

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const blob = await response.blob();
    if (blob.size === 0) throw new Error('Empty response');

    const imageUrl = URL.createObjectURL(blob);

    generatedImage.src = imageUrl;
    currentImageUrl = imageUrl;
    imageInfo.textContent = `"${prompt}${currentPromptStyle}" | Model: ${model} | ${ratio}`;
    resultSection.hidden = false;
    resultSection.scrollIntoView({ behavior: 'smooth' });

    addToHistory(prompt, model);
    addToGallery({
      url: imageUrl,
      prompt,
      style: currentPromptStyle,
      model,
      ratio,
      seed: seed || 'random',
      timestamp: Date.now()
    });
  } catch (error) {
    if (error.name === 'AbortError') {
      alert('Generation timed out. Please try again.');
    } else {
      alert('Failed to generate image. Please try again.');
    }
    console.error('Generation error:', error);
  } finally {
    showLoading(generateBtn, false);
  }
}

// Img2Img
function initImg2Img() {
  const uploadArea = $('uploadArea');
  const imageUpload = $('imageUpload');
  const uploadPlaceholder = $('uploadPlaceholder');
  const uploadPreview = $('uploadPreview');
  const previewImage = $('previewImage');
  const clearImage = $('clearImage');
  const strengthSlider = $('img2imgStrength');
  const strengthValue = $('strengthValue');

  // Click to upload
  uploadArea.addEventListener('click', () => imageUpload.click());

  // Drag and drop
  uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('dragover');
  });

  uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('dragover');
  });

  uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleImageUpload(file);
    }
  });

  // File input change
  imageUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) handleImageUpload(file);
  });

  // Clear image
  clearImage.addEventListener('click', (e) => {
    e.stopPropagation();
    uploadedImageBase64 = null;
    uploadPlaceholder.hidden = false;
    uploadPreview.hidden = true;
  });

  // Strength slider
  strengthSlider.addEventListener('input', () => {
    strengthValue.textContent = strengthSlider.value;
  });

  // Use as source button
  $('useAsSourceBtn').addEventListener('click', () => {
    if (!currentImageUrl) return;
    document.querySelector('[data-tab="img2img"]').click();
    fetch(currentImageUrl)
      .then(r => r.blob())
      .then(blob => handleImageUpload(blob));
  });

  // Img2Img Generate
  $('img2imgGenerateBtn').addEventListener('click', generateImg2Img);

  // Img2Img Enhance
  $('img2imgEnhanceBtn').addEventListener('click', () => enhancePromptText($('img2imgPrompt'), $('img2imgEnhanceBtn')));

  // Img2Img actions
  $('img2imgDownload').addEventListener('click', () => downloadImageFromUrl($('img2imgResultImage').src));
  $('img2imgCopy').addEventListener('click', () => copyUrlFromUrl($('img2imgResultImage').src, $('img2imgCopy')));
  $('img2imgShare').addEventListener('click', () => shareImageFromUrl($('img2imgResultImage').src));
  $('img2imgUseAsSource').addEventListener('click', () => {
    const url = $('img2imgResultImage').src;
    fetch(url)
      .then(r => r.blob())
      .then(blob => handleImageUpload(blob));
  });
}

function handleImageUpload(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    uploadedImageBase64 = e.target.result;
    $('previewImage').src = uploadedImageBase64;
    $('uploadPlaceholder').hidden = true;
    $('uploadPreview').hidden = false;
  };
  reader.readAsDataURL(file);
}

async function generateImg2Img() {
  const prompt = $('img2imgPrompt').value.trim();
  if (!uploadedImageBase64) { alert('Please upload an image first'); return; }
  if (!prompt) { $('img2imgPrompt').focus(); return; }

  const btn = $('img2imgGenerateBtn');
  showLoading(btn, true);
  $('img2imgResult').hidden = true;

  const ratio = $('img2imgRatio').value;
  const seed = $('img2imgSeed').value;
  const strength = $('img2imgStrength').value / 100;

  const size = aspectSizes[ratio] || aspectSizes['1:1'];
  const w = $('widthInput') ? $('widthInput').value : size.width;
  const h = $('heightInput') ? $('heightInput').value : size.height;
  const neg = $('img2imgNegative').value.trim();
  const nologo = $('nologo') && $('nologo').checked ? '&nologo=true' : '';
  const seedParam = seed ? `&seed=${seed}` : `&seed=${Math.floor(Math.random() * 1000000)}`;
  const negParam = neg ? `&negative=${encodeURIComponent(neg)}` : '';

  const url = `${API_BASE}/${encodeURIComponent(prompt)}?width=${w}&height=${h}&model=flux-kontext&image=${encodeURIComponent(uploadedImageBase64)}&strength=${strength}${seedParam}${nologo}${negParam}&t=${Date.now()}`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);

    const response = await fetch(url, { signal: controller.signal, mode: 'cors' });
    clearTimeout(timeoutId);

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const blob = await response.blob();
    if (blob.size === 0) throw new Error('Empty response');

    const imageUrl = URL.createObjectURL(blob);

    $('img2imgOriginal').src = uploadedImageBase64;
    $('img2imgResultImage').src = imageUrl;
    $('img2imgInfo').textContent = `"${prompt}" | Model: flux-kontext | Strength: ${Math.round(strength * 100)}%`;
    $('img2imgResult').hidden = false;
    $('img2imgResult').scrollIntoView({ behavior: 'smooth' });

    addToHistory(prompt, 'flux-kontext');
    addToGallery({
      url: imageUrl,
      prompt: `[Img2Img] ${prompt}`,
      model: 'flux-kontext',
      ratio,
      seed: seed || 'random',
      timestamp: Date.now()
    });
  } catch (error) {
    alert('Img2Img failed. Please try again.');
    console.error('Img2Img error:', error);
  } finally {
    showLoading(btn, false);
  }
}

// Compare Mode
function initCompare() {
  $('compareGenerateBtn').addEventListener('click', generateCompare);
}

async function generateCompare() {
  const prompt = $('comparePrompt').value.trim();
  if (!prompt) { $('comparePrompt').focus(); return; }

  const btn = $('compareGenerateBtn');
  showLoading(btn, true);
  $('compareResults').hidden = true;

  const modelA = $('compareModelA').value;
  const modelB = $('compareModelB').value;
  const seed = $('compareSeed').value || Math.floor(Math.random() * 1000000);

  const urlA = buildImageUrl(prompt, modelA, '1:1', seed);
  const urlB = buildImageUrl(prompt, modelB, '1:1', seed);

  try {
    const [responseA, responseB] = await Promise.all([
      fetch(urlA, { mode: 'cors' }),
      fetch(urlB, { mode: 'cors' })
    ]);

    if (!responseA.ok || !responseB.ok) throw new Error('Failed');

    const [blobA, blobB] = await Promise.all([
      responseA.blob(),
      responseB.blob()
    ]);

    const imgA = URL.createObjectURL(blobA);
    const imgB = URL.createObjectURL(blobB);

    $('compareImageA').src = imgA;
    $('compareImageB').src = imgB;
    $('compareTitleA').textContent = modelA;
    $('compareTitleB').textContent = modelB;
    $('compareResults').hidden = false;

    addToHistory(prompt, `compare:${modelA}vs${modelB}`);
  } catch (error) {
    alert('Comparison failed. Please try again.');
    console.error('Compare error:', error);
  } finally {
    showLoading(btn, false);
  }
}

// Enhance prompt (generic)
async function enhancePromptText(inputEl, btnEl) {
  const prompt = inputEl.value.trim();
  if (!prompt) { inputEl.focus(); return; }

  btnEl.disabled = true;
  btnEl.textContent = '⏳ Enhancing...';

  try {
    const model = 'openai';
    const apiKey = apiKeyInput ? apiKeyInput.value.trim() : '';

    const headers = { 'Content-Type': 'application/json' };
    if (apiKey) headers['Authorization'] = `Bearer ${apiKey}`;

    const response = await fetch(TEXT_API, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model,
        messages: [{
          role: 'user',
          content: `You are an expert AI image prompt engineer. Enhance this prompt to be more detailed, vivid, and likely to produce a stunning AI-generated image. Keep it under 200 words. Only return the enhanced prompt, nothing else.\n\nOriginal: ${prompt}`
        }]
      })
    });
    const data = await response.json();
    const enhanced = data.choices?.[0]?.message?.content || data;
    if (typeof enhanced === 'string') {
      inputEl.value = enhanced.trim();
    }
  } catch (e) {
    console.error('Enhance failed:', e);
    alert('Enhancement failed. Please try again.');
  } finally {
    btnEl.disabled = false;
    btnEl.textContent = '✨ Enhance';
  }
}

// Download helper
async function downloadImageFromUrl(url) {
  if (!url) return;
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = `pollinations-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(blobUrl);
  } catch {
    window.open(url, '_blank');
  }
}

// Copy URL helper
function copyUrlFromUrl(url, btn) {
  if (!url) return;
  navigator.clipboard.writeText(url).then(() => {
    const original = btn.innerHTML;
    btn.innerHTML = '✅ Copied!';
    setTimeout(() => btn.innerHTML = original, 2000);
  });
}

// Share helper
async function shareImageFromUrl(url) {
  if (!url) return;
  if (navigator.share) {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const file = new File([blob], 'ai-image.png', { type: 'image/png' });
      await navigator.share({ title: 'AI Generated Image', files: [file] });
    } catch {
      navigator.share({ title: 'AI Generated Image', url });
    }
  } else {
    copyUrlFromUrl(url, $('img2imgCopy'));
  }
}

// Download
async function downloadImage() {
  await downloadImageFromUrl(currentImageUrl);
}

// Copy URL
function copyUrl() {
  copyUrlFromUrl(currentImageUrl, copyBtn);
}

// Share
async function shareImage() {
  if (!currentImageUrl) return;
  if (navigator.share) {
    try {
      const response = await fetch(currentImageUrl);
      const blob = await response.blob();
      const file = new File([blob], 'ai-image.png', { type: 'image/png' });
      await navigator.share({ title: 'AI Generated Image', files: [file] });
    } catch {
      navigator.share({ title: 'AI Generated Image', url: currentImageUrl });
    }
  } else {
    copyUrl();
  }
}

// Regenerate
function regenerate() {
  seedInput.value = '';
  generateImage();
}

// Batch generate
async function batchGenerate() {
  const prompt = $('batchPrompt').value.trim();
  if (!prompt) { $('batchPrompt').focus(); return; }

  const count = parseInt($('batchCount').value);
  const model = $('batchModel').value;
  const ratio = $('batchRatio').value;

  showLoading(batchGenerateBtn, true);
  $('batchTotal').textContent = count;
  batchGrid.innerHTML = '';

  for (let i = 0; i < count; i++) {
    $('batchProgress').textContent = i + 1;
    const seed = Math.floor(Math.random() * 1000000);
    const url = buildImageUrl(prompt, model, ratio, seed);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000);

      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!response.ok) throw new Error('Failed');
      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);

      const card = document.createElement('div');
      card.className = 'batch-card';
      card.innerHTML = `
        <img src="${imageUrl}" alt="Batch ${i + 1}">
        <div class="batch-card-actions">
          <button onclick="window.open('${imageUrl}', '_blank')">🔍 Full</button>
        </div>
      `;
      batchGrid.appendChild(card);

      addToGallery({
        url: imageUrl,
        prompt,
        model,
        ratio,
        seed: String(seed),
        timestamp: Date.now()
      });
    } catch (e) {
      console.error(`Batch ${i + 1} failed:`, e);
    }
  }

  addToHistory(prompt, model);
  showLoading(batchGenerateBtn, false);
}

// Gallery export/import
function exportGallery() {
  const blob = new Blob([JSON.stringify(gallery, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `pollinations-gallery-${Date.now()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function importGallery(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    try {
      const imported = JSON.parse(ev.target.result);
      if (Array.isArray(imported)) {
        gallery = [...imported, ...gallery].slice(0, 100);
        localStorage.setItem('pollinations-gallery', JSON.stringify(gallery));
        renderGallery();
        alert(`Imported ${imported.length} images.`);
      }
    } catch {
      alert('Invalid file format.');
    }
  };
  reader.readAsText(file);
}

function clearGallery() {
  if (!confirm('Clear all gallery images?')) return;
  gallery = [];
  localStorage.setItem('pollinations-gallery', JSON.stringify(gallery));
  renderGallery();
}

// Keyboard shortcuts
function initShortcuts() {
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
      if (e.key === 'Enter' && !e.shiftKey && e.target === promptInput) {
        e.preventDefault();
        generateImage();
      }
      return;
    }

    switch (e.key.toLowerCase()) {
      case 'e': e.preventDefault(); enhancePromptText(promptInput, enhanceBtn); break;
      case 'd': e.preventDefault(); downloadImage(); break;
      case 'c': e.preventDefault(); copyUrl(); break;
      case 'r': e.preventDefault(); regenerate(); break;
      case 't': e.preventDefault(); toggleTheme(); break;
      case 'escape':
        if (!settingsOverlay.hidden) closeSettingsPanel();
        break;
    }
  });
}

// Event listeners
generateBtn.addEventListener('click', generateImage);
downloadBtn.addEventListener('click', downloadImage);
copyBtn.addEventListener('click', copyUrl);
shareBtn.addEventListener('click', shareImage);
regenerateBtn.addEventListener('click', regenerate);
enhanceBtn.addEventListener('click', () => enhancePromptText(promptInput, enhanceBtn));
$('themeToggle').addEventListener('click', toggleTheme);
$('batchGenerateBtn').addEventListener('click', batchGenerate);
$('exportGallery').addEventListener('click', exportGallery);
$('importGallery').addEventListener('click', () => $('importFile').click());
$('importFile').addEventListener('change', importGallery);
$('clearGallery').addEventListener('click', clearGallery);
gallerySearch.addEventListener('input', (e) => renderGallery(e.target.value));
$('clearHistory').addEventListener('click', () => {
  if (!confirm('Clear prompt history?')) return;
  promptHistory = [];
  localStorage.setItem('pollinations-history', JSON.stringify(promptHistory));
  renderHistory('recent');
});

// Init
initTheme();
initTabs();
initPresets();
initShortcuts();
initSettings();
initImg2Img();
initCompare();
renderTemplates();
renderGallery();
renderHistory('recent');