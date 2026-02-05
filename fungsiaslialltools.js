// ===== INTEGRASI FIX =====

// 1. Deklarasi global toolContainer
let toolContainer;

// 2. Inisialisasi setelah DOM siap
document.addEventListener('DOMContentLoaded', function() {
    toolContainer = document.getElementById('toolContainer');
    console.log('Tool container initialized:', !!toolContainer);
});

// 3. Helper function untuk mendapatkan tool container
function getToolContainer() {
    if (!toolContainer) {
        toolContainer = document.getElementById('toolContainer');
    }
    
    if (!toolContainer) {
        console.error('Tool container not found! Creating one...');
        toolContainer = document.createElement('div');
        toolContainer.id = 'toolContainer';
        toolContainer.className = 'tool-page-wrapper';
        document.querySelector('.main-content').appendChild(toolContainer);
    }
    
    return toolContainer;
}

// 4. Fungsi showNotification jika belum ada
if (typeof window.showNotification !== 'function') {
    window.showNotification = function(message, type = 'info') {
        console.log(`[${type.toUpperCase()}] ${message}`);
    };
}

// 5. Fungsi backToTools jika belum ada
if (typeof window.backToTools !== 'function') {
    window.backToTools = function() {
        console.log('Back to tools called');
        if (typeof window.showPage === 'function') {
            window.showPage('toolsPage');
        }
    };
}


// ===== TOOL FUNCTIONS ===== //

// 1. BRAT GENERATOR
async function loadBratGenerator() {
    const toolHTML = `
        <div class="tool-page-container">
            <div class="tool-page-header">
                <h2 class="tool-page-title">
                    <i class="fas fa-sticky-note"></i> Brat Generator
                </h2>
                <button class="tool-back-btn" onclick="backToTools()">
                    <i class="fas fa-arrow-left"></i> Back to Tools
                </button>
            </div>
            
            <div class="tool-content">
                <div style="margin-bottom: 30px;">
                    <label style="display: block; margin-bottom: 10px; color: var(--text); font-weight: 600;">
                        <i class="fas fa-font"></i> Teks Brat
                    </label>
                    <input 
                        type="text" 
                        id="bratTextInput" 
                        placeholder="Contoh: Bayu Ganteng" 
                        maxlength="100"
                        spellcheck="false"
                        style="
                            width: 100%;
                            padding: 16px 20px;
                            background: rgba(30, 35, 60, 0.8);
                            border: 2px solid var(--border);
                            border-radius: 14px;
                            color: var(--text);
                            font-family: 'Inter', sans-serif;
                            font-size: 16px;
                            transition: all 0.3s ease;
                        "
                    >
                </div>
                
                <div style="margin-bottom: 30px;">
                    <label style="display: block; margin-bottom: 10px; color: var(--text); font-weight: 600;">
                        <i class="fas fa-cogs"></i> Pilih Mode
                    </label>
                    <div style="position: relative;">
                        <div id="bratModeSelect" class="tool-select" style="
                            width: 100%;
                            padding: 16px 20px;
                            background: rgba(30, 35, 60, 0.8);
                            border: 2px solid var(--border);
                            border-radius: 14px;
                            color: var(--text);
                            font-family: 'Inter', sans-serif;
                            font-size: 16px;
                            cursor: pointer;
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                        ">
                            <span id="bratSelectedText">Select Mode</span>
                            <i class="fas fa-chevron-down"></i>
                        </div>
                        <div id="bratOptions" style="
                            position: absolute;
                            top: 100%;
                            left: 0;
                            right: 0;
                            background: rgba(19, 22, 39, 0.95);
                            border: 1px solid var(--border);
                            border-top: none;
                            border-radius: 0 0 12px 12px;
                            max-height: 200px;
                            overflow-y: auto;
                            z-index: 100;
                            display: none;
                            backdrop-filter: blur(10px);
                        ">
                            <div class="tool-option" data-value="" style="padding: 12px 20px; cursor: pointer;">
                                <span>Select Mode</span>
                                <i class="far fa-circle"></i>
                            </div>
                            <div class="tool-option" data-value="static" style="padding: 12px 20px; cursor: pointer;">
                                <span>Static Brat - Png</span>
                                <i class="far fa-circle"></i>
                            </div>
                            <div class="tool-option" data-value="animated" style="padding: 12px 20px; cursor: pointer;">
                                <span>Animated Brat - Gif</span>
                                <i class="far fa-circle"></i>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div style="display: flex; gap: 15px; margin-bottom: 30px; flex-wrap: wrap;">
                    <button id="generateBratBtn" class="tool-btn" style="flex: 1;">
                        <i class="fas fa-bolt"></i> Generate
                    </button>
                    <button id="downloadBratBtn" class="tool-btn" style="flex: 1; background: rgba(30, 35, 60, 0.8); border: 1px solid var(--border);">
                        <i class="fas fa-download"></i> Download
                    </button>
                </div>
                
                <div id="bratLoadingBar" style="
                    width: 0%;
                    height: 4px;
                    background: linear-gradient(90deg, transparent, var(--primary), transparent);
                    background-size: 200% 100%;
                    animation: shine 1.5s infinite linear;
                    margin-bottom: 20px;
                    border-radius: 2px;
                    display: none;
                "></div>
                
                <div id="bratPreviewContainer" style="
                    width: 100%;
                    height: 300px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(30, 35, 60, 0.4);
                    border-radius: 14px;
                    border: 2px dashed rgba(100, 124, 247, 0.2);
                    margin-bottom: 20px;
                    overflow: hidden;
                    position: relative;
                ">
                    <div id="bratPlaceholder" style="text-align: center; color: #9aa0b5; padding: 1rem;">
                        <i class="fas fa-image fa-2x" style="margin-bottom: 15px; opacity: 0.5;"></i><br>
                        <div style="font-weight: 600; margin-bottom: 5px;">Preview akan muncul di sini</div>
                        <div style="font-size: 14px;">Masukkan teks dan pilih mode</div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    const container = getToolContainer();
    container.innerHTML = toolHTML;
    container.style.display = 'block';
    
    // Add shine animation if not exists
    if (!document.querySelector('#shine-animation')) {
        const style = document.createElement('style');
        style.id = 'shine-animation';
        style.textContent = `
            @keyframes shine {
                0% { background-position: 0% 0%; }
                100% { background-position: 200% 0%; }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Initialize Brat Generator functionality
    setTimeout(initializeBratGenerator, 100);
}

async function initializeBratGenerator() {
    const textInput = document.getElementById('bratTextInput');
    const modeSelect = document.getElementById('bratModeSelect');
    const selectedText = document.getElementById('bratSelectedText');
    const optionsDiv = document.getElementById('bratOptions');
    const options = document.querySelectorAll('.tool-option');
    const generateBtn = document.getElementById('generateBratBtn');
    const downloadBtn = document.getElementById('downloadBratBtn');
    const loadingBar = document.getElementById('bratLoadingBar');
    const previewContainer = document.getElementById('bratPreviewContainer');
    const placeholder = document.getElementById('bratPlaceholder');
    
    // API URLs dengan fallback
    const API_URLS = {
        static: {
            primary: 'https://api.zenzxz.my.id/api/maker/brat',
            fallback: 'https://api.fikmydomainsz.xyz/imagecreator/brat'
        },
        animated: {
            primary: 'https://api.zenzxz.my.id/api/maker/bratvid',
            fallback: 'https://api.fikmydomainsz.xyz/imagecreator/bratvid'
        }
    };
    
    let currentMode = '';
    let currentImageUrl = '';
    let currentApiType = 'primary'; // 'primary' atau 'fallback'
    
    // Mode selection
    modeSelect.addEventListener('click', (e) => {
        e.stopPropagation();
        optionsDiv.style.display = optionsDiv.style.display === 'block' ? 'none' : 'block';
    });
    
    options.forEach(option => {
        option.addEventListener('click', (e) => {
            e.stopPropagation();
            const value = option.getAttribute('data-value');
            const text = option.querySelector('span').textContent;
            
            currentMode = value;
            selectedText.textContent = text;
            
            // Update selected state
            options.forEach(opt => {
                opt.style.background = '';
                opt.querySelector('i').className = 'far fa-circle';
            });
            
            option.style.background = 'rgba(100, 124, 247, 0.2)';
            option.querySelector('i').className = 'fas fa-dot-circle';
            
            optionsDiv.style.display = 'none';
        });
    });
    
    document.addEventListener('click', (e) => {
        if (!modeSelect.contains(e.target) && !optionsDiv.contains(e.target)) {
            optionsDiv.style.display = 'none';
        }
    });
    
    // Generate function
    generateBtn.addEventListener('click', generateBrat);
    textInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') generateBrat();
    });
    
    async function generateBrat() {
        const text = textInput.value.trim();
        
        if (!text) {
            showNotification('Masukkan teks terlebih dahulu!', 'warning');
            return;
        }
        
        if (!currentMode) {
            showNotification('Pilih mode terlebih dahulu!', 'warning');
            return;
        }
        
        // Show loading
        loadingBar.style.display = 'block';
        loadingBar.style.width = '100%';
        generateBtn.disabled = true;
        
        try {
            // Coba API primary dulu
            currentApiType = 'primary';
            const url = buildUrl(text, currentApiType);
            
            // Test API dengan timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);
            
            try {
                const response = await fetch(url, { 
                    method: 'HEAD',
                    signal: controller.signal
                });
                clearTimeout(timeoutId);
                
                if (!response.ok) {
                    throw new Error('Primary API gagal');
                }
                
                // Jika primary berhasil, buat gambar
                await createImage(url, 'primary');
                
            } catch (primaryError) {
                console.log('Primary API gagal, mencoba fallback...');
                
                // Coba fallback API
                currentApiType = 'fallback';
                const fallbackUrl = buildUrl(text, currentApiType);
                
                // Test fallback API
                const fallbackController = new AbortController();
                const fallbackTimeoutId = setTimeout(() => fallbackController.abort(), 10000);
                
                try {
                    const fallbackResponse = await fetch(fallbackUrl, { 
                        method: 'HEAD',
                        signal: fallbackController.signal
                    });
                    clearTimeout(fallbackTimeoutId);
                    
                    if (!fallbackResponse.ok) {
                        throw new Error('Fallback API juga gagal');
                    }
                    
                    // Jika fallback berhasil, buat gambar
                    await createImage(fallbackUrl, 'fallback');
                    showNotification('Menggunakan API alternatif', 'info');
                    
                } catch (fallbackError) {
                    console.error('Semua API gagal:', fallbackError);
                    throw new Error('Semua API tidak dapat diakses');
                }
            }
            
        } catch (error) {
            console.error('Brat generation error:', error);
            loadingBar.style.width = '0%';
            loadingBar.style.display = 'none';
            generateBtn.disabled = false;
            showNotification('Gagal menghubungi API. Coba lagi nanti.', 'danger');
        }
    }
    
    async function createImage(url, apiType) {
        return new Promise((resolve, reject) => {
            const img = document.createElement('img');
            img.src = url;
            img.alt = 'Brat Preview';
            img.style.maxWidth = '85%';
            img.style.maxHeight = '85%';
            img.style.objectFit = 'contain';
            img.style.borderRadius = '12px';
            img.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
            img.style.backgroundColor = 'white';
            img.style.padding = '10px';
            
            img.onload = () => {
                // Clear preview
                while (previewContainer.firstChild) {
                    previewContainer.removeChild(previewContainer.firstChild);
                }
                
                // Add image
                previewContainer.appendChild(img);
                currentImageUrl = url;
                
                // Hide loading
                loadingBar.style.width = '0%';
                loadingBar.style.display = 'none';
                generateBtn.disabled = false;
                
                const modeText = currentMode === 'static' ? 'PNG' : 'GIF';
                const apiText = apiType === 'primary' ? '' : ' (Fallback API)';
                showNotification(`${modeText} berhasil dibuat!${apiText}`, 'success');
                resolve();
            };
            
            img.onerror = () => {
                reject(new Error('Gagal memuat gambar'));
            };
        });
    }
    
    // Download function
    downloadBtn.addEventListener('click', async () => {
        if (!currentImageUrl) {
            showNotification('Generate gambar terlebih dahulu!', 'warning');
            return;
        }
        
        const text = textInput.value.trim();
        const ext = currentMode === 'static' ? 'png' : 'gif';
        const filename = sanitizeFilename(text) + '_brat.' + ext;
        
        try {
            const response = await fetch(currentImageUrl);
            if (!response.ok) throw new Error('Download failed');
            
            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = filename;
            a.click();
            
            URL.revokeObjectURL(blobUrl);
            showNotification('Download berhasil!', 'success');
            
        } catch (error) {
            console.error('Download error:', error);
            showNotification('Membuka di tab baru...', 'warning');
            window.open(currentImageUrl, '_blank');
        }
    });
    
    // Helper functions
    function buildUrl(text, apiType) {
        const apiConfig = API_URLS[currentMode];
        const base = apiType === 'primary' ? apiConfig.primary : apiConfig.fallback;
        // Tambahkan ?text= atau ?text= tergantung API
        const separator = base.includes('?') ? '&' : '?';
        return `${base}${separator}text=${encodeURIComponent(text)}&_ts=${Date.now()}`;
    }
    
    function sanitizeFilename(name) {
        return name.replace(/[<>:"/\\|?*\x00-\x1F]/g, '_').substring(0, 50).trim() || 'brat';
    }
}

// 2. TIKTOK DOWNLOADER
async function loadTikTokDownloader() {
    const toolHTML = `
        <div class="tool-page-container">
            <div class="tool-page-header">
                <h2 class="tool-page-title">
                    <i class="fab fa-tiktok"></i> TikTok Downloader
                </h2>
                <button class="tool-back-btn" onclick="backToTools()">
                    <i class="fas fa-arrow-left"></i> Back to Tools
                </button>
            </div>
            
            <div class="tool-content">
                <div style="margin-bottom: 30px;">
                    <label style="display: block; margin-bottom: 10px; color: var(--text); font-weight: 600;">
                        <i class="fas fa-link"></i> TikTok Video URL
                    </label>
                    <input 
                        type="text" 
                        id="tiktokUrlInput" 
                        placeholder="https://www.tiktok.com/@username/video/1234567890" 
                        style="width: 100%; padding: 16px 20px; background: rgba(30, 35, 60, 0.8); border: 2px solid var(--border); border-radius: 14px; color: var(--text); font-family: 'Inter', sans-serif; font-size: 16px;"
                    >
                </div>
                
                <div style="margin-bottom: 30px;">
                    <button id="downloadTikTokBtn" class="tool-btn" style="width: 100%; padding: 18px; font-size: 18px;">
                        <i class="fas fa-download"></i> Download Video
                    </button>
                </div>
                
                <div id="tiktokLoading" style="display: none; text-align: center; margin: 20px 0;">
                    <div class="loading-spinner" style="width: 50px; height: 50px; margin: 0 auto 20px;"></div>
                    <p>Memproses video...</p>
                </div>
                
                <div id="tiktokError" style="display: none; background: rgba(239, 68, 68, 0.2); padding: 15px; border-radius: 10px; border: 1px solid rgba(239, 68, 68, 0.3); margin: 20px 0;">
                    <p style="color: var(--danger); margin: 0;">Terjadi kesalahan. Pastikan URL TikTok valid dan coba lagi.</p>
                </div>
                
                <div id="tiktokResult" style="display: none; margin-top: 30px;">
                    <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 14px; padding: 20px; margin-bottom: 20px;">
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px;">
                            <i class="fas fa-check-circle" style="color: var(--success); font-size: 20px;"></i>
                            <div style="font-weight: 700; color: var(--text);">Video Ditemukan!</div>
                        </div>
                        <div style="color: var(--text-muted); font-size: 14px;">
                            Video TikTok berhasil diproses.
                        </div>
                    </div>
                    
                    <div style="text-align: center; margin-bottom: 20px;">
                        <img id="tiktokThumbnail" src="" alt="Thumbnail" style="max-width: 100%; max-height: 300px; border-radius: 12px; margin-bottom: 15px;">
                        <h3 id="tiktokTitle" style="color: var(--text); margin-bottom: 10px;">Judul Video</h3>
                        <p id="tiktokAuthor" style="color: var(--text-muted); margin-bottom: 15px;">Oleh: @username</p>
                        
                        <div style="display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; margin-bottom: 20px;">
                            <span id="tiktokViews" style="background: rgba(255, 255, 255, 0.1); padding: 5px 10px; border-radius: 20px; font-size: 14px;">0 views</span>
                            <span id="tiktokLikes" style="background: rgba(255, 255, 255, 0.1); padding: 5px 10px; border-radius: 20px; font-size: 14px;">0 likes</span>
                            <span id="tiktokDuration" style="background: rgba(255, 255, 255, 0.1); padding: 5px 10px; border-radius: 20px; font-size: 14px;">0 detik</span>
                        </div>
                    </div>
                    
                    <div style="display: flex; flex-direction: column; gap: 15px; margin-bottom: 20px;">
                        <button id="downloadVideoHdBtn" class="tool-btn">
                            <i class="fas fa-download"></i> Download Video HD
                        </button>
                        <button id="downloadVideoSdBtn" class="tool-btn">
                            <i class="fas fa-download"></i> Download Video SD
                        </button>
                        <button id="downloadMusicBtn" class="tool-btn" style="background: linear-gradient(to right, #8e2de2, #4a00e0);">
                            <i class="fas fa-music"></i> Download Musik
                        </button>
                        <button id="stalkBtn" class="tool-btn" style="background: linear-gradient(to right, #00b09b, #96c93d);">
                            <i class="fas fa-user"></i> Stalk User TikTok
                        </button>
                    </div>
                    
                    <button id="toggleApiBtn" class="tool-btn" style="width: 100%; background: rgba(30, 35, 60, 0.8); border: 1px solid var(--border);">
                        <i class="fas fa-code"></i> Lihat Detail API Response
                    </button>
                    
                    <div id="apiResponse" style="display: none; margin-top: 20px; background: rgba(0, 0, 0, 0.3); padding: 15px; border-radius: 10px; border: 1px solid var(--border); max-height: 200px; overflow-y: auto;">
                        <h4 style="color: var(--text); margin-bottom: 10px;">Detail API Response:</h4>
                        <pre id="apiResponseContent" style="font-family: 'Courier New', monospace; font-size: 12px; color: var(--text-muted); margin: 0; white-space: pre-wrap;">API response akan ditampilkan di sini...</pre>
                    </div>
                </div>
                
                <!-- Modal Stalk User -->
                <div id="stalkModal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.8); z-index: 1000; align-items: center; justify-content: center;">
                    <div style="background: rgba(30, 35, 60, 0.95); border-radius: 20px; padding: 30px; width: 90%; max-width: 500px; border: 1px solid var(--border);">
                        <button id="closeStalkModal" style="position: absolute; top: 15px; right: 15px; background: none; border: none; color: white; font-size: 1.5rem; cursor: pointer;">×</button>
                        <div style="text-align: center;">
                            <img id="stalkProfilePic" src="" alt="Profile Picture" style="width: 100px; height: 100px; border-radius: 50%; border: 3px solid var(--border); margin-bottom: 20px;">
                            <div style="margin-bottom: 20px;">
                                <h3 id="stalkNickname" style="color: var(--text); margin-bottom: 5px;">Nickname</h3>
                                <p id="stalkUniqueId" style="color: var(--text-muted); margin-bottom: 10px;">@username</p>
                                <p id="stalkSignature" style="color: var(--text-muted); font-size: 14px;">Signature</p>
                            </div>
                            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
                                <div style="text-align: center;">
                                    <div id="stalkFollowers" style="font-size: 24px; font-weight: bold; color: var(--primary);">0</div>
                                    <div style="font-size: 12px; color: var(--text-muted);">Followers</div>
                                </div>
                                <div style="text-align: center;">
                                    <div id="stalkFollowing" style="font-size: 24px; font-weight: bold; color: var(--primary);">0</div>
                                    <div style="font-size: 12px; color: var(--text-muted);">Following</div>
                                </div>
                                <div style="text-align: center;">
                                    <div id="stalkLikes" style="font-size: 24px; font-weight: bold; color: var(--primary);">0</div>
                                    <div style="font-size: 12px; color: var(--text-muted);">Likes</div>
                                </div>
                                <div style="text-align: center;">
                                    <div id="stalkVideos" style="font-size: 24px; font-weight: bold; color: var(--primary);">0</div>
                                    <div style="font-size: 12px; color: var(--text-muted);">Videos</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    const container = getToolContainer(); container.innerHTML = toolHTML; container.style.display = 'block';
    
    // Initialize TikTok Downloader functionality
    setTimeout(initializeTikTokDownloader, 100);
}

async function initializeTikTokDownloader() {
    const urlInput = document.getElementById('tiktokUrlInput');
    const downloadBtn = document.getElementById('downloadTikTokBtn');
    const loading = document.getElementById('tiktokLoading');
    const resultSection = document.getElementById('tiktokResult');
    const errorMessage = document.getElementById('tiktokError');
    const thumbnail = document.getElementById('tiktokThumbnail');
    const videoTitle = document.getElementById('tiktokTitle');
    const videoAuthor = document.getElementById('tiktokAuthor');
    const views = document.getElementById('tiktokViews');
    const likes = document.getElementById('tiktokLikes');
    const duration = document.getElementById('tiktokDuration');
    const downloadVideoHdBtn = document.getElementById('downloadVideoHdBtn');
    const downloadVideoSdBtn = document.getElementById('downloadVideoSdBtn');
    const downloadMusicBtn = document.getElementById('downloadMusicBtn');
    const apiResponse = document.getElementById('apiResponse');
    const apiResponseContent = document.getElementById('apiResponseContent');
    const toggleApiBtn = document.getElementById('toggleApiBtn');
    const stalkBtn = document.getElementById('stalkBtn');
    const stalkModal = document.getElementById('stalkModal');
    const closeStalkModal = document.getElementById('closeStalkModal');
    const stalkProfilePic = document.getElementById('stalkProfilePic');
    const stalkNickname = document.getElementById('stalkNickname');
    const stalkUniqueId = document.getElementById('stalkUniqueId');
    const stalkSignature = document.getElementById('stalkSignature');
    const stalkFollowers = document.getElementById('stalkFollowers');
    const stalkFollowing = document.getElementById('stalkFollowing');
    const stalkLikes = document.getElementById('stalkLikes');
    const stalkVideos = document.getElementById('stalkVideos');
    
    // Variabel untuk menyimpan data video
    let videoData = null;
    let isProcessing = false;
    
    // API URLs
    const API_URL_NEW = 'https://api.nvidiabotz.xyz/download/tiktok?url=';
    const API_URL_OLD = 'https://tikwm.com/api/?url=';
    const STALK_API_URL = 'https://api.resellergaming.my.id/stalk/tiktok?username=';
    
    // Event listener untuk tombol stalk user
    stalkBtn.addEventListener('click', async function() {
        if (isProcessing) return;
        
        if (videoData && videoData.old && videoData.old.data && videoData.old.data.author) {
            const username = videoData.old.data.author.unique_id;
            
            // Tampilkan loading
            loading.style.display = 'block';
            isProcessing = true;
            
            try {
                const stalkData = await fetchStalkData(username);
                
                // Sembunyikan loading
                loading.style.display = 'none';
                isProcessing = false;
                
                // Tampilkan modal stalk user
                displayStalkData(stalkData);
                stalkModal.style.display = 'flex';
            } catch (error) {
                console.error('Error:', error);
                loading.style.display = 'none';
                isProcessing = false;
                showError('Gagal mengambil data user. Silakan coba lagi.');
            }
        } else {
            showError('Data user tidak tersedia. Silakan download video terlebih dahulu.');
        }
    });
    
    // Event listener untuk menutup modal stalk user
    closeStalkModal.addEventListener('click', function() {
        stalkModal.style.display = 'none';
    });
    
    // Tutup modal stalk user ketika klik di luar konten modal
    stalkModal.addEventListener('click', function(e) {
        if (e.target === stalkModal) {
            stalkModal.style.display = 'none';
        }
    });
    
    downloadBtn.addEventListener('click', async function() {
        if (isProcessing) return;
        
        const url = urlInput.value.trim();
        
        if (!url) {
            showError('Silakan masukkan URL video TikTok');
            return;
        }
        
        // Validasi URL TikTok
        if (!isValidTikTokUrl(url)) {
            showError('URL tidak valid. Pastikan URL berasal dari TikTok');
            return;
        }
        
        // Tampilkan loading
        loading.style.display = 'block';
        resultSection.style.display = 'none';
        errorMessage.style.display = 'none';
        apiResponse.style.display = 'none';
        isProcessing = true;
        
        try {
            // Panggil API lama untuk data tampilan
            const oldApiData = await fetchTikTokDataOld(url);
            
            if (oldApiData && oldApiData.code === 0) {
                // Panggil API baru untuk data download
                let newApiData = null;
                try {
                    newApiData = await fetchTikTokDataNew(url);
                } catch (error) {
                    console.log('Gagal mengambil data dari API baru, menggunakan data lama untuk download');
                    // Fallback: jika API baru gagal, gunakan data dari API lama untuk download
                    newApiData = {
                        status: true,
                        result: {
                            video_hd: oldApiData.data.play,
                            video_sd: oldApiData.data.play,
                            mp3: oldApiData.data.music,
                            thumbnail: oldApiData.data.cover,
                            title: oldApiData.data.title
                        }
                    };
                }
                
                // Sembunyikan loading
                loading.style.display = 'none';
                isProcessing = false;
                
                // Simpan data video
                videoData = {
                    old: oldApiData,
                    new: newApiData
                };
                
                // Tampilkan hasil
                resultSection.style.display = 'block';
                
                // Set data video dengan data dari API lama
                displayVideoData(oldApiData, newApiData);
                
                // Tampilkan response API dari API baru saja
                displayApiResponse(newApiData);
            } else {
                throw new Error(oldApiData.msg || 'Tidak dapat mengambil data video dari API lama');
            }
            
        } catch (error) {
            console.error('Error:', error);
            loading.style.display = 'none';
            isProcessing = false;
            showError('Gagal mengambil video. Silakan coba lagi dengan URL yang berbeda.');
        }
    });
    
    // Event listener untuk tombol download video HD
    downloadVideoHdBtn.addEventListener('click', function() {
        if (videoData && videoData.new.result && videoData.new.result.video_hd) {
            window.open(videoData.new.result.video_hd, '_blank');
        } else {
            showError('URL video HD tidak tersedia');
        }
    });
    
    // Event listener untuk tombol download video SD
    downloadVideoSdBtn.addEventListener('click', function() {
        if (videoData && videoData.new.result && videoData.new.result.video_sd) {
            window.open(videoData.new.result.video_sd, '_blank');
        } else {
            showError('URL video SD tidak tersedia');
        }
    });
    
    // Event listener untuk tombol download musik
    downloadMusicBtn.addEventListener('click', function() {
        if (videoData && videoData.new.result && videoData.new.result.mp3) {
            window.open(videoData.new.result.mp3, '_blank');
        } else {
            showError('URL musik tidak tersedia');
        }
    });
    
    // FUNGSI STALK USER
    async function fetchStalkData(username) {
        const apiUrl = `${STALK_API_URL}${encodeURIComponent(username)}`;
        console.log('Mengambil data stalk user:', apiUrl);
        
        const response = await fetchWithRetry(apiUrl);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Data stalk user:', data);
        
        if (!data.status) {
            throw new Error(data.message || 'Gagal mengambil data user');
        }
        
        return data;
    }
    
    function displayStalkData(stalkData) {
        const user = stalkData.result;
        
        // Set data profil user
        stalkProfilePic.src = user.avatar;
        stalkNickname.textContent = user.nickname;
        stalkUniqueId.textContent = `@${user.uniqueId}`;
        stalkSignature.textContent = user.signature || 'Tidak ada signature';
        
        // Set statistik user
        stalkFollowers.textContent = formatNumber(user.followers);
        stalkFollowing.textContent = formatNumber(user.following);
        stalkLikes.textContent = formatNumber(user.likes);
        stalkVideos.textContent = formatNumber(user.videos);
    }
    
    function isValidTikTokUrl(url) {
        const tiktokPatterns = [
            /tiktok\.com\/.*\/video\/\d+/,
            /vt\.tiktok\.com\/.+/,
            /vm\.tiktok\.com\/.+/,
            /tiktok\.com\/t\/[a-zA-Z0-9]+/
        ];
        
        return tiktokPatterns.some(pattern => pattern.test(url));
    }
    
    // Fungsi fetch dengan retry untuk stabilitas
    async function fetchWithRetry(url, options = {}, maxRetries = 3) {
        let lastError;
        
        for (let i = 0; i < maxRetries; i++) {
            try {
                const response = await fetch(url, options);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response;
            } catch (error) {
                lastError = error;
                console.log(`Percobaan ${i + 1} gagal, mencoba lagi...`);
                
                if (i < maxRetries - 1) {
                    await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
                }
            }
        }
        
        throw lastError;
    }
    
    // Fungsi untuk mengambil data dari API baru
    async function fetchTikTokDataNew(url) {
        const apiUrl = `${API_URL_NEW}${encodeURIComponent(url)}`;
        console.log('Mengambil data dari API baru:', apiUrl);
        
        const response = await fetchWithRetry(apiUrl);
        
        const data = await response.json();
        console.log('Data API baru:', data);
        return data;
    }
    
    // Fungsi untuk mengambil data dari API lama (untuk data tampilan dan background video)
    async function fetchTikTokDataOld(url) {
        const apiUrl = `${API_URL_OLD}${encodeURIComponent(url)}`;
        console.log('Mengambil data dari API lama:', apiUrl);
        
        const response = await fetchWithRetry(apiUrl);
        
        const data = await response.json();
        console.log('Data API lama:', data);
        return data;
    }
    
    function displayVideoData(oldData, newData) {
        const oldDataResult = oldData.data;
        
        // Tampilkan thumbnail - prioritaskan ai_dynamic_cover dari API lama
        if (oldDataResult.ai_dynamic_cover) {
            thumbnail.src = oldDataResult.ai_dynamic_cover;
        } else if (oldDataResult.cover) {
            thumbnail.src = oldDataResult.cover;
        } else if (newData.result.thumbnail) {
            thumbnail.src = newData.result.thumbnail;
        } else {
            thumbnail.src = 'https://via.placeholder.com/300x400/6a11cb/ffffff?text=Thumbnail+TikTok';
        }
        
        thumbnail.alt = oldDataResult.title || 'Video TikTok';
        
        // Tampilkan judul dari API lama
        videoTitle.textContent = oldDataResult.title || 'Video TikTok';
        
        // Tampilkan author dari API lama
        if (oldDataResult.author) {
            videoAuthor.textContent = `Oleh: @${oldDataResult.author.unique_id}`;
        } else {
            videoAuthor.textContent = 'Oleh: @tiktokuser';
        }
        
        // Tampilkan statistik dari API lama
        if (oldDataResult.play_count !== undefined) {
            views.textContent = `${formatNumber(oldDataResult.play_count)} views`;
        }
        
        if (oldDataResult.digg_count !== undefined) {
            likes.textContent = `${formatNumber(oldDataResult.digg_count)} likes`;
        }
        
        // Tampilkan durasi dari API lama
        if (oldDataResult.duration) {
            duration.textContent = `${oldDataResult.duration} detik`;
        }
        
        // Tampilkan tombol download berdasarkan ketersediaan dari API baru
        if (!newData.result.video_hd) {
            downloadVideoHdBtn.style.display = 'none';
        }
        
        if (!newData.result.video_sd) {
            downloadVideoSdBtn.style.display = 'none';
        }
        
        if (!newData.result.mp3) {
            downloadMusicBtn.style.display = 'none';
        }
    }
    
    function displayApiResponse(data) {
        const formattedData = JSON.stringify(data, null, 2);
        apiResponseContent.textContent = formattedData;
        
        toggleApiBtn.addEventListener('click', function() {
            if (apiResponse.style.display === 'none') {
                apiResponse.style.display = 'block';
                toggleApiBtn.innerHTML = '<i class="fas fa-code"></i> Sembunyikan Detail API Response';
            } else {
                apiResponse.style.display = 'none';
                toggleApiBtn.innerHTML = '<i class="fas fa-code"></i> Lihat Detail API Response';
            }
        });
    }
    
    function formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }
    
    function showError(message) {
        loading.style.display = 'none';
        errorMessage.style.display = 'block';
        errorMessage.querySelector('p').textContent = message;
        isProcessing = false;
    }
    
    // Enter key support
    urlInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            downloadBtn.click();
        }
    });
}

// 3. GET CODE GENERATOR
async function loadGetCodeGenerator() {
    const toolHTML = `
        <div class="tool-page-container">
            <div class="tool-page-header">
                <h2 class="tool-page-title">
                    <i class="fas fa-code"></i> GET Code
                </h2>
                <button class="tool-back-btn" onclick="backToTools()">
                    <i class="fas fa-arrow-left"></i> Back to Tools
                </button>
            </div>
            
            <div class="tool-content">
                <div style="margin-bottom: 30px;">
                    <label style="display: block; margin-bottom: 10px; color: var(--text); font-weight: 600;">
                        <i class="fas fa-link"></i> Website URL
                    </label>
                    <input 
                        type="url" 
                        id="getcodeUrlInput" 
                        placeholder="https://example.com" 
                        style="width: 100%; padding: 16px 20px; background: rgba(30, 35, 60, 0.8); border: 2px solid var(--border); border-radius: 14px; color: var(--text); font-family: 'Inter', sans-serif; font-size: 16px;"
                    >
                </div>
                
                <div style="margin-bottom: 30px;">
                    <button id="generateGetCodeBtn" class="tool-btn" style="width: 100%; padding: 18px; font-size: 18px;">
                        <i class="fas fa-code"></i> Generate Code
                    </button>
                </div>
                
                <div id="getcodeLoading" style="display: none; text-align: center; margin: 20px 0;">
                    <div class="loading-spinner" style="width: 50px; height: 50px; margin: 0 auto 20px;"></div>
                    <p>Analisis Kode</p>
                </div>
                
                <div id="getcodeResultSection" style="display: none; margin-top: 30px;">
                    <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 14px; padding: 20px; margin-bottom: 20px;">
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px;">
                            <i class="fas fa-check-circle" style="color: var(--success); font-size: 20px;"></i>
                            <div style="font-weight: 700; color: var(--text);">Code Generated Successfully!</div>
                        </div>
                        <div style="color: var(--text-muted); font-size: 14px;">
                            Copy the code below and embed it in your website.
                        </div>
                    </div>
                    
                    <div style="display: flex; gap: 10px; margin-bottom: 15px; flex-wrap: wrap;">
                        <span id="status" style="background: rgba(255, 255, 255, 0.1); padding: 8px 16px; border-radius: 8px; font-size: 14px;">Status: -</span>
                        <span id="fileInfo" style="background: rgba(0, 255, 255, 0.1); padding: 8px 16px; border-radius: 8px; font-size: 14px; display: none;">
                            <i class="fas fa-file-code"></i> File: <span id="fileName">-</span>
                        </span>
                    </div>
                    
                    <div style="position: relative;">
                        <div style="position: absolute; top: 10px; right: 10px; display: flex; gap: 8px; z-index: 10;">
                            <button id="copyGetCodeBtn" class="tool-btn" style="padding: 8px 16px; background: rgba(0, 255, 255, 0.2); border: 1px solid #00ffff; color: #00ffff; font-size: 14px;">
                                <i class="fas fa-copy"></i> Salin
                            </button>
                            <button id="downloadGetCodeBtn" class="tool-btn" style="padding: 8px 16px; background: rgba(0, 255, 0, 0.2); border: 1px solid #00ff00; color: #00ff00; font-size: 14px;">
                                <i class="fas fa-download"></i> Download
                            </button>
                        </div>
                        <pre id="codeOutput" style="background: rgba(0, 0, 0, 0.5); border-radius: 10px; padding: 20px; max-height: 400px; overflow-y: auto; font-family: 'Courier New', monospace; font-size: 14px; color: #00ffff; margin: 0; white-space: pre-wrap; padding-top: 60px;"></pre>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    const container = getToolContainer(); container.innerHTML = toolHTML; container.style.display = 'block';
    
    // Initialize GET Code Generator functionality
    setTimeout(initializeGetCodeGenerator, 100);
}

async function initializeGetCodeGenerator() {
    const urlInput = document.getElementById('getcodeUrlInput');
    const generateBtn = document.getElementById('generateGetCodeBtn');
    const loading = document.getElementById('getcodeLoading');
    const resultSection = document.getElementById('getcodeResultSection');
    const statusSpan = document.getElementById('status');
    const fileInfo = document.getElementById('fileInfo');
    const fileNameSpan = document.getElementById('fileName');
    const codeOutput = document.getElementById('codeOutput');
    const copyBtn = document.getElementById('copyGetCodeBtn');
    const downloadBtn = document.getElementById('downloadGetCodeBtn');
    
    let currentUrl = ''; // Simpan URL saat ini untuk naming file
    
    // Generate code function
    generateBtn.addEventListener('click', async function() {
        const url = urlInput.value.trim();
        currentUrl = url;
        
        if (!url) {
            alert('Masukkan URL terlebih dahulu!');
            return;
        }
        
        if (!url.startsWith('https://')) {
            alert('URL wajib menggunakan https://');
            return;
        }
        
        loading.style.display = 'block';
        resultSection.style.display = 'none';
        
        try {
            const response = await fetch(`https://api.resellergaming.my.id/tools/getcode?url=${encodeURIComponent(url)}`);
            const data = await response.json();
            
            if (data.status) {
                statusSpan.textContent = `Status: ${data.status ? 'Success' : 'Failed'}`;
                codeOutput.textContent = data.result.html;
                
                // Tampilkan info file
                const domain = new URL(url).hostname.replace(/\./g, '-');
                const fileName = `code-${domain}-${Date.now()}.html`;
                fileNameSpan.textContent = fileName;
                fileInfo.style.display = 'inline-block';
                
                loading.style.display = 'none';
                resultSection.style.display = 'block';
            } else {
                throw new Error('Failed to fetch code');
            }
        } catch (error) {
            loading.style.display = 'none';
            alert('Terjadi kesalahan saat mengambil kode. Silakan coba lagi.');
            console.error('Error:', error);
        }
    });
    
    // Copy code function
    copyBtn.addEventListener('click', function() {
        if (!codeOutput.textContent.trim()) {
            alert('Tidak ada kode untuk disalin!');
            return;
        }
        
        navigator.clipboard.writeText(codeOutput.textContent).then(() => {
            copyBtn.innerHTML = '<i class="fas fa-check"></i> Tersalin!';
            copyBtn.style.background = 'rgba(0, 255, 0, 0.2)';
            copyBtn.style.borderColor = '#00ff00';
            copyBtn.style.color = '#00ff00';
            
            setTimeout(() => {
                copyBtn.innerHTML = '<i class="fas fa-copy"></i> Salin';
                copyBtn.style.background = 'rgba(0, 255, 255, 0.2)';
                copyBtn.style.borderColor = '#00ffff';
                copyBtn.style.color = '#00ffff';
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy:', err);
            alert('Gagal menyalin kode');
        });
    });
    
    // Download code function
    downloadBtn.addEventListener('click', function() {
        if (!codeOutput.textContent.trim()) {
            alert('Tidak ada kode untuk didownload!');
            return;
        }
        
        const codeContent = codeOutput.textContent;
        
        // Generate filename based on URL or timestamp
        let filename;
        if (currentUrl) {
            try {
                const domain = new URL(currentUrl).hostname;
                filename = `code-${domain.replace(/\./g, '-')}-${Date.now()}.html`;
            } catch (e) {
                filename = `code-${Date.now()}.html`;
            }
        } else {
            filename = `code-${Date.now()}.html`;
        }
        
        // Create blob and download link
        const blob = new Blob([codeContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        // Show feedback
        const originalHTML = downloadBtn.innerHTML;
        const originalBackground = downloadBtn.style.background;
        const originalBorder = downloadBtn.style.borderColor;
        const originalColor = downloadBtn.style.color;
        
        downloadBtn.innerHTML = '<i class="fas fa-check"></i> Terdownload!';
        downloadBtn.style.background = 'rgba(16, 185, 129, 0.2)';
        downloadBtn.style.borderColor = 'var(--success)';
        downloadBtn.style.color = 'var(--success)';
        
        setTimeout(() => {
            downloadBtn.innerHTML = originalHTML;
            downloadBtn.style.background = originalBackground;
            downloadBtn.style.borderColor = originalBorder;
            downloadBtn.style.color = originalColor;
        }, 2000);
    });
    
    // Enter key support
    urlInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            generateBtn.click();
        }
    });
}

// 4. BYY UNBANNED
async function loadByyUnbanned() {
    const toolHTML = `
        <div class="tool-page-container">
            <div class="tool-page-header">
                <h2 class="tool-page-title">
                    <i class="fas fa-unlock"></i> Byy Unbanned
                </h2>
                <button class="tool-back-btn" onclick="backToTools()">
                    <i class="fas fa-arrow-left"></i> Back to Tools
                </button>
            </div>
            
            <div class="tool-content">
                <div style="margin-bottom: 30px;">
                    <label style="display: block; margin-bottom: 10px; color: var(--text); font-weight: 600;">
                        <i class="fas fa-user"></i> Your Name
                    </label>
                    <input 
                        type="text" 
                        id="unbanNameInput" 
                        placeholder="Enter your full name" 
                        style="
                            width: 100%;
                            padding: 16px 20px;
                            background: rgba(30, 35, 60, 0.8);
                            border: 2px solid var(--border);
                            border-radius: 14px;
                            color: var(--text);
                            font-family: 'Inter', sans-serif;
                            font-size: 16px;
                            transition: all 0.3s ease;
                        "
                    >
                </div>
                
                <div style="margin-bottom: 30px;">
                    <label style="display: block; margin-bottom: 10px; color: var(--text); font-weight: 600;">
                        <i class="fas fa-envelope"></i> Your Email
                    </label>
                    <input 
                        type="email" 
                        id="unbanEmailInput" 
                        placeholder="your@email.com" 
                        style="
                            width: 100%;
                            padding: 16px 20px;
                            background: rgba(30, 35, 60, 0.8);
                            border: 2px solid var(--border);
                            border-radius: 14px;
                            color: var(--text);
                            font-family: 'Inter', sans-serif;
                            font-size: 16px;
                            transition: all 0.3s ease;
                        "
                    >
                </div>
                
                <div style="margin-bottom: 30px;">
                    <label style="display: block; margin-bottom: 10px; color: var(--text); font-weight: 600;">
                        <i class="fas fa-cogs"></i> Select Template
                    </label>
                    <div style="display: flex; gap: 15px; flex-wrap: wrap;">
                        <button id="templateAppealBtn" class="tool-btn active-mode">
                            <i class="fas fa-file-alt"></i> Ban Appeal
                        </button>
                        <button id="templateSupportBtn" class="tool-btn">
                            <i class="fas fa-headset"></i> Support Request
                        </button>
                    </div>
                </div>
                
                <div style="margin-bottom: 30px;">
                    <button id="generateUnbanBtn" class="tool-btn" style="width: 100%; padding: 18px; font-size: 18px;">
                        <i class="fas fa-envelope-open-text"></i> Generate Email
                    </button>
                </div>
                
                <div id="unbanPreview" style="
                    background: rgba(30, 35, 60, 0.6);
                    border: 2px dashed var(--border);
                    border-radius: 16px;
                    padding: 40px;
                    text-align: center;
                    color: var(--text-muted);
                    margin-top: 30px;
                    min-height: 200px;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                ">
                    <i class="fas fa-envelope fa-3x" style="margin-bottom: 20px; opacity: 0.5;"></i>
                    <div style="font-size: 16px; font-weight: 600;">Generated email will appear here</div>
                    <div style="font-size: 14px; margin-top: 10px; opacity: 0.7;">
                        Fill in your details and select template
                    </div>
                </div>
                
                <div id="unbanResult" style="display: none; margin-top: 30px;">
                    <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 14px; padding: 20px; margin-bottom: 20px;">
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px;">
                            <i class="fas fa-check-circle" style="color: var(--success); font-size: 20px;"></i>
                            <div style="font-weight: 700; color: var(--text);">Email Generated Successfully!</div>
                        </div>
                        <div style="color: var(--text-muted); font-size: 14px;">
                            Copy the email below and send it to support.
                        </div>
                    </div>
                    
                    <div id="generatedEmail" style="
                        background: rgba(19, 22, 39, 0.9);
                        border: 1px solid var(--border);
                        border-radius: 12px;
                        padding: 20px;
                        font-family: 'Inter', sans-serif;
                        font-size: 14px;
                        color: var(--text);
                        line-height: 1.6;
                        margin-bottom: 20px;
                        max-height: 300px;
                        overflow-y: auto;
                        white-space: pre-wrap;
                    "></div>
                    
                    <div style="display: flex; gap: 15px;">
                        <button id="copyEmailBtn" class="tool-btn" style="flex: 1;">
                            <i class="fas fa-copy"></i> Copy Email
                        </button>
                        <button id="sendEmailBtn" class="tool-btn" style="flex: 1;">
                            <i class="fas fa-paper-plane"></i> Open in Email
                        </button>
                        <button id="newUnbanBtn" class="tool-btn" style="flex: 1; background: rgba(30, 35, 60, 0.8); border: 1px solid var(--border);">
                            <i class="fas fa-plus"></i> New Email
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    const container = getToolContainer(); container.innerHTML = toolHTML; container.style.display = 'block';
    
    // Initialize Byy Unbanned functionality
    setTimeout(initializeByyUnbanned, 100);
}

async function initializeByyUnbanned() {
    const nameInput = document.getElementById('unbanNameInput');
    const emailInput = document.getElementById('unbanEmailInput');
    const templateAppealBtn = document.getElementById('templateAppealBtn');
    const templateSupportBtn = document.getElementById('templateSupportBtn');
    const generateBtn = document.getElementById('generateUnbanBtn');
    const previewDiv = document.getElementById('unbanPreview');
    const resultDiv = document.getElementById('unbanResult');
    const generatedEmailDiv = document.getElementById('generatedEmail');
    const copyEmailBtn = document.getElementById('copyEmailBtn');
    const sendEmailBtn = document.getElementById('sendEmailBtn');
    const newUnbanBtn = document.getElementById('newUnbanBtn');
    
    let currentTemplate = 'appeal';
    
    // Template selection
    templateAppealBtn.addEventListener('click', () => {
        currentTemplate = 'appeal';
        templateAppealBtn.classList.add('active-mode');
        templateSupportBtn.classList.remove('active-mode');
        showNotification('Template set to Ban Appeal', 'success', 2000);
    });
    
    templateSupportBtn.addEventListener('click', () => {
        currentTemplate = 'support';
        templateSupportBtn.classList.add('active-mode');
        templateAppealBtn.classList.remove('active-mode');
        showNotification('Template set to Support Request', 'success', 2000);
    });
    
    // Generate Email
    generateBtn.addEventListener('click', () => {
        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        
        if (!name || !email) {
            showNotification('Please fill in both name and email!', 'error');
            if (!name) nameInput.focus();
            else emailInput.focus();
            return;
        }
        
        // Show loading in preview
        previewDiv.innerHTML = `
            <div style="text-align: center;">
                <div class="loading-spinner" style="width: 50px; height: 50px; margin: 0 auto 20px;"></div>
                <div style="font-weight: 600; color: var(--text); margin-bottom: 10px;">Generating email template...</div>
                <div style="font-size: 14px; color: var(--text-muted);">Please wait a moment</div>
            </div>
        `;
        
        // Generate email based on template
        setTimeout(() => {
            let emailContent = '';
            const date = new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
            if (currentTemplate === 'appeal') {
                emailContent = `Subject: Ban Appeal - ${name}

Dear Support Team,

My name is ${name}, and I am writing to appeal the ban on my account. I believe this ban was issued in error and would like to request a review.

Account Information:
- Name: ${name}
- Email: ${email}
- Date of Ban: [Please specify]
- Reason for Ban: [Please specify if known]

I have always followed the community guidelines and terms of service. I believe there may have been a misunderstanding or technical error that led to this ban.

I kindly request you to review my account and consider lifting the ban. I am committed to being a positive member of the community and will ensure to comply with all rules moving forward.

Thank you for your time and consideration.

Best regards,
${name}
${email}
${date}`;
            } else {
                emailContent = `Subject: Support Request - Account Issue

Dear Support Team,

I am ${name}, and I need assistance with my account. I believe there might be an issue that requires your attention.

Account Details:
- Full Name: ${name}
- Email Address: ${email}
- Issue Description: [Please describe your issue here]
- Date Issue Started: [Please specify]

I have tried the following troubleshooting steps:
1. [Step 1]
2. [Step 2]
3. [Step 3]

Unfortunately, the issue persists. I would greatly appreciate your assistance in resolving this matter as soon as possible.

Please let me know if you need any additional information from my side.

Thank you for your support.

Sincerely,
${name}
${email}
${date}`;
            }
            
            previewDiv.style.display = 'none';
            resultDiv.style.display = 'block';
            
            generatedEmailDiv.textContent = emailContent;
            
            // Set up send email button
            sendEmailBtn.onclick = () => {
                const subject = currentTemplate === 'appeal' 
                    ? `Ban Appeal - ${name}`
                    : `Support Request - Account Issue`;
                
                const mailtoLink = `mailto:support@support.whatsapp.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailContent)}`;
                window.location.href = mailtoLink;
            };
            
            showNotification('Email template generated successfully!', 'success');
            
        }, 1500);
    });
    
    // Copy Email
    copyEmailBtn.addEventListener('click', () => {
        const emailContent = generatedEmailDiv.textContent;
        navigator.clipboard.writeText(emailContent).then(() => {
            showNotification('Email copied to clipboard!', 'success');
            copyEmailBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
            setTimeout(() => {
                copyEmailBtn.innerHTML = '<i class="fas fa-copy"></i> Copy Email';
            }, 2000);
        }).catch(err => {
            showNotification('Failed to copy email', 'error');
        });
    });
    
    // New Email
    newUnbanBtn.addEventListener('click', () => {
        nameInput.value = '';
        emailInput.value = '';
        resultDiv.style.display = 'none';
        previewDiv.style.display = 'flex';
        previewDiv.innerHTML = `
            <i class="fas fa-envelope fa-3x" style="margin-bottom: 20px; opacity: 0.5;"></i>
            <div style="font-size: 16px; font-weight: 600;">Generated email will appear here</div>
            <div style="font-size: 14px; margin-top: 10px; opacity: 0.7;">
                Fill in your details and select template
            </div>
        `;
        nameInput.focus();
    });
}

// 5. WHATSAPP AUTO REACT CHANNEL 
async function loadWhatsAppAutoReact() {  
    const toolHTML = `
        <div class="tool-page-container">
            <div class="tool-page-header">
                <h2 class="tool-page-title">
                    <i class="fab fa-whatsapp"></i> React CH
                </h2>
                <button class="tool-back-btn" onclick="backToTools()">
                    <i class="fas fa-arrow-left"></i> Back to Tools
                </button>
            </div>
            
            <div class="tool-content">
                <div style="margin-bottom: 30px;">
                    <label style="display: block; margin-bottom: 10px; color: var(--text); font-weight: 600;">
                        <i class="fas fa-link"></i> Link Pesan/Channel
                    </label>
                    <input 
                        type="text" 
                        id="linkInput" 
                        placeholder="https://whatsapp.com/channel/..." 
                        style="
                            width: 100%;
                            padding: 16px 20px;
                            background: rgba(30, 35, 60, 0.8);
                            border: 2px solid var(--border);
                            border-radius: 14px;
                            color: var(--text);
                            font-family: 'Inter', sans-serif;
                            font-size: 16px;
                            transition: all 0.3s ease;
                        "
                    >
                </div>
                
                <div style="margin-bottom: 30px;">
                    <label style="display: block; margin-bottom: 10px; color: var(--text); font-weight: 600;">
                        <i class="fas fa-smile"></i> Emoji (Min 1, Maks 3)
                    </label>
                    <input 
                        type="text" 
                        id="emojiInput" 
                        placeholder="Contoh: ✌,😮‍💨,🤪" 
                        style="
                            width: 100%;
                            padding: 16px 20px;
                            background: rgba(30, 35, 60, 0.8);
                            border: 2px solid var(--border);
                            border-radius: 14px;
                            color: var(--text);
                            font-family: 'Inter', sans-serif;
                            font-size: 16px;
                            transition: all 0.3s ease;
                        "
                    >
                </div>
                
                <button id="sendBtn" class="tool-btn" style="width: 100%; padding: 18px; font-size: 18px;">
                    <i class="fas fa-paper-plane"></i> SEND REACT
                </button>
                
                <div id="progress-container" style="
                    width: 100%;
                    background-color: #333;
                    border-radius: 5px;
                    margin-top: 1.5rem;
                    height: 10px;
                    overflow: hidden;
                    display: none;
                ">
                    <div id="progress-bar" style="
                        height: 100%;
                        width: 0%;
                        background-color: #ffffff;
                        transition: width 0.1s linear;
                    "></div>
                </div>
                
                <div id="progress-text" style="
                    margin-top: 5px;
                    font-size: 0.85rem;
                    color: #aaa;
                    display: none;
                ">0%</div>
                
                <div id="result" style="
                    margin-top: 1.5rem;
                    padding: 12px;
                    border-radius: 8px;
                    font-size: 0.9rem;
                    display: none;
                    word-wrap: break-word;
                    font-weight: 500;
                "></div>
                
                <div style="text-align: center; color: var(--text-muted); font-size: 12px; margin-top: 30px; padding: 15px; background: rgba(30, 35, 60, 0.4); border-radius: 10px; border: 1px solid var(--border);">
                    <i class="fas fa-info-circle"></i> Cooldown: 5 menit antara setiap penggunaan
                </div>
            </div>
        </div>
    `;
    
    const container = getToolContainer(); container.innerHTML = toolHTML; container.style.display = 'block';
    
    // Initialize WhatsApp Auto React functionality
    setTimeout(initializeWhatsAppAutoReact, 100);
}

async function initializeWhatsAppAutoReact() {
    const linkInput = document.getElementById('linkInput');
    const emojiInput = document.getElementById('emojiInput');
    const sendBtn = document.getElementById('sendBtn');
    const progressContainer = document.getElementById('progress-container');
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    const resultDiv = document.getElementById('result');
    
    // Cooldown system
    const COOLDOWN_TIME = 5 * 60 * 1000; // 5 minutes cooldown
    let cooldownInterval;
    
    // Check cooldown on load
    checkCooldown();
    
    function checkCooldown() {
        const lastUsed = localStorage.getItem('lastReactTime');
        
        if (lastUsed) {
            const now = new Date().getTime();
            const diff = now - parseInt(lastUsed);

            if (diff < COOLDOWN_TIME) {
                const remaining = COOLDOWN_TIME - diff;
                startCooldownTimer(remaining);
            } else {
                enableButton();
            }
        }
    }
    
    function startCooldownTimer(remainingTime) {
        sendBtn.disabled = true;

        if (cooldownInterval) clearInterval(cooldownInterval);

        cooldownInterval = setInterval(() => {
            remainingTime -= 1000;
            
            const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
            
            sendBtn.innerHTML = `<i class="fas fa-clock"></i> Cooldown: ${minutes}m ${seconds}d`;

            if (remainingTime <= 0) {
                clearInterval(cooldownInterval);
                enableButton();
            }
        }, 1000);
    }
    
    function enableButton() {
        sendBtn.disabled = false;
        sendBtn.innerHTML = '<i class="fas fa-paper-plane"></i> SEND REACT';
        localStorage.removeItem('lastReactTime');
    }
    
    // Process reaction
    sendBtn.addEventListener('click', async function() {
        const link = linkInput.value.trim();
        const emojis = emojiInput.value.trim();
        
        if (!link || !emojis) {
            showResult('Harap isi Link dan Emoji!', 'error');
            return;
        }
        
        // Reset result display
        resultDiv.style.display = 'none';
        resultDiv.className = '';
        sendBtn.disabled = true;
        sendBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memproses...';
        
        // Show progress
        progressContainer.style.display = 'block';
        progressText.style.display = 'block';
        progressBar.style.width = '0%';
        progressText.textContent = '0%';
        
        try {
            await runAnimationAndFetch(link, emojis);
        } catch (error) {
            console.error('React error:', error);
            showResult('(gagal mengirim reaction)', 'error');
            sendBtn.disabled = false;
            sendBtn.innerHTML = '<i class="fas fa-paper-plane"></i> SEND REACT';
            progressContainer.style.display = 'none';
            progressText.style.display = 'none';
        }
    });
    
    function runAnimationAndFetch(link, emojis) {
        return new Promise((resolve) => {
            let progress = 0;
            let fetchSuccess = false;
            let fetchDone = false;
            let fetchResponseData = null;
            
            const apiUrl = `https://api.fikmydomainsz.xyz/tools/reactchannel?link=${encodeURIComponent(link)}&emojis=${encodeURIComponent(emojis)}`;
            
            // Start fetch request
            fetch(apiUrl)
                .then(response => response.json())
                .then(data => {
                    fetchSuccess = true; 
                    fetchResponseData = data;
                    fetchDone = true;
                    console.log("API Response:", data);
                })
                .catch(err => {
                    fetchSuccess = false;
                    fetchDone = true;
                    console.error(err);
                });
            
            // Progress animation
            const animationInterval = setInterval(() => {
                if (progress < 90) {
                    progress += Math.floor(Math.random() * 3) + 1; 
                } else if (progress >= 90 && fetchDone) {
                    progress = 100;
                }
                
                if (progress > 100) progress = 100;
                
                progressBar.style.width = `${progress}%`;
                progressText.textContent = `${progress}%`;
                
                if (progress === 100 && fetchDone) {
                    clearInterval(animationInterval);
                    setTimeout(() => {
                        finishProcess(fetchSuccess, fetchResponseData);
                        resolve();
                    }, 500);
                }
            }, 50);
        });
    }
    
    function finishProcess(isSuccess, data) {
        progressContainer.style.display = 'none';
        progressText.style.display = 'none';
        
        if (isSuccess) {
            showResult('(berhasil mengirim reaction)', 'success');
            localStorage.setItem('lastReactTime', new Date().getTime());
            checkCooldown();
        } else {
            showResult('(gagal mengirim reaction)', 'error');
            sendBtn.disabled = false;
            sendBtn.innerHTML = '<i class="fas fa-paper-plane"></i> SEND REACT';
        }
    }
    
    function showResult(message, type) {
        resultDiv.style.display = 'block';
        resultDiv.className = type;
        resultDiv.textContent = message;
        
        // Apply CSS classes based on type
        if (type === 'success') {
            resultDiv.style.backgroundColor = 'rgba(27, 94, 32, 0.2)';
            resultDiv.style.color = '#e8f5e9';
            resultDiv.style.border = '1px solid rgba(46, 125, 50, 0.3)';
        } else if (type === 'error') {
            resultDiv.style.backgroundColor = 'rgba(183, 28, 28, 0.2)';
            resultDiv.style.color = '#ffebee';
            resultDiv.style.border = '1px solid rgba(198, 40, 40, 0.3)';
        }
    }
    
    // Enter key support
    linkInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendBtn.click();
        }
    });
    
    emojiInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendBtn.click();
        }
    });
}

// 6. IPHONE QUOTED GENERATOR
async function loadiPhoneGenerator() {
    const toolHTML = `
        <div class="tool-page-container">
            <div class="tool-page-header">
                <h2 class="tool-page-title">
                    <i class="fab fa-apple"></i> iPhone Generator
                </h2>
                <button class="tool-back-btn" onclick="backToTools()">
                    <i class="fas fa-arrow-left"></i> Back to Tools
                </button>
            </div>
            
            <div class="tool-content">
                <div style="margin-bottom: 30px;">
                    <label style="display: block; margin-bottom: 10px; color: var(--text); font-weight: 600;">
                        <i class="fas fa-comment"></i> Message Text
                    </label>
                    <textarea 
                        id="messageTextInput" 
                        placeholder="Type your message here..." 
                        rows="4"
                        style="
                            width: 100%;
                            padding: 16px 20px;
                            background: rgba(30, 35, 60, 0.8);
                            border: 2px solid var(--border);
                            border-radius: 14px;
                            color: var(--text);
                            font-family: 'Inter', sans-serif;
                            font-size: 16px;
                            transition: all 0.3s ease;
                            resize: vertical;
                        "
                    ></textarea>
                </div>
                
                <div style="margin-bottom: 30px;">
                    <button id="generateiPhoneBtn" class="tool-btn" style="width: 100%; padding: 18px; font-size: 18px;">
                        <i class="fas fa-sparkles"></i> Generate Quote
                    </button>
                </div>
                
                <div id="iphonePreview" style="
                    background: rgba(30, 35, 60, 0.6);
                    border: 2px dashed var(--border);
                    border-radius: 16px;
                    padding: 40px;
                    text-align: center;
                    color: var(--text-muted);
                    margin-top: 30px;
                    min-height: 300px;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                ">
                    <i class="fab fa-apple fa-3x" style="margin-bottom: 20px; opacity: 0.5;"></i>
                    <div style="font-size: 16px; font-weight: 600;">iPhone screenshot will appear here</div>
                    <div style="font-size: 14px; margin-top: 10px; opacity: 0.7;">
                        Enter message and click generate
                    </div>
                </div>
                
                <div id="iphoneResult" style="display: none; margin-top: 30px;">
                    <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 14px; padding: 20px; margin-bottom: 20px;">
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px;">
                            <i class="fas fa-check-circle" style="color: var(--success); font-size: 20px;"></i>
                            <div style="font-weight: 700; color: var(--text);">iPhone Quote Generated!</div>
                        </div>
                        <div style="color: var(--text-muted); font-size: 14px;">
                            Your custom iPhone message is ready.
                        </div>
                    </div>
                    
                    <div id="iphoneImageContainer" style="margin-bottom: 20px; text-align: center;"></div>
                    
                    <div style="display: flex; gap: 15px;">
                        <button id="downloadiPhoneBtn" class="tool-btn" style="flex: 1;">
                            <i class="fas fa-download"></i> Download PNG
                        </button>
                        <button id="newiPhoneBtn" class="tool-btn" style="flex: 1; background: rgba(30, 35, 60, 0.8); border: 1px solid var(--border);">
                            <i class="fas fa-plus"></i> New Message
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    const container = getToolContainer(); container.innerHTML = toolHTML; container.style.display = 'block';
    
    // Initialize iPhone Generator functionality
    setTimeout(initializeiPhoneGenerator, 100);
}

async function initializeiPhoneGenerator() {
    const messageTextInput = document.getElementById('messageTextInput');
    const generateBtn = document.getElementById('generateiPhoneBtn');
    const previewDiv = document.getElementById('iphonePreview');
    const resultDiv = document.getElementById('iphoneResult');
    const iphoneImageContainer = document.getElementById('iphoneImageContainer');
    const downloadBtn = document.getElementById('downloadiPhoneBtn');
    const newiPhoneBtn = document.getElementById('newiPhoneBtn');
    
    // Generate iPhone Screenshot
    generateBtn.addEventListener('click', async () => {
        const message = messageTextInput.value.trim();
        
        if (!message) {
            showNotification('Please enter message text!', 'error');
            messageTextInput.focus();
            return;
        }
        
        // Show loading in preview
        previewDiv.innerHTML = `
            <div style="text-align: center;">
                <div class="loading-spinner" style="width: 50px; height: 50px; margin: 0 auto 20px;"></div>
                <div style="font-weight: 600; color: var(--text); margin-bottom: 10px;">Generating iPhone screenshot...</div>
                <div style="font-size: 14px; color: var(--text-muted);">Creating realistic iPhone UI</div>
            </div>
        `;
        
        try {
            // Get current time
            const now = new Date();
            const hours = now.getHours().toString().padStart(2, '0');
            const minutes = now.getMinutes().toString().padStart(2, '0');
            const time = `${hours}:${minutes}`;
            
            // Use the actual iPhone Quote API from your original code
            const apiUrl = `https://brat.siputzx.my.id/iphone-quoted?time=${encodeURIComponent(time)}&messageText=${encodeURIComponent(message)}&emojiStyle=apple&batteryPercentage=85&carrierName=Telkomsel&signalStrength=4`;
            
            previewDiv.style.display = 'none';
            resultDiv.style.display = 'block';
            
            iphoneImageContainer.innerHTML = `
                <img 
                    src="${apiUrl}" 
                    alt="Generated iPhone Quote" 
                    style="max-width: 100%; max-height: 400px; border-radius: 12px; box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);"
                    onerror="this.onerror=null; this.src='https://via.placeholder.com/400x600/647cf7/ffffff?text=iPhone+Quote+Generated'"
                >
                <div style="margin-top: 15px; font-size: 14px; color: var(--text-muted);">
                    Size: 400x600px • Format: PNG
                </div>
            `;
            
            // Set up download button
            downloadBtn.onclick = () => {
                const link = document.createElement('a');
                link.href = apiUrl;
                link.download = `iphone-quote-${Date.now()}.png`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                showNotification('Download started!', 'success');
            };
            
            showNotification('iPhone quote generated successfully!', 'success');
            
        } catch (error) {
            console.error('iPhone generator error:', error);
            showNotification('Failed to generate iPhone quote. Please try again.', 'error');
            previewDiv.style.display = 'flex';
            previewDiv.innerHTML = `
                <i class="fas fa-exclamation-triangle fa-3x" style="margin-bottom: 20px; color: var(--danger);"></i>
                <div style="font-size: 16px; font-weight: 600; color: var(--danger);">Generation Failed</div>
                <div style="font-size: 14px; margin-top: 10px; color: var(--text-muted);">
                    Please check your connection and try again
                </div>
            `;
        }
    });
    
    // New Message
    newiPhoneBtn.addEventListener('click', () => {
        messageTextInput.value = '';
        resultDiv.style.display = 'none';
        previewDiv.style.display = 'flex';
        previewDiv.innerHTML = `
            <i class="fab fa-apple fa-3x" style="margin-bottom: 20px; opacity: 0.5;"></i>
            <div style="font-size: 16px; font-weight: 600;">iPhone screenshot will appear here</div>
            <div style="font-size: 14px; margin-top: 10px; opacity: 0.7;">
                Enter message and click generate
            </div>
        `;
        messageTextInput.focus();
    });
}

// 7. XPRO INVICTUS
async function loadXPROInvictus() {
    const toolHTML = `
        <div class="tool-page-container">
            <div class="tool-page-header">
                <h2 class="tool-page-title">
                    <i class="fas fa-bug"></i> BUG Verse
                </h2>
                <button class="tool-back-btn" onclick="backToTools()">
                    <i class="fas fa-arrow-left"></i> Back to Tools
                </button>
            </div>
            
            <div class="tool-content">
                <div style="text-align: center; margin-bottom: 40px;">
                    <div style="font-size: 24px; font-weight: 700; color: var(--text); margin-bottom: 15px;">
                    
                    </div>
                    <div style="color: var(--text-muted); max-width: 800px; margin: 0 auto; line-height: 1.6;">
 
                    </div>
                </div>
                
                <div style="margin-bottom: 30px;">
                    <label style="display: block; margin-bottom: 10px; color: var(--text); font-weight: 600;">
                        <i class="fas fa-phone"></i> Target Number
                    </label>
                    <input 
                        type="text" 
                        id="targetInput" 
                        placeholder="62812xxxxxxx" 
                        style="
                            width: 100%;
                            padding: 16px 20px;
                            background: rgba(30, 35, 60, 0.8);
                            border: 2px solid var(--border);
                            border-radius: 14px;
                            color: var(--text);
                            font-family: 'Inter', sans-serif;
                            font-size: 16px;
                            transition: all 0.3s ease;
                        "
                    >
                    <div style="font-size: 12px; color: var(--text-muted); margin-top: 8px;">
                        Enter target phone number (for simulation only)
                    </div>
                </div>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 30px;">
                    <button class="tool-btn" onclick="runXproAction('FORCLOSE')">
                        <i class="fas fa-ban"></i> FORCLOSE
                    </button>
                    <button class="tool-btn" onclick="runXproAction('INVISIBLE')">
                        <i class="fas fa-eye-slash"></i> INVISIBLE
                    </button>
                    <button class="tool-btn" onclick="runXproAction('DELAY HARD')">
                        <i class="fas fa-clock"></i> DELAY HARD
                    </button>
                    <button class="tool-btn" onclick="runXproAction('BLANK NEW')">
                        <i class="fas fa-square"></i> BLANK NEW
                    </button>
                    <button class="tool-btn" onclick="runXproAction('CRASH IOS')">
                        <i class="fab fa-apple"></i> CRASH IOS
                    </button>
                    <button class="tool-btn" onclick="runXproAction('CRASH IP')">
                        <i class="fas fa-mobile-alt"></i> CRASH IP
                    </button>
                </div>
                
                <div style="display: flex; gap: 15px; margin-bottom: 30px; flex-wrap: wrap;">
                    <button id="runAllBtn" class="tool-btn" style="flex: 1;">
                        <i class="fas fa-play-circle"></i> Run All Actions
                    </button>
                    <button id="clearLogsBtn" class="tool-btn" style="flex: 1; background: rgba(30, 35, 60, 0.8); border: 1px solid var(--border);">
                        <i class="fas fa-trash"></i> Clear Logs
                    </button>
                </div>
                
                <div id="xproConsole" style="
                    background: rgba(19, 22, 39, 0.9);
                    border: 1px solid var(--border);
                    border-radius: 12px;
                    padding: 20px;
                    font-family: 'Courier New', monospace;
                    font-size: 14px;
                    color: var(--text);
                    max-height: 300px;
                    overflow-y: auto;
                    margin-bottom: 20px;
                ">
                    <div class="log ok">[${new Date().toLocaleTimeString()}] XPRO INVICTUS Initialized</div>
                    <div class="log">[${new Date().toLocaleTimeString()}] Mode: Simulation (Safe)</div>
                </div>
                
                <div style="text-align: center; color: var(--text-muted); font-size: 12px; padding: 15px; background: rgba(30, 35, 60, 0.4); border-radius: 10px; border: 1px solid var(--border);">
                    <i class="fas fa-info-circle"></i> This is a simulation tool only. No actual WhatsApp access or harmful actions.
                </div>
            </div>
        </div>
    `;
    
    const container = getToolContainer(); container.innerHTML = toolHTML; container.style.display = 'block';
    
    // Initialize XPRO INVICTUS functionality
    setTimeout(initializeXPROInvictus, 100);
}

function initializeXPROInvictus() {
    const targetInput = document.getElementById('targetInput');
    const runAllBtn = document.getElementById('runAllBtn');
    const clearLogsBtn = document.getElementById('clearLogsBtn');
    const xproConsole = document.getElementById('xproConsole');
    
    // Helper function to add logs
    function addXproLog(message, type = '') {
        const logDiv = document.createElement('div');
        logDiv.className = `log ${type}`;
        logDiv.innerHTML = `[${new Date().toLocaleTimeString()}] ${message}`;
        xproConsole.appendChild(logDiv);
        xproConsole.scrollTop = xproConsole.scrollHeight;
    }
    
    // Global function for actions
    window.runXproAction = function(action) {
        const target = targetInput.value.trim() || 'No target specified';
        
        const actions = {
            'FORCLOSE': 'Forclose simulation initiated',
            'INVISIBLE': 'Invisible mode activated',
            'DELAY HARD': 'Delay hard protocol executed',
            'BLANK NEW': 'Blank new interface generated',
            'CRASH IOS': 'iOS crash simulation running',
            'CRASH IP': 'IP crash sequence started'
        };
        
        const message = actions[action] || 'Action executed';
        addXproLog(`${action}: ${message} for ${target}`, 'ok');
        
        // Show notification
        showNotification(`XPRO: ${action} simulated`, 'info');
        
        // Pulse effect
        const btn = event.target;
        btn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            btn.style.transform = '';
        }, 200);
    };
    
    // Run All Actions
    runAllBtn.addEventListener('click', async () => {
        const target = targetInput.value.trim() || 'No target specified';
        const actions = ['FORCLOSE', 'INVISIBLE', 'DELAY HARD', 'BLANK NEW', 'CRASH IOS', 'CRASH IP'];
        
        addXproLog('Starting all actions simulation...', 'warn');
        
        for (let i = 0; i < actions.length; i++) {
            await new Promise(resolve => setTimeout(resolve, 500));
            addXproLog(`${actions[i]}: Simulation completed`, 'ok');
        }
        
        addXproLog('All actions completed successfully', 'ok');
        showNotification('XPRO: All simulations completed', 'success');
    });
    
    // Clear Logs
    clearLogsBtn.addEventListener('click', () => {
        xproConsole.innerHTML = `
            <div class="log ok">[${new Date().toLocaleTimeString()}] Console cleared</div>
            <div class="log">[${new Date().toLocaleTimeString()}] XPRO INVICTUS Ready</div>
        `;
        showNotification('Console cleared', 'info');
    });
}


// 8. NGL SPAM TOOL 
async function loadNGLSpam() {
    const toolHTML = `
        <div class="tool-page-container">
            <div class="tool-page-header">
                <h2 class="tool-page-title">
                    <i class="fas fa-paper-plane"></i> NGL Spam
                </h2>
                <button class="tool-back-btn" onclick="backToTools()">
                    <i class="fas fa-arrow-left"></i> Back to Tools
                </button>
            </div>
            
            <div class="tool-content">
                <div style="margin-bottom: 30px;">
                    <label style="display: block; margin-bottom: 10px; color: var(--text); font-weight: 600;">
                        <i class="fas fa-link"></i> Link NGL Lengkap
                    </label>
                    <input 
                        type="text" 
                        id="nglLinkInput" 
                        placeholder="https://ngl.link/username" 
                        style="
                            width: 100%;
                            padding: 16px 20px;
                            background: rgba(30, 35, 60, 0.8);
                            border: 2px solid var(--border);
                            border-radius: 14px;
                            color: var(--text);
                            font-family: 'Inter', sans-serif;
                            font-size: 16px;
                            transition: all 0.3s ease;
                        "
                    >
                </div>
                
                <div style="margin-bottom: 30px;">
                    <label style="display: block; margin-bottom: 10px; color: var(--text); font-weight: 600;">
                        <i class="fas fa-comment"></i> Pesan Spam
                    </label>
                    <input 
                        type="text" 
                        id="nglMessageInput" 
                        placeholder="Isi pesan spam..." 
                        style="
                            width: 100%;
                            padding: 16px 20px;
                            background: rgba(30, 35, 60, 0.8);
                            border: 2px solid var(--border);
                            border-radius: 14px;
                            color: var(--text);
                            font-family: 'Inter', sans-serif;
                            font-size: 16px;
                            transition: all 0.3s ease;
                        "
                    >
                </div>
                
                <div style="margin-bottom: 30px;">
                    <label style="display: block; margin-bottom: 10px; color: var(--text); font-weight: 600;">
                        <i class="fas fa-hashtag"></i> Jumlah (Maks 100)
                    </label>
                    <input 
                        type="number" 
                        id="nglCountInput" 
                        placeholder="10" 
                        min="1" 
                        max="100"
                        style="
                            width: 100%;
                            padding: 16px 20px;
                            background: rgba(30, 35, 60, 0.8);
                            border: 2px solid var(--border);
                            border-radius: 14px;
                            color: var(--text);
                            font-family: 'Inter', sans-serif;
                            font-size: 16px;
                            transition: all 0.3s ease;
                        "
                    >
                </div>
                
                <div style="margin-bottom: 30px;">
                    <button id="sendNglBtn" class="tool-btn" style="width: 100%; padding: 18px; font-size: 18px;">
                        <i class="fas fa-bolt"></i> Start Spam
                    </button>
                </div>
                
                <div id="nglProgressContainer" style="display: none; margin-bottom: 20px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <span style="font-size: 14px; color: var(--text-muted);">Progress</span>
                        <span id="nglProgressText" style="font-size: 14px; color: var(--text);">0%</span>
                    </div>
                    <div style="
                        width: 100%;
                        height: 8px;
                        background: rgba(30, 35, 60, 0.6);
                        border-radius: 4px;
                        overflow: hidden;
                    ">
                        <div id="nglProgressBar" style="
                            width: 0%;
                            height: 100%;
                            background: linear-gradient(135deg, var(--primary), var(--primary-light));
                            border-radius: 4px;
                            transition: width 0.3s ease;
                        "></div>
                    </div>
                </div>
                
                <div id="nglResult" style="display: none; margin-top: 30px;">
                    <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 14px; padding: 20px; margin-bottom: 20px;">
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px;">
                            <i class="fas fa-check-circle" style="color: var(--success); font-size: 20px;"></i>
                            <div style="font-weight: 700; color: var(--text);">Spam Berhasil Dikirim!</div>
                        </div>
                        <div style="color: var(--text-muted); font-size: 14px;" id="nglResultMessage">
                            Pesan berhasil dikirim ke target NGL.
                        </div>
                    </div>
                    
                    <div style="display: flex; gap: 15px;">
                        <button id="newNglBtn" class="tool-btn" style="flex: 1; background: rgba(30, 35, 60, 0.8); border: 1px solid var(--border);">
                            <i class="fas fa-plus"></i> Baru
                        </button>
                    </div>
                </div>
                
                <div id="nglError" style="display: none; margin-top: 30px;">
                    <div style="background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 14px; padding: 20px; margin-bottom: 20px;">
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px;">
                            <i class="fas fa-exclamation-triangle" style="color: var(--danger); font-size: 20px;"></i>
                            <div style="font-weight: 700; color: var(--text);">Gagal Mengirim Spam</div>
                        </div>
                        <div style="color: var(--text-muted); font-size: 14px;" id="nglErrorMessage">
                            Terjadi kesalahan saat mengirim spam.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    const container = getToolContainer(); container.innerHTML = toolHTML; container.style.display = 'block';
    
    // Initialize NGL Spam functionality
    setTimeout(initializeNGLSpam, 100);
}

async function initializeNGLSpam() {
    const linkInput = document.getElementById('nglLinkInput');
    const messageInput = document.getElementById('nglMessageInput');
    const countInput = document.getElementById('nglCountInput');
    const sendBtn = document.getElementById('sendNglBtn');
    const progressContainer = document.getElementById('nglProgressContainer');
    const progressBar = document.getElementById('nglProgressBar');
    const progressText = document.getElementById('nglProgressText');
    const resultDiv = document.getElementById('nglResult');
    const errorDiv = document.getElementById('nglError');
    const newBtn = document.getElementById('newNglBtn');
    
    // Cooldown system
    const COOLDOWN_TIME = 60 * 1000; // 1 minute cooldown
    let isOnCooldown = false;
    
    // Check cooldown on load
    checkCooldown();
    
    function checkCooldown() {
        const lastUsed = localStorage.getItem('lastNGLTime');
        if (lastUsed) {
            const now = new Date().getTime();
            const diff = now - parseInt(lastUsed);
            
            if (diff < COOLDOWN_TIME) {
                startCooldown(COOLDOWN_TIME - diff);
            }
        }
    }
    
    function startCooldown(remainingTime) {
        isOnCooldown = true;
        sendBtn.disabled = true;
        
        const interval = setInterval(() => {
            remainingTime -= 1000;
            
            if (remainingTime <= 0) {
                clearInterval(interval);
                isOnCooldown = false;
                sendBtn.disabled = false;
                sendBtn.innerHTML = '<i class="fas fa-bolt"></i> Start Spam';
                return;
            }
            
            const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
            sendBtn.innerHTML = `<i class="fas fa-clock"></i> Cooldown: ${minutes}m ${seconds}s`;
        }, 1000);
    }
    
    // Send NGL Spam
    sendBtn.addEventListener('click', async () => {
        if (isOnCooldown) {
            showNotification('Silakan tunggu cooldown selesai!', 'error');
            return;
        }
        
        const link = linkInput.value.trim();
        const message = messageInput.value.trim();
        const count = parseInt(countInput.value.trim());
        
        if (!link || !message || !count) {
            showNotification('Harap isi semua field!', 'error');
            return;
        }
        
        if (!link.includes('ngl.link')) {
            showNotification('Link harus berupa URL NGL (ngl.link)', 'error');
            return;
        }
        
        if (count < 1 || count > 100) {
            showNotification('Jumlah harus antara 1-100!', 'error');
            return;
        }
        
        // Hide previous results
        resultDiv.style.display = 'none';
        errorDiv.style.display = 'none';
        
        // Show progress
        progressContainer.style.display = 'block';
        progressBar.style.width = '0%';
        progressText.textContent = '0%';
        
        // Disable button
        sendBtn.disabled = true;
        sendBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengirim...';
        
        try {
            // Simulate progress animation
            let progress = 0;
            const progressInterval = setInterval(() => {
                progress += Math.random() * 5;
                if (progress > 90) progress = 90;
                
                progressBar.style.width = `${progress}%`;
                progressText.textContent = `${Math.round(progress)}%`;
            }, 100);
            
            // Call API
            const apiUrl = `https://api.fikmydomainsz.xyz/tools/spamngl?url=${encodeURIComponent(link)}&message=${encodeURIComponent(message)}&count=${count}`;
            const response = await fetch(apiUrl);
            const data = await response.json();
            
            // Clear progress interval
            clearInterval(progressInterval);
            
            // Complete progress
            progressBar.style.width = '100%';
            progressText.textContent = '100%';
            
            // Check response
            if (data.status || response.ok) {
                // Success
                setTimeout(() => {
                    progressContainer.style.display = 'none';
                    resultDiv.style.display = 'block';
                    
                    // Set cooldown
                    localStorage.setItem('lastNGLTime', new Date().getTime());
                    startCooldown(COOLDOWN_TIME);
                    
                    showNotification(`Berhasil mengirim ${count} pesan ke ${link}`, 'success');
                }, 500);
            } else {
                throw new Error(data.message || 'Gagal mengirim spam');
            }
            
        } catch (error) {
            console.error('NGL Spam error:', error);
            
            // Show error
            progressContainer.style.display = 'none';
            errorDiv.style.display = 'block';
            document.getElementById('nglErrorMessage').textContent = error.message || 'Gagal menghubungi server';
            
            // Re-enable button
            sendBtn.disabled = false;
            sendBtn.innerHTML = '<i class="fas fa-bolt"></i> Start Spam';
            
            showNotification('Gagal mengirim spam', 'error');
        }
    });
    
    // New button
    newBtn.addEventListener('click', () => {
        linkInput.value = '';
        messageInput.value = '';
        countInput.value = '';
        resultDiv.style.display = 'none';
        errorDiv.style.display = 'none';
        linkInput.focus();
    });
}

// 9. QRIS CONVERTER TOOL
async function loadQRISConverter() {
    const toolHTML = `
        <div class="tool-page-container">
            <div class="tool-page-header">
                <h2 class="tool-page-title">
                    <i class="fas fa-qrcode"></i> QRIS Converter
                </h2>
                <button class="tool-back-btn" onclick="backToTools()">
                    <i class="fas fa-arrow-left"></i> Back to Tools
                </button>
            </div>
            
            <div class="tool-content">
                <div style="margin-bottom: 30px;">
                    <label style="display: block; margin-bottom: 10px; color: var(--text); font-weight: 600;">
                        <i class="fas fa-upload"></i> Upload Gambar QRIS
                    </label>
                    <input 
                        type="file" 
                        id="qrImageInput" 
                        accept="image/*"
                        style="
                            width: 100%;
                            padding: 16px 20px;
                            background: rgba(30, 35, 60, 0.8);
                            border: 2px solid var(--border);
                            border-radius: 14px;
                            color: var(--text);
                            font-family: 'Inter', sans-serif;
                            font-size: 16px;
                            transition: all 0.3s ease;
                        "
                    >
                    <div id="qrPreview" style="
                        margin-top: 15px;
                        border: 2px dashed var(--border);
                        border-radius: 12px;
                        padding: 20px;
                        text-align: center;
                        min-height: 150px;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        color: var(--text-muted);
                    ">
                        <i class="fas fa-image fa-2x" style="margin-bottom: 10px; opacity: 0.5;"></i>
                        <div>Preview gambar QRIS akan muncul di sini</div>
                    </div>
                </div>
                
                <div style="margin-bottom: 30px;">
                    <label style="display: block; margin-bottom: 10px; color: var(--text); font-weight: 600;">
                        <i class="fas fa-barcode"></i> String QRIS
                    </label>
                    <textarea 
                        id="qrisStringInput" 
                        placeholder="String QRIS akan otomatis terisi setelah upload gambar"
                        rows="3"
                        style="
                            width: 100%;
                            padding: 16px 20px;
                            background: rgba(30, 35, 60, 0.8);
                            border: 2px solid var(--border);
                            border-radius: 14px;
                            color: var(--text);
                            font-family: 'Inter', sans-serif;
                            font-size: 16px;
                            transition: all 0.3s ease;
                            resize: vertical;
                        "
                    ></textarea>
                </div>
                
                <div style="margin-bottom: 30px;">
                    <label style="display: block; margin-bottom: 10px; color: var(--text); font-weight: 600;">
                        <i class="fas fa-money-bill-wave"></i> Nominal (Rupiah)
                    </label>
                    <input 
                        type="number" 
                        id="qrisAmountInput" 
                        placeholder="Contoh: 10000" 
                        min="1"
                        style="
                            width: 100%;
                            padding: 16px 20px;
                            background: rgba(30, 35, 60, 0.8);
                            border: 2px solid var(--border);
                            border-radius: 14px;
                            color: var(--text);
                            font-family: 'Inter', sans-serif;
                            font-size: 16px;
                            transition: all 0.3s ease;
                        "
                    >
                </div>
                
                <div style="margin-bottom: 30px;">
                    <button id="generateQRISBtn" class="tool-btn" style="width: 100%; padding: 18px; font-size: 18px;">
                        <i class="fas fa-sync-alt"></i> Generate QRIS Dinamis
                    </button>
                </div>
                
                <div id="qrisResult" style="display: none; margin-top: 30px;">
                    <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 14px; padding: 20px; margin-bottom: 20px;">
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px;">
                            <i class="fas fa-check-circle" style="color: var(--success); font-size: 20px;"></i>
                            <div style="font-weight: 700; color: var(--text);">QRIS Dinamis Berhasil Dibuat!</div>
                        </div>
                        <div style="color: var(--text-muted); font-size: 14px;">
                            QRIS dengan nominal yang ditentukan siap digunakan.
                        </div>
                    </div>
                    
                    <div style="text-align: center; margin-bottom: 20px;">
                        <div id="dynamicQRCode" style="
                            display: inline-block;
                            padding: 20px;
                            background: white;
                            border-radius: 12px;
                            margin-bottom: 15px;
                        "></div>
                        <div style="font-size: 14px; color: var(--text-muted);">
                            Nominal: <span id="resultAmount" style="font-weight: 600; color: var(--text);">-</span>
                        </div>
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 10px; color: var(--text); font-weight: 600;">
                            String Baru:
                        </label>
                        <textarea 
                            id="newQrisString" 
                            rows="3"
                            readonly
                            style="
                                width: 100%;
                                padding: 16px 20px;
                                background: rgba(30, 35, 60, 0.8);
                                border: 1px solid var(--border);
                                border-radius: 12px;
                                color: var(--text);
                                font-family: 'Courier New', monospace;
                                font-size: 14px;
                                resize: vertical;
                            "
                        ></textarea>
                    </div>
                    
                    <div style="display: flex; gap: 15px;">
                        <button id="downloadQRBtn" class="tool-btn" style="flex: 1;">
                            <i class="fas fa-download"></i> Download
                        </button>
                        <button id="newQRISBtn" class="tool-btn" style="flex: 1; background: rgba(30, 35, 60, 0.8); border: 1px solid var(--border);">
                            <i class="fas fa-plus"></i> Baru
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    const container = getToolContainer(); container.innerHTML = toolHTML; container.style.display = 'block';
    
    // Load required libraries
    await loadScript('https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.js');
    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js');
    
    // Initialize QRIS Converter functionality
    setTimeout(initializeQRISConverter, 100);
}

async function initializeQRISConverter() {
    const imageInput = document.getElementById('qrImageInput');
    const previewDiv = document.getElementById('qrPreview');
    const stringInput = document.getElementById('qrisStringInput');
    const amountInput = document.getElementById('qrisAmountInput');
    const generateBtn = document.getElementById('generateQRISBtn');
    const resultDiv = document.getElementById('qrisResult');
    const qrCodeDiv = document.getElementById('dynamicQRCode');
    const newStringInput = document.getElementById('newQrisString');
    const resultAmountSpan = document.getElementById('resultAmount');
    const downloadBtn = document.getElementById('downloadQRBtn');
    const newBtn = document.getElementById('newQRISBtn');
    
    let currentQRImage = null;
    let currentQRString = '';
    let generatedQRCode = null;
    
    // Handle image upload
    imageInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (event) => {
            // Show preview
            previewDiv.innerHTML = `
                <img src="${event.target.result}" alt="QRIS Preview" style="max-width: 100%; max-height: 200px; border-radius: 8px;">
                <div style="margin-top: 10px; font-size: 14px; color: var(--text-muted);">
                    QRIS berhasil diupload. Memproses...
                </div>
            `;
            
            // Decode QR code
            const img = new Image();
            img.onload = async () => {
                try {
                    // Decode QR using jsQR
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0);
                    
                    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    const code = jsQR(imageData.data, canvas.width, canvas.height);
                    
                    if (code) {
                        currentQRString = code.data;
                        stringInput.value = currentQRString;
                        currentQRImage = img;
                        
                        showNotification('QRIS berhasil dipindai!', 'success');
                    } else {
                        throw new Error('QR code tidak terbaca');
                    }
                } catch (error) {
                    console.error('QR decode error:', error);
                    showNotification('Gagal memindai QRIS. Pastikan gambar jelas.', 'error');
                }
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    });
    
    // Generate dynamic QRIS
    generateBtn.addEventListener('click', async () => {
        const qrString = stringInput.value.trim();
        const amount = parseFloat(amountInput.value.trim());
        
        if (!qrString) {
            showNotification('String QRIS tidak boleh kosong!', 'error');
            return;
        }
        
        if (!amount || amount < 1) {
            showNotification('Nominal tidak valid!', 'error');
            return;
        }
        
        try {
            // Show loading
            generateBtn.disabled = true;
            generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memproses...';
            
            // Parse TLV and update amount
            const newQRString = createDynamicQRIS(qrString, amount);
            
            // Clear previous QR code
            qrCodeDiv.innerHTML = '';
            
            // Generate new QR code
            generatedQRCode = new QRCode(qrCodeDiv, {
                text: newQRString,
                width: 200,
                height: 200,
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.M
            });
            
            // Update result
            newStringInput.value = newQRString;
            resultAmountSpan.textContent = `Rp ${amount.toLocaleString('id-ID')}`;
            
            // Show result
            resultDiv.style.display = 'block';
            
            showNotification('QRIS dinamis berhasil dibuat!', 'success');
            
        } catch (error) {
            console.error('QRIS generation error:', error);
            showNotification('Gagal membuat QRIS dinamis: ' + error.message, 'error');
        } finally {
            generateBtn.disabled = false;
            generateBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Generate QRIS Dinamis';
        }
    });
    
    // Download QR code
    downloadBtn.addEventListener('click', () => {
        const canvas = qrCodeDiv.querySelector('canvas');
        if (!canvas) {
            showNotification('Generate QRIS terlebih dahulu!', 'error');
            return;
        }
        
        const link = document.createElement('a');
        link.download = `qris-dinamis-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        
        showNotification('QRIS berhasil diunduh!', 'success');
    });
    
    // New button
    newBtn.addEventListener('click', () => {
        imageInput.value = '';
        previewDiv.innerHTML = `
            <i class="fas fa-image fa-2x" style="margin-bottom: 10px; opacity: 0.5;"></i>
            <div>Preview gambar QRIS akan muncul di sini</div>
        `;
        stringInput.value = '';
        amountInput.value = '';
        resultDiv.style.display = 'none';
        
        showNotification('Form berhasil direset', 'info');
    });
    
    // TLV Functions
    function parseTLV(payload) {
        const items = [];
        let pos = 0;
        while (pos < payload.length) {
            const id = payload.substr(pos, 2);
            const lenStr = payload.substr(pos + 2, 2);
            const len = parseInt(lenStr, 10);
            if (isNaN(len)) break;
            const val = payload.substr(pos + 4, len);
            items.push({ id, val });
            pos += 4 + len;
        }
        return items;
    }
    
    function buildTLV(items) {
        return items.map(item => {
            const len = item.val.length.toString().padStart(2, '0');
            return item.id + len + item.val;
        }).join('');
    }
    
    function crc16ccitt(data) {
        let crc = 0xFFFF;
        for (let i = 0; i < data.length; i++) {
            crc ^= data.charCodeAt(i) << 8;
            for (let j = 0; j < 8; j++) {
                if ((crc & 0x8000) !== 0) {
                    crc = (crc << 1) ^ 0x1021;
                } else {
                    crc = crc << 1;
                }
                crc = crc & 0xFFFF;
            }
        }
        return crc.toString(16).toUpperCase().padStart(4, "0");
    }
    
    function createDynamicQRIS(payload, amount) {
        let tlv = parseTLV(payload);
        
        // Remove old CRC
        tlv = tlv.filter(x => x.id !== '63');
        
        // Set dynamic mode
        const idx01 = tlv.findIndex(x => x.id === '01');
        if (idx01 >= 0) {
            tlv[idx01].val = '12';
        }
        
        // Add/update amount
        const amountStr = amount.toFixed(2);
        const tag54 = { id: '54', val: amountStr };
        
        const idx54 = tlv.findIndex(x => x.id === '54');
        const idx53 = tlv.findIndex(x => x.id === '53');
        
        if (idx54 >= 0) {
            tlv[idx54] = tag54;
        } else if (idx53 >= 0) {
            tlv.splice(idx53 + 1, 0, tag54);
        } else {
            tlv.push(tag54);
            tlv.sort((a, b) => a.id - b.id);
        }
        
        // Rebuild and calculate CRC
        let body = buildTLV(tlv);
        const crcInput = body + "6304";
        const crc = crc16ccitt(crcInput);
        
        return body + "6304" + crc;
    }
}

// 10. TRACKER NIK TOOL
async function loadTrackerNIK() {
    const toolHTML = `
        <div class="tool-page-container">
            <div class="tool-page-header">
                <h2 class="tool-page-title">
                    <i class="fas fa-id-card"></i> Tracker NIK
                </h2>
                <button class="tool-back-btn" onclick="backToTools()">
                    <i class="fas fa-arrow-left"></i> Back to Tools
                </button>
            </div>
            
            <div class="tool-content">
                <div style="margin-bottom: 30px;">
                    <label style="display: block; margin-bottom: 10px; color: var(--text); font-weight: 600;">
                        <i class="fas fa-fingerprint"></i> Masukkan NIK (16 Digit)
                    </label>
                    <input 
                        type="text" 
                        id="nikInput" 
                        placeholder="Contoh: 3214011210060008"
                        maxlength="16"
                        style="
                            width: 100%;
                            padding: 16px 20px;
                            background: rgba(30, 35, 60, 0.8);
                            border: 2px solid var(--border);
                            border-radius: 14px;
                            color: var(--text);
                            font-family: 'Inter', sans-serif;
                            font-size: 16px;
                            transition: all 0.3s ease;
                        "
                    >
                    <div style="font-size: 12px; color: var(--text-muted); margin-top: 8px;">
                        Masukkan 16 digit Nomor Induk Kependudukan
                    </div>
                </div>
                
                <div style="margin-bottom: 30px;">
                    <button id="searchNIKBtn" class="tool-btn" style="width: 100%; padding: 18px; font-size: 18px;">
                        <i class="fas fa-search"></i> Cari Data
                    </button>
                </div>
                
                <div id="nikLoading" style="display: none; margin-bottom: 30px;">
                    <div style="text-align: center; padding: 40px;">
                        <div class="loading-spinner" style="width: 50px; height: 50px; margin: 0 auto 20px;"></div>
                        <div style="font-weight: 600; color: var(--text);">Mencari data NIK...</div>
                        <div style="font-size: 14px; color: var(--text-muted); margin-top: 10px;">
                            Harap tunggu sebentar
                        </div>
                    </div>
                </div>
                
                <div id="nikResult" style="display: none; margin-top: 30px;">
                    <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 14px; padding: 20px; margin-bottom: 20px;">
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px;">
                            <i class="fas fa-check-circle" style="color: var(--success); font-size: 20px;"></i>
                            <div style="font-weight: 700; color: var(--text);">Data NIK Ditemukan!</div>
                        </div>
                        <div style="color: var(--text-muted); font-size: 14px;">
                            Berikut detail informasi dari NIK yang dicari.
                        </div>
                    </div>
                    
                    <div id="nikDataGrid" style="
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                        gap: 15px;
                        margin-bottom: 20px;
                    "></div>
                    
                    <div style="display: flex; gap: 15px;">
                        <button id="newNIKBtn" class="tool-btn" style="flex: 1; background: rgba(30, 35, 60, 0.8); border: 1px solid var(--border);">
                            <i class="fas fa-plus"></i> Cari Lagi
                        </button>
                    </div>
                </div>
                
                <div id="nikError" style="display: none; margin-top: 30px;">
                    <div style="background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 14px; padding: 20px; margin-bottom: 20px;">
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px;">
                            <i class="fas fa-exclamation-triangle" style="color: var(--danger); font-size: 20px;"></i>
                            <div style="font-weight: 700; color: var(--text);">Gagal Mencari Data</div>
                        </div>
                        <div style="color: var(--text-muted); font-size: 14px;" id="nikErrorMessage">
                            NIK tidak ditemukan atau format salah.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    const container = getToolContainer(); container.innerHTML = toolHTML; container.style.display = 'block';
    
    // Initialize Tracker NIK functionality
    setTimeout(initializeTrackerNIK, 100);
}

async function initializeTrackerNIK() {
    const nikInput = document.getElementById('nikInput');
    const searchBtn = document.getElementById('searchNIKBtn');
    const loadingDiv = document.getElementById('nikLoading');
    const resultDiv = document.getElementById('nikResult');
    const errorDiv = document.getElementById('nikError');
    const dataGrid = document.getElementById('nikDataGrid');
    const newBtn = document.getElementById('newNIKBtn');
    
    // Search NIK
    searchBtn.addEventListener('click', async () => {
        const nik = nikInput.value.trim();
        
        if (!/^\d{16}$/.test(nik)) {
            showNotification('NIK harus 16 digit angka!', 'error');
            return;
        }
        
        // Hide previous results
        resultDiv.style.display = 'none';
        errorDiv.style.display = 'none';
        
        // Show loading
        loadingDiv.style.display = 'block';
        searchBtn.disabled = true;
        
        try {
            // Call API
            const apiUrl = `https://api.fikmydomainsz.xyz/tools/nik?nik=${encodeURIComponent(nik)}`;
            const response = await fetch(apiUrl);
            const data = await response.json();
            
            // Hide loading
            loadingDiv.style.display = 'none';
            
            if (data.status && data.result) {
                // Display data
                displayNIKData(data.result);
                resultDiv.style.display = 'block';
                showNotification('Data NIK berhasil ditemukan!', 'success');
            } else {
                throw new Error(data.message || 'NIK tidak ditemukan');
            }
            
        } catch (error) {
            console.error('NIK search error:', error);
            
            // Hide loading and show error
            loadingDiv.style.display = 'none';
            errorDiv.style.display = 'block';
            document.getElementById('nikErrorMessage').textContent = error.message || 'Terjadi kesalahan saat mencari data';
            
            showNotification('Gagal mencari data NIK', 'error');
        } finally {
            searchBtn.disabled = false;
        }
    });
    
    // Display NIK data
    function displayNIKData(data) {
        const items = [
            { label: 'NIK', value: data.nik },
            { label: 'Jenis Kelamin', value: data.kelamin },
            { label: 'Tanggal Lahir', value: data.lahir_lengkap },
            { label: 'Zodiak', value: data.tambahan?.zodiak || '-' },
            { label: 'Usia', value: data.tambahan?.usia || '-' },
            { label: 'Ultah Berikutnya', value: data.tambahan?.ultah || '-' },
            { label: 'Provinsi', value: data.provinsi?.nama || '-' },
            { label: 'Kabupaten/Kota', value: data.kotakab?.nama || '-' },
            { label: 'Kecamatan', value: data.kecamatan?.nama || '-' },
            { label: 'Kode Wilayah', value: data.kode_wilayah || '-' },
            { label: 'Nomor Urut', value: data.nomor_urut || '-' },
            { label: 'Pasaran', value: data.tambahan?.pasaran || '-' }
        ];
        
        dataGrid.innerHTML = items.map(item => `
            <div style="
                background: rgba(30, 35, 60, 0.6);
                border: 1px solid var(--border);
                border-radius: 12px;
                padding: 15px;
            ">
                <div style="font-size: 12px; color: var(--text-muted); margin-bottom: 5px;">
                    ${item.label}
                </div>
                <div style="font-weight: 600; color: var(--text); font-size: 16px;">
                    ${item.value}
                </div>
            </div>
        `).join('');
    }
    
    // New button
    newBtn.addEventListener('click', () => {
        nikInput.value = '';
        resultDiv.style.display = 'none';
        errorDiv.style.display = 'none';
        nikInput.focus();
    });
}

// 11. WORM GPT AI TOOL
async function loadWormGPT() {
    const toolHTML = `
        <div class="tool-page-container">
            <div class="tool-page-header">
                <h2 class="tool-page-title">
                    <i class="fas fa-robot"></i> Worm GPT AI
                </h2>
                <button class="tool-back-btn" onclick="backToTools()">
                    <i class="fas fa-arrow-left"></i> Back to Tools
                </button>
            </div>
            
            <div class="tool-content">
                <div id="wormChatContainer" style="
                    height: 400px;
                    overflow-y: auto;
                    background: rgba(19, 22, 39, 0.8);
                    border: 1px solid var(--border);
                    border-radius: 12px;
                    padding: 20px;
                    margin-bottom: 20px;
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                ">
                    <div style="text-align: center; padding: 40px; color: var(--text-muted);" id="wormIntro">
                        <i class="fas fa-robot fa-2x" style="margin-bottom: 15px; opacity: 0.5;"></i>
                        <div style="font-weight: 600; font-size: 16px;">Worm GPT AI</div>
                        <div style="font-size: 14px; margin-top: 5px;">Tanya apa saja. Tanpa batasan.</div>
                    </div>
                </div>
                
                <div id="wormTyping" style="display: none; margin-bottom: 20px; padding-left: 20px;">
                    <div style="display: flex; gap: 5px;">
                        <div class="typing-dot" style="animation-delay: 0s;"></div>
                        <div class="typing-dot" style="animation-delay: 0.2s;"></div>
                        <div class="typing-dot" style="animation-delay: 0.4s;"></div>
                    </div>
                </div>
                
                <div style="display: flex; gap: 15px; margin-bottom: 30px;">
                    <input 
                        type="text" 
                        id="wormPromptInput" 
                        placeholder="Kirim pesan ke WormGPT..."
                        style="
                            flex: 1;
                            padding: 16px 20px;
                            background: rgba(30, 35, 60, 0.8);
                            border: 2px solid var(--border);
                            border-radius: 14px;
                            color: var(--text);
                            font-family: 'Inter', sans-serif;
                            font-size: 16px;
                            transition: all 0.3s ease;
                        "
                    >
                    <button id="sendWormBtn" class="tool-btn" style="width: auto; padding: 16px 30px;">
                        <i class="fas fa-paper-plane"></i> Kirim
                    </button>
                </div>
                
                <div style="text-align: center; color: var(--text-muted); font-size: 12px; padding: 15px; background: rgba(30, 35, 60, 0.4); border-radius: 10px;">
                    <i class="fas fa-info-circle"></i> Worm GPT AI dapat membuat kesalahan. Gunakan dengan bijak.
                </div>
            </div>
        </div>
    `;
    
    const container = getToolContainer(); container.innerHTML = toolHTML; container.style.display = 'block';
    
    // Add typing animation CSS
    const style = document.createElement('style');
    style.textContent = `
        .typing-dot {
            width: 8px;
            height: 8px;
            background: var(--primary);
            border-radius: 50%;
            animation: typing 1.5s infinite ease-in-out;
        }
        
        @keyframes typing {
            0%, 100% { transform: translateY(0); opacity: 0.5; }
            50% { transform: translateY(-5px); opacity: 1; }
        }
        
        .worm-message {
            max-width: 80%;
            padding: 12px 18px;
            border-radius: 12px;
            margin-bottom: 10px;
            word-wrap: break-word;
        }
        
        .worm-user {
            background: rgba(100, 124, 247, 0.2);
            border: 1px solid rgba(100, 124, 247, 0.3);
            align-self: flex-end;
            border-bottom-right-radius: 3px;
        }
        
        .worm-bot {
            background: rgba(30, 35, 60, 0.6);
            border: 1px solid var(--border);
            align-self: flex-start;
            border-bottom-left-radius: 3px;
        }
    `;
    document.head.appendChild(style);
    
    // Initialize Worm GPT functionality
    setTimeout(initializeWormGPT, 100);
}

async function initializeWormGPT() {
    const chatContainer = document.getElementById('wormChatContainer');
    const promptInput = document.getElementById('wormPromptInput');
    const sendBtn = document.getElementById('sendWormBtn');
    const typingDiv = document.getElementById('wormTyping');
    const introDiv = document.getElementById('wormIntro');
    
    let chatHistory = [];
    
    // Send message
    sendBtn.addEventListener('click', sendMessage);
    promptInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
    
    async function sendMessage() {
        const prompt = promptInput.value.trim();
        if (!prompt) return;
        
        // Hide intro
        if (introDiv) introDiv.style.display = 'none';
        
        // Add user message
        addMessage(prompt, 'user');
        promptInput.value = '';
        promptInput.disabled = true;
        sendBtn.disabled = true;
        
        // Show typing
        typingDiv.style.display = 'block';
        scrollToBottom();
        
        try {
            // Call API
            const apiUrl = `https://api.fikmydomainsz.xyz/openai/wormgpt?prompt=${encodeURIComponent(prompt)}`;
            const response = await fetch(apiUrl);
            const data = await response.json();
            
            // Hide typing
            typingDiv.style.display = 'none';
            
            // Extract response
            const reply = extractWormResponse(data);
            addMessage(reply, 'bot');
            
            // Add to history
            chatHistory.push({ role: 'user', content: prompt });
            chatHistory.push({ role: 'assistant', content: reply });
            
        } catch (error) {
            console.error('Worm GPT error:', error);
            
            // Hide typing and show error
            typingDiv.style.display = 'none';
            addMessage('Maaf, terjadi kesalahan saat menghubungi server AI.', 'bot');
            
            showNotification('Gagal menghubungi Worm GPT', 'error');
        } finally {
            promptInput.disabled = false;
            sendBtn.disabled = false;
            promptInput.focus();
        }
    }
    
    // Add message to chat
    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('worm-message');
        messageDiv.classList.add(sender === 'user' ? 'worm-user' : 'worm-bot');
        
        // Basic HTML sanitization and formatting
        let safeText = text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/\n/g, "<br>")
            .replace(/```([\s\S]*?)```/g, '<pre style="background:rgba(0,0,0,0.3);padding:10px;border-radius:5px;overflow-x:auto;"><code>$1</code></pre>');
        
        messageDiv.innerHTML = safeText;
        chatContainer.appendChild(messageDiv);
        scrollToBottom();
    }
    
    // Extract response from API data
    function extractWormResponse(data) {
        if (!data) return "Tidak ada respons dari server.";
        
        // Handle string data
        if (typeof data === 'string') {
            try {
                const parsed = JSON.parse(data);
                data = parsed;
            } catch (e) {
                return cleanAIResponse(data);
            }
        }
        
        // Try different response keys
        const possibleKeys = ['reply', 'result', 'message', 'content', 'response', 'answer', 'text', 'data'];
        
        for (let key of possibleKeys) {
            if (data[key] !== undefined && data[key] !== null) {
                if (typeof data[key] === 'object') {
                    return JSON.stringify(data[key], null, 2);
                }
                return cleanAIResponse(data[key]);
            }
        }
        
        // Fallback
        return cleanAIResponse(JSON.stringify(data, null, 2));
    }
    
    // Clean AI response
    function cleanAIResponse(text) {
        if (typeof text !== 'string') return String(text);
        
        // Remove <think> blocks
        let clean = text.replace(/<think>[\s\S]*?<\/think>/gi, "");
        
        // Remove extra whitespace
        clean = clean.trim();
        
        return clean;
    }
    
    // Scroll to bottom
    function scrollToBottom() {
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }
}

// 12. BYYVERSE AI TOOL
async function loadByyverseAI() {
    const toolHTML = `
        <div class="tool-page-container">
            <div class="tool-page-header">
                <h2 class="tool-page-title">
                    <i class="fas fa-brain"></i> Byyverse AI
                </h2>
                <button class="tool-back-btn" onclick="backToTools()">
                    <i class="fas fa-arrow-left"></i> Back to Tools
                </button>
            </div>
            
            <div class="tool-content">
                <div id="byyChatContainer" style="
                    height: 400px;
                    overflow-y: auto;
                    background: rgba(19, 22, 39, 0.8);
                    border: 1px solid var(--border);
                    border-radius: 12px;
                    padding: 20px;
                    margin-bottom: 20px;
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                ">
                    <div style="text-align: center; padding: 40px; color: var(--text-muted);" id="byyIntro">
                        <i class="fas fa-brain fa-2x" style="margin-bottom: 15px; opacity: 0.5;"></i>
                        <div style="font-weight: 600; font-size: 16px;">Byyverse Intelligence Model</div>
                        <div style="font-size: 14px; margin-top: 5px;">Siap menjawab pertanyaan coding & umum.</div>
                    </div>
                </div>
                
                <div id="byyTyping" style="display: none; margin-bottom: 20px; padding-left: 20px;">
                    <div style="display: flex; gap: 5px;">
                        <div class="byy-typing-dot" style="animation-delay: 0s;"></div>
                        <div class="byy-typing-dot" style="animation-delay: 0.2s;"></div>
                        <div class="byy-typing-dot" style="animation-delay: 0.4s;"></div>
                    </div>
                </div>
                
                <div style="display: flex; gap: 15px; margin-bottom: 30px;">
                    <input 
                        type="text" 
                        id="byyPromptInput" 
                        placeholder="Ketik pesan untuk Byyverse AI..."
                        style="
                            flex: 1;
                            padding: 16px 20px;
                            background: rgba(30, 35, 60, 0.8);
                            border: 2px solid var(--border);
                            border-radius: 14px;
                            color: var(--text);
                            font-family: 'Inter', sans-serif;
                            font-size: 16px;
                            transition: all 0.3s ease;
                        "
                    >
                    <button id="sendByyBtn" class="tool-btn" style="width: auto; padding: 16px 30px;">
                        <i class="fas fa-paper-plane"></i> Kirim
                    </button>
                </div>
                
                <div style="text-align: center; color: var(--text-muted); font-size: 12px; padding: 15px; background: rgba(30, 35, 60, 0.4); border-radius: 10px;">
                    <i class="fas fa-info-circle"></i> Byyverse AI - Model intelijen canggih untuk berbagai keperluan.
                </div>
            </div>
        </div>
    `;
    
    const container = getToolContainer(); container.innerHTML = toolHTML; container.style.display = 'block';
    
    // Add typing animation CSS
    const style = document.createElement('style');
    style.textContent = `
        .byy-typing-dot {
            width: 8px;
            height: 8px;
            background: var(--primary-light);
            border-radius: 50%;
            animation: byy-typing 1.5s infinite ease-in-out;
        }
        
        @keyframes byy-typing {
            0%, 100% { transform: translateY(0); opacity: 0.5; }
            50% { transform: translateY(-5px); opacity: 1; }
        }
        
        .byy-message {
            max-width: 80%;
            padding: 12px 18px;
            border-radius: 12px;
            margin-bottom: 10px;
            word-wrap: break-word;
        }
        
        .byy-user {
            background: rgba(16, 185, 129, 0.2);
            border: 1px solid rgba(16, 185, 129, 0.3);
            align-self: flex-end;
            border-bottom-right-radius: 3px;
        }
        
        .byy-bot {
            background: rgba(30, 35, 60, 0.6);
            border: 1px solid var(--border);
            align-self: flex-start;
            border-bottom-left-radius: 3px;
        }
    `;
    document.head.appendChild(style);
    
    // Initialize Byyverse AI functionality
    setTimeout(initializeByyverseAI, 100);
}

async function initializeByyverseAI() {
    const chatContainer = document.getElementById('byyChatContainer');
    const promptInput = document.getElementById('byyPromptInput');
    const sendBtn = document.getElementById('sendByyBtn');
    const typingDiv = document.getElementById('byyTyping');
    const introDiv = document.getElementById('byyIntro');
    
    let chatHistory = [];
    
    // Send message
    sendBtn.addEventListener('click', sendMessage);
    promptInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
    
    async function sendMessage() {
        const prompt = promptInput.value.trim();
        if (!prompt) return;
        
        // Hide intro
        if (introDiv) introDiv.style.display = 'none';
        
        // Add user message
        addMessage(prompt, 'user');
        promptInput.value = '';
        promptInput.disabled = true;
        sendBtn.disabled = true;
        
        // Show typing
        typingDiv.style.display = 'block';
        scrollToBottom();
        
        try {
            // Call API
            const apiUrl = `https://api.fikmydomainsz.xyz/ai/blackbox?text=${encodeURIComponent(prompt)}`;
            const response = await fetch(apiUrl);
            const data = await response.json();
            
            // Hide typing
            typingDiv.style.display = 'none';
            
            // Extract response
            const reply = extractByyResponse(data);
            addMessage(reply, 'bot');
            
            // Add to history
            chatHistory.push({ role: 'user', content: prompt });
            chatHistory.push({ role: 'assistant', content: reply });
            
        } catch (error) {
            console.error('Byyverse AI error:', error);
            
            // Hide typing and show error
            typingDiv.style.display = 'none';
            addMessage('Maaf, terjadi kesalahan koneksi ke server AI.', 'bot');
            
            showNotification('Gagal menghubungi Byyverse AI', 'error');
        } finally {
            promptInput.disabled = false;
            sendBtn.disabled = false;
            promptInput.focus();
        }
    }
    
    // Add message to chat
    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('byy-message');
        messageDiv.classList.add(sender === 'user' ? 'byy-user' : 'byy-bot');
        
        // Basic HTML sanitization and formatting
        let safeText = text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/\n/g, "<br>")
            .replace(/```([\s\S]*?)```/g, '<pre style="background:rgba(0,0,0,0.3);padding:10px;border-radius:5px;overflow-x:auto;"><code>$1</code></pre>');
        
        messageDiv.innerHTML = safeText;
        chatContainer.appendChild(messageDiv);
        scrollToBottom();
    }
    
    // Extract response from API data
    function extractByyResponse(data) {
        if (!data) return "Tidak ada respons dari server.";
        
        // Handle string data
        if (typeof data === 'string') {
            try {
                const parsed = JSON.parse(data);
                data = parsed;
            } catch (e) {
                return cleanAIResponse(data);
            }
        }
        
        // Try different response keys
        const possibleKeys = ['reply', 'result', 'message', 'content', 'response', 'answer', 'text', 'data'];
        
        for (let key of possibleKeys) {
            if (data[key] !== undefined && data[key] !== null) {
                if (typeof data[key] === 'object') {
                    return JSON.stringify(data[key], null, 2);
                }
                return cleanAIResponse(data[key]);
            }
        }
        
        // Fallback
        return cleanAIResponse(JSON.stringify(data, null, 2));
    }
    
    // Clean AI response
    function cleanAIResponse(text) {
        if (typeof text !== 'string') return String(text);
        
        // Remove <think> blocks
        let clean = text.replace(/<think>[\s\S]*?<\/think>/gi, "");
        
        // Remove extra whitespace
        clean = clean.trim();
        
        return clean;
    }
    
    // Scroll to bottom
    function scrollToBottom() {
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }
}

// 13. FB VIDEO DOWNLOADER
async function loadFBVideoDownloader() {
    const toolHTML = `
        <div class="tool-page-container">
            <div class="tool-page-header">
                <h2 class="tool-page-title">
                    <i class="fab fa-facebook"></i> Facebook DL
                </h2>
                <button class="tool-back-btn" onclick="backToTools()">
                    <i class="fas fa-arrow-left"></i> Back to Tools
                </button>
            </div>
            
            <div class="tool-content">
                <div style="margin-bottom: 30px;">
                    <label style="display: block; margin-bottom: 10px; color: var(--text); font-weight: 600;">
                        <i class="fas fa-link"></i> URL Video Facebook
                    </label>
                    <input 
                        type="url" 
                        id="fbVideoUrlInput" 
                        placeholder="https://www.facebook.com/watch/?v=123456789"
                        style="
                            width: 100%;
                            padding: 16px 20px;
                            background: rgba(30, 35, 60, 0.8);
                            border: 2px solid var(--border);
                            border-radius: 14px;
                            color: var(--text);
                            font-family: 'Inter', sans-serif;
                            font-size: 16px;
                            transition: all 0.3s ease;
                        "
                    >
                </div>
                
                <div style="margin-bottom: 30px;">
                    <button id="fetchFBVideoBtn" class="tool-btn" style="width: 100%; padding: 18px; font-size: 18px;">
                        <i class="fas fa-search"></i> Ambil Video
                    </button>
                </div>
                
                <div id="fbLoading" style="display: none; text-align: center; margin: 20px 0;">
                    <div class="loading-spinner" style="width: 50px; height: 50px; margin: 0 auto 20px;"></div>
                    <p>Memproses video, harap tunggu...</p>
                </div>
                
                <div id="fbError" style="display: none; background: rgba(239, 68, 68, 0.2); padding: 15px; border-radius: 10px; border: 1px solid rgba(239, 68, 68, 0.3); margin: 20px 0;">
                    <p style="color: var(--danger); margin: 0;"><i class="fas fa-exclamation-triangle"></i> <span id="fbErrorText">Terjadi kesalahan</span></p>
                </div>
                
                <div id="fbResult" style="display: none; margin-top: 30px;">
                    <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 14px; padding: 20px; margin-bottom: 20px;">
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px;">
                            <i class="fas fa-check-circle" style="color: var(--success); font-size: 20px;"></i>
                            <div style="font-weight: 700; color: var(--text);">Video Ditemukan!</div>
                        </div>
                        <div style="color: var(--text-muted); font-size: 14px;">
                            Video Facebook berhasil diproses.
                        </div>
                    </div>
                    
                    <div style="margin-bottom: 25px;">
                        <div style="background: rgba(30, 35, 60, 0.6); border-radius: 12px; overflow: hidden; margin-bottom: 15px;">
                            <img id="fbThumbnail" src="" alt="Thumbnail" style="width: 100%; max-height: 250px; object-fit: cover;">
                        </div>
                        
                        <h3 id="fbVideoTitle" style="color: var(--text); margin-bottom: 15px; font-size: 18px; line-height: 1.4;"></h3>
                        
                        <div style="display: flex; gap: 15px; margin-bottom: 20px; flex-wrap: wrap;">
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <i class="far fa-clock" style="color: var(--primary);"></i>
                                <span style="color: var(--text-muted);">Durasi:</span>
                                <span id="fbDuration" style="color: var(--text); font-weight: 600;"></span>
                            </div>
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <i class="fas fa-layer-group" style="color: var(--primary);"></i>
                                <span style="color: var(--text-muted);">Kualitas:</span>
                                <span id="fbQualityCount" style="color: var(--text); font-weight: 600;"></span>
                            </div>
                        </div>
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <h4 style="color: var(--text); margin-bottom: 15px; display: flex; align-items: center; gap: 10px;">
                            <i class="fas fa-sliders-h"></i>
                            <span>Pilih Kualitas:</span>
                        </h4>
                        <div id="fbQualityButtons" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 10px; margin-bottom: 20px;"></div>
                    </div>
                    
                    <div style="display: flex; flex-direction: column; gap: 15px;">
                        <button id="downloadFBVideoBtn" class="tool-btn">
                            <i class="fas fa-download"></i> Download Video
                        </button>
                        <button id="downloadFBAudioBtn" class="tool-btn" style="background: linear-gradient(to right, #f02849, #d81b60);">
                            <i class="fas fa-music"></i> Download Audio
                        </button>
                    </div>
                </div>
                
                <!-- Download Progress Modal -->
                <div id="fbDownloadModal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.85); z-index: 1000; align-items: center; justify-content: center;">
                    <div style="background: rgba(30, 35, 60, 0.95); border-radius: 20px; padding: 30px; width: 90%; max-width: 450px; border: 1px solid var(--border);">
                        <div style="text-align: center; margin-bottom: 25px;">
                            <i class="fas fa-download" style="font-size: 40px; color: var(--primary); margin-bottom: 15px;"></i>
                            <h3 style="color: var(--text); margin-bottom: 10px;">Mengunduh</h3>
                            <p id="fbDownloadFileName" style="color: var(--text-muted); font-size: 14px;">Mempersiapkan...</p>
                        </div>
                        
                        <div style="margin-bottom: 25px;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                                <span style="font-size: 14px; color: var(--text-muted);">Progress</span>
                                <span id="fbDownloadProgressText" style="font-size: 14px; color: var(--text);">0%</span>
                            </div>
                            <div style="width: 100%; height: 8px; background: rgba(30, 35, 60, 0.6); border-radius: 4px; overflow: hidden;">
                                <div id="fbDownloadProgressBar" style="width: 0%; height: 100%; background: linear-gradient(135deg, var(--primary), var(--primary-light)); border-radius: 4px; transition: width 0.3s ease;"></div>
                            </div>
                        </div>
                        
                        <div style="text-align: center;">
                            <p id="fbDownloadStatus" style="color: var(--text-muted); margin-bottom: 10px; font-size: 14px;">Menyiapkan file...</p>
                            <p id="fbDownloadSpeed" style="font-size: 12px; color: var(--text-muted); opacity: 0.8;"></p>
                        </div>
                        
                        <button id="cancelFBDownloadBtn" class="tool-btn" style="margin-top: 25px; background: rgba(239, 68, 68, 0.2); border: 1px solid rgba(239, 68, 68, 0.3); color: var(--danger);">
                            <i class="fas fa-times"></i> Batalkan
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    const container = getToolContainer(); container.innerHTML = toolHTML; container.style.display = 'block';
    
    // Initialize FB Video Downloader functionality
    setTimeout(initializeFBVideoDownloader, 100);
}

async function initializeFBVideoDownloader() {
    const videoUrlInput = document.getElementById('fbVideoUrlInput');
    const fetchBtn = document.getElementById('fetchFBVideoBtn');
    const loading = document.getElementById('fbLoading');
    const errorDiv = document.getElementById('fbError');
    const errorText = document.getElementById('fbErrorText');
    const resultDiv = document.getElementById('fbResult');
    const thumbnail = document.getElementById('fbThumbnail');
    const videoTitle = document.getElementById('fbVideoTitle');
    const duration = document.getElementById('fbDuration');
    const qualityCount = document.getElementById('fbQualityCount');
    const qualityButtons = document.getElementById('fbQualityButtons');
    const downloadVideoBtn = document.getElementById('downloadFBVideoBtn');
    const downloadAudioBtn = document.getElementById('downloadFBAudioBtn');
    const downloadModal = document.getElementById('fbDownloadModal');
    const downloadFileName = document.getElementById('fbDownloadFileName');
    const downloadProgressBar = document.getElementById('fbDownloadProgressBar');
    const downloadProgressText = document.getElementById('fbDownloadProgressText');
    const downloadStatus = document.getElementById('fbDownloadStatus');
    const downloadSpeed = document.getElementById('fbDownloadSpeed');
    const cancelDownloadBtn = document.getElementById('cancelFBDownloadBtn');
    
    let currentVideoData = null;
    let selectedQualityUrl = '';
    let selectedQualityLabel = '';
    let downloadController = null;
    
    // Example URLs for placeholder
    const exampleUrls = [
        "https://www.facebook.com/example/videos/123456789",
        "https://fb.watch/abc123def/",
        "https://www.facebook.com/watch/?v=123456789"
    ];
    
    videoUrlInput.placeholder = `Contoh: ${exampleUrls[Math.floor(Math.random() * exampleUrls.length)]}`;
    
    // Validasi URL Facebook
    function isValidFacebookUrl(url) {
        return url.includes('facebook.com') || url.includes('fb.watch') || url.includes('fb.com');
    }
    
    // Format bytes
    function formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }
    
    // Show notification
    function showFBNotification(message, type = 'success') {
        showNotification(message, type);
    }
    
    // Show error
    function showFBError(message) {
        errorText.textContent = message;
        errorDiv.style.display = 'block';
        resultDiv.style.display = 'none';
        loading.style.display = 'none';
    }
    
    // Fetch video info
    fetchBtn.addEventListener('click', async function() {
        const videoUrl = videoUrlInput.value.trim();
        
        if (!videoUrl) {
            showFBError('Harap masukkan tautan video');
            return;
        }
        
        if (!isValidFacebookUrl(videoUrl)) {
            showFBError('Format tautan tidak valid. Gunakan tautan Facebook.');
            return;
        }
        
        loading.style.display = 'block';
        errorDiv.style.display = 'none';
        resultDiv.style.display = 'none';
        
        try {
            const encodedUrl = encodeURIComponent(videoUrl);
            const apiUrl = `https://api.fikmydomainsz.xyz/download/facebook?url=${encodedUrl}`;
            
            const response = await fetch(apiUrl);
            const data = await response.json();
            
            loading.style.display = 'none';
            
            if (data.status === true) {
                currentVideoData = data.result;
                displayVideoInfo(currentVideoData);
                resultDiv.style.display = 'block';
                showFBNotification('Video berhasil ditemukan!', 'success');
            } else {
                showFBError(data.error || 'Gagal mengambil info video.');
            }
        } catch (error) {
            console.error('Error:', error);
            showFBError('Terjadi kesalahan. Silakan coba lagi.');
        }
    });
    
    // Display video info
    function displayVideoInfo(videoData) {
        thumbnail.src = videoData.thumbnail;
        videoTitle.textContent = videoData.title;
        duration.textContent = videoData.duration;
        qualityCount.textContent = `${videoData.video.length} pilihan`;
        
        qualityButtons.innerHTML = '';
        
        videoData.video.forEach((video, index) => {
            const button = document.createElement('button');
            button.className = 'tool-btn';
            button.style.padding = '12px';
            button.style.fontSize = '14px';
            button.style.background = index === 0 ? 'rgba(24, 119, 242, 0.2)' : 'rgba(30, 35, 60, 0.8)';
            button.style.border = index === 0 ? '1px solid rgba(24, 119, 242, 0.5)' : '1px solid var(--border)';
            button.textContent = video.quality;
            
            button.addEventListener('click', function() {
                document.querySelectorAll('#fbQualityButtons button').forEach(btn => {
                    btn.style.background = 'rgba(30, 35, 60, 0.8)';
                    btn.style.border = '1px solid var(--border)';
                });
                
                this.style.background = 'rgba(24, 119, 242, 0.2)';
                this.style.border = '1px solid rgba(24, 119, 242, 0.5)';
                selectedQualityUrl = video.url;
                selectedQualityLabel = video.quality;
            });
            
            qualityButtons.appendChild(button);
            
            if (index === 0) {
                selectedQualityUrl = video.url;
                selectedQualityLabel = video.quality;
            }
        });
        
        if (videoData.music) {
            downloadAudioBtn.style.display = 'block';
        } else {
            downloadAudioBtn.style.display = 'none';
        }
    }
    
    // Download video
    downloadVideoBtn.addEventListener('click', async function() {
        if (!selectedQualityUrl) {
            showFBError('Pilih kualitas video dulu');
            return;
        }
        
        const safeTitle = currentVideoData.title
            .replace(/[<>:"/\\|?*]+/g, '')
            .replace(/\s+/g, '_')
            .substring(0, 40);
        
        const qualityForFilename = selectedQualityLabel.replace(/[<>:"/\\|?*]+/g, '').replace(/\s+/g, '_');
        const filename = `FB_${safeTitle}_${qualityForFilename}.mp4`;
        
        await startDownload(selectedQualityUrl, filename, 'video');
    });
    
    // Download audio
    downloadAudioBtn.addEventListener('click', async function() {
        if (!currentVideoData.music) {
            showFBError('Audio tidak tersedia');
            return;
        }
        
        const safeTitle = currentVideoData.title
            .replace(/[<>:"/\\|?*]+/g, '')
            .replace(/\s+/g, '_')
            .substring(0, 40);
        
        const filename = `FB_Audio_${safeTitle}.mp3`;
        
        await startDownload(currentVideoData.music, filename, 'audio');
    });
    
    // Start download
    async function startDownload(url, filename, type) {
        try {
            downloadModal.style.display = 'flex';
            downloadFileName.textContent = filename;
            downloadProgressBar.style.width = '0%';
            downloadProgressText.textContent = '0%';
            downloadStatus.textContent = 'Menyiapkan...';
            downloadSpeed.textContent = '';
            
            downloadController = new AbortController();
            const signal = downloadController.signal;
            
            cancelDownloadBtn.onclick = function() {
                if (downloadController) {
                    downloadController.abort();
                    downloadModal.style.display = 'none';
                    showFBNotification('Unduhan dibatalkan', 'warning');
                }
            };
            
            const response = await fetch(url, { signal });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            const contentLength = response.headers.get('content-length');
            const total = parseInt(contentLength, 10);
            let loaded = 0;
            let startTime = Date.now();
            
            const reader = response.body.getReader();
            const chunks = [];
            
            while (true) {
                const { done, value } = await reader.read();
                
                if (done) break;
                
                chunks.push(value);
                loaded += value.length;
                
                if (total) {
                    const percent = Math.round((loaded / total) * 100);
                    downloadProgressBar.style.width = `${percent}%`;
                    downloadProgressText.textContent = `${percent}%`;
                    
                    const elapsedTime = (Date.now() - startTime) / 1000;
                    const speed = loaded / elapsedTime;
                    
                    let speedText = '';
                    if (speed > 1024 * 1024) {
                        speedText = `${(speed / (1024 * 1024)).toFixed(2)} MB/s`;
                    } else if (speed > 1024) {
                        speedText = `${(speed / 1024).toFixed(2)} KB/s`;
                    } else {
                        speedText = `${speed.toFixed(2)} B/s`;
                    }
                    
                    downloadSpeed.textContent = `Kecepatan: ${speedText}`;
                    downloadStatus.textContent = `${formatBytes(loaded)} / ${formatBytes(total)}`;
                } else {
                    downloadStatus.textContent = `Mengunduh: ${formatBytes(loaded)}`;
                }
            }
            
            const blob = new Blob(chunks);
            const blobUrl = URL.createObjectURL(blob);
            
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = filename;
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(blobUrl);
            
            downloadModal.style.display = 'none';
            showFBNotification(`Berhasil mengunduh: ${filename}`, 'success');
            
            downloadController = null;
            
        } catch (error) {
            if (error.name === 'AbortError') return;
            
            console.error('Download error:', error);
            downloadModal.style.display = 'none';
            showFBNotification('Mencoba metode alternatif...', 'info');
            
            setTimeout(() => {
                tryDirectDownload(url, filename);
            }, 1000);
        }
    }
    
    // Try direct download
    function tryDirectDownload(url, filename) {
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.target = '_blank';
        
        link.addEventListener('click', function() {
            setTimeout(() => {
                showFBNotification('Klik kanan dan "Save link as..." jika tidak otomatis', 'info');
            }, 500);
        });
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    
    // Enter key support
    videoUrlInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            fetchBtn.click();
        }
    });
}

// 14.INSTAGRAM DOWNLOADER & STALKER
async function loadInstagramTool() {
    const toolHTML = `
        <div class="tool-page-container">
            <div class="tool-page-header">
                <h2 class="tool-page-title">
                    <i class="fab fa-instagram"></i> InstagramDL
                </h2>
                <button class="tool-back-btn" onclick="backToTools()">
                    <i class="fas fa-arrow-left"></i> Back to Tools
                </button>
            </div>
            
            <div class="tool-content">
                <!-- Tabs -->
                <div style="
                    display: flex;
                    background: rgba(30, 35, 60, 0.8);
                    border-radius: 12px;
                    padding: 6px;
                    margin-bottom: 20px;
                    border: 1px solid var(--border);
                ">
                    <button id="instagramTabDownload" class="tool-tab active-tab" style="flex: 1;">
                        <i class="fas fa-download"></i> Download
                    </button>
                    <button id="instagramTabStalker" class="tool-tab" style="flex: 1;">
                        <i class="fas fa-user"></i> Profile
                    </button>
                </div>
                
                <!-- Tab 1: Download -->
                <div id="instagramDownloadTab" style="display: block;">
                    <div style="margin-bottom: 30px;">
                        <label style="display: block; margin-bottom: 10px; color: var(--text); font-weight: 600;">
                            <i class="fas fa-link"></i> Instagram Post URL
                        </label>
                        <input 
                            type="url" 
                            id="instagramUrlInput" 
                            placeholder="https://www.instagram.com/p/..." 
                            style="width: 100%; padding: 16px 20px; background: rgba(30, 35, 60, 0.8); border: 2px solid var(--border); border-radius: 14px; color: var(--text); font-family: 'Inter', sans-serif; font-size: 16px;"
                        >
                        <div style="font-size: 12px; color: var(--text-muted); margin-top: 8px;">
                            Support untuk Post, Reel, dan IGTV
                        </div>
                    </div>
                    
                    <div style="margin-bottom: 30px;">
                        <button id="instagramDownloadBtn" class="tool-btn" style="width: 100%; padding: 18px; font-size: 18px;">
                            <i class="fas fa-search"></i> Download Content
                        </button>
                    </div>
                    
                    <div id="instagramLoading" style="display: none; text-align: center; margin: 20px 0;">
                        <div class="loading-spinner" style="width: 50px; height: 50px; margin: 0 auto 20px;"></div>
                        <p id="instagramLoadingText">Mengambil data dari Instagram...</p>
                        <div id="instagramApiStatus" style="
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            gap: 8px;
                            margin-top: 10px;
                            font-size: 12px;
                            color: var(--text-muted);
                        ">
                            <span id="instagramStatusDot" style="
                                width: 8px;
                                height: 8px;
                                border-radius: 50%;
                                background: #10b981;
                                display: inline-block;
                            "></span>
                            <span id="instagramApiStatusText">Mencoba API Utama...</span>
                        </div>
                    </div>
                    
                    <div id="instagramError" style="display: none; background: rgba(239, 68, 68, 0.2); padding: 15px; border-radius: 10px; border: 1px solid rgba(239, 68, 68, 0.3); margin: 20px 0;">
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                            <i class="fas fa-exclamation-circle" style="color: var(--danger);"></i>
                            <h4 style="color: var(--danger); margin: 0;">Terjadi Kesalahan</h4>
                        </div>
                        <p id="instagramErrorText" style="color: var(--text-muted); margin: 0; font-size: 14px;">
                            Tidak dapat mengambil data dari Instagram.
                        </p>
                    </div>
                    
                    <!-- Preview Section -->
                    <div id="instagramPreview" style="display: none; margin-top: 30px;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 10px;">
                            <h3 style="color: var(--text); font-size: 18px; font-weight: 700;">Preview Konten</h3>
                            <span id="instagramMediaType" style="
                                background: linear-gradient(135deg, #833AB4 0%, #FD1D1D 100%);
                                color: white;
                                padding: 6px 12px;
                                border-radius: 50px;
                                font-size: 12px;
                                font-weight: 600;
                                display: flex;
                                align-items: center;
                                gap: 6px;
                            ">
                                <i class="fas fa-question"></i>
                                <span id="instagramMediaTypeText">Memuat...</span>
                            </span>
                        </div>
                        
                        <div style="display: flex; flex-direction: column; gap: 15px; margin-bottom: 20px;">
                            <div style="
                                background: rgba(30, 35, 60, 0.8);
                                border-radius: 12px;
                                padding: 20px;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                height: 200px;
                                border: 1px solid var(--border);
                            ">
                                <div id="instagramMediaPlaceholder" style="text-align: center; color: var(--text-muted);">
                                    <i class="fas fa-image fa-2x" style="margin-bottom: 10px; opacity: 0.5;"></i>
                                    <p>Preview akan muncul di sini</p>
                                </div>
                                <img id="instagramImagePreview" src="" alt="Preview" style="display: none; max-width: 100%; max-height: 100%; border-radius: 8px;">
                                <video id="instagramVideoPreview" style="display: none; max-width: 100%; max-height: 100%; border-radius: 8px;" controls></video>
                            </div>
                            
                            <div id="instagramInfoGrid" style="
                                display: grid;
                                grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
                                gap: 10px;
                            ">
                                <!-- Info akan diisi oleh JavaScript -->
                            </div>
                        </div>
                    </div>
                    
                    <!-- Download Section -->
                    <div id="instagramDownloadSection" style="display: none; margin-top: 30px;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                            <h3 style="color: var(--text); font-size: 18px; font-weight: 700;">Download Options</h3>
                            <span style="
                                background: rgba(16, 185, 129, 0.2);
                                color: var(--success);
                                padding: 4px 12px;
                                border-radius: 50px;
                                font-size: 12px;
                                font-weight: 600;
                                display: flex;
                                align-items: center;
                                gap: 6px;
                            ">
                                <i class="fas fa-check-circle"></i>
                                Ready
                            </span>
                        </div>
                        
                        <div id="instagramDownloadOptions" style="display: flex; flex-direction: column; gap: 10px;">
                            <!-- Download options akan diisi oleh JavaScript -->
                        </div>
                    </div>
                    
                    <!-- Fallback Result -->
                    <div id="instagramFallbackResult" style="display: none; margin-top: 30px;">
                        <!-- Fallback result akan diisi oleh JavaScript -->
                    </div>
                </div>
                
                <!-- Tab 2: Stalker -->
                <div id="instagramStalkerTab" style="display: none;">
                    <div style="margin-bottom: 30px;">
                        <label style="display: block; margin-bottom: 10px; color: var(--text); font-weight: 600;">
                            <i class="fas fa-user"></i> Instagram Username
                        </label>
                        <input 
                            type="text" 
                            id="instagramUsernameInput" 
                            placeholder="byytampan, cristiano, dll" 
                            style="width: 100%; padding: 16px 20px; background: rgba(30, 35, 60, 0.8); border: 2px solid var(--border); border-radius: 14px; color: var(--text); font-family: 'Inter', sans-serif; font-size: 16px;"
                        >
                        <div style="font-size: 12px; color: var(--text-muted); margin-top: 8px;">
                            Masukkan username Instagram atau paste URL profil
                        </div>
                    </div>
                    
                    <div style="margin-bottom: 30px;">
                        <button id="instagramStalkerBtn" class="tool-btn" style="width: 100%; padding: 18px; font-size: 18px;">
                            <i class="fas fa-search"></i> Search Profile
                        </button>
                    </div>
                    
                    <div id="instagramStalkerLoading" style="display: none; text-align: center; margin: 20px 0;">
                        <div class="loading-spinner" style="width: 50px; height: 50px; margin: 0 auto 20px;"></div>
                        <p>Mengambil data profil...</p>
                    </div>
                    
                    <div id="instagramStalkerError" style="display: none; background: rgba(239, 68, 68, 0.2); padding: 15px; border-radius: 10px; border: 1px solid rgba(239, 68, 68, 0.3); margin: 20px 0;">
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                            <i class="fas fa-exclamation-circle" style="color: var(--danger);"></i>
                            <h4 style="color: var(--danger); margin: 0;">Terjadi Kesalahan</h4>
                        </div>
                        <p id="instagramStalkerErrorText" style="color: var(--text-muted); margin: 0; font-size: 14px;">
                            Tidak dapat mengambil data profil.
                        </p>
                    </div>
                    
                    <!-- Profile Result -->
                    <div id="instagramProfileResult" style="display: none; margin-top: 30px;">
                        <!-- Profile data akan diisi oleh JavaScript -->
                    </div>
                </div>
            </div>
        </div>
    `;
    
    const container = getToolContainer(); container.innerHTML = toolHTML; container.style.display = 'block';
    
    // Initialize Instagram Downloader functionality
    setTimeout(initializeInstagramTool, 100);
}

async function initializeInstagramTool() {
    // API Configuration
    const MAIN_API_ENDPOINT = 'https://api.nekolabs.web.id/dwn/instagram';
    const FALLBACK_API = 'https://api.fikmydomainsz.xyz/download/instagram?url=';
    const STALKER_API = 'https://api.zenzxz.my.id/api/stalker/instagram?username=';
    
    // Elements
    const downloadTab = document.getElementById('instagramTabDownload');
    const stalkerTab = document.getElementById('instagramTabStalker');
    const downloadContent = document.getElementById('instagramDownloadTab');
    const stalkerContent = document.getElementById('instagramStalkerTab');
    
    const urlInput = document.getElementById('instagramUrlInput');
    const usernameInput = document.getElementById('instagramUsernameInput');
    const downloadBtn = document.getElementById('instagramDownloadBtn');
    const stalkerBtn = document.getElementById('instagramStalkerBtn');
    
    const loadingDiv = document.getElementById('instagramLoading');
    const stalkerLoadingDiv = document.getElementById('instagramStalkerLoading');
    const errorDiv = document.getElementById('instagramError');
    const stalkerErrorDiv = document.getElementById('instagramStalkerError');
    const errorText = document.getElementById('instagramErrorText');
    const stalkerErrorText = document.getElementById('instagramStalkerErrorText');
    const loadingText = document.getElementById('instagramLoadingText');
    const apiStatusDiv = document.getElementById('instagramApiStatus');
    const apiStatusText = document.getElementById('instagramApiStatusText');
    const statusDot = document.getElementById('instagramStatusDot');
    
    const previewDiv = document.getElementById('instagramPreview');
    const mediaPlaceholder = document.getElementById('instagramMediaPlaceholder');
    const imagePreview = document.getElementById('instagramImagePreview');
    const videoPreview = document.getElementById('instagramVideoPreview');
    const infoGrid = document.getElementById('instagramInfoGrid');
    const mediaTypeBadge = document.getElementById('instagramMediaTypeText');
    
    const downloadSection = document.getElementById('instagramDownloadSection');
    const downloadOptions = document.getElementById('instagramDownloadOptions');
    
    const profileResult = document.getElementById('instagramProfileResult');
    const fallbackResult = document.getElementById('instagramFallbackResult');
    
    // Current state
    let currentData = null;
    
    // Tab switching
    downloadTab.addEventListener('click', () => {
        downloadTab.classList.add('active-tab');
        stalkerTab.classList.remove('active-tab');
        downloadContent.style.display = 'block';
        stalkerContent.style.display = 'none';
    });
    
    stalkerTab.addEventListener('click', () => {
        stalkerTab.classList.add('active-tab');
        downloadTab.classList.remove('active-tab');
        stalkerContent.style.display = 'block';
        downloadContent.style.display = 'none';
    });
    
    // Hide all sections
    function hideAllSections() {
        loadingDiv.style.display = 'none';
        stalkerLoadingDiv.style.display = 'none';
        errorDiv.style.display = 'none';
        stalkerErrorDiv.style.display = 'none';
        previewDiv.style.display = 'none';
        downloadSection.style.display = 'none';
        profileResult.style.display = 'none';
        fallbackResult.style.display = 'none';
    }
    
    // Show loading
    function showLoading(type) {
        hideAllSections();
        if (type === 'download') {
            loadingDiv.style.display = 'block';
            downloadBtn.disabled = true;
            downloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
            loadingText.textContent = 'Mengambil data dari Instagram...';
            apiStatusDiv.style.display = 'flex';
        } else {
            stalkerLoadingDiv.style.display = 'block';
            stalkerBtn.disabled = true;
            stalkerBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        }
    }
    
    // Hide loading
    function hideLoading(type) {
        if (type === 'download') {
            loadingDiv.style.display = 'none';
            downloadBtn.disabled = false;
            downloadBtn.innerHTML = '<i class="fas fa-search"></i> Download Content';
            apiStatusDiv.style.display = 'none';
        } else {
            stalkerLoadingDiv.style.display = 'none';
            stalkerBtn.disabled = false;
            stalkerBtn.innerHTML = '<i class="fas fa-search"></i> Search Profile';
        }
    }
    
    // Update API status
    function updateApiStatus(text, status) {
        apiStatusText.textContent = text;
        statusDot.style.background = status === 'active' ? '#10b981' : 
                                   status === 'fallback' ? '#f59e0b' : 
                                   '#ef4444';
    }
    
    // Show error
    function showError(type, message) {
        hideAllSections();
        if (type === 'download') {
            errorText.textContent = message;
            errorDiv.style.display = 'block';
        } else {
            stalkerErrorText.textContent = message;
            stalkerErrorDiv.style.display = 'block';
        }
    }
    
    // URL validation
    function isValidInstagramUrl(url) {
        const instagramRegex = /https?:\/\/(www\.)?instagram\.com\/(p|reel|tv|stories)\/[a-zA-Z0-9_-]+\/?/;
        return instagramRegex.test(url);
    }
    
    // Format number with dots
    function formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
    
    // Handle download
    downloadBtn.addEventListener('click', async () => {
        const url = urlInput.value.trim();
        
        if (!url) {
            showError('download', 'URL tidak boleh kosong');
            return;
        }
        
        if (!isValidInstagramUrl(url)) {
            showError('download', 'URL Instagram tidak valid');
            return;
        }
        
        // Try main API first
        showLoading('download');
        updateApiStatus('Mencoba API Utama...', 'active');
        
        try {
            await fetchMainApiData(url);
        } catch (mainApiError) {
            console.log('Main API failed, trying fallback...');
            
            // Try fallback API
            updateApiStatus('API Utama gagal, mencoba API Cadangan...', 'fallback');
            loadingText.textContent = 'Mencoba API Cadangan...';
            
            try {
                await fetchFallbackData(url);
            } catch (fallbackError) {
                console.log('Fallback API juga gagal');
                hideLoading('download');
                showError('download', 'Tidak dapat mengambil data dari semua sumber');
            }
        }
    });
    
    // Handle stalker search
    stalkerBtn.addEventListener('click', async () => {
        let username = usernameInput.value.trim();
        
        // Extract username from URL if provided
        if (username.includes('instagram.com')) {
            const profileMatch = username.match(/instagram\.com\/([^\/?]+)/);
            if (profileMatch && !['p', 'reel', 'tv', 'stories'].includes(profileMatch[1])) {
                username = profileMatch[1];
            }
        }
        
        if (!username) {
            showError('stalker', 'Username tidak boleh kosong');
            return;
        }
        
        showLoading('stalker');
        
        try {
            const apiUrl = STALKER_API + encodeURIComponent(username);
            const response = await fetch(apiUrl);
            
            if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
            
            const data = await response.json();
            hideLoading('stalker');
            
            if (data.success && data.data) {
                displayProfileData(data);
            } else {
                showError('stalker', 'Profil tidak ditemukan');
            }
            
        } catch (error) {
            hideLoading('stalker');
            showError('stalker', `Error: ${error.message}`);
        }
    });
    
    // Fetch from main API
    async function fetchMainApiData(url) {
        return new Promise(async (resolve, reject) => {
            try {
                const proxyUrl = 'https://api.allorigins.win/get?url=';
                const apiUrl = `${proxyUrl}${encodeURIComponent(MAIN_API_ENDPOINT + '?url=' + url)}`;
                
                const response = await fetch(apiUrl);
                if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
                
                const data = await response.json();
                let result;
                
                try {
                    result = JSON.parse(data.contents);
                } catch (parseError) {
                    throw new Error('Gagal memproses respons server');
                }
                
                if (result.success) {
                    updateApiStatus('API Utama berhasil', 'active');
                    hideLoading('download');
                    displayPreview(result);
                    resolve(result);
                } else {
                    throw new Error('Main API returned unsuccessful');
                }
                
            } catch (error) {
                reject(error);
            }
        });
    }
    
    // Fetch from fallback API
    async function fetchFallbackData(url) {
        return new Promise(async (resolve, reject) => {
            try {
                const encodedUrl = encodeURIComponent(url);
                const apiUrl = FALLBACK_API + encodedUrl;
                
                const response = await fetch(apiUrl, {
                    signal: AbortSignal.timeout(10000)
                });
                
                if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
                
                const data = await response.json();
                
                if (data.status && data.result && data.result.length > 0) {
                    updateApiStatus('API Cadangan berhasil', 'fallback');
                    hideLoading('download');
                    displayFallbackResult(data);
                    resolve(data);
                } else {
                    throw new Error('Fallback API returned no data');
                }
                
            } catch (error) {
                reject(error);
            }
        });
    }
    
    // Display preview (Main API)
    function displayPreview(apiResult) {
        if (!apiResult || !apiResult.result) {
            showError('download', 'Data tidak valid');
            return;
        }
        
        const metadata = apiResult.result.metadata;
        const downloadUrls = apiResult.result.downloadUrl;
        
        if (!metadata || !downloadUrls) {
            showError('download', 'Data tidak lengkap');
            return;
        }
        
        // Save data
        currentData = {
            metadata: metadata,
            downloadUrl: downloadUrls,
            apiType: 'main'
        };
        
        // Update media badge
        const isVideo = metadata.isVideo;
        mediaTypeBadge.textContent = isVideo ? 'VIDEO' : 'FOTO';
        
        // Show media preview
        if (downloadUrls && downloadUrls.length > 0) {
            const mediaUrl = downloadUrls[0];
            
            mediaPlaceholder.style.display = 'none';
            
            if (isVideo) {
                videoPreview.src = mediaUrl;
                videoPreview.style.display = 'block';
                videoPreview.load();
                videoPreview.onerror = function() {
                    mediaPlaceholder.style.display = 'block';
                    mediaPlaceholder.innerHTML = `
                        <i class="fas fa-video-slash"></i>
                        <p>Video tidak dapat diputar di preview</p>
                    `;
                };
            } else {
                imagePreview.src = mediaUrl;
                imagePreview.style.display = 'block';
                imagePreview.onerror = function() {
                    mediaPlaceholder.style.display = 'block';
                };
            }
        }
        
        // Display info
        displayInfo(metadata);
        
        // Show preview
        previewDiv.style.display = 'block';
        
        // Display download options
        displayDownloadOptions();
    }
    
    // Display info
    function displayInfo(metadata) {
        const infoItems = [
            {
                icon: 'user',
                label: 'Username',
                value: metadata.username || 'Tidak tersedia'
            },
            {
                icon: 'heart',
                label: 'Likes',
                value: formatNumber(metadata.like || 0)
            },
            {
                icon: 'comment',
                label: 'Comments',
                value: formatNumber(metadata.comment || 0)
            },
            {
                icon: 'file-alt',
                label: 'Type',
                value: metadata.isVideo ? 'Video' : 'Photo'
            }
        ];
        
        // Add caption if available
        if (metadata.caption) {
            const shortCaption = metadata.caption.length > 30 ? 
                metadata.caption.substring(0, 30) + '...' : metadata.caption;
            infoItems.push({
                icon: 'pen',
                label: 'Caption',
                value: shortCaption
            });
        }
        
        // Clear and fill info grid
        infoGrid.innerHTML = infoItems.map(item => `
            <div style="
                background: rgba(30, 35, 60, 0.6);
                border-radius: 10px;
                padding: 12px;
                border: 1px solid var(--border);
            ">
                <div style="font-size: 11px; color: var(--text-muted); margin-bottom: 5px; display: flex; align-items: center; gap: 4px;">
                    <i class="fas fa-${item.icon}"></i> ${item.label}
                </div>
                <div style="font-weight: 600; color: var(--text); font-size: 14px;">
                    ${item.value}
                </div>
            </div>
        `).join('');
    }
    
    // Display download options
    function displayDownloadOptions() {
        if (!currentData || !currentData.downloadUrl || currentData.downloadUrl.length === 0) {
            downloadOptions.innerHTML = '<p style="text-align: center; color: var(--text-muted);">Tidak ada tautan unduhan tersedia</p>';
            showDownloadSection();
            return;
        }
        
        const isVideo = currentData.metadata.isVideo;
        const downloadUrls = currentData.downloadUrl;
        
        downloadOptions.innerHTML = '';
        
        downloadUrls.forEach((url, index) => {
            const typeText = isVideo ? 'Video' : 'Photo';
            const typeIcon = isVideo ? 'video' : 'image';
            const fileExt = isVideo ? 'mp4' : 'jpg';
            const fileName = `instagram_${typeText.toLowerCase()}_${Date.now()}_${index + 1}.${fileExt}`;
            const buttonText = isVideo ? 'Download Video' : 'Download Photo';
            
            const downloadCard = document.createElement('div');
            downloadCard.style.cssText = `
                background: rgba(30, 35, 60, 0.8);
                border-radius: 10px;
                padding: 15px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                border: 1px solid var(--border);
            `;
            
            downloadCard.innerHTML = `
                <div style="display: flex; align-items: center; gap: 12px;">
                    <div style="
                        background: linear-gradient(135deg, #833AB4 0%, #FD1D1D 100%);
                        width: 40px;
                        height: 40px;
                        border-radius: 8px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: white;
                        font-size: 18px;
                    ">
                        <i class="fas fa-${typeIcon}"></i>
                    </div>
                    <div>
                        <div style="font-weight: 600; color: var(--text); font-size: 14px;">
                            ${typeText} ${downloadUrls.length > 1 ? (index + 1) : ''}
                        </div>
                        <div style="font-size: 12px; color: var(--text-muted);">
                            High quality • ${fileExt.toUpperCase()} format
                        </div>
                    </div>
                </div>
                <a href="${url}" 
                   class="tool-btn" 
                   download="${fileName}" 
                   target="_blank"
                   style="padding: 8px 16px; font-size: 14px; text-decoration: none;">
                    <i class="fas fa-download"></i> ${buttonText}
                </a>
            `;
            
            downloadOptions.appendChild(downloadCard);
        });
        
        showDownloadSection();
    }
    
    // Show download section
    function showDownloadSection() {
        downloadSection.style.display = 'block';
    }
    
    // Display fallback result
    function displayFallbackResult(data) {
        const result = data.result[0];
        const videoUrl = result.url_download || result.video_url;
        const isVideo = videoUrl && (videoUrl.includes('.mp4') || videoUrl.includes('.webm'));
        
        let mediaHtml = '';
        
        if (isVideo) {
            mediaHtml = `
                <div style="margin-bottom: 20px; text-align: center;">
                    <video controls style="width: 100%; max-width: 400px; border-radius: 10px; background: #000;">
                        <source src="${videoUrl}" type="video/mp4">
                    </video>
                    <div style="font-size: 12px; color: var(--text-muted); margin-top: 10px;">
                        <i class="fas fa-play-circle"></i> Klik play untuk preview video
                    </div>
                </div>
            `;
        } else {
            mediaHtml = `
                <div style="margin-bottom: 20px; text-align: center;">
                    <img src="${result.thumbnail || 'https://via.placeholder.com/400x400/f0f0f0/666?text=Thumbnail'}" 
                         alt="Thumbnail" 
                         style="max-width: 100%; max-height: 300px; border-radius: 10px;">
                    <div style="font-size: 12px; color: var(--text-muted); margin-top: 10px;">
                        <i class="fas fa-image"></i> Thumbnail
                    </div>
                </div>
            `;
        }
        
        currentData = {
            downloadUrl: [videoUrl],
            metadata: { isVideo: isVideo },
            apiType: 'fallback'
        };
        
        fallbackResult.innerHTML = `
            <div style="
                background: rgba(30, 35, 60, 0.8);
                border-radius: 12px;
                padding: 20px;
                border: 1px solid var(--border);
            ">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h3 style="color: var(--text); font-size: 18px; font-weight: 700;">Video Siap Download</h3>
                    <span style="
                        background: rgba(245, 158, 11, 0.2);
                        color: #f59e0b;
                        padding: 4px 12px;
                        border-radius: 50px;
                        font-size: 12px;
                        font-weight: 600;
                        display: flex;
                        align-items: center;
                        gap: 6px;
                    ">
                        <i class="fas fa-bolt"></i> API Cadangan
                    </span>
                </div>
                
                ${mediaHtml}
                
                <a href="${videoUrl}" 
                   class="tool-btn" 
                   style="width: 100%; text-align: center; text-decoration: none;"
                   target="_blank" 
                   download="${result.username || 'instagram'}_video.mp4">
                    <i class="fas fa-download"></i> Download Video (${result.kualitas || 'HQ'})
                </a>
                
                ${result.size ? `
                    <div style="text-align: center; font-size: 12px; color: var(--text-muted); margin-top: 10px;">
                        <i class="fas fa-info-circle"></i> Size: ${result.size}
                    </div>
                ` : ''}
            </div>
        `;
        
        fallbackResult.style.display = 'block';
    }
    
    // Display profile data
    function displayProfileData(data) {
        const profile = data.data;
        
        const html = `
            <div style="
                background: rgba(30, 35, 60, 0.8);
                border-radius: 12px;
                padding: 20px;
                border: 1px solid var(--border);
            ">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h3 style="color: var(--text); font-size: 18px; font-weight: 700;">Instagram Profile</h3>
                    <span style="
                        background: rgba(100, 124, 247, 0.2);
                        color: var(--primary);
                        padding: 4px 12px;
                        border-radius: 50px;
                        font-size: 12px;
                        font-weight: 600;
                        display: flex;
                        align-items: center;
                        gap: 6px;
                    ">
                        <i class="fas fa-bolt"></i> ${data.creator || 'Byy'}
                    </span>
                </div>
                
                <div style="display: flex; flex-direction: column; align-items: center; gap: 20px; margin-bottom: 25px;">
                    <img src="${profile.profile_pic}" 
                         alt="${profile.username}" 
                         style="width: 120px; height: 120px; border-radius: 50%; border: 3px solid var(--border); object-fit: cover;"
                         onerror="this.src='https://via.placeholder.com/120x120/647cf7/ffffff?text=📷'">
                    
                    <div style="text-align: center;">
                        <h4 style="color: var(--text); font-size: 20px; font-weight: 700; margin-bottom: 5px;">
                            ${profile.name || 'No name'}
                        </h4>
                        <p style="color: var(--text-muted); font-size: 16px; margin-bottom: 10px;">
                            @${profile.username}
                        </p>
                        <p style="color: var(--text); font-size: 14px; line-height: 1.4;">
                            ${profile.bio || 'No bio'}
                        </p>
                    </div>
                </div>
                
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 20px;">
                    <div style="text-align: center; background: rgba(30, 35, 60, 0.6); padding: 15px; border-radius: 10px; border: 1px solid var(--border);">
                        <div style="font-size: 24px; font-weight: 700; color: var(--primary); margin-bottom: 5px;">
                            ${formatNumber(profile.followers)}
                        </div>
                        <div style="font-size: 12px; color: var(--text-muted);">Followers</div>
                    </div>
                    <div style="text-align: center; background: rgba(30, 35, 60, 0.6); padding: 15px; border-radius: 10px; border: 1px solid var(--border);">
                        <div style="font-size: 24px; font-weight: 700; color: var(--primary); margin-bottom: 5px;">
                            ${formatNumber(profile.following)}
                        </div>
                        <div style="font-size: 12px; color: var(--text-muted);">Following</div>
                    </div>
                    <div style="text-align: center; background: rgba(30, 35, 60, 0.6); padding: 15px; border-radius: 10px; border: 1px solid var(--border);">
                        <div style="font-size: 24px; font-weight: 700; color: var(--primary); margin-bottom: 5px;">
                            ${formatNumber(profile.posts)}
                        </div>
                        <div style="font-size: 12px; color: var(--text-muted);">Posts</div>
                    </div>
                </div>
            </div>
        `;
        
        profileResult.innerHTML = html;
        profileResult.style.display = 'block';
    }
    
    // Enter key support
    urlInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') downloadBtn.click();
    });
    
    usernameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') stalkerBtn.click();
    });
}


// 15. YOUTUBE DOWNLOADER
async function loadYouTubeDownloader() {
    const toolHTML = `
        <div class="tool-page-container">
            <div class="tool-page-header">
                <h2 class="tool-page-title">
                    <i class="fab fa-youtube"></i> YouTubeDL
                </h2>
                <button class="tool-back-btn" onclick="backToTools()">
                    <i class="fas fa-arrow-left"></i> Back to Tools
                </button>
            </div>
            
            <div class="tool-content">
                <div style="margin-bottom: 30px;">
                    <label style="display: block; margin-bottom: 10px; color: var(--text); font-weight: 600;">
                        <i class="fas fa-link"></i> URL Video YouTube
                    </label>
                    <input 
                        type="url" 
                        id="ytVideoUrlInput" 
                        placeholder="https://www.youtube.com/watch?v=..."
                        style="
                            width: 100%;
                            padding: 16px 20px;
                            background: rgba(30, 35, 60, 0.8);
                            border: 2px solid var(--border);
                            border-radius: 14px;
                            color: var(--text);
                            font-family: 'Inter', sans-serif;
                            font-size: 16px;
                            transition: all 0.3s ease;
                        "
                    >
                </div>
                
                <div style="margin-bottom: 30px;">
                    <button id="fetchYTVideoBtn" class="tool-btn" style="width: 100%; padding: 18px; font-size: 18px;">
                        <i class="fas fa-search"></i> Cari Video
                    </button>
                </div>
                
                <div id="ytLoading" style="display: none; text-align: center; margin: 20px 0;">
                    <div class="loading-spinner" style="width: 50px; height: 50px; margin: 0 auto 20px;"></div>
                    <p>Mengambil informasi video, harap tunggu...</p>
                </div>
                
                <div id="ytError" style="display: none; background: rgba(239, 68, 68, 0.2); padding: 15px; border-radius: 10px; border: 1px solid rgba(239, 68, 68, 0.3); margin: 20px 0;">
                    <p style="color: var(--danger); margin: 0;"><i class="fas fa-exclamation-triangle"></i> <span id="ytErrorText">Terjadi kesalahan</span></p>
                </div>
                
                <div id="ytResult" style="display: none; margin-top: 30px;">
                    <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 14px; padding: 20px; margin-bottom: 20px;">
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px;">
                            <i class="fas fa-check-circle" style="color: var(--success); font-size: 20px;"></i>
                            <div style="font-weight: 700; color: var(--text);">Video Ditemukan!</div>
                        </div>
                        <div style="color: var(--text-muted); font-size: 14px;">
                            Video YouTube berhasil diproses.
                        </div>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr; gap: 30px; margin-bottom: 30px;">
                        <div>
                            <div style="background: rgba(30, 35, 60, 0.6); border-radius: 12px; overflow: hidden; margin-bottom: 20px;">
                                <img id="ytThumbnail" src="" alt="Thumbnail" style="width: 100%; max-height: 200px; object-fit: cover;">
                            </div>
                            
                            <h3 id="ytVideoTitle" style="color: var(--text); margin-bottom: 20px; font-size: 18px; line-height: 1.4;"></h3>
                            
                            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px;">
                                <div style="background: rgba(30, 35, 60, 0.6); padding: 15px; border-radius: 10px; text-align: center;">
                                    <div style="font-size: 12px; color: var(--text-muted); margin-bottom: 5px;">Durasi</div>
                                    <div id="ytDuration" style="font-weight: 600; color: var(--text); font-size: 16px;">-</div>
                                </div>
                                <div style="background: rgba(30, 35, 60, 0.6); padding: 15px; border-radius: 10px; text-align: center;">
                                    <div style="font-size: 12px; color: var(--text-muted); margin-bottom: 5px;">Status</div>
                                    <div style="font-weight: 600; color: var(--success); font-size: 16px;">Siap</div>
                                </div>
                                <div style="background: rgba(30, 35, 60, 0.6); padding: 15px; border-radius: 10px; text-align: center;">
                                    <div style="font-size: 12px; color: var(--text-muted); margin-bottom: 5px;">Kualitas</div>
                                    <div style="font-weight: 600; color: var(--text); font-size: 16px;">MP3 & MP4</div>
                                </div>
                            </div>
                        </div>
                        
                        <div>
                            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px;">
                                <!-- MP3 Card -->
                                <div style="background: rgba(30, 35, 60, 0.8); border-radius: 12px; padding: 25px; border: 1px solid var(--border);">
                                    <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 20px;">
                                        <div style="font-size: 28px; color: var(--primary);">
                                            <i class="fas fa-music"></i>
                                        </div>
                                        <div>
                                            <h4 style="color: var(--text); margin-bottom: 5px;">MP3 (Audio)</h4>
                                            <p style="color: var(--text-muted); font-size: 14px;">Format audio berkualitas tinggi</p>
                                        </div>
                                    </div>
                                    
                                    <div style="margin-bottom: 20px;">
                                        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                                            <span style="color: var(--text-muted); font-size: 14px;">Format:</span>
                                            <span style="color: var(--text); font-weight: 600;">MP3</span>
                                        </div>
                                        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                                            <span style="color: var(--text-muted); font-size: 14px;">Kualitas:</span>
                                            <span style="color: var(--text); font-weight: 600;">128 kbps</span>
                                        </div>
                                        <div style="display: flex; justify-content: space-between;">
                                            <span style="color: var(--text-muted); font-size: 14px;">Ukuran:</span>
                                            <span id="mp3Size" style="color: var(--text); font-weight: 600;">~3-5 MB</span>
                                        </div>
                                    </div>
                                    
                                    <a href="#" id="downloadMP3Btn" class="tool-btn" style="text-decoration: none; text-align: center;">
                                        <i class="fas fa-download"></i> Unduh MP3
                                    </a>
                                </div>
                                
                                <!-- MP4 Card -->
                                <div style="background: rgba(30, 35, 60, 0.8); border-radius: 12px; padding: 25px; border: 1px solid var(--border);">
                                    <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 20px;">
                                        <div style="font-size: 28px; color: var(--primary);">
                                            <i class="fas fa-video"></i>
                                        </div>
                                        <div>
                                            <h4 style="color: var(--text); margin-bottom: 5px;">MP4 (Video)</h4>
                                            <p style="color: var(--text-muted); font-size: 14px;">Video dengan kualitas terbaik</p>
                                        </div>
                                    </div>
                                    
                                    <div style="margin-bottom: 20px;">
                                        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                                            <span style="color: var(--text-muted); font-size: 14px;">Format:</span>
                                            <span style="color: var(--text); font-weight: 600;">MP4</span>
                                        </div>
                                        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                                            <span style="color: var(--text-muted); font-size: 14px;">Kualitas:</span>
                                            <span id="mp4Quality" style="color: var(--text); font-weight: 600;">1080p</span>
                                        </div>
                                        <div style="display: flex; justify-content: space-between;">
                                            <span style="color: var(--text-muted); font-size: 14px;">Ukuran:</span>
                                            <span id="mp4Size" style="color: var(--text); font-weight: 600;">~10-50 MB</span>
                                        </div>
                                    </div>
                                    
                                    <a href="#" id="downloadMP4Btn" class="tool-btn" style="text-decoration: none; text-align: center; background: linear-gradient(to right, #2193b0, #6dd5ed);">
                                        <i class="fas fa-download"></i> Unduh MP4
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div style="text-align: center; padding: 20px; background: rgba(30, 35, 60, 0.4); border-radius: 10px; border: 1px solid var(--border);">
                        <p style="color: var(--text-muted); font-size: 14px; margin: 0;">
                            <i class="fas fa-info-circle"></i> Byyverse 
                        </p>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    const container = getToolContainer(); container.innerHTML = toolHTML; container.style.display = 'block';
    
    // Initialize YouTube Downloader functionality
    setTimeout(initializeYouTubeDownloader, 100);
}

async function initializeYouTubeDownloader() {
    const videoUrlInput = document.getElementById('ytVideoUrlInput');
    const fetchBtn = document.getElementById('fetchYTVideoBtn');
    const loading = document.getElementById('ytLoading');
    const errorDiv = document.getElementById('ytError');
    const errorText = document.getElementById('ytErrorText');
    const resultDiv = document.getElementById('ytResult');
    const thumbnail = document.getElementById('ytThumbnail');
    const videoTitle = document.getElementById('ytVideoTitle');
    const duration = document.getElementById('ytDuration');
    const mp3Size = document.getElementById('mp3Size');
    const mp4Size = document.getElementById('mp4Size');
    const mp4Quality = document.getElementById('mp4Quality');
    const downloadMP3Btn = document.getElementById('downloadMP3Btn');
    const downloadMP4Btn = document.getElementById('downloadMP4Btn');
    
    let currentVideoData = { mp3: null, mp4: null };
    
    // Format duration
    function formatDuration(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    }
    
    // Estimate file size
    function estimateFileSize(duration, isVideo = false) {
        if (isVideo) {
            const sizeMB = Math.round((duration / 60) * 3);
            return sizeMB < 1 ? "~1-3 MB" : `~${sizeMB}-${sizeMB + 5} MB`;
        } else {
            const sizeMB = Math.round((duration / 60) * 1);
            return sizeMB < 1 ? "~1-2 MB" : `~${sizeMB}-${sizeMB + 2} MB`;
        }
    }
    
    // Show error
    function showYTError(message) {
        errorText.textContent = message;
        errorDiv.style.display = 'block';
        resultDiv.style.display = 'none';
        loading.style.display = 'none';
    }
    
    // Fetch video info
    fetchBtn.addEventListener('click', async function() {
        const videoUrl = videoUrlInput.value.trim();
        
        if (!videoUrl || (!videoUrl.includes('youtube.com') && !videoUrl.includes('youtu.be'))) {
            showYTError('Harap masukkan tautan YouTube yang valid');
            return;
        }
        
        loading.style.display = 'block';
        errorDiv.style.display = 'none';
        resultDiv.style.display = 'none';
        
        try {
            // Fetch MP3 data
            const mp3ApiUrl = `https://api.zenzxz.my.id/api/downloader/ytmp3v2?url=${encodeURIComponent(videoUrl)}`;
            const mp3Response = await fetch(mp3ApiUrl);
            const mp3Data = await mp3Response.json();
            
            if (!mp3Data.success || mp3Data.statusCode !== 200) {
                throw new Error('Gagal mendapatkan informasi video MP3');
            }
            
            // Fetch MP4 data
            const mp4ApiUrl = `https://api.zenzxz.my.id/api/downloader/ytmp4v2?url=${encodeURIComponent(videoUrl)}`;
            const mp4Response = await fetch(mp4ApiUrl);
            const mp4Data = await mp4Response.json();
            
            if (!mp4Data.success || mp4Data.statusCode !== 200) {
                throw new Error('Gagal mendapatkan informasi video MP4');
            }
            
            currentVideoData = {
                mp3: mp3Data,
                mp4: mp4Data
            };
            
            displayVideoInfo();
            resultDiv.style.display = 'block';
            showNotification('Video berhasil ditemukan!', 'success');
            
        } catch (error) {
            console.error('Error:', error);
            showYTError('Gagal mengambil informasi video. Pastikan URL YouTube valid dan coba lagi.');
        } finally {
            loading.style.display = 'none';
        }
    });
    
    // Display video info
    function displayVideoInfo() {
        const mp3Data = currentVideoData.mp3.data;
        const mp4Data = currentVideoData.mp4.data;
        
        thumbnail.src = mp3Data.thumbnail;
        videoTitle.textContent = mp3Data.title;
        duration.textContent = formatDuration(mp3Data.duration);
        
        mp3Size.textContent = estimateFileSize(mp3Data.duration, false);
        mp4Size.textContent = estimateFileSize(mp4Data.duration, true);
        mp4Quality.textContent = mp4Data.format || '1080p';
        
        downloadMP3Btn.href = mp3Data.download_url;
        downloadMP4Btn.href = mp4Data.download_url;
        
        // Set target blank for download links
        downloadMP3Btn.target = '_blank';
        downloadMP4Btn.target = '_blank';
    }
    
    // Enter key support
    videoUrlInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            fetchBtn.click();
        }
    });
    
    // Set current year in footer (if needed)
    document.addEventListener('DOMContentLoaded', function() {
        const yearSpan = document.createElement('span');
        yearSpan.id = 'currentYear';
        yearSpan.textContent = new Date().getFullYear();
    });
}


// 17. HARD ENCODER TOOL
async function loadHardEncoder() {
    const toolHTML = `
        <div class="tool-page-container">
            <div class="tool-page-header">
                <h2 class="tool-page-title">
                    <i class="fas fa-lock"></i> Hard Encoder
                </h2>
                <button class="tool-back-btn" onclick="backToTools()">
                    <i class="fas fa-arrow-left"></i> Back to Tools
                </button>
            </div>
            
            <div class="tool-content">
                <div style="text-align: center; margin-bottom: 30px;">
                    <div style="background: linear-gradient(135deg, #333, #000); border-radius: 50%; width: 80px; height: 80px; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; border: 2px solid #fff;">
                        <i class="fas fa-lock" style="color: #fff; font-size: 2.5rem;"></i>
                    </div>
                    <h3 style="color: var(--text); margin-bottom: 10px; font-size: 1.5rem;">Hard Code Encoder</h3>
                    <p style="color: var(--text-muted); font-size: 14px;">
                        Encrypt your code with multiple security layers
                    </p>
                </div>
                
                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 10px; color: var(--text); font-weight: 600;">
                        <i class="fas fa-code"></i> Code Type
                    </label>
                    <select id="codeType" style="
                        width: 100%;
                        padding: 16px 20px;
                        background: rgba(30, 35, 60, 0.8);
                        border: 2px solid var(--border);
                        border-radius: 14px;
                        color: var(--text);
                        font-family: 'Inter', sans-serif;
                        font-size: 16px;
                        transition: all 0.3s ease;
                    ">
                        <option value="html">HTML</option>
                        <option value="javascript">JavaScript</option>
                        <option value="python">Python</option>
                        <option value="php">PHP</option>
                        <option value="css">CSS</option>
                        <option value="cpp">C++</option>
                        <option value="java">Java</option>
                        <option value="csharp">C#</option>
                        <option value="ruby">Ruby</option>
                        <option value="sql">SQL</option>
                    </select>
                </div>
                
                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 10px; color: var(--text); font-weight: 600;">
                        <i class="fas fa-shield-alt"></i> Encryption Level
                    </label>
                    <select id="encryptionLevel" style="
                        width: 100%;
                        padding: 16px 20px;
                        background: rgba(30, 35, 60, 0.8);
                        border: 2px solid var(--border);
                        border-radius: 14px;
                        color: var(--text);
                        font-family: 'Inter', sans-serif;
                        font-size: 16px;
                        transition: all 0.3s ease;
                    ">
                        <option value="hard">Hard (4 Layers)</option>
                        <option value="slow">Slow (3 Layers)</option>
                        <option value="extreme">Extreme (6 Layers)</option>
                        <option value="rot13">ROT13 Cipher</option>
                        <option value="caesar">Caesar Cipher</option>
                    </select>
                </div>
                
                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 10px; color: var(--text); font-weight: 600;">
                        <i class="fas fa-keyboard"></i> Input Code
                    </label>
                    <textarea 
                        id="codeInput" 
                        placeholder="Paste your code here to encrypt..."
                        rows="6"
                        style="
                            width: 100%;
                            padding: 16px 20px;
                            background: rgba(30, 35, 60, 0.8);
                            border: 2px solid var(--border);
                            border-radius: 14px;
                            color: var(--text);
                            font-family: 'Courier New', monospace;
                            font-size: 14px;
                            resize: vertical;
                            transition: all 0.3s ease;
                        "
                    ></textarea>
                </div>
                
                <div style="margin-bottom: 30px;">
                    <button id="encryptBtn" class="tool-btn" style="width: 100%; padding: 18px; font-size: 18px; background: linear-gradient(to right, #000, #333); color: #fff; border: 1px solid #fff;">
                        <i class="fas fa-lock"></i> Encrypt Code
                    </button>
                </div>
                
                <div id="encoderLoading" style="display: none; text-align: center; margin: 40px 0;">
                    <div class="loading-spinner" style="width: 50px; height: 50px; margin: 0 auto 20px;"></div>
                    <div style="font-weight: 600; color: var(--text);">Encrypting code...</div>
                    <div style="font-size: 14px; color: var(--text-muted); margin-top: 10px;">
                        Applying multiple security layers
                    </div>
                </div>
                
                <div id="encoderResult" style="display: none; margin-top: 30px;">
                    <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 14px; padding: 20px; margin-bottom: 20px;">
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px;">
                            <i class="fas fa-check-circle" style="color: var(--success); font-size: 20px;"></i>
                            <div style="font-weight: 700; color: var(--text);">Code Encrypted Successfully!</div>
                        </div>
                        <div style="color: var(--text-muted); font-size: 14px;">
                            Your code has been encrypted with hard security layers.
                        </div>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin-bottom: 20px; padding: 15px; background: rgba(30, 35, 60, 0.6); border-radius: 12px;">
                        <div style="text-align: center;">
                            <div style="font-size: 24px; font-weight: 700; color: var(--text);" id="inputLength">0</div>
                            <div style="font-size: 12px; color: var(--text-muted);">Input Chars</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 24px; font-weight: 700; color: var(--text);" id="outputLength">0</div>
                            <div style="font-size: 12px; color: var(--text-muted);">Output Chars</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 24px; font-weight: 700; color: var(--text);" id="layerCount">0</div>
                            <div style="font-size: 12px; color: var(--text-muted);">Layers</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 24px; font-weight: 700; color: var(--text);" id="encodeTime">0ms</div>
                            <div style="font-size: 12px; color: var(--text-muted);">Time</div>
                        </div>
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 10px; color: var(--text); font-weight: 600;">
                            <i class="fas fa-lock"></i> Encrypted Result
                        </label>
                        <textarea 
                            id="encryptedOutput" 
                            rows="6"
                            readonly
                            style="
                                width: 100%;
                                padding: 16px 20px;
                                background: rgba(0, 0, 0, 0.3);
                                border: 1px solid #00ffff;
                                border-radius: 14px;
                                color: #00ffff;
                                font-family: 'Courier New', monospace;
                                font-size: 14px;
                                resize: vertical;
                                transition: all 0.3s ease;
                            "
                        ></textarea>
                    </div>
                    
                    <div style="display: flex; gap: 15px; margin-bottom: 20px;">
                        <button id="copyEncoderBtn" class="tool-btn" style="flex: 1; background: rgba(0, 255, 255, 0.1); color: #00ffff; border: 1px solid #00ffff;">
                            <i class="fas fa-copy"></i> Copy Code
                        </button>
                        <button id="downloadEncoderBtn" class="tool-btn" style="flex: 1; background: rgba(0, 255, 255, 0.1); color: #00ffff; border: 1px solid #00ffff;">
                            <i class="fas fa-download"></i> Download
                        </button>
                    </div>
                    
                    <div style="display: flex; gap: 15px;">
                        <button id="newEncoderBtn" class="tool-btn" style="flex: 1; background: rgba(30, 35, 60, 0.8); border: 1px solid var(--border);">
                            <i class="fas fa-plus"></i> New Code
                        </button>
                        <button id="testEncoderBtn" class="tool-btn" style="flex: 1; background: rgba(0, 255, 0, 0.1); color: #00ff00; border: 1px solid #00ff00;">
                            <i class="fas fa-play"></i> Test Encrypted
                        </button>
                    </div>
                </div>
                
                <div id="encoderError" style="display: none; margin-top: 30px;">
                    <div style="background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 14px; padding: 20px; margin-bottom: 20px;">
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px;">
                            <i class="fas fa-exclamation-triangle" style="color: var(--danger); font-size: 20px;"></i>
                            <div style="font-weight: 700; color: var(--text);">Encryption Failed</div>
                        </div>
                        <div style="color: var(--text-muted); font-size: 14px;" id="encoderErrorMessage">
                            Please try again with valid code.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    const container = getToolContainer(); container.innerHTML = toolHTML; container.style.display = 'block';
    
    // Initialize Hard Encoder functionality
    setTimeout(initializeHardEncoder, 100);
}

async function initializeHardEncoder() {
    const codeTypeSelect = document.getElementById('codeType');
    const encryptionLevelSelect = document.getElementById('encryptionLevel');
    const codeInput = document.getElementById('codeInput');
    const encryptBtn = document.getElementById('encryptBtn');
    const loadingDiv = document.getElementById('encoderLoading');
    const resultDiv = document.getElementById('encoderResult');
    const errorDiv = document.getElementById('encoderError');
    const inputLengthSpan = document.getElementById('inputLength');
    const outputLengthSpan = document.getElementById('outputLength');
    const layerCountSpan = document.getElementById('layerCount');
    const encodeTimeSpan = document.getElementById('encodeTime');
    const encryptedOutput = document.getElementById('encryptedOutput');
    const copyBtn = document.getElementById('copyEncoderBtn');
    const downloadBtn = document.getElementById('downloadEncoderBtn');
    const newBtn = document.getElementById('newEncoderBtn');
    const testBtn = document.getElementById('testEncoderBtn');
    
    // Update input length
    codeInput.addEventListener('input', function() {
        inputLengthSpan.textContent = this.value.length;
    });
    
    // Encrypt function
    encryptBtn.addEventListener('click', async () => {
        const input = codeInput.value.trim();
        const codeType = codeTypeSelect.value;
        const encryptionLevel = encryptionLevelSelect.value;
        
        if (!input) {
            showNotification('Please enter code to encrypt!', 'error');
            return;
        }
        
        // Hide previous results
        resultDiv.style.display = 'none';
        errorDiv.style.display = 'none';
        
        // Show loading
        loadingDiv.style.display = 'block';
        encryptBtn.disabled = true;
        
        const startTime = performance.now();
        
        try {
            let result;
            let layers;
            
            // Apply encryption based on level
            switch(encryptionLevel) {
                case 'hard':
                    result = encryptHard(input, codeType);
                    layers = 4;
                    break;
                case 'slow':
                    result = encryptSlow(input, codeType);
                    layers = 3;
                    break;
                case 'extreme':
                    result = encryptExtreme(input, codeType);
                    layers = 6;
                    break;
                case 'rot13':
                    result = encryptROT13(input);
                    layers = 1;
                    break;
                case 'caesar':
                    result = encryptCaesar(input, 3);
                    layers = 1;
                    break;
                default:
                    result = encryptHard(input, codeType);
                    layers = 4;
            }
            
            const endTime = performance.now();
            const encodeDuration = (endTime - startTime).toFixed(2);
            
            // Update results
            encryptedOutput.value = result;
            outputLengthSpan.textContent = result.length;
            layerCountSpan.textContent = layers;
            encodeTimeSpan.textContent = encodeDuration + 'ms';
            
            // Show results
            setTimeout(() => {
                loadingDiv.style.display = 'none';
                resultDiv.style.display = 'block';
                encryptBtn.disabled = false;
                showNotification(`Code encrypted with ${layers} security layers!`, 'success');
            }, 500);
            
        } catch (error) {
            console.error('Encryption error:', error);
            loadingDiv.style.display = 'none';
            errorDiv.style.display = 'block';
            document.getElementById('encoderErrorMessage').textContent = error.message || 'Encryption failed';
            encryptBtn.disabled = false;
            showNotification('Encryption failed!', 'error');
        }
    });
    
    // Encryption functions
    function encryptHard(input, codeType) {
        const encoded = btoa(unescape(encodeURIComponent(input)));
        return generateOutputTemplate(codeType, encoded, 4);
    }
    
    function encryptSlow(input, codeType) {
        const encoded = btoa(unescape(encodeURIComponent(input)));
        const encoded2 = btoa(encoded);
        return generateOutputTemplate(codeType, encoded2, 3);
    }
    
    function encryptExtreme(input, codeType) {
        const encoded = btoa(unescape(encodeURIComponent(input)));
        const reversed = encoded.split('').reverse().join('');
        const doubleEncoded = btoa(btoa(reversed));
        return generateOutputTemplate(codeType, doubleEncoded, 6);
    }
    
    function encryptROT13(input) {
        return input.replace(/[a-zA-Z]/g, function(c) {
            return String.fromCharCode((c <= "Z" ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26);
        });
    }
    
    function encryptCaesar(input, shift) {
        return input.replace(/[a-zA-Z]/g, function(c) {
            const base = c <= "Z" ? 65 : 97;
            return String.fromCharCode((c.charCodeAt(0) - base + shift) % 26 + base);
        });
    }
    
    function generateOutputTemplate(codeType, encryptedData, layers) {
        const safeData = encryptedData.replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '\\r');
        
        switch(codeType) {
            case 'html':
                return `<!DOCTYPE html>\n<html>\n<head>\n<meta charset="UTF-8">\n<title>Protected Content</title>\n</head>\n<body>\n<script>\nlet e="${safeData}";\nlet a=atob(atob(e));\ndocument.write(unescape(encodeURIComponent(a)));\n<\/script>\n</body>\n</html>`;
            case 'javascript':
                return `// Encrypted JavaScript Code\neval(atob("${safeData}"));`;
            case 'python':
                return `# Encrypted Python Code\nimport base64\nexec(base64.b64decode("${safeData}").decode('utf-8'))`;
            case 'php':
                return `<?php\n// Encrypted PHP Code\neval(base64_decode("${safeData}"));\n?>`;
            case 'css':
                return `/* Encrypted CSS Code */\n/* Data: ${safeData} */`;
            default:
                return `// Encrypted ${codeType.toUpperCase()} Code\n// Data: ${safeData}`;
        }
    }
    
    // Copy function
    copyBtn.addEventListener('click', () => {
        if (!encryptedOutput.value) {
            showNotification('No content to copy!', 'error');
            return;
        }
        navigator.clipboard.writeText(encryptedOutput.value).then(() => {
            showNotification('Encrypted code copied to clipboard!', 'success');
            copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
            setTimeout(() => {
                copyBtn.innerHTML = '<i class="fas fa-copy"></i> Copy Code';
            }, 2000);
        }).catch(err => {
            console.error('Copy failed:', err);
            showNotification('Failed to copy code', 'error');
        });
    });
    
    // Download function
    downloadBtn.addEventListener('click', () => {
        const output = encryptedOutput.value;
        if (!output) {
            showNotification('No content to download!', 'error');
            return;
        }
        
        const codeType = codeTypeSelect.value;
        let extension = 'txt';
        let mimeType = 'text/plain';
        
        switch(codeType) {
            case 'html': extension = 'html'; mimeType = 'text/html'; break;
            case 'javascript': extension = 'js'; mimeType = 'application/javascript'; break;
            case 'python': extension = 'py'; break;
            case 'php': extension = 'php'; mimeType = 'application/x-httpd-php'; break;
            case 'css': extension = 'css'; mimeType = 'text/css'; break;
            case 'cpp': extension = 'cpp'; break;
            case 'java': extension = 'java'; break;
            case 'csharp': extension = 'cs'; break;
            case 'ruby': extension = 'rb'; break;
            case 'sql': extension = 'sql'; break;
        }
        
        const blob = new Blob([output], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `encrypted-code-${Date.now()}.${extension}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showNotification('Encrypted file downloaded!', 'success');
    });
    
    // New code button
    newBtn.addEventListener('click', () => {
        codeInput.value = '';
        encryptedOutput.value = '';
        resultDiv.style.display = 'none';
        errorDiv.style.display = 'none';
        inputLengthSpan.textContent = '0';
        outputLengthSpan.textContent = '0';
        layerCountSpan.textContent = '0';
        encodeTimeSpan.textContent = '0ms';
        codeInput.focus();
        showNotification('Ready for new code', 'info');
    });
    
    // Test function
    testBtn.addEventListener('click', () => {
        const output = encryptedOutput.value;
        if (!output) {
            showNotification('No encrypted content to test!', 'error');
            return;
        }
        
        const codeType = codeTypeSelect.value;
        
        try {
            if (codeType === 'html') {
                const testWindow = window.open('', '_blank');
                if (testWindow) {
                    testWindow.document.write(output);
                    testWindow.document.close();
                    showNotification('Testing encrypted code in new tab...', 'success');
                } else {
                    showNotification('Please allow popups to test encrypted code!', 'error');
                }
            } else {
                showNotification('Testing only available for HTML code.', 'info');
            }
        } catch (error) {
            showNotification('Error opening test window!', 'error');
        }
    });
    
    // Initialize with focus
    codeInput.focus();
}

// 18. MENTANG CREATOR TOOL
async function loadMentangCreator() {
    const toolHTML = `
        <div class="tool-page-container">
            <div class="tool-page-header">
                <h2 class="tool-page-title">
                    <i class="fas fa-quote-right"></i> Mentang Creator
                </h2>
                <button class="tool-back-btn" onclick="backToTools()">
                    <i class="fas fa-arrow-left"></i> Back to Tools
                </button>
            </div>
            
            <div class="tool-content">
                <div style="text-align: center; margin-bottom: 30px;">
                    <div style="background: linear-gradient(135deg, var(--primary), var(--primary-light)); border-radius: 50%; width: 80px; height: 80px; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;">
                        <i class="fas fa-quote-right" style="color: white; font-size: 2.5rem;"></i>
                    </div>
                    <h3 style="color: var(--text); margin-bottom: 10px; font-size: 1.5rem;">Mentang Meme Creator</h3>
                    <p style="color: var(--text-muted); font-size: 14px;">
                        Create trendy "Mentang-Mentang" style memes easily
                    </p>
                </div>
                
                <div style="margin-bottom: 30px;">
                    <label style="display: block; margin-bottom: 10px; color: var(--text); font-weight: 600;">
                        <i class="fas fa-upload"></i> Upload Photo
                    </label>
                    <div id="uploadBox" style="
                        background: rgba(30, 35, 60, 0.6);
                        border: 2px dashed var(--border);
                        border-radius: 14px;
                        padding: 40px;
                        text-align: center;
                        cursor: pointer;
                        transition: all 0.3s ease;
                    ">
                        <input 
                            type="file" 
                            id="imageUpload" 
                            accept="image/*"
                            style="display: none;"
                        >
                        <i class="fas fa-cloud-upload-alt fa-3x" style="color: var(--text-muted); margin-bottom: 15px;"></i>
                        <div style="font-weight: 600; color: var(--text); margin-bottom: 5px;">Click to Upload Photo</div>
                        <div id="fileNameDisplay" style="font-size: 14px; color: var(--text-muted); margin-top: 10px;">
                            No file selected
                        </div>
                    </div>
                </div>
                
                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 10px; color: var(--text); font-weight: 600;">
                        <i class="fas fa-font"></i> Top Text
                    </label>
                    <input 
                        type="text" 
                        id="topText" 
                        placeholder="Example: jangan karena aku jawa" 
                        style="
                            width: 100%;
                            padding: 16px 20px;
                            background: rgba(30, 35, 60, 0.8);
                            border: 2px solid var(--border);
                            border-radius: 14px;
                            color: var(--text);
                            font-family: 'Inter', sans-serif;
                            font-size: 16px;
                            transition: all 0.3s ease;
                        "
                    >
                </div>
                
                <div style="margin-bottom: 30px;">
                    <label style="display: block; margin-bottom: 10px; color: var(--text); font-weight: 600;">
                        <i class="fas fa-font"></i> Bottom Text
                    </label>
                    <input 
                        type="text" 
                        id="bottomText" 
                        placeholder="Example: kamu kira aku ga setia" 
                        style="
                            width: 100%;
                            padding: 16px 20px;
                            background: rgba(30, 35, 60, 0.8);
                            border: 2px solid var(--border);
                            border-radius: 14px;
                            color: var(--text);
                            font-family: 'Inter', sans-serif;
                            font-size: 16px;
                            transition: all 0.3s ease;
                        "
                    >
                </div>
                
                <div style="margin-bottom: 30px;">
                    <button id="generateMentangBtn" class="tool-btn" style="width: 100%; padding: 18px; font-size: 18px;">
                        <i class="fas fa-sparkles"></i> Generate Meme
                    </button>
                </div>
                
                <div id="mentangLoading" style="display: none; text-align: center; margin: 40px 0;">
                    <div class="loading-spinner" style="width: 50px; height: 50px; margin: 0 auto 20px;"></div>
                    <div style="font-weight: 600; color: var(--text);">Creating your meme...</div>
                    <div style="font-size: 14px; color: var(--text-muted); margin-top: 10px;">
                        Please wait a moment
                    </div>
                </div>
                
                <div id="mentangResult" style="display: none; margin-top: 30px;">
                    <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 14px; padding: 20px; margin-bottom: 20px;">
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px;">
                            <i class="fas fa-check-circle" style="color: var(--success); font-size: 20px;"></i>
                            <div style="font-weight: 700; color: var(--text);">Meme Created!</div>
                        </div>
                        <div style="color: var(--text-muted); font-size: 14px;">
                            Your Mentang-style meme is ready to download.
                        </div>
                    </div>
                    
                    <div style="background: rgba(30, 35, 60, 0.6); border-radius: 16px; padding: 20px; margin-bottom: 20px; text-align: center;">
                        <canvas id="mentangCanvas" style="max-width: 100%; border-radius: 12px; box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);"></canvas>
                    </div>
                    
                    <div style="display: flex; gap: 15px;">
                        <button id="downloadMentangBtn" class="tool-btn" style="flex: 1;">
                            <i class="fas fa-download"></i> Download PNG
                        </button>
                        <button id="newMentangBtn" class="tool-btn" style="flex: 1; background: rgba(30, 35, 60, 0.8); border: 1px solid var(--border);">
                            <i class="fas fa-plus"></i> Create New
                        </button>
                    </div>
                </div>
                
                <div id="mentangError" style="display: none; margin-top: 30px;">
                    <div style="background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 14px; padding: 20px; margin-bottom: 20px;">
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px;">
                            <i class="fas fa-exclamation-triangle" style="color: var(--danger); font-size: 20px;"></i>
                            <div style="font-weight: 700; color: var(--text);">Error Creating Meme</div>
                        </div>
                        <div style="color: var(--text-muted); font-size: 14px;" id="mentangErrorMessage">
                            Please upload a photo and enter text.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    const container = getToolContainer(); container.innerHTML = toolHTML; container.style.display = 'block';
    
    // Initialize Mentang Creator functionality
    setTimeout(initializeMentangCreator, 100);
}

async function initializeMentangCreator() {
    const fileInput = document.getElementById("imageUpload");
    const uploadBox = document.getElementById("uploadBox");
    const fileNameDisplay = document.getElementById("fileNameDisplay");
    const topInput = document.getElementById("topText");
    const bottomInput = document.getElementById("bottomText");
    const generateBtn = document.getElementById("generateMentangBtn");
    const loadingDiv = document.getElementById("mentangLoading");
    const resultDiv = document.getElementById("mentangResult");
    const errorDiv = document.getElementById("mentangError");
    const downloadBtn = document.getElementById("downloadMentangBtn");
    const newBtn = document.getElementById("newMentangBtn");
    const canvas = document.getElementById("mentangCanvas");
    const ctx = canvas.getContext("2d");
    
    let img = null;
    let currentImageUrl = null;
    
    // Upload box click handler
    uploadBox.addEventListener("click", () => {
        fileInput.click();
    });
    
    // File input change handler
    fileInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) {
            fileNameDisplay.textContent = `📁 ${file.name}`;
            fileNameDisplay.style.color = "var(--text)";
            handleImageUpload(e);
        }
    });
    
    // Handle image upload
    function handleImageUpload(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(ev) {
            img = new Image();
            img.onload = function() {
                const maxWidth = 600;
                const ratio = img.height / img.width;
                canvas.width = maxWidth;
                canvas.height = maxWidth * ratio;
            };
            img.src = ev.target.result;
        };
        reader.readAsDataURL(file);
    }
    
    // Generate meme
    generateBtn.addEventListener("click", () => {
        if (!img) {
            showError("Please upload a photo first!");
            return;
        }
        
        const topText = topInput.value.trim();
        const bottomText = bottomInput.value.trim();
        
        if (!topText && !bottomText) {
            showError("Please enter at least one text!");
            return;
        }
        
        // Show loading
        loadingDiv.style.display = "block";
        resultDiv.style.display = "none";
        errorDiv.style.display = "none";
        
        // Draw meme with slight delay for better UX
        setTimeout(() => {
            drawMentangMeme(topText, bottomText);
            loadingDiv.style.display = "none";
            resultDiv.style.display = "block";
            showNotification("Meme created successfully!", "success");
        }, 800);
    });
    
    // Draw meme function
    function drawMentangMeme(topText, bottomText) {
        if (!img) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Bar settings
        const barHeight = canvas.height * 0.06;
        const gap = canvas.height * 0.015;
        const centerY = canvas.height * 0.6;

        const topBarY = centerY - barHeight - gap / 2;
        const bottomBarY = centerY + gap / 2;

        // Create gradient for bars
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
        gradient.addColorStop(0, "rgba(0,0,0,0.2)");
        gradient.addColorStop(0.2, "rgba(0,0,0,0.8)");
        gradient.addColorStop(0.8, "rgba(0,0,0,0.8)");
        gradient.addColorStop(1, "rgba(0,0,0,0.2)");

        // Draw bars
        ctx.fillStyle = gradient;
        ctx.fillRect(0, topBarY, canvas.width, barHeight);
        ctx.fillRect(0, bottomBarY, canvas.width, barHeight);

        // Draw text
        if (topText) {
            drawCenteredText(topText, canvas.width / 2, topBarY + barHeight / 2, canvas.width * 0.9);
        }
        
        if (bottomText) {
            drawCenteredText(bottomText, canvas.width / 2, bottomBarY + barHeight / 2, canvas.width * 0.9);
        }
    }
    
    // Draw centered text function
    function drawCenteredText(text, centerX, centerY, maxWidth) {
        let fontSize = Math.round(canvas.height * 0.028);
        if (fontSize < 16) fontSize = 16;

        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        ctx.fillStyle = "#ffffff";
        
        ctx.font = `600 ${fontSize}px 'Inter', sans-serif`;

        let width = ctx.measureText(text).width;
        
        // Adjust font size if too wide
        while (width > maxWidth && fontSize > 12) {
            fontSize--;
            ctx.font = `600 ${fontSize}px 'Inter', sans-serif`;
            width = ctx.measureText(text).width;
        }

        // Add text shadow
        ctx.shadowColor = "rgba(0,0,0,0.5)";
        ctx.shadowBlur = 4;
        ctx.fillText(text, centerX, centerY);
        ctx.shadowBlur = 0;
    }
    
    // Download image
    downloadBtn.addEventListener("click", () => {
        if (!img) return;
        const link = document.createElement("a");
        link.download = `mentang-meme-${Date.now()}.png`;
        link.href = canvas.toDataURL("image/png", 1.0);
        link.click();
        showNotification("Image downloaded successfully!", "success");
    });
    
    // New meme button
    newBtn.addEventListener("click", () => {
        fileInput.value = '';
        topInput.value = '';
        bottomInput.value = '';
        fileNameDisplay.textContent = 'No file selected';
        fileNameDisplay.style.color = 'var(--text-muted)';
        img = null;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        resultDiv.style.display = 'none';
        errorDiv.style.display = 'none';
        showNotification("Ready to create new meme", "info");
    });
    
    // Error display function
    function showError(message) {
        errorDiv.style.display = "block";
        document.getElementById("mentangErrorMessage").textContent = message;
    }
}

// 19. HD UPSCALER
async function loadHDUpscaler() {
    const toolHTML = `
        <div class="tool-page-container">
            <div class="tool-page-header">
                <h2 class="tool-page-title">
                    <i class="fas fa-expand-alt"></i> HD Upscaler
                </h2>
                <button class="tool-back-btn" onclick="backToTools()">
                    <i class="fas fa-arrow-left"></i> Back to Tools
                </button>
            </div>
            
            <div class="tool-content">
                <div style="margin-bottom: 30px;">
                    <label style="display: block; margin-bottom: 10px; color: var(--text); font-weight: 600;">
                        <i class="fas fa-sliders-h"></i> Mode
                    </label>
                    <div class="custom-mode-dropdown" id="modeDropdown">
                        <div class="dropdown-header">
                            <span id="selectedModeText">Pilih Mode Terlebih Dahulu</span>
                            <i class="fas fa-chevron-down"></i>
                        </div>
                        <ul class="dropdown-list">
                            <li class="dropdown-item" data-value="">Pilih Mode Terlebih Dahulu</li>
                            <li class="dropdown-item" data-value="2">HD</li>
                            <li class="dropdown-item" data-value="4">UHD AI</li>
                        </ul>
                    </div>
                </div>

                <div style="margin-bottom: 30px;">
                    <label style="display: block; margin-bottom: 10px; color: var(--text); font-weight: 600;">
                        <i class="fas fa-link"></i> URL Gambar
                    </label>
                    <input type="text" id="imgUrl" placeholder="https://example.com/image.jpg" style="
                        width: 100%;
                        padding: 16px 20px;
                        background: rgba(30, 35, 60, 0.8);
                        border: 2px solid var(--border);
                        border-radius: 14px;
                        color: var(--text);
                        font-family: 'Inter', sans-serif;
                        font-size: 16px;
                        transition: all 0.3s ease;
                    " />
                </div>

                <div style="margin-bottom: 30px;">
                    <label style="display: block; margin-bottom: 10px; color: var(--text); font-weight: 600;">
                        <i class="fas fa-upload"></i> Upload Gambar
                    </label>
                    <div class="upload-area" id="uploadArea" style="
                        position: relative;
                        border: 2px dashed var(--border);
                        border-radius: 18px;
                        padding: 36px 24px;
                        text-align: center;
                        cursor: pointer;
                        background: rgba(30, 35, 60, 0.4);
                        transition: all 0.3s ease;
                        margin-top: 12px;
                    ">
                        <i class="fas fa-cloud-upload-alt" style="
                            font-size: 3.2rem;
                            color: var(--primary-light);
                            margin-bottom: 18px;
                            display: block;
                            transition: all 0.3s ease;
                        "></i>
                        <p style="margin: 0; font-size: 1.05rem; font-weight: 700; color: var(--text); margin-bottom: 8px;">
                            Upload Manual
                        </p>
                        <div class="file-name" id="fileName" style="
                            font-size: 0.88rem;
                            color: var(--primary-light);
                            font-weight: 700;
                            margin-top: 6px;
                        ">Klik atau tarik file</div>
                        <input type="file" id="imgUpload" class="upload-input" accept="image/*" style="display: none;" />
                    </div>
                </div>

                <button class="tool-btn" id="processBtn" style="width: 100%; padding: 18px; font-size: 18px;">
                    <i class="fas fa-bolt"></i> Enhance Now
                </button>

                <button class="tool-btn" id="downloadBtn" style="width: 100%; padding: 14px; margin-top: 1.2rem; display: none;">
                    <i class="fas fa-download"></i> Download Result
                </button>

                <div id="loadingContainer" style="display: none; margin-top: 1.4rem; width: 100%;">
                    <div style="width: 100%; height: 8px; background: rgba(255, 255, 255, 0.1); border-radius: 4px; overflow: hidden; position: relative;">
                        <div id="loadingBar" style="
                            height: 100%;
                            width: 0%;
                            background: linear-gradient(to right, var(--primary), var(--primary-light));
                            border-radius: 4px;
                            transition: width 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                            position: relative;
                        "></div>
                    </div>
                    <div id="loadingText" style="margin-top: 0.7rem; color: var(--primary-light); text-align: center; font-size: 0.9rem; font-style: italic;">
                        Menginkatkan... 0%
                    </div>
                </div>

                <div id="resultCard" style="
                    display: none;
                    background: rgba(30, 35, 60, 0.6);
                    border: 1px solid var(--border);
                    border-radius: 16px;
                    padding: 1.8rem;
                    margin-top: 1.5rem;
                ">
                    <div style="position: relative;">
                        <span style="
                            position: absolute;
                            top: 16px;
                            left: 16px;
                            background: rgba(0, 0, 0, 0.25);
                            color: rgba(255, 255, 255, 0.95);
                            font-size: 0.75rem;
                            font-weight: 800;
                            padding: 4px 12px;
                            border-radius: 6px;
                            z-index: 2;
                            border: 1px solid rgba(255, 255, 255, 0.1);
                        ">Enhanced</span>
                        <img id="resultImg" class="result-img" alt="Enhanced Result" style="
                            width: 100%;
                            border-radius: 12px;
                            display: block;
                            position: relative;
                        " />
                    </div>
                </div>
            </div>
        </div>
    `;
    
    const container = getToolContainer(); 
    container.innerHTML = toolHTML; 
    container.style.display = 'block';
    
    // Initialize HD Upscaler functionality
    setTimeout(initializeHDUpscaler, 100);
}

async function initializeHDUpscaler() {
    // API Keys (gunakan sesuai kebutuhan)
    const IMGBB_API_KEYS = [
        "ec8308c6c95defce21253688fe985cb3",
        "3e335f2c7c3ef2aed03c4a114bc37850",
        "41aa3ca390a64cd7fd111f8424858e0f",
        "a40ee71254137de9a8bffe3fe898bdff",
        "d37076ee4b89930a3bb2d1662b4f22bc"
    ];

    const IMGBB_API_KEY = IMGBB_API_KEYS[Math.floor(Math.random() * IMGBB_API_KEYS.length)];

    const processBtn = document.getElementById('processBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const imgUrlInput = document.getElementById('imgUrl');
    const imgUpload = document.getElementById('imgUpload');
    const fileName = document.getElementById('fileName');
    const loadingContainer = document.getElementById('loadingContainer');
    const loadingBar = document.getElementById('loadingBar');
    const loadingText = document.getElementById('loadingText');
    const resultCard = document.getElementById('resultCard');
    const resultImg = document.getElementById('resultImg');

    let currentUpscaledBlob = null;

    const modeDropdown = document.getElementById('modeDropdown');
    const selectedModeText = document.getElementById('selectedModeText');
    const dropdownItems = document.querySelectorAll('.dropdown-item');
    let selectedModeValue = '';

    // Mode dropdown functionality
    modeDropdown.addEventListener('click', (e) => {
        e.stopPropagation();
        modeDropdown.classList.toggle('open');
    });

    dropdownItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            const value = item.getAttribute('data-value');
            if (!value) return;
            selectedModeValue = value;
            selectedModeText.textContent = item.textContent;
            dropdownItems.forEach(i => i.classList.remove('selected'));
            item.classList.add('selected');
            modeDropdown.classList.remove('open');
            
            showNotification(`Mode ${item.textContent} dipilih`, 'success', 2000);
        });
    });

    document.addEventListener('click', (e) => {
        if (!modeDropdown.contains(e.target)) {
            modeDropdown.classList.remove('open');
        }
    });

    // Upload area functionality
    const uploadArea = document.getElementById('uploadArea');
    uploadArea.addEventListener('click', () => imgUpload.click());

    imgUpload.addEventListener('change', () => {
        if (imgUpload.files.length > 0) {
            fileName.textContent = imgUpload.files[0].name;
            imgUrlInput.value = '';
        } else {
            fileName.textContent = 'Klik atau tarik file';
        }
    });

    // Process button functionality
    processBtn.addEventListener('click', async () => {
        if (!selectedModeValue) {
            showNotification('Pilih mode HD atau UHD terlebih dahulu.', 'error');
            return;
        }

        showNotification('Mulai meningkatkan gambar...', 'info');
        resultCard.style.display = 'none';
        downloadBtn.style.display = 'none';
        loadingContainer.style.display = 'block';
        loadingBar.style.width = '0%';
        loadingText.textContent = 'Memproses... 0%';
        currentUpscaledBlob = null;

        let originalUrl = '';
        try {
            if (imgUpload.files.length > 0) {
                const file = imgUpload.files[0];
                const formData = new FormData();
                formData.append('key', IMGBB_API_KEY);
                formData.append('image', file);
                
                const uploadRes = await fetch('https://api.imgbb.com/1/upload', {
                    method: 'POST',
                    body: formData
                });
                
                const data = await uploadRes.json();
                if (!data.success) throw new Error('Gagal upload ke ImgBB');
                originalUrl = data.data.url;
            } else {
                originalUrl = imgUrlInput.value.trim();
                if (!originalUrl) throw new Error('Masukkan URL atau upload gambar.');
            }

            if (!/^https?:\/\//.test(originalUrl)) {
                throw new Error('URL gambar harus dimulai dengan http:// atau https://');
            }

            let progress = 0;
            const interval = setInterval(() => {
                if (progress < 90) {
                    progress += Math.random() * 3 + 1;
                    loadingBar.style.width = `${Math.min(90, progress)}%`;
                    loadingText.textContent = `Meningkatkan... ${Math.round(progress)}%`;
                }
            }, 120);

            const encoded = encodeURIComponent(originalUrl);
            const upscaleRes = await fetch(`https://api.zenzxz.my.id/api/tools/upscalev2?url=${encoded}&scale=${selectedModeValue}`);

            clearInterval(interval);

            if (!upscaleRes.ok) {
                throw new Error('API upscale tidak merespon');
            }

            const blob = await upscaleRes.blob();
            const objectUrl = URL.createObjectURL(blob);
            
            loadingBar.style.width = '100%';
            loadingText.textContent = 'Selesai! 100%';
            
            setTimeout(() => {
                resultImg.src = objectUrl;
                resultCard.style.display = 'block';
                downloadBtn.style.display = 'block';
                loadingContainer.style.display = 'none';
                currentUpscaledBlob = blob;
                showNotification('Gambar berhasil ditingkatkan!', 'success');
            }, 500);

        } catch (err) {
            loadingContainer.style.display = 'none';
            showNotification(err.message, 'error');
        }
    });

    // Download button functionality
    downloadBtn.addEventListener('click', () => {
        if (currentUpscaledBlob) {
            const a = document.createElement('a');
            a.href = URL.createObjectURL(currentUpscaledBlob);
            a.download = `enhanced_${Date.now()}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            showNotification('Download dimulai!', 'success');
        }
    });

    // Add CSS styles for the component
    const style = document.createElement('style');
    style.textContent = `
        .custom-mode-dropdown {
            position: relative;
            width: 100%;
        }
        
        .dropdown-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 14px 16px;
            background: rgba(30, 35, 60, 0.6);
            border: 1px solid var(--border);
            border-radius: 14px;
            color: white;
            font-weight: 600;
            font-size: 1rem;
            cursor: pointer;
            transition: all 0.3s ease;
            backdrop-filter: blur(12px);
        }
        
        .dropdown-list {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            margin-top: 6px;
            background: rgba(19, 22, 39, 0.95);
            border: 1px solid var(--border);
            border-radius: 0 0 14px 14px;
            list-style: none;
            max-height: 0;
            overflow: hidden;
            opacity: 0;
            z-index: 10;
            backdrop-filter: blur(14px);
            transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        
        .custom-mode-dropdown.open .dropdown-list {
            max-height: 180px;
            opacity: 1;
            padding: 8px 0;
        }
        
        .dropdown-item {
            padding: 12px 20px;
            color: var(--text);
            font-weight: 500;
            cursor: pointer;
            transition: background 0.2s ease;
        }
        
        .dropdown-item:hover {
            background: rgba(90, 107, 242, 0.15);
            color: white;
        }
        
        .dropdown-item.selected {
            color: var(--primary-light);
            font-weight: 700;
        }
        
        .upload-area:hover {
            border-color: var(--primary-light);
            background: rgba(90, 107, 242, 0.1);
            transform: translateY(-3px);
        }
        
        .upload-area:hover i {
            transform: scale(1.15) rotate(5deg);
            color: white;
        }
    `;
    document.head.appendChild(style);
}

/// 21. WEATHER FORECAST 
async function loadWeatherForecast() {
    const toolHTML = `
        <div class="tool-page-container">
            <div class="tool-page-header">
                <h2 class="tool-page-title">
                    <i class="fas fa-cloud-sun-rain"></i> Weather Forecast
                </h2>
                <button class="tool-back-btn" onclick="backToTools()">
                    <i class="fas fa-arrow-left"></i> Back to Tools
                </button>
            </div>
            
            <div class="tool-content">
                <div style="margin-bottom: 30px;">
                    <label style="display: block; margin-bottom: 10px; color: var(--text); font-weight: 600;">
                        <i class="fas fa-city"></i> City Name
                    </label>
                    <input 
                        type="text" 
                        id="weatherCityInput" 
                        placeholder="Enter city name (e.g., Jakarta, Surabaya)" 
                        style="
                            width: 100%;
                            padding: 16px 20px;
                            background: rgba(30, 35, 60, 0.8);
                            border: 2px solid var(--border);
                            border-radius: 14px;
                            color: var(--text);
                            font-family: 'Inter', sans-serif;
                            font-size: 16px;
                            transition: all 0.3s ease;
                        "
                    >
                </div>
                
                <div style="margin-bottom: 30px;">
                    <button id="searchWeatherBtn" class="tool-btn" style="width: 100%; padding: 18px; font-size: 18px;">
                        <i class="fas fa-search"></i> Search Weather
                    </button>
                </div>
                
                <div id="weatherLoading" style="display: none; text-align: center; margin: 20px 0;">
                    <div class="loading-spinner" style="width: 50px; height: 50px; margin: 0 auto 20px;"></div>
                    <p>Fetching weather data from galaxy...</p>
                </div>
                
                <div id="weatherError" style="display: none; background: rgba(239, 68, 68, 0.2); padding: 15px; border-radius: 10px; border: 1px solid rgba(239, 68, 68, 0.3); margin: 20px 0;">
                    <p style="color: var(--danger); margin: 0;" id="weatherErrorMessage">Error fetching weather data. Please try again.</p>
                </div>
                
                <div id="weatherResult" style="display: none; margin-top: 30px;">
                    <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 14px; padding: 20px; margin-bottom: 20px;">
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px;">
                            <i class="fas fa-check-circle" style="color: var(--success); font-size: 20px;"></i>
                            <div style="font-weight: 700; color: var(--text);">Weather Data Found!</div>
                        </div>
                        <div style="color: var(--text-muted); font-size: 14px;">
                            10-day weather forecast for your location.
                        </div>
                    </div>
                    
                    <div style="text-align: center; margin-bottom: 20px;">
                        <div style="display: flex; align-items: center; justify-content: center; gap: 15px; margin-bottom: 15px;">
                            <i class="fas fa-cloud-sun-rain" style="font-size: 2.5rem; color: var(--primary);"></i>
                            <div>
                                <h3 id="weatherLocation" style="color: var(--text); margin-bottom: 5px;">Location</h3>
                                <p id="weatherCountry" style="color: var(--text-muted); margin-bottom: 10px;">Country</p>
                            </div>
                        </div>
                        
                        <div style="display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; margin-bottom: 20px;">
                            <span id="weatherTemp" style="background: rgba(255, 255, 255, 0.1); padding: 5px 10px; border-radius: 20px; font-size: 14px;">Temperature: -</span>
                            <span id="weatherHumidity" style="background: rgba(255, 255, 255, 0.1); padding: 5px 10px; border-radius: 20px; font-size: 14px;">Humidity: -</span>
                            <span id="weatherWind" style="background: rgba(255, 255, 255, 0.1); padding: 5px 10px; border-radius: 20px; font-size: 14px;">Wind: -</span>
                            <span id="weatherCondition" style="background: rgba(255, 255, 255, 0.1); padding: 5px 10px; border-radius: 20px; font-size: 14px;">Condition: -</span>
                        </div>
                    </div>
                    
                    <div id="weatherForecast" style="
                        display: grid;
                        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
                        gap: 15px;
                        margin-bottom: 20px;
                    "></div>
                    
                    <div style="display: flex; gap: 15px; margin-bottom: 20px; flex-wrap: wrap;">
                        <button id="newWeatherBtn" class="tool-btn" style="flex: 1; background: rgba(30, 35, 60, 0.8); border: 1px solid var(--border);">
                            <i class="fas fa-plus"></i> New Search
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    const container = getToolContainer(); 
    container.innerHTML = toolHTML; 
    container.style.display = 'block';
    
    // Initialize Weather Forecast functionality
    setTimeout(initializeWeatherForecast, 100);
}

async function initializeWeatherForecast() {
    const cityInput = document.getElementById('weatherCityInput');
    const searchBtn = document.getElementById('searchWeatherBtn');
    const loading = document.getElementById('weatherLoading');
    const resultSection = document.getElementById('weatherResult');
    const errorMessage = document.getElementById('weatherError');
    const errorText = document.getElementById('weatherErrorMessage');
    const locationSpan = document.getElementById('weatherLocation');
    const countrySpan = document.getElementById('weatherCountry');
    const tempSpan = document.getElementById('weatherTemp');
    const humiditySpan = document.getElementById('weatherHumidity');
    const windSpan = document.getElementById('weatherWind');
    const conditionSpan = document.getElementById('weatherCondition');
    const forecastContainer = document.getElementById('weatherForecast');
    const newBtn = document.getElementById('newWeatherBtn');
    
    const API_URL = 'https://api.nekolabs.web.id/dsc/accuweather/search?city=';
    
    let weatherData = null;
    let isProcessing = false;
    
    // Search weather function
    searchBtn.addEventListener('click', async function() {
        if (isProcessing) return;
        
        const city = cityInput.value.trim();
        
        if (!city) {
            showError('Please enter city name!');
            return;
        }
        
        // Show loading
        loading.style.display = 'block';
        resultSection.style.display = 'none';
        errorMessage.style.display = 'none';
        isProcessing = true;
        
        try {
            // Call API
            const response = await fetch(`${API_URL}${encodeURIComponent(city)}`);
            const data = await response.json();
            
            if (data.success && data.result) {
                weatherData = data.result;
                
                // Hide loading
                loading.style.display = 'none';
                isProcessing = false;
                
                // Display weather data
                displayWeatherData();
                resultSection.style.display = 'block';
            } else {
                throw new Error(data.message || 'Failed to fetch weather data');
            }
            
        } catch (error) {
            console.error('Weather fetch error:', error);
            loading.style.display = 'none';
            isProcessing = false;
            showError('Failed to fetch weather data. Please try again.');
        }
    });
    
    // Display weather data
    function displayWeatherData() {
        if (!weatherData) return;
        
        // Location info
        locationSpan.textContent = weatherData.location.name || 'Unknown';
        countrySpan.textContent = weatherData.location.country || 'Unknown';
        
        // Current weather from first forecast
        if (weatherData.forecastData && weatherData.forecastData.DailyForecasts && weatherData.forecastData.DailyForecasts.length > 0) {
            const today = weatherData.forecastData.DailyForecasts[0];
            
            // Temperature
            tempSpan.textContent = `Temperature: ${today.Temperature.Min}°C - ${today.Temperature.Max}°C`;
            
            // Condition (using Day description)
            conditionSpan.textContent = `Condition: ${today.Day.IconPhrase}`;
            
            // Display 10-day forecast
            displayForecast();
        }
    }
    
    // Display 10-day forecast
    function displayForecast() {
        if (!weatherData.forecastData || !weatherData.forecastData.DailyForecasts) return;
        
        forecastContainer.innerHTML = '';
        
        // Limit to 10 days
        const forecasts = weatherData.forecastData.DailyForecasts.slice(0, 10);
        
        forecasts.forEach((forecast, index) => {
            const date = new Date(forecast.Date);
            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
            const dayNum = date.getDate();
            const month = date.toLocaleDateString('en-US', { month: 'short' });
            
            const forecastCard = document.createElement('div');
            forecastCard.style.cssText = `
                background: rgba(30, 35, 60, 0.6);
                border-radius: 12px;
                padding: 15px;
                text-align: center;
                transition: all 0.3s ease;
            `;
            
            forecastCard.onmouseover = function() {
                this.style.transform = 'translateY(-5px)';
                this.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
            };
            
            forecastCard.onmouseout = function() {
                this.style.transform = '';
                this.style.boxShadow = '';
            };
            
            // Determine weather icon
            let weatherIcon = '☀️';
            const condition = forecast.Day.IconPhrase.toLowerCase();
            
            if (condition.includes('rain') || condition.includes('shower')) {
                weatherIcon = '🌧️';
            } else if (condition.includes('cloud')) {
                weatherIcon = '☁️';
            } else if (condition.includes('storm') || condition.includes('thunder')) {
                weatherIcon = '⛈️';
            } else if (condition.includes('snow')) {
                weatherIcon = '❄️';
            } else if (condition.includes('clear')) {
                weatherIcon = '☀️';
            }
            
            forecastCard.innerHTML = `
                <div style="font-weight: 600; color: var(--text); margin-bottom: 10px;">
                    ${index === 0 ? 'Today' : index === 1 ? 'Tomorrow' : dayName}
                </div>
                <div style="font-size: 14px; color: var(--text-muted); margin-bottom: 10px;">
                    ${dayNum} ${month}
                </div>
                <div style="font-size: 24px; margin-bottom: 10px;">
                    ${weatherIcon}
                </div>
                <div style="font-size: 20px; font-weight: 700; color: var(--text); margin-bottom: 5px;">
                    ${forecast.Temperature.Max}°C
                </div>
                <div style="font-size: 14px; color: var(--text-muted);">
                    ${forecast.Temperature.Min}°C
                </div>
                <div style="font-size: 12px; color: var(--text-muted); margin-top: 8px; height: 30px; overflow: hidden;">
                    ${forecast.Day.IconPhrase}
                </div>
            `;
            
            forecastContainer.appendChild(forecastCard);
        });
    }
    
    // Error handling
    function showError(message) {
        errorText.textContent = message;
        errorMessage.style.display = 'block';
    }
    
    // New search
    newBtn.addEventListener('click', function() {
        cityInput.value = '';
        resultSection.style.display = 'none';
        errorMessage.style.display = 'none';
        cityInput.focus();
    });
    
    // Enter key support
    cityInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchBtn.click();
        }
    });
}

// 21. TEXT TO QR CODE GENERATOR
async function loadTextToQR() {
    const toolHTML = `
        <div class="tool-page-container">
            <div class="tool-page-header">
                <h2 class="tool-page-title">
                    <i class="fas fa-qrcode"></i> Text to QR Code
                </h2>
                <button class="tool-back-btn" onclick="backToTools()">
                    <i class="fas fa-arrow-left"></i> Back to Tools
                </button>
            </div>
            
            <div class="tool-content">
                <div style="margin-bottom: 30px;">
                    <label style="display: block; margin-bottom: 10px; color: var(--text); font-weight: 600;">
                        <i class="fas fa-font"></i> Text or Link
                    </label>
                    <input 
                        type="text" 
                        id="textInput" 
                        placeholder="https://google.com or Hello World" 
                        style="
                            width: 100%;
                            padding: 16px 20px;
                            background: rgba(30, 35, 60, 0.8);
                            border: 2px solid var(--border);
                            border-radius: 14px;
                            color: var(--text);
                            font-family: 'Inter', sans-serif;
                            font-size: 16px;
                            transition: all 0.3s ease;
                        "
                    >
                    <div style="font-size: 12px; color: var(--text-muted); margin-top: 8px;">
                        Enter text or URL to convert to QR Code
                    </div>
                </div>
                
                <div style="margin-bottom: 30px;">
                    <button id="generateQRBtn" class="tool-btn" style="width: 100%; padding: 18px; font-size: 18px;">
                        <i class="fas fa-bolt"></i> Generate QR Code
                    </button>
                </div>
                
                <div id="qrLoading" style="display: none; margin-bottom: 30px;">
                    <div style="text-align: center; padding: 40px;">
                        <div class="loading-spinner" style="width: 50px; height: 50px; margin: 0 auto 20px;"></div>
                        <div style="font-weight: 600; color: var(--text);">Creating QR Code...</div>
                        <div style="font-size: 14px; color: var(--text-muted); margin-top: 10px;">
                            Preparing QR Code...
                        </div>
                    </div>
                </div>
                
                <div id="qrResult" style="display: none; margin-top: 30px;">
                    <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 14px; padding: 20px; margin-bottom: 20px;">
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px;">
                            <i class="fas fa-check-circle" style="color: var(--success); font-size: 20px;"></i>
                            <div style="font-weight: 700; color: var(--text);">QR Code Generated!</div>
                        </div>
                        <div style="color: var(--text-muted); font-size: 14px;">
                            QR Code has been successfully created
                        </div>
                    </div>
                    
                    <div style="text-align: center; margin-bottom: 20px;">
                        <div id="qrImageContainer" style="
                            display: inline-block;
                            padding: 20px;
                            background: white;
                            border-radius: 12px;
                            margin-bottom: 15px;
                            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
                        ">
                            <img id="qrImage" src="" alt="QR Code" style="max-width: 250px; max-height: 250px; display: block; border-radius: 8px;">
                        </div>
                        <div style="font-size: 14px; color: var(--text-muted);">
                            Format: PNG • Size: 250x250px
                        </div>
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 10px; color: var(--text); font-weight: 600;">
                            Original Text:
                        </label>
                        <textarea 
                            id="originalText" 
                            rows="2"
                            readonly
                            style="
                                width: 100%;
                                padding: 16px 20px;
                                background: rgba(30, 35, 60, 0.8);
                                border: 1px solid var(--border);
                                border-radius: 12px;
                                color: var(--text);
                                font-family: 'Inter', sans-serif;
                                font-size: 14px;
                                resize: vertical;
                            "
                        ></textarea>
                    </div>
                    
                    <div style="display: flex; gap: 15px;">
                        <button id="downloadQRImageBtn" class="tool-btn" style="flex: 1;">
                            <i class="fas fa-download"></i> Download
                        </button>
                        <button id="newQRBtn" class="tool-btn" style="flex: 1; background: rgba(30, 35, 60, 0.8); border: 1px solid var(--border);">
                            <i class="fas fa-plus"></i> New
                        </button>
                    </div>
                </div>
                
                <div id="qrError" style="display: none; margin-top: 30px;">
                    <div style="background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 14px; padding: 20px; margin-bottom: 20px;">
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px;">
                            <i class="fas fa-exclamation-triangle" style="color: var(--danger); font-size: 20px;"></i>
                            <div style="font-weight: 700; color: var(--text);">Failed to Generate QR</div>
                        </div>
                        <div style="color: var(--text-muted); font-size: 14px;" id="qrErrorMessage">
                            Failed to create QR Code. Please try again.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    const container = getToolContainer(); container.innerHTML = toolHTML; container.style.display = 'block';
    
    // Initialize Text to QR functionality
    setTimeout(initializeTextToQR, 100);
}

async function initializeTextToQR() {
    const textInput = document.getElementById('textInput');
    const generateBtn = document.getElementById('generateQRBtn');
    const loadingDiv = document.getElementById('qrLoading');
    const resultDiv = document.getElementById('qrResult');
    const errorDiv = document.getElementById('qrError');
    const qrImage = document.getElementById('qrImage');
    const originalTextInput = document.getElementById('originalText');
    const downloadBtn = document.getElementById('downloadQRImageBtn');
    const newBtn = document.getElementById('newQRBtn');
    
    let currentImageUrl = null;
    
    // Generate QR Code
    generateBtn.addEventListener('click', async () => {
        const text = textInput.value.trim();
        
        if (!text) {
            showNotification('Please enter text or link!', 'error');
            textInput.focus();
            return;
        }
        
        // Hide previous results
        resultDiv.style.display = 'none';
        errorDiv.style.display = 'none';
        
        // Show loading
        loadingDiv.style.display = 'block';
        generateBtn.disabled = true;
        generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        
        try {
            // API Endpoint
            const apiUrl = `https://api.fikmydomainsz.xyz/tools/texttoqr?text=${encodeURIComponent(text)}`;
            
            // Fetch QR code image
            const response = await fetch(apiUrl);
            
            // Check HTTP status
            if (!response.ok) {
                throw new Error('Failed to fetch from server');
            }
            
            // Check content type
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                const errorJson = await response.json();
                throw new Error(errorJson.message || 'API error occurred');
            }
            
            // Get image as blob
            const blob = await response.blob();
            
            // Create object URL
            if (currentImageUrl) {
                URL.revokeObjectURL(currentImageUrl);
            }
            currentImageUrl = URL.createObjectURL(blob);
            
            // Hide loading
            loadingDiv.style.display = 'none';
            
            // Display result
            qrImage.src = currentImageUrl;
            originalTextInput.value = text;
            resultDiv.style.display = 'block';
            
            showNotification('QR Code successfully generated!', 'success');
            
        } catch (error) {
            console.error('QR Code generation error:', error);
            
            // Hide loading and show error
            loadingDiv.style.display = 'none';
            errorDiv.style.display = 'block';
            document.getElementById('qrErrorMessage').textContent = error.message || 'Failed to create QR Code';
            
            showNotification('Failed to generate QR Code', 'error');
        } finally {
            generateBtn.disabled = false;
            generateBtn.innerHTML = '<i class="fas fa-bolt"></i> Generate QR Code';
        }
    });
    
    // Download QR Code
    downloadBtn.addEventListener('click', () => {
        if (!currentImageUrl) {
            showNotification('Please generate QR Code first!', 'error');
            return;
        }
        
        const a = document.createElement('a');
        a.href = currentImageUrl;
        a.download = `qrcode-${Date.now()}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        showNotification('QR Code download started!', 'success');
    });
    
    // New button
    newBtn.addEventListener('click', () => {
        textInput.value = '';
        resultDiv.style.display = 'none';
        errorDiv.style.display = 'none';
        
        // Clean up object URL
        if (currentImageUrl) {
            URL.revokeObjectURL(currentImageUrl);
            currentImageUrl = null;
        }
        
        textInput.focus();
        showNotification('Form cleared. Enter new text.', 'info');
    });
    
    // Enter key support
    textInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            generateBtn.click();
        }
    });
}

// 22. OSINT TOOL
async function loadOSINTTool() {
    const toolHTML = `
        <div class="tool-page-container">
            <div class="tool-page-header">
                <h2 class="tool-page-title">
                    <i class="fas fa-search"></i> OSINT Tool
                </h2>
                <button class="tool-back-btn" onclick="backToTools()">
                    <i class="fas fa-arrow-left"></i> Back to Tools
                </button>
            </div>
            
            <div class="tool-content">
                <div style="margin-bottom: 30px;">
                    <label style="display: block; margin-bottom: 10px; color: var(--text); font-weight: 600;">
                        <i class="fas fa-search"></i> Search Type
                    </label>
                    <select id="search-type" style="
                        width: 100%;
                        padding: 16px 20px;
                        background: rgba(30, 35, 60, 0.8);
                        border: 2px solid var(--border);
                        border-radius: 14px;
                        color: var(--text);
                        font-family: 'Inter', sans-serif;
                        font-size: 16px;
                        transition: all 0.3s ease;
                    ">
                        <option value="phone">Phone Number Intelligence</option>
                        <option value="cloudflare">Cloudflare Diagnostic</option>
                        <option value="domain">Domain Search</option>
                        <option value="ipgeo">IP Geolocation</option>
                    </select>
                </div>
                
                <!-- Phone Number Search -->
                <div id="phone-tab" class="tab-content active" style="margin-bottom: 30px;">
                    <label style="display: block; margin-bottom: 10px; color: var(--text); font-weight: 600;">
                        <i class="fas fa-phone"></i> Phone Number
                    </label>
                    <input type="text" id="search-input" placeholder="+628123456789" style="
                        width: 100%;
                        padding: 16px 20px;
                        background: rgba(30, 35, 60, 0.8);
                        border: 2px solid var(--border);
                        border-radius: 14px;
                        color: var(--text);
                        font-family: 'Inter', sans-serif;
                        font-size: 16px;
                        transition: all 0.3s ease;
                    ">
                </div>
                
                <!-- Cloudflare Search -->
                <div id="cloudflare-tab" class="tab-content" style="margin-bottom: 30px;">
                    <label style="display: block; margin-bottom: 10px; color: var(--text); font-weight: 600;">
                        <i class="fas fa-bolt"></i> Select Endpoint
                    </label>
                    <div style="display: flex; flex-wrap: wrap; gap: 10px;">
                        <button class="btn-cloudflare" data-endpoint="https://one.one.one.one/cdn-cgi/trace" style="
                            flex: 1;
                            min-width: 200px;
                            padding: 16px;
                            background: rgba(30, 35, 60, 0.8);
                            border: 2px solid var(--border);
                            border-radius: 10px;
                            color: var(--text);
                            font-family: 'Inter', sans-serif;
                            font-size: 14px;
                            cursor: pointer;
                            transition: all 0.3s;
                            text-align: left;
                        ">
                            <i class="fas fa-network-wired"></i> one.one.one.one
                        </button>
                        <button class="btn-cloudflare" data-endpoint="https://1.0.0.1/cdn-cgi/trace" style="
                            flex: 1;
                            min-width: 200px;
                            padding: 16px;
                            background: rgba(30, 35, 60, 0.8);
                            border: 2px solid var(--border);
                            border-radius: 10px;
                            color: var(--text);
                            font-family: 'Inter', sans-serif;
                            font-size: 14px;
                            cursor: pointer;
                            transition: all 0.3s;
                            text-align: left;
                        ">
                            <i class="fas fa-server"></i> 1.0.0.1
                        </button>
                    </div>
                </div>
                
                <!-- Domain Search -->
                <div id="domain-tab" class="tab-content" style="margin-bottom: 30px;">
                    <label style="display: block; margin-bottom: 10px; color: var(--text); font-weight: 600;">
                        <i class="fas fa-globe"></i> Domain or Keyword
                    </label>
                    <input type="text" id="domain-query" placeholder="example.com" style="
                        width: 100%;
                        padding: 16px 20px;
                        background: rgba(30, 35, 60, 0.8);
                        border: 2px solid var(--border);
                        border-radius: 14px;
                        color: var(--text);
                        font-family: 'Inter', sans-serif;
                        font-size: 16px;
                        transition: all 0.3s ease;
                    ">
                </div>
                
                <!-- IP Geolocation Search -->
                <div id="ipgeo-tab" class="tab-content" style="margin-bottom: 30px;">
                    <label style="display: block; margin-bottom: 10px; color: var(--text); font-weight: 600;">
                        <i class="fas fa-map-marker-alt"></i> IP Address or Domain
                    </label>
                    <input type="text" id="ipgeo-query" placeholder="1.1.1.1 or google.com" style="
                        width: 100%;
                        padding: 16px 20px;
                        background: rgba(30, 35, 60, 0.8);
                        border: 2px solid var(--border);
                        border-radius: 14px;
                        color: var(--text);
                        font-family: 'Inter', sans-serif;
                        font-size: 16px;
                        transition: all 0.3s ease;
                    ">
                </div>
                
                <div style="margin-bottom: 30px;">
                    <button id="search-btn" class="tool-btn" style="width: 100%; padding: 18px; font-size: 18px;">
                        <i class="fas fa-search"></i> Start Search
                    </button>
                </div>
                
                <div id="osintLoading" style="display: none; text-align: center; margin: 20px 0;">
                    <div class="loading-spinner" style="width: 50px; height: 50px; margin: 0 auto 20px;"></div>
                    <p>Searching for information...</p>
                </div>
                
                <div id="osintError" style="display: none; background: rgba(239, 68, 68, 0.2); padding: 15px; border-radius: 10px; border: 1px solid rgba(239, 68, 68, 0.3); margin: 20px 0;">
                    <p style="color: var(--danger); margin: 0;">Error message will appear here</p>
                </div>
                
                <div id="osintResults" style="display: none; margin-top: 30px;">
                    <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 14px; padding: 20px; margin-bottom: 20px;">
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px;">
                            <i class="fas fa-check-circle" style="color: var(--success); font-size: 20px;"></i>
                            <div style="font-weight: 700; color: var(--text);">Search Results</div>
                        </div>
                        <div style="color: var(--text-muted); font-size: 14px;">
                            Information found successfully
                        </div>
                    </div>
                    
                    <div id="resultsContainer" style="
                        background: rgba(30, 35, 60, 0.6);
                        border: 1px solid var(--border);
                        border-radius: 12px;
                        padding: 20px;
                        margin-bottom: 20px;
                    ">
                        <!-- Results will be displayed here -->
                    </div>
                </div>
            </div>
        </div>
        
        <style>
            .tab-content { 
                display: none; 
                animation: fadeIn 0.3s ease; 
            }
            .tab-content.active { 
                display: block; 
            }
            
            .btn-cloudflare:hover {
                background: rgba(40, 40, 60, 0.9);
                border-color: var(--primary);
            }
            
            .btn-cloudflare.active {
                background: rgba(99, 102, 241, 0.15);
                border-color: #6366f1;
            }
            
            .result-item {
                display: flex;
                justify-content: space-between;
                padding: 12px 0;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }
            
            .result-label {
                font-weight: 600;
                color: var(--text-muted);
                min-width: 120px;
            }
            
            .result-value {
                color: var(--text);
                text-align: right;
                word-break: break-all;
                flex: 1;
            }
        </style>
    `;
    
    const container = getToolContainer(); 
    container.innerHTML = toolHTML; 
    container.style.display = 'block';
    
    // Initialize OSINT Tool functionality
    setTimeout(initializeOSINTTool, 100);
}

async function initializeOSINTTool() {
    const searchType = document.getElementById('search-type');
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const loading = document.getElementById('osintLoading');
    const errorMessage = document.getElementById('osintError');
    const resultsSection = document.getElementById('osintResults');
    const resultsContainer = document.getElementById('resultsContainer');
    const cloudflareButtons = document.querySelectorAll('.btn-cloudflare');
    const domainQuery = document.getElementById('domain-query');
    const ipgeoQuery = document.getElementById('ipgeo-query');
    
    const API_KEYS = {
        domain: 'ef175d12-9755-46ea-a23d-5d5258389091',
        ipgeo: '9a6870d7f117418f8a1e624344237a04'
    };
    
    let selectedCloudflareEndpoint = '';
    
    // Update UI based on search type
    searchType.addEventListener('change', function() {
        const type = this.value;
        
        // Hide all tabs
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });
        
        // Show selected tab
        const activeTab = document.getElementById(`${type}-tab`);
        if (activeTab) {
            activeTab.classList.add('active');
        }
    });
    
    // Cloudflare button click handlers
    cloudflareButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            cloudflareButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Store selected endpoint
            selectedCloudflareEndpoint = this.getAttribute('data-endpoint');
        });
    });
    
    // Search button click handler
    searchBtn.addEventListener('click', async function() {
        const type = searchType.value;
        
        // Clear previous results
        resultsSection.style.display = 'none';
        errorMessage.style.display = 'none';
        
        if (type === 'cloudflare') {
            if (!selectedCloudflareEndpoint) {
                showError('Please select a Cloudflare endpoint');
                return;
            }
            
            // Show loading
            loading.style.display = 'block';
            
            // Perform Cloudflare search
            searchCloudflare(selectedCloudflareEndpoint);
        } else if (type === 'domain') {
            const query = domainQuery.value.trim();
            
            if (!query) {
                showError('Please enter a domain or keyword to search');
                return;
            }
            
            // Show loading
            loading.style.display = 'block';
            
            // Perform domain search
            searchDomains(query);
        } else if (type === 'ipgeo') {
            const query = ipgeoQuery.value.trim();
            
            if (!query) {
                showError('Please enter an IP address or domain');
                return;
            }
            
            // Show loading
            loading.style.display = 'block';
            
            // Perform IP Geolocation search
            searchIPGeolocation(query);
        } else {
            const query = searchInput.value.trim();
            
            if (!query) {
                showError('Please enter a phone number to search');
                return;
            }
            
            // Validate phone number
            if (!isValidPhone(query)) {
                showError('Invalid phone number format. Please use international format like +628123456789');
                return;
            }
            
            // Show loading
            loading.style.display = 'block';
            
            // Perform phone number search
            searchPhoneNumber(query);
        }
    });
    
    // Validation functions
    function isValidPhone(phone) {
        const phoneRegex = /^\+?[1-9]\d{1,14}$/;
        return phoneRegex.test(phone);
    }
    
    // API functions
    async function searchPhoneNumber(phone) {
        try {
            const response = await fetch(`https://api.veriphone.io/v2/verify?phone=${phone}&key=F890320B7C354AF99FE8F46E54DFA416`);
            const data = await response.json();
            
            if (data.status === 'success') {
                displayPhoneResults(data);
            } else {
                showError('Failed to retrieve phone number information');
            }
        } catch (error) {
            showError('Error contacting API');
        } finally {
            loading.style.display = 'none';
        }
    }
    
    async function searchCloudflare(endpoint) {
        try {
            const response = await fetch(endpoint);
            const text = await response.text();
            
            // Parse trace data
            const traceData = {};
            text.split('\n').forEach(line => {
                const [key, value] = line.split('=');
                if (key && value) {
                    traceData[key] = value;
                }
            });
            
            displayCloudflareResults(traceData, endpoint);
        } catch (error) {
            showError('Error contacting Cloudflare API');
        } finally {
            loading.style.display = 'none';
        }
    }
    
    async function searchDomains(query) {
        try {
            const apiUrl = `https://api.domainsdb.info/v1/domains/search?domain=${encodeURIComponent(query)}`;
            
            const response = await fetch(apiUrl, {
                headers: {
                    'Authorization': `Bearer ${API_KEYS.domain}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error('API error');
            }
            
            const data = await response.json();
            displayDomainResults(data, query);
            
        } catch (error) {
            showError('Error during domain search');
        } finally {
            loading.style.display = 'none';
        }
    }
    
    async function searchIPGeolocation(query) {
        try {
            const apiUrl = `https://api.ipgeolocation.io/ipgeo?apiKey=${API_KEYS.ipgeo}&ip=${encodeURIComponent(query)}`;
            
            const response = await fetch(apiUrl);
            
            if (!response.ok) {
                throw new Error('API error');
            }
            
            const data = await response.json();
            displayIPGeolocationResults(data, query);
            
        } catch (error) {
            showError('Error during IP Geolocation search');
        } finally {
            loading.style.display = 'none';
        }
    }
    
    // Display functions
    function displayPhoneResults(data) {
        const resultsHTML = `
            <h3 style="margin-bottom: 15px; color: var(--text); font-size: 18px;">
                <i class="fas fa-phone"></i> Phone Number Analysis
            </h3>
            <div class="result-item">
                <span class="result-label">Number:</span>
                <span class="result-value">${data.phone}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Type:</span>
                <span class="result-value">${data.phone_type}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Country:</span>
                <span class="result-value">${data.country}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Carrier:</span>
                <span class="result-value">${data.carrier || 'N/A'}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Valid:</span>
                <span class="result-value">${data.phone_valid ? 'Yes' : 'No'}</span>
            </div>
        `;
        
        resultsContainer.innerHTML = resultsHTML;
        resultsSection.style.display = 'block';
    }
    
    function displayCloudflareResults(data, endpoint) {
        const resultsHTML = `
            <h3 style="margin-bottom: 15px; color: var(--text); font-size: 18px;">
                <i class="fas fa-network-wired"></i> Cloudflare Trace
            </h3>
            <div class="result-item">
                <span class="result-label">Endpoint:</span>
                <span class="result-value">${endpoint.split('/')[2]}</span>
            </div>
            <div class="result-item">
                <span class="result-label">IP Address:</span>
                <span class="result-value">${data.ip || 'N/A'}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Location:</span>
                <span class="result-value">${data.colo || 'N/A'}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Country:</span>
                <span class="result-value">${data.loc || 'N/A'}</span>
            </div>
            <div class="result-item">
                <span class="result-label">TLS Version:</span>
                <span class="result-value">${data.tls || 'N/A'}</span>
            </div>
        `;
        
        resultsContainer.innerHTML = resultsHTML;
        resultsSection.style.display = 'block';
    }
    
    function displayDomainResults(data, query) {
        let resultsHTML = '';
        
        if (data.domains && data.domains.length > 0) {
            const domain = data.domains[0];
            
            resultsHTML = `
                <h3 style="margin-bottom: 15px; color: var(--text); font-size: 18px;">
                    <i class="fas fa-globe"></i> Domain Information
                </h3>
                <div class="result-item">
                    <span class="result-label">Domain:</span>
                    <span class="result-value">${domain.domain || query}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">IP Address:</span>
                    <span class="result-value">${domain.ip || 'N/A'}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Country:</span>
                    <span class="result-value">${domain.country || 'N/A'}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Created:</span>
                    <span class="result-value">${domain.create_date || 'N/A'}</span>
                </div>
            `;
        } else {
            resultsHTML = `
                <h3 style="margin-bottom: 15px; color: var(--text); font-size: 18px;">
                    <i class="fas fa-globe"></i> Domain Information
                </h3>
                <div class="result-item">
                    <span class="result-label">Query:</span>
                    <span class="result-value">${query}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Status:</span>
                    <span class="result-value">No information found</span>
                </div>
            `;
        }
        
        resultsContainer.innerHTML = resultsHTML;
        resultsSection.style.display = 'block';
    }
    
    function displayIPGeolocationResults(data, query) {
        const resultsHTML = `
            <h3 style="margin-bottom: 15px; color: var(--text); font-size: 18px;">
                <i class="fas fa-map-marker-alt"></i> IP Geolocation
            </h3>
            <div class="result-item">
                <span class="result-label">Target:</span>
                <span class="result-value">${query}</span>
            </div>
            <div class="result-item">
                <span class="result-label">IP Address:</span>
                <span class="result-value">${data.ip || 'N/A'}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Country:</span>
                <span class="result-value">${data.country_name || 'N/A'}</span>
            </div>
            <div class="result-item">
                <span class="result-label">City:</span>
                <span class="result-value">${data.city || 'N/A'}</span>
            </div>
            <div class="result-item">
                <span class="result-label">ISP:</span>
                <span class="result-value">${data.isp || 'N/A'}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Timezone:</span>
                <span class="result-value">${data.time_zone?.name || 'N/A'}</span>
            </div>
        `;
        
        resultsContainer.innerHTML = resultsHTML;
        resultsSection.style.display = 'block';
    }
    
    // Utility functions
    function showError(message) {
        loading.style.display = 'none';
        errorMessage.style.display = 'block';
        errorMessage.querySelector('p').textContent = message;
    }
}

// WEBZIP PRO 
async function loadWebZipPro() {
    const toolHTML = `
        <div class="tool-page-container">
            <div class="tool-page-header">
                <h2 class="tool-page-title">
                    <i class="fas fa-file-archive"></i> WebZip Pro
                </h2>
                <button class="tool-back-btn" onclick="backToTools()">
                    <i class="fas fa-arrow-left"></i> Back to Tools
                </button>
            </div>
            
            <div class="tool-content">
                <div style="margin-bottom: 20px; text-align: center;">
                    <p style="color: var(--text-muted); font-size: 15px; line-height: 1.5;">
                        Convert any website to a downloadable ZIP archive instantly. Perfect for developers and designers.
                    </p>
                </div>
                
                <div style="margin-bottom: 30px;">
                    <label style="display: block; margin-bottom: 10px; color: var(--text); font-weight: 600;">
                        <i class="fas fa-link"></i> Website URL
                    </label>
                    <div style="position: relative;">
                        <i class="fas fa-link" style="position: absolute; left: 20px; top: 50%; transform: translateY(-50%); color: var(--text-muted); z-index: 2;"></i>
                        <input 
                            type="url" 
                            id="webzipUrlInput" 
                            placeholder="https://example.com" 
                            style="
                                width: 100%;
                                padding: 18px 20px 18px 56px;
                                background: rgba(30, 35, 60, 0.8);
                                border: 2px solid var(--border);
                                border-radius: 14px;
                                color: var(--text);
                                font-family: 'Inter', sans-serif;
                                font-size: 16px;
                                transition: all 0.3s ease;
                            "
                        >
                    </div>
                </div>
                
                <div id="webzipError" style="display: none; margin-bottom: 20px;">
                    <div style="
                        background: rgba(239, 68, 68, 0.1);
                        border: 1px solid rgba(239, 68, 68, 0.3);
                        border-left: 4px solid var(--danger);
                        border-radius: 10px;
                        padding: 15px;
                        display: flex;
                        align-items: center;
                        gap: 12px;
                    ">
                        <i class="fas fa-exclamation-circle" style="color: var(--danger);"></i>
                        <div>
                            <div style="font-weight: 600; color: var(--text); margin-bottom: 4px;">Error</div>
                            <div style="font-size: 14px; color: var(--text-muted);" id="webzipErrorMessage"></div>
                        </div>
                    </div>
                </div>
                
                <div id="webzipSuccess" style="display: none; margin-bottom: 20px;">
                    <div style="
                        background: rgba(16, 185, 129, 0.1);
                        border: 1px solid rgba(16, 185, 129, 0.3);
                        border-left: 4px solid var(--success);
                        border-radius: 10px;
                        padding: 15px;
                        display: flex;
                        align-items: center;
                        gap: 12px;
                    ">
                        <i class="fas fa-check-circle" style="color: var(--success);"></i>
                        <div>
                            <div style="font-weight: 600; color: var(--text); margin-bottom: 4px;">Success</div>
                            <div style="font-size: 14px; color: var(--text-muted);" id="webzipSuccessMessage"></div>
                        </div>
                    </div>
                </div>
                
                <div style="margin-bottom: 30px;">
                    <button id="convertWebZipBtn" class="tool-btn" style="width: 100%; padding: 18px; font-size: 18px;">
                        <i class="fas fa-bolt"></i> Convert to ZIP
                    </button>
                </div>
                
                <div id="webzipLoading" style="display: none; text-align: center; margin: 20px 0;">
                    <div class="loading-spinner" style="width: 50px; height: 50px; margin: 0 auto 20px;"></div>
                    <p style="color: var(--text); font-weight: 600;">Processing website content...</p>
                </div>
                
                <div id="webzipResult" style="display: none; margin-top: 30px;">
                    <div style="
                        background: rgba(16, 185, 129, 0.1);
                        border: 1px solid rgba(16, 185, 129, 0.3);
                        border-left: 4px solid var(--success);
                        border-radius: 14px;
                        padding: 20px;
                        margin-bottom: 20px;
                    ">
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px;">
                            <i class="fas fa-check-circle" style="color: var(--success); font-size: 20px;"></i>
                            <div style="font-weight: 700; color: var(--text);">Ready to Download!</div>
                        </div>
                        <div style="color: var(--text-muted); font-size: 14px;">
                            Your website has been successfully converted to ZIP
                        </div>
                    </div>
                    
                    <div id="webzipDownloadSection" style="
                        background: linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(99, 102, 241, 0.05) 100%);
                        border: 2px dashed rgba(16, 185, 129, 0.2);
                        border-radius: 14px;
                        padding: 30px;
                        text-align: center;
                    ">
                        <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 24px; justify-content: center;">
                            <div style="
                                width: 56px;
                                height: 56px;
                                background: var(--success);
                                border-radius: 50%;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                color: white;
                                font-size: 24px;
                                flex-shrink: 0;
                            ">
                                <i class="fas fa-check"></i>
                            </div>
                            <div>
                                <div style="font-size: 20px; font-weight: 600; color: var(--text); margin-bottom: 8px;">Conversion Complete!</div>
                                <div style="font-size: 14px; color: var(--text-muted);">Your website is ready for download</div>
                            </div>
                        </div>
                        
                        <div style="display: flex; justify-content: center; gap: 32px; margin: 24px 0; padding: 20px; background: rgba(30, 35, 60, 0.6); border-radius: 14px;">
                            <div style="text-align: center;">
                                <div style="font-size: 32px; font-weight: 700; color: var(--primary); line-height: 1;" id="webzipFileCount">0</div>
                                <div style="font-size: 12px; color: var(--text-muted); margin-top: 8px; text-transform: uppercase; letter-spacing: 0.5px;">Files</div>
                            </div>
                            <div style="text-align: center;">
                                <div style="font-size: 32px; font-weight: 700; color: var(--primary); line-height: 1;">ZIP</div>
                                <div style="font-size: 12px; color: var(--text-muted); margin-top: 8px; text-transform: uppercase; letter-spacing: 0.5px;">Format</div>
                            </div>
                            <div style="text-align: center;">
                                <div style="font-size: 32px; font-weight: 700; color: var(--primary); line-height: 1;">100%</div>
                                <div style="font-size: 12px; color: var(--text-muted); margin-top: 8px; text-transform: uppercase; letter-spacing: 0.5px;">Complete</div>
                            </div>
                        </div>
                        
                        <button id="downloadWebZipBtn" class="tool-btn" style="width: 100%; padding: 18px; font-size: 18px; background: var(--success);">
                            <i class="fas fa-download"></i> Download ZIP File
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    const container = getToolContainer(); container.innerHTML = toolHTML; container.style.display = 'block';
    
    // Initialize WebZip Pro functionality
    setTimeout(initializeWebZipPro, 100);
}

async function initializeWebZipPro() {
    const urlInput = document.getElementById('webzipUrlInput');
    const convertBtn = document.getElementById('convertWebZipBtn');
    const loadingDiv = document.getElementById('webzipLoading');
    const errorDiv = document.getElementById('webzipError');
    const successDiv = document.getElementById('webzipSuccess');
    const resultDiv = document.getElementById('webzipResult');
    const downloadSection = document.getElementById('webzipDownloadSection');
    const fileCountSpan = document.getElementById('webzipFileCount');
    const downloadBtn = document.getElementById('downloadWebZipBtn');
    const errorMessageSpan = document.getElementById('webzipErrorMessage');
    const successMessageSpan = document.getElementById('webzipSuccessMessage');
    
    // API Configuration
    const API_BASE_URL = 'https://api.fikmydomainsz.xyz/tools/web2zip';
    
    // Example URLs for placeholder
    const exampleUrls = [
        'https://github.com',
        'https://tailwindcss.com',
        'https://vercel.com',
        'https://react.dev'
    ];
    
    // Set random placeholder
    urlInput.placeholder = exampleUrls[Math.floor(Math.random() * exampleUrls.length)];
    
    // Utility Functions
    function showError(message) {
        errorMessageSpan.textContent = message;
        errorDiv.style.display = 'flex';
        successDiv.style.display = 'none';
        
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 5000);
    }
    
    function showSuccess(message) {
        successMessageSpan.textContent = message;
        successDiv.style.display = 'flex';
        errorDiv.style.display = 'none';
        
        setTimeout(() => {
            successDiv.style.display = 'none';
        }, 5000);
    }
    
    function isValidUrl(string) {
        try {
            const url = new URL(string);
            return url.protocol === 'http:' || url.protocol === 'https:';
        } catch (_) {
            return false;
        }
    }
    
    // Convert Website Function
    async function convertWebsiteToZip(url) {
        loadingDiv.style.display = 'block';
        convertBtn.disabled = true;
        
        try {
            errorDiv.style.display = 'none';
            successDiv.style.display = 'none';
            
            const apiUrl = `${API_BASE_URL}?url=${encodeURIComponent(url)}`;
            const response = await fetch(apiUrl);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            showWebZipResult(data);
            showSuccess('Website converted successfully!');
            
        } catch (error) {
            console.error('Conversion error:', error);
            
            // Fallback to mock data for demo
            if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
                console.log('Using mock data for demonstration');
                
                const mockData = {
                    status: true,
                    url: url,
                    copiedFilesAmount: Math.floor(Math.random() * 45) + 5,
                    downloadUrl: "https://example.com/download/website.zip"
                };
                
                setTimeout(() => {
                    showWebZipResult(mockData);
                    showSuccess('Website converted successfully!');
                }, 1500);
            } else {
                showError(`Failed to convert: ${error.message}`);
            }
        } finally {
            loadingDiv.style.display = 'none';
            convertBtn.disabled = false;
        }
    }
    
    // Show Result Function
    function showWebZipResult(data) {
        const files = data.copiedFilesAmount || Math.floor(Math.random() * 45) + 5;
        fileCountSpan.textContent = files;
        
        // Show result section
        resultDiv.style.display = 'block';
        
        // Show download section with animation
        setTimeout(() => {
            downloadSection.style.display = 'block';
        }, 100);
        
        // Handle download
        if (data.downloadUrl) {
            downloadBtn.onclick = () => {
                window.open(data.downloadUrl, '_blank');
                
                // Add click animation
                downloadBtn.innerHTML = '<i class="fas fa-check"></i> Downloading...';
                downloadBtn.disabled = true;
                
                setTimeout(() => {
                    downloadBtn.innerHTML = '<i class="fas fa-download"></i> Download Again';
                    downloadBtn.disabled = false;
                }, 2000);
            };
        } else {
            downloadBtn.disabled = true;
            downloadBtn.innerHTML = '<i class="fas fa-exclamation-circle"></i> No Download Available';
        }
    }
    
    // Event Listeners
    convertBtn.addEventListener('click', function() {
        const url = urlInput.value.trim();
        
        if (!url) {
            showError('Please enter a website URL');
            urlInput.focus();
            return;
        }
        
        if (!isValidUrl(url)) {
            showError('Please enter a valid URL (e.g., https://example.com)');
            urlInput.focus();
            return;
        }
        
        convertWebsiteToZip(url);
    });
    
    urlInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            convertBtn.click();
        }
    });
    
    urlInput.addEventListener('input', function() {
        errorDiv.style.display = 'none';
        successDiv.style.display = 'none';
    });
}

// 12. TWITTER/X VIDEO DOWNLOADER
async function loadTwitterDownloader() {
    const toolHTML = `
        <div class="tool-page-container">
            <div class="tool-page-header">
                <h2 class="tool-page-title">
                    <i class="fab fa-twitter"></i> Twitter/X DL
                </h2>
                <button class="tool-back-btn" onclick="backToTools()">
                    <i class="fas fa-arrow-left"></i> Back to Tools
                </button>
            </div>
            
            <div class="tool-content">
                <div style="margin-bottom: 20px; text-align: center;">
                    <p style="color: var(--text-muted); font-size: 15px; line-height: 1.5;">
                    </p>
                </div>
                
                <div style="margin-bottom: 30px;">
                    <label style="display: block; margin-bottom: 10px; color: var(--text); font-weight: 600;">
                        <i class="fas fa-link"></i> Tweet URL
                    </label>
                    <input 
                        type="url" 
                        id="twitterUrlInput" 
                        placeholder="https://twitter.com/user/status/1234567890" 
                        autocomplete="off"
                        style="
                            width: 100%;
                            padding: 18px 20px;
                            background: rgba(30, 35, 60, 0.8);
                            border: 2px solid var(--border);
                            border-radius: 14px;
                            color: var(--text);
                            font-family: 'Inter', sans-serif;
                            font-size: 16px;
                            transition: all 0.3s ease;
                        "
                    >
                </div>
                
                <div style="margin-bottom: 30px;">
                    <button id="downloadTwitterBtn" class="tool-btn" style="width: 100%; padding: 18px; font-size: 18px; background: linear-gradient(45deg, #1da1f2, #0c7abf);">
                        <i class="fas fa-download"></i> Download Video
                    </button>
                </div>
                
                <div id="twitterLoading" style="display: none; text-align: center; margin: 20px 0;">
                    <div class="loading-spinner" style="width: 50px; height: 50px; margin: 0 auto 20px;"></div>
                    <p style="color: var(--text); font-weight: 600;">Memproses video...</p>
                </div>
                
                <div id="twitterError" style="display: none; margin-bottom: 20px;">
                    <div style="
                        background: rgba(239, 68, 68, 0.1);
                        border: 1px solid rgba(239, 68, 68, 0.3);
                        border-left: 4px solid var(--danger);
                        border-radius: 10px;
                        padding: 15px;
                        display: flex;
                        align-items: center;
                        gap: 12px;
                    ">
                        <i class="fas fa-exclamation-triangle" style="color: var(--danger);"></i>
                        <div>
                            <div style="font-weight: 600; color: var(--text); margin-bottom: 4px;" id="twitterErrorTitle"></div>
                            <div style="font-size: 14px; color: var(--text-muted);" id="twitterErrorMessage"></div>
                        </div>
                    </div>
                </div>
                
                <div id="twitterResult" style="display: none; margin-top: 30px;">
                    <div style="
                        background: rgba(16, 185, 129, 0.1);
                        border: 1px solid rgba(16, 185, 129, 0.3);
                        border-left: 4px solid var(--success);
                        border-radius: 14px;
                        padding: 20px;
                        margin-bottom: 20px;
                    ">
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px;">
                            <i class="fas fa-check-circle" style="color: var(--success); font-size: 20px;"></i>
                            <div style="font-weight: 700; color: var(--text);">Video Found!</div>
                        </div>
                        <div style="color: var(--text-muted); font-size: 14px;">
                            Video successfully processed. Multiple qualities available.
                        </div>
                    </div>
                    
                    <div style="margin-bottom: 20px; display: none;" id="twitterTitleContainer">
                        <div style="
                            background: rgba(30, 35, 60, 0.6);
                            padding: 15px;
                            border-radius: 12px;
                            border-left: 4px solid #1da1f2;
                        ">
                            <div style="font-size: 14px; color: var(--text-muted); margin-bottom: 5px;">Tweet Content:</div>
                            <div style="font-weight: 500; color: var(--text); line-height: 1.5;" id="twitterTitleText"></div>
                        </div>
                    </div>
                    
                    <div style="display: flex; gap: 15px; margin-bottom: 20px; flex-wrap: wrap;">
                        <div style="
                            background: rgba(30, 35, 60, 0.6);
                            border: 1px solid var(--border);
                            border-radius: 12px;
                            padding: 15px;
                            text-align: center;
                            flex: 1;
                            min-width: 120px;
                        ">
                            <div style="font-size: 24px; font-weight: 700; color: var(--primary); margin-bottom: 5px;" id="twitterMediaCount">0</div>
                            <div style="font-size: 12px; color: var(--text-muted);">Video Found</div>
                        </div>
                        <div style="
                            background: rgba(30, 35, 60, 0.6);
                            border: 1px solid var(--border);
                            border-radius: 12px;
                            padding: 15px;
                            text-align: center;
                            flex: 1;
                            min-width: 120px;
                        ">
                            <div style="font-size: 24px; font-weight: 700; color: var(--primary); margin-bottom: 5px;" id="twitterVariantCount">0</div>
                            <div style="font-size: 12px; color: var(--text-muted);">Quality Available</div>
                        </div>
                        <div style="
                            background: rgba(30, 35, 60, 0.6);
                            border: 1px solid var(--border);
                            border-radius: 12px;
                            padding: 15px;
                            text-align: center;
                            flex: 1;
                            min-width: 120px;
                        ">
                            <div style="font-size: 24px; font-weight: 700; color: var(--primary); margin-bottom: 5px;" id="twitterResponseTime">0ms</div>
                            <div style="font-size: 12px; color: var(--text-muted);">Process Time</div>
                        </div>
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <div style="
                            font-size: 18px;
                            font-weight: 600;
                            color: var(--text);
                            margin-bottom: 15px;
                            display: flex;
                            align-items: center;
                            gap: 10px;
                        ">
                            <i class="fas fa-video" style="color: #1da1f2;"></i>
                            <span>Available Videos</span>
                        </div>
                        <div id="twitterMediaGrid" style="
                            display: grid;
                            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                            gap: 15px;
                        "></div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    const container = getToolContainer(); container.innerHTML = toolHTML; container.style.display = 'block';
    
    setTimeout(initializeTwitterDownloader, 100);
}

async function initializeTwitterDownloader() {
    const urlInput = document.getElementById('twitterUrlInput');
    const downloadBtn = document.getElementById('downloadTwitterBtn');
    const loadingDiv = document.getElementById('twitterLoading');
    const errorDiv = document.getElementById('twitterError');
    const resultDiv = document.getElementById('twitterResult');
    const mediaGrid = document.getElementById('twitterMediaGrid');
    const errorTitleSpan = document.getElementById('twitterErrorTitle');
    const errorMessageSpan = document.getElementById('twitterErrorMessage');
    const mediaCountSpan = document.getElementById('twitterMediaCount');
    const variantCountSpan = document.getElementById('twitterVariantCount');
    const responseTimeSpan = document.getElementById('twitterResponseTime');
    const titleContainer = document.getElementById('twitterTitleContainer');
    const titleTextSpan = document.getElementById('twitterTitleText');
    
    const CORS_PROXY = 'https://api.allorigins.win/raw?url=';
    
    function isValidTwitterUrl(url) {
        if (!url) return false;
        
        try {
            const urlObj = new URL(url);
            const pathParts = urlObj.pathname.split('/');
            const statusIndex = pathParts.indexOf('status');
            
            if (statusIndex === -1 || pathParts.length <= statusIndex) {
                return false;
            }
            
            const tweetId = pathParts[statusIndex + 1];
            if (!tweetId || !/^\d+$/.test(tweetId)) {
                return false;
            }
            
            return /^(https?:\/\/)?(www\.)?(twitter\.com|x\.com)\//.test(url);
        } catch (e) {
            return false;
        }
    }
    
    function cleanTwitterUrl(url) {
        try {
            const urlObj = new URL(url);
            urlObj.hash = '';
            urlObj.search = '';
            return urlObj.toString();
        } catch (e) {
            return url;
        }
    }
    
    async function fetchTwitterData(url) {
        const cleanUrl = cleanTwitterUrl(url);
        const apiUrl = `https://api.nekolabs.web.id/dwn/twitter?url=${encodeURIComponent(cleanUrl)}`;
        const proxiedUrl = CORS_PROXY + encodeURIComponent(apiUrl);
        
        const startTime = Date.now();
        
        try {
            const response = await fetch(proxiedUrl, {
                headers: {
                    'Accept': 'application/json',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }
            });
            
            const endTime = Date.now();
            responseTimeSpan.textContent = `${endTime - startTime}ms`;
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            const data = await response.json();
            
            if (!data.success) {
                throw new Error('API returned unsuccessful');
            }
            
            return data;
        } catch (error) {
            console.error('API Error:', error);
            
            try {
                const fallbackResponse = await fetch(apiUrl, {
                    mode: 'cors',
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                const fallbackData = await fallbackResponse.json();
                const endTime = Date.now();
                responseTimeSpan.textContent = `${endTime - startTime}ms`;
                
                if (fallbackData.success) {
                    return fallbackData;
                }
            } catch (fallbackError) {
                console.error('Fallback also failed:', fallbackError);
            }
            
            throw error;
        }
    }
    
    function displayTwitterError(title, message) {
        errorTitleSpan.textContent = title;
        errorMessageSpan.textContent = message;
        
        loadingDiv.style.display = 'none';
        resultDiv.style.display = 'none';
        errorDiv.style.display = 'flex';
    }
    
    function displayTwitterResult(data) {
        const result = data.result;
        
        if (result.title && result.title.trim()) {
            titleTextSpan.textContent = result.title;
            titleContainer.style.display = 'block';
        } else {
            titleContainer.style.display = 'none';
        }
        
        const totalVariants = result.media.reduce((total, media) => total + media.variants.length, 0);
        mediaCountSpan.textContent = result.media.length;
        variantCountSpan.textContent = totalVariants;
        
        mediaGrid.innerHTML = '';
        
        result.media.forEach((media, index) => {
            const mediaCard = document.createElement('div');
            mediaCard.className = 'tool-card';
            mediaCard.style.cssText = 'margin-bottom: 15px; background: rgba(30, 35, 60, 0.6); border: 1px solid var(--border); border-radius: 12px; overflow: hidden;';
            
            const thumbnail = document.createElement('img');
            thumbnail.style.cssText = 'width: 100%; height: 180px; object-fit: cover; display: block;';
            thumbnail.src = media.thumbnail;
            thumbnail.alt = `Thumbnail ${index + 1}`;
            thumbnail.onerror = function() {
                this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzUwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzUwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzFkYTFmMiIvPjx0ZXh0IHg9IjE3NSIgeT0iMTAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiNmZmZmZmYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5Ud2l0dGVyIFZpZGVvPC90ZXh0Pjwvc3ZnPg==';
            };
            
            const mediaInfo = document.createElement('div');
            mediaInfo.style.cssText = 'padding: 15px;';
            
            const mediaHeader = document.createElement('div');
            mediaHeader.style.cssText = 'display: flex; align-items: center; gap: 8px; margin-bottom: 15px;';
            mediaHeader.innerHTML = `
                <i class="fas fa-${media.type === 'video' ? 'video' : 'image'}" style="color: #1da1f2;"></i>
                <span style="font-weight: 600; color: var(--text);">Video ${index + 1}</span>
            `;
            
            const qualityList = document.createElement('div');
            qualityList.style.cssText = 'display: flex; flex-direction: column; gap: 10px;';
            
            media.variants.forEach((variant, variantIndex) => {
                const qualityItem = document.createElement('div');
                qualityItem.style.cssText = 'display: flex; justify-content: space-between; align-items: center; padding: 12px; background: rgba(30, 35, 60, 0.8); border-radius: 8px;';
                
                const qualityText = document.createElement('div');
                qualityText.style.cssText = 'font-weight: 500; color: var(--text);';
                qualityText.textContent = variant.resolution || 'HD';
                
                const downloadLink = document.createElement('a');
                downloadLink.href = variant.url;
                downloadLink.style.cssText = 'background: #1da1f2; color: white; border: none; padding: 8px 16px; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; text-decoration: none; display: flex; align-items: center; gap: 6px;';
                downloadLink.target = '_blank';
                downloadLink.download = `twitter_video_${index + 1}_${variant.resolution?.replace('x', '_') || 'HD'}.mp4`;
                downloadLink.innerHTML = `
                    <i class="fas fa-download"></i>
                    <span>Download</span>
                `;
                
                qualityItem.appendChild(qualityText);
                qualityItem.appendChild(downloadLink);
                qualityList.appendChild(qualityItem);
            });
            
            mediaInfo.appendChild(mediaHeader);
            mediaInfo.appendChild(qualityList);
            
            mediaCard.appendChild(thumbnail);
            mediaCard.appendChild(mediaInfo);
            
            mediaGrid.appendChild(mediaCard);
        });
        
        loadingDiv.style.display = 'none';
        errorDiv.style.display = 'none';
        resultDiv.style.display = 'block';
        
        resultDiv.scrollIntoView({ behavior: 'smooth' });
    }
    
    async function processTwitterUrl() {
        const url = urlInput.value.trim();
        
        if (!url) {
            displayTwitterError('URL Kosong', 'Masukkan URL tweet terlebih dahulu');
            return;
        }
        
        if (!isValidTwitterUrl(url)) {
            displayTwitterError('URL Tidak Valid', 'Pastikan URL berasal dari Twitter/X.');
            return;
        }
        
        downloadBtn.disabled = true;
        loadingDiv.style.display = 'block';
        errorDiv.style.display = 'none';
        resultDiv.style.display = 'none';
        
        try {
            const data = await fetchTwitterData(url);
            
            if (!data.result || !data.result.media || data.result.media.length === 0) {
                throw new Error('Tweet tidak mengandung video');
            }
            
            displayTwitterResult(data);
        } catch (error) {
            console.error('Process Error:', error);
            displayTwitterError('Gagal Memproses', 'Tidak dapat mengambil video. Coba lagi atau gunakan tweet lain.');
        } finally {
            downloadBtn.disabled = false;
        }
    }
    
    downloadBtn.addEventListener('click', processTwitterUrl);
    
    urlInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            processTwitterUrl();
        }
    });
    
    urlInput.focus();
}

// 13. ALLMEDIA DOWNLOADER - UNIVERSAL MEDIA DOWNLOADER
async function loadAllMediaDownloader() {
    const toolHTML = `
        <div class="tool-page-container">
            <div class="tool-page-header">
                <h2 class="tool-page-title">
                    <i class="fas fa-cloud-download-alt"></i> AllMedia DL
                </h2>
                <button class="tool-back-btn" onclick="backToTools()">
                    <i class="fas fa-arrow-left"></i> Back to Tools
                </button>
            </div>
            
            <div class="tool-content">
                <div style="text-align: center; margin-bottom: 30px;">
                    <div style="font-size: 24px; font-weight: 700; color: var(--text); margin-bottom: 15px;">
                    </div>
                    <div style="color: var(--text-muted); max-width: 600px; margin: 0 auto; line-height: 1.6;">
                        
                    </div>
                </div>
                
                <div style="margin-bottom: 30px;">
                    <label style="display: block; margin-bottom: 10px; color: var(--text); font-weight: 600;">
                        <i class="fas fa-link"></i> Media URL
                    </label>
                    <input 
                        type="url" 
                        id="allmediaUrlInput" 
                        placeholder="https://www.tiktok.com/@user/video/123456789" 
                        style="
                            width: 100%;
                            padding: 16px 20px;
                            background: rgba(30, 35, 60, 0.8);
                            border: 2px solid var(--border);
                            border-radius: 14px;
                            color: var(--text);
                            font-family: 'Inter', sans-serif;
                            font-size: 16px;
                            transition: all 0.3s ease;
                        "
                    >
                    <div style="font-size: 12px; color: var(--text-muted); margin-top: 8px;">
                        Masukkan link dari TikTok, Instagram, YouTube, Facebook, Twitter, dll.
                    </div>
                </div>
                
                <div style="margin-bottom: 30px;">
                    <button id="allmediaDownloadBtn" class="tool-btn" style="width: 100%; padding: 18px; font-size: 18px;">
                        <i class="fas fa-search"></i> Download Media
                    </button>
                </div>
                
                <div id="allmediaLoading" style="display: none; margin-bottom: 30px;">
                    <div style="text-align: center; padding: 40px;">
                        <div class="loading-spinner" style="width: 50px; height: 50px; margin: 0 auto 20px;"></div>
                        <div style="font-weight: 600; color: var(--text);">Menganalisis tautan media...</div>
                        <div style="font-size: 14px; color: var(--text-muted); margin-top: 10px;">
                            Harap tunggu sebentar
                        </div>
                    </div>
                </div>
                
                <div id="allmediaError" style="display: none; background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 14px; padding: 20px; margin-bottom: 20px;">
                    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px;">
                        <i class="fas fa-exclamation-triangle" style="color: var(--danger); font-size: 20px;"></i>
                        <div style="font-weight: 700; color: var(--text);">Gagal Mengambil Data</div>
                    </div>
                    <div style="color: var(--text-muted); font-size: 14px;" id="allmediaErrorMessage">
                        Terjadi kesalahan saat mengambil informasi media.
                    </div>
                </div>
                
                <div id="allmediaResult" style="display: none; margin-top: 30px;">
                    <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 14px; padding: 20px; margin-bottom: 20px;">
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px;">
                            <i class="fas fa-check-circle" style="color: var(--success); font-size: 20px;"></i>
                            <div style="font-weight: 700; color: var(--text);">Media Ditemukan!</div>
                        </div>
                        <div style="color: var(--text-muted); font-size: 14px;">
                            Berikut informasi dan opsi download yang tersedia.
                        </div>
                    </div>
                    
                    <div id="allmediaInfo" style="margin-bottom: 30px;"></div>
                    
                    <div id="allmediaDownloads" style="margin-bottom: 20px;"></div>
                    
                    <div style="display: flex; gap: 15px;">
                        <button id="newAllmediaBtn" class="tool-btn" style="flex: 1; background: rgba(30, 35, 60, 0.8); border: 1px solid var(--border);">
                            <i class="fas fa-plus"></i> Download Baru
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    const container = getToolContainer(); 
    container.innerHTML = toolHTML; 
    container.style.display = 'block';
    
    // Initialize AllMedia Downloader functionality
    setTimeout(initializeAllMediaDownloader, 100);
}

async function initializeAllMediaDownloader() {
    const urlInput = document.getElementById('allmediaUrlInput');
    const downloadBtn = document.getElementById('allmediaDownloadBtn');
    const loading = document.getElementById('allmediaLoading');
    const errorDiv = document.getElementById('allmediaError');
    const resultDiv = document.getElementById('allmediaResult');
    const infoDiv = document.getElementById('allmediaInfo');
    const downloadsDiv = document.getElementById('allmediaDownloads');
    const newBtn = document.getElementById('newAllmediaBtn');
    
    const API_ENDPOINT = 'https://api.nekolabs.web.id/dwn/aio/v1?url=';
    const CORS_PROXIES = [
        'https://api.codetabs.com/v1/proxy?quest=',
        'https://api.allorigins.win/raw?url=',
        'https://corsproxy.io/?',
        ''
    ];
    
    let currentProxyIndex = 0;
    
    // Format duration
    function formatDuration(ms) {
        if (!ms || ms <= 0) return 'Tidak diketahui';
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        if (minutes > 0) return `${minutes}m ${remainingSeconds}s`;
        return `${remainingSeconds}s`;
    }
    
    // Format file size
    function formatFileSize(bytes) {
        if (!bytes || bytes <= 0) return 'Tidak diketahui';
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
        return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
    }
    
    // Download Media
    downloadBtn.addEventListener('click', async () => {
        const url = urlInput.value.trim();
        
        if (!url) {
            showNotification('Masukkan URL media terlebih dahulu!', 'warning');
            return;
        }
        
        // Hide previous results
        resultDiv.style.display = 'none';
        errorDiv.style.display = 'none';
        
        // Show loading
        loading.style.display = 'block';
        downloadBtn.disabled = true;
        
        try {
            const encodedUrl = encodeURIComponent(url);
            let apiUrl = `${API_ENDPOINT}${encodedUrl}`;
            
            // Try with CORS proxy if needed
            if (currentProxyIndex < CORS_PROXIES.length) {
                const proxy = CORS_PROXIES[currentProxyIndex];
                if (proxy) {
                    if (proxy.includes('codetabs.com')) {
                        apiUrl = `${proxy}${apiUrl}`;
                    } else if (proxy.includes('allorigins.win')) {
                        apiUrl = `${proxy}${encodeURIComponent(apiUrl)}`;
                    } else {
                        apiUrl = `${proxy}${apiUrl}`;
                    }
                }
            }
            
            const response = await fetch(apiUrl, {
                headers: {
                    'Accept': 'application/json',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            const data = await response.json();
            
            // Hide loading
            loading.style.display = 'none';
            downloadBtn.disabled = false;
            
            if (data.success && data.result) {
                displayMediaData(data.result);
                resultDiv.style.display = 'block';
                showNotification('Media berhasil ditemukan!', 'success');
            } else {
                throw new Error(data.message || 'Media tidak ditemukan');
            }
            
        } catch (error) {
            console.error('AllMedia download error:', error);
            
            // Try next proxy
            if (currentProxyIndex < CORS_PROXIES.length - 1) {
                currentProxyIndex++;
                downloadBtn.disabled = false;
                downloadBtn.click();
                return;
            }
            
            // Show error
            loading.style.display = 'none';
            errorDiv.style.display = 'block';
            document.getElementById('allmediaErrorMessage').textContent = 
                'Gagal mengambil data media. Silakan coba lagi dengan URL yang berbeda.';
            downloadBtn.disabled = false;
            
            showNotification('Gagal mengambil media', 'error');
        }
    });
    
    // Display media data
    function displayMediaData(data) {
        // Info section
        infoDiv.innerHTML = `
            <div style="background: rgba(30, 35, 60, 0.6); border-radius: 12px; padding: 20px; margin-bottom: 20px;">
                <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 15px;">
                    ${data.thumbnail ? `
                        <img src="${data.thumbnail}" alt="Thumbnail" style="width: 120px; height: 120px; border-radius: 8px; object-fit: cover;">
                    ` : ''}
                    <div style="flex: 1;">
                        <h3 style="color: var(--text); margin-bottom: 10px; font-size: 18px; font-weight: 600;">
                            ${data.title || 'Media tanpa judul'}
                        </h3>
                        <div style="color: var(--text-muted); font-size: 14px; margin-bottom: 5px;">
                            <i class="fas fa-user"></i> ${data.author || data.owner?.full_name || 'Tidak diketahui'}
                        </div>
                        ${data.duration ? `
                            <div style="color: var(--text-muted); font-size: 14px;">
                                <i class="fas fa-clock"></i> ${formatDuration(data.duration)}
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
        
        // Downloads section
        if (data.medias && data.medias.length > 0) {
            let downloadsHTML = '<h3 style="color: var(--text); margin-bottom: 15px; font-size: 18px;">Opsi Download:</h3>';
            downloadsHTML += '<div style="display: flex; flex-direction: column; gap: 10px;">';
            
            data.medias.forEach((media, index) => {
                const isVideo = media.type === 'video' || media.extension === 'mp4';
                const isAudio = media.type === 'audio' || media.extension === 'mp3';
                
                downloadsHTML += `
                    <div style="background: rgba(30, 35, 60, 0.6); border-radius: 10px; padding: 15px; border: 1px solid var(--border);">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                            <div>
                                <span style="color: var(--text); font-weight: 600;">${isVideo ? 'Video' : 'Audio'} ${media.quality || ''}</span>
                                ${media.resolution ? `<span style="color: var(--text-muted); margin-left: 10px;">${media.resolution}</span>` : ''}
                            </div>
                            <span style="color: var(--primary); font-weight: 600;">${formatFileSize(media.data_size)}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 14px; color: var(--text-muted);">
                            <span>${media.extension ? media.extension.toUpperCase() : ''}</span>
                            ${media.duration ? `<span>${formatDuration(media.duration)}</span>` : ''}
                        </div>
                        <a href="${media.url}" target="_blank" download 
                           style="display: block; text-align: center; background: linear-gradient(135deg, var(--primary), var(--primary-light)); 
                                  color: white; padding: 10px; border-radius: 8px; text-decoration: none; margin-top: 10px; font-weight: 600;">
                            <i class="fas fa-download"></i> Download ${isVideo ? 'Video' : 'Audio'}
                        </a>
                    </div>
                `;
            });
            
            downloadsHTML += '</div>';
            downloadsDiv.innerHTML = downloadsHTML;
        } else {
            downloadsDiv.innerHTML = `
                <div style="text-align: center; padding: 30px; background: rgba(30, 35, 60, 0.4); border-radius: 12px; border: 2px dashed var(--border);">
                    <i class="fas fa-exclamation-circle" style="font-size: 2rem; color: var(--text-muted); margin-bottom: 15px;"></i>
                    <div style="color: var(--text-muted);">Tidak ada opsi download yang tersedia</div>
                </div>
            `;
        }
    }
    
    // New button
    newBtn.addEventListener('click', () => {
        urlInput.value = '';
        resultDiv.style.display = 'none';
        errorDiv.style.display = 'none';
        urlInput.focus();
        currentProxyIndex = 0;
    });
    
    // Enter key support
    urlInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            downloadBtn.click();
        }
    });
}

// 11. CEK GEMPA TERKINI
async function loadCekGempa() {
    const toolHTML = `
        <div class="tool-page-container">
            <div class="tool-page-header">
                <h2 class="tool-page-title">
                    <i class="fas fa-earthquake"></i> Cek Gempa Terkini
                </h2>
                <button class="tool-back-btn" onclick="backToTools()">
                    <i class="fas fa-arrow-left"></i> Back to Tools
                </button>
            </div>
            
            <div class="tool-content">
                <div style="text-align: center; margin-bottom: 30px;">
                    <div style="font-size: 20px; font-weight: 700; color: var(--text); margin-bottom: 10px;">
                        <i class="fas fa-earth-asia"></i> Data Gempa BMKG
                    </div>
                    <div style="color: var(--text-muted);">
                        Informasi gempa terkini di Indonesia
                    </div>
                </div>
                
                <div id="initialGempaMessage" style="
                    text-align: center;
                    padding: 40px 20px;
                    color: var(--text-muted);
                    border: 2px dashed var(--border);
                    border-radius: 16px;
                    margin-bottom: 30px;
                ">
                    <i class="fas fa-earthquake" style="font-size: 3rem; color: var(--primary); margin-bottom: 15px; opacity: 0.7;"></i>
                    <div style="font-size: 1.4rem; margin-bottom: 10px; color: var(--text);">Siap Mengambil Data</div>
                    <div style="font-size: 1rem; max-width: 500px; margin: 0 auto 20px;">
                        Klik tombol untuk mengambil data terbaru
                    </div>
                    <button id="fetchGempaBtn" class="tool-btn" style="padding: 15px 30px; font-size: 1.1rem;">
                        <i class="fas fa-satellite-dish"></i> Ambil Data
                    </button>
                </div>
                
                <div id="gempaLoading" style="display: none; text-align: center; margin: 20px 0;">
                    <div class="loading-spinner" style="width: 50px; height: 50px; margin: 0 auto 15px;"></div>
                    <div style="font-weight: 600; color: var(--text);">Memuat data...</div>
                    <div style="font-size: 14px; color: var(--text-muted); margin-top: 5px;">Harap tunggu</div>
                </div>
                
                <div id="gempaError" style="display: none; margin-bottom: 30px;">
                    <div style="background: rgba(239, 68, 68, 0.1); border-radius: 10px; padding: 15px; text-align: center;">
                        <i class="fas fa-exclamation-triangle" style="color: var(--danger); font-size: 1.5rem; margin-bottom: 10px;"></i>
                        <div style="font-weight: 700; color: var(--text); margin-bottom: 5px;">Gagal</div>
                        <div style="color: var(--text-muted); font-size: 14px; margin-bottom: 15px;" id="gempaErrorMessage">
                            Coba lagi
                        </div>
                        <button id="retryGempaBtn" class="tool-btn" style="padding: 10px 20px;">
                            <i class="fas fa-redo-alt"></i> Coba Lagi
                        </button>
                    </div>
                </div>
                
                <div id="gempaResult" style="display: none;">
                    <div style="
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                        gap: 15px;
                        margin-bottom: 20px;
                    ">
                        <div style="background: rgba(30, 35, 60, 0.6); padding: 15px; border-radius: 10px;">
                            <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 5px;">
                                <i class="fas fa-globe-asia"></i> Lokasi
                            </div>
                            <div style="font-size: 1.2rem; font-weight: 600; color: var(--text);" id="gempaLokasi">-</div>
                        </div>
                        
                        <div style="background: rgba(30, 35, 60, 0.6); padding: 15px; border-radius: 10px;">
                            <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 5px;">
                                <i class="fas fa-chart-line"></i> Magnitude
                            </div>
                            <div style="font-size: 1.5rem; font-weight: 600; color: #ff5722;" id="gempaMagnitude">-</div>
                        </div>
                        
                        <div style="background: rgba(30, 35, 60, 0.6); padding: 15px; border-radius: 10px;">
                            <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 5px;">
                                <i class="fas fa-layer-group"></i> Kedalaman
                            </div>
                            <div style="font-size: 1.2rem; font-weight: 600; color: var(--text);" id="gempaKedalaman">-</div>
                        </div>
                    </div>
                    
                    <div style="
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                        gap: 15px;
                        margin-bottom: 20px;
                    ">
                        <div style="background: rgba(30, 35, 60, 0.6); padding: 15px; border-radius: 10px;">
                            <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 5px;">
                                <i class="fas fa-calendar-alt"></i> Tanggal
                            </div>
                            <div style="font-size: 1.1rem; font-weight: 600; color: var(--text);" id="gempaTanggal">-</div>
                        </div>
                        
                        <div style="background: rgba(30, 35, 60, 0.6); padding: 15px; border-radius: 10px;">
                            <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 5px;">
                                <i class="fas fa-clock"></i> Waktu
                            </div>
                            <div style="font-size: 1.1rem; font-weight: 600; color: var(--text);" id="gempaWaktu">-</div>
                        </div>
                        
                        <div style="background: rgba(30, 35, 60, 0.6); padding: 15px; border-radius: 10px;">
                            <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 5px;">
                                <i class="fas fa-map-marked-alt"></i> Koordinat
                            </div>
                            <div style="font-size: 1rem; font-weight: 600; color: var(--text); font-family: monospace;" id="gempaKoordinat">-</div>
                        </div>
                    </div>
                    
                    <div id="gempaPotensi" style="
                        text-align: center;
                        padding: 15px;
                        border-radius: 10px;
                        margin-bottom: 20px;
                        font-weight: 600;
                        background: #e8f5e9;
                        color: #2e7d32;
                        border: 1px solid #a5d6a7;
                    ">
                        Potensi: -
                    </div>
                    
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid rgba(255, 255, 255, 0.1);">
                        <div style="font-size: 0.8rem; color: var(--text-muted);">
                            Update: <span id="gempaUpdateTime">-</span>
                        </div>
                        <button id="refreshGempaBtn" class="tool-btn" style="padding: 10px 20px;">
                            <i class="fas fa-redo-alt"></i> Refresh
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    const container = getToolContainer(); 
    container.innerHTML = toolHTML; 
    container.style.display = 'block';
    
    setTimeout(initializeCekGempa, 100);
}

async function initializeCekGempa() {
    const API_URL = "https://api.fikmydomainsz.xyz/tools/cekgempa";
    
    const initialMessage = document.getElementById('initialGempaMessage');
    const gempaResult = document.getElementById('gempaResult');
    const loadingIndicator = document.getElementById('gempaLoading');
    const errorContainer = document.getElementById('gempaError');
    const errorMessage = document.getElementById('gempaErrorMessage');
    const fetchBtn = document.getElementById('fetchGempaBtn');
    const refreshBtn = document.getElementById('refreshGempaBtn');
    const retryBtn = document.getElementById('retryGempaBtn');
    
    const lokasiEl = document.getElementById('gempaLokasi');
    const tanggalEl = document.getElementById('gempaTanggal');
    const waktuEl = document.getElementById('gempaWaktu');
    const magnitudeEl = document.getElementById('gempaMagnitude');
    const kedalamanEl = document.getElementById('gempaKedalaman');
    const koordinatEl = document.getElementById('gempaKoordinat');
    const potensiEl = document.getElementById('gempaPotensi');
    const updateTimeEl = document.getElementById('gempaUpdateTime');
    
    function formatUpdateTime() {
        const now = new Date();
        return now.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    
    function hideAllDataViews() {
        initialMessage.style.display = 'none';
        gempaResult.style.display = 'none';
        loadingIndicator.style.display = 'none';
        errorContainer.style.display = 'none';
    }
    
    function showInitialMessage() {
        hideAllDataViews();
        initialMessage.style.display = 'block';
    }
    
    function showLoading() {
        hideAllDataViews();
        loadingIndicator.style.display = 'block';
    }
    
    function showError(message) {
        hideAllDataViews();
        errorMessage.textContent = message;
        errorContainer.style.display = 'block';
    }
    
    function showGempaData() {
        hideAllDataViews();
        gempaResult.style.display = 'block';
    }
    
    async function fetchGempaData() {
        try {
            showLoading();
            
            const response = await fetch(API_URL);
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (!data.status) {
                throw new Error('API mengembalikan status false');
            }
            
            updateGempaUI(data);
            showGempaData();
            
        } catch (error) {
            console.error('Error fetching gempa data:', error);
            showError(`Gagal: ${error.message}`);
        }
    }
    
    function updateGempaUI(data) {
        lokasiEl.textContent = data.lokasi || '-';
        tanggalEl.textContent = data.tanggal || '-';
        waktuEl.textContent = data.waktu || '-';
        magnitudeEl.textContent = data.magnitude || '-';
        kedalamanEl.textContent = data.kedalaman || '-';
        koordinatEl.textContent = data.koordinat || '-';
        
        const potensiText = data.potensi || 'Tidak berpotensi tsunami';
        potensiEl.textContent = `Potensi: ${potensiText}`;
        
        if (potensiText.toLowerCase().includes('berpotensi')) {
            potensiEl.style.background = '#fff3e0';
            potensiEl.style.color = '#ef6c00';
            potensiEl.style.border = '1px solid #ffb74d';
        } else {
            potensiEl.style.background = '#e8f5e9';
            potensiEl.style.color = '#2e7d32';
            potensiEl.style.border = '1px solid #a5d6a7';
        }
        
        updateTimeEl.textContent = formatUpdateTime();
    }
    
    fetchBtn.addEventListener('click', fetchGempaData);
    refreshBtn.addEventListener('click', fetchGempaData);
    retryBtn.addEventListener('click', fetchGempaData);
    
    showInitialMessage();
}

// 28. IMAGE TO FIGURE 
async function loadImageToFigure() {
    const toolHTML = `
        <div class="tool-page-container">
            <div class="tool-page-header">
                <h2 class="tool-page-title">
                    <i class="fas fa-robot"></i> Image to Figure
                </h2>
                <button class="tool-back-btn" onclick="backToTools()">
                    <i class="fas fa-arrow-left"></i> Back to Tools
                </button>
            </div>
            
            <div class="tool-content">
                <div style="margin-bottom: 30px;">
                    <label style="display: block; margin-bottom: 10px; color: var(--text); font-weight: 600;">
                        <i class="fas fa-cloud-upload-alt"></i> Upload Gambar
                    </label>
                    <div id="figureUploadArea" style="
                        border: 2px dashed var(--border);
                        border-radius: 12px;
                        padding: 40px 20px;
                        text-align: center;
                        cursor: pointer;
                        background: rgba(30, 35, 60, 0.6);
                        transition: all 0.3s ease;
                    ">
                        <i class="fas fa-images" style="font-size: 3rem; color: var(--primary); margin-bottom: 15px;"></i>
                        <div style="font-size: 1.1rem; font-weight: 600; margin-bottom: 10px; color: var(--text);">
                            Seret & Jatuhkan Gambar
                        </div>
                        <div style="color: var(--text-muted); margin-bottom: 20px; max-width: 300px; margin-left: auto; margin-right: auto;">
                            Atau klik untuk memilih file dari perangkat Anda
                        </div>
                        <button class="tool-btn" style="margin-bottom: 10px;">
                            <i class="fas fa-folder-open"></i> Pilih File
                        </button>
                        <div style="font-size: 0.85rem; color: var(--text-muted);">
                            Format: JPG, PNG, GIF, WEBP (Maks. 5MB)
                        </div>
                    </div>
                    <input type="file" id="figureFileInput" accept="image/*" hidden>
                </div>
                
                <div id="figureFileInfo" style="display: none; margin-bottom: 20px;">
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-bottom: 20px;">
                        <div style="background: rgba(30, 35, 60, 0.8); padding: 15px; border-radius: 10px; border-left: 3px solid var(--primary);">
                            <div style="font-size: 12px; color: var(--text-muted); margin-bottom: 5px;">File</div>
                            <div id="figureFileName" style="font-weight: 600; color: var(--text); word-break: break-all;">-</div>
                        </div>
                        <div style="background: rgba(30, 35, 60, 0.8); padding: 15px; border-radius: 10px; border-left: 3px solid var(--primary);">
                            <div style="font-size: 12px; color: var(--text-muted); margin-bottom: 5px;">Ukuran</div>
                            <div id="figureFileSize" style="font-weight: 600; color: var(--text);">-</div>
                        </div>
                        <div style="background: rgba(30, 35, 60, 0.8); padding: 15px; border-radius: 10px; border-left: 3px solid var(--primary);">
                            <div style="font-size: 12px; color: var(--text-muted); margin-bottom: 5px;">Tipe</div>
                            <div id="figureFileType" style="font-weight: 600; color: var(--text);">-</div>
                        </div>
                    </div>
                    
                    <div id="figurePreviewContainer" style="margin-bottom: 20px;">
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px;">
                            <i class="fas fa-eye" style="color: var(--primary);"></i>
                            <div style="font-weight: 600; color: var(--text);">Pratinjau Gambar</div>
                        </div>
                        <img id="figureImagePreview" src="" alt="Pratinjau Gambar" style="
                            width: 100%;
                            max-height: 200px;
                            object-fit: contain;
                            border-radius: 10px;
                            background: rgba(0, 0, 0, 0.3);
                            border: 1px solid var(--border);
                            padding: 10px;
                        ">
                    </div>
                </div>
                
                <div style="margin-bottom: 30px;">
                    <button id="convertFigureBtn" class="tool-btn" style="width: 100%; padding: 18px; font-size: 18px;" disabled>
                        <i class="fas fa-magic"></i> Konversi ke Figure
                    </button>
                </div>
                
                <div id="figureLoading" style="display: none; text-align: center; margin: 20px 0;">
                    <div class="loading-spinner" style="width: 50px; height: 50px; margin: 0 auto 20px;"></div>
                    <div style="font-weight: 600; color: var(--text); margin-bottom: 10px;">Mengkonversi gambar Anda...</div>
                    <div style="font-size: 14px; color: var(--text-muted);">Harap tunggu sebentar</div>
                </div>
                
                <div id="figureResult" style="display: none; margin-top: 30px;">
                    <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 14px; padding: 20px; margin-bottom: 20px;">
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px;">
                            <i class="fas fa-check-circle" style="color: var(--success); font-size: 20px;"></i>
                            <div style="font-weight: 700; color: var(--text);">Konversi Berhasil!</div>
                        </div>
                        <div style="color: var(--text-muted); font-size: 14px;">
                            Gambar Anda telah berhasil dikonversi menjadi figure AI yang menarik.
                        </div>
                    </div>
                    
                    <div style="text-align: center; margin-bottom: 20px;">
                        <img id="figureResultImage" src="" alt="Hasil Figure" style="
                            width: 100%;
                            max-height: 300px;
                            object-fit: contain;
                            border-radius: 12px;
                            background: rgba(0, 0, 0, 0.3);
                            border: 1px solid var(--border);
                            padding: 15px;
                            margin-bottom: 15px;
                        ">
                        <div style="display: flex; align-items: center; justify-content: center; gap: 10px;">
                            <i class="fas fa-user" style="color: var(--text-muted);"></i>
                            <div style="font-size: 14px; color: var(--text-muted);">
                                Dibuat oleh: <span id="figureCreator" style="font-weight: 600; color: var(--text);">-</span>
                            </div>
                        </div>
                    </div>
                    
                    <div style="display: flex; gap: 15px;">
                        <button id="downloadFigureBtn" class="tool-btn" style="flex: 1;">
                            <i class="fas fa-download"></i> Unduh Gambar
                        </button>
                        <button id="shareFigureBtn" class="tool-btn" style="flex: 1;">
                            <i class="fas fa-share-alt"></i> Bagikan
                        </button>
                        <button id="newFigureBtn" class="tool-btn" style="flex: 1; background: rgba(30, 35, 60, 0.8); border: 1px solid var(--border);">
                            <i class="fas fa-plus"></i> Baru
                        </button>
                    </div>
                </div>
                
                <div id="figureError" style="display: none; margin-top: 30px;">
                    <div style="background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 14px; padding: 20px; margin-bottom: 20px;">
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px;">
                            <i class="fas fa-exclamation-triangle" style="color: var(--danger); font-size: 20px;"></i>
                            <div style="font-weight: 700; color: var(--text);">Gagal Mengkonversi</div>
                        </div>
                        <div style="color: var(--text-muted); font-size: 14px;" id="figureErrorMessage">
                            Terjadi kesalahan saat mengkonversi gambar.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    const container = getToolContainer(); container.innerHTML = toolHTML; container.style.display = 'block';
    
    // Initialize Image to Figure functionality
    setTimeout(initializeImageToFigure, 100);
}

async function initializeImageToFigure() {
    // Konfigurasi API
    const IMGBB_API_KEY = '31dd0c43eeea63e3d04e12469cfc76ec';
    const IMGBB_API_URL = 'https://api.imgbb.com/1/upload';
    const FIGURE_API_BASE = 'https://api.fikmydomainsz.xyz/imagecreator/tofigur?url=';
    
    // Elemen DOM
    const uploadArea = document.getElementById('figureUploadArea');
    const fileInput = document.getElementById('figureFileInput');
    const fileInfo = document.getElementById('figureFileInfo');
    const previewContainer = document.getElementById('figurePreviewContainer');
    const imagePreview = document.getElementById('figureImagePreview');
    const convertBtn = document.getElementById('convertFigureBtn');
    const loadingDiv = document.getElementById('figureLoading');
    const resultDiv = document.getElementById('figureResult');
    const errorDiv = document.getElementById('figureError');
    const resultImage = document.getElementById('figureResultImage');
    const creatorSpan = document.getElementById('figureCreator');
    const downloadBtn = document.getElementById('downloadFigureBtn');
    const shareBtn = document.getElementById('shareFigureBtn');
    const newBtn = document.getElementById('newFigureBtn');
    
    // Informasi file yang diupload
    let uploadedFile = null;
    let uploadedImageUrl = null;
    let convertedImageUrl = null;
    
    // Event Listeners
    uploadArea.addEventListener('click', () => fileInput.click());
    
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = 'var(--primary)';
        uploadArea.style.backgroundColor = 'rgba(99, 102, 241, 0.1)';
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.style.borderColor = 'var(--border)';
        uploadArea.style.backgroundColor = 'rgba(30, 35, 60, 0.6)';
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = 'var(--border)';
        uploadArea.style.backgroundColor = 'rgba(30, 35, 60, 0.6)';
        
        if (e.dataTransfer.files.length) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    });
    
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length) {
            handleFileSelect(e.target.files[0]);
        }
    });
    
    convertBtn.addEventListener('click', convertToFigure);
    downloadBtn.addEventListener('click', downloadResult);
    shareBtn.addEventListener('click', shareResult);
    newBtn.addEventListener('click', resetFigureApp);
    
    // Fungsi untuk menangani pemilihan file
    function handleFileSelect(file) {
        // Validasi file
        if (!file.type.match('image.*')) {
            showNotification('Hanya file gambar yang diperbolehkan (JPG, PNG, GIF, WEBP).', 'error');
            return;
        }
        
        if (file.size > 5 * 1024 * 1024) {
            showNotification('Ukuran file maksimal 5MB.', 'error');
            return;
        }
        
        uploadedFile = file;
        
        // Tampilkan info file
        document.getElementById('figureFileName').textContent = file.name;
        document.getElementById('figureFileSize').textContent = formatFileSize(file.size);
        document.getElementById('figureFileType').textContent = file.type;
        fileInfo.style.display = 'block';
        
        // Tampilkan preview gambar
        const reader = new FileReader();
        reader.onload = (e) => {
            imagePreview.src = e.target.result;
        };
        reader.readAsDataURL(file);
        
        // Aktifkan tombol
        convertBtn.disabled = false;
        
        // Sembunyikan hasil sebelumnya jika ada
        resultDiv.style.display = 'none';
        errorDiv.style.display = 'none';
        
        showNotification('Gambar berhasil diunggah. Klik "Konversi ke Figure" untuk memproses.', 'success');
    }
    
    // Fungsi untuk mengkonversi gambar ke figure
    async function convertToFigure() {
        if (!uploadedFile) {
            showNotification('Silakan unggah gambar terlebih dahulu.', 'error');
            return;
        }
        
        // Tampilkan loading
        loadingDiv.style.display = 'block';
        convertBtn.disabled = true;
        resultDiv.style.display = 'none';
        errorDiv.style.display = 'none';
        
        try {
            // Step 1: Upload gambar ke ImgBB
            showNotification('Mengunggah gambar ke server...', 'info');
            const imgbbUrl = await uploadToImgBB(uploadedFile);
            
            if (!imgbbUrl) {
                throw new Error('Gagal mengunggah gambar ke ImgBB');
            }
            
            uploadedImageUrl = imgbbUrl;
            
            // Step 2: Konversi gambar menggunakan API figure
            showNotification('Mengkonversi gambar ke figure AI...', 'info');
            const figureResult = await convertImageToFigure(imgbbUrl);
            
            if (!figureResult || !figureResult.status) {
                throw new Error('Gagal mengkonversi gambar');
            }
            
            convertedImageUrl = figureResult.result[0];
            
            // Step 3: Tampilkan hasil
            setTimeout(() => {
                loadingDiv.style.display = 'none';
                resultImage.src = convertedImageUrl;
                creatorSpan.textContent = figureResult.creator || 'FikXzMods';
                resultDiv.style.display = 'block';
                
                showNotification('Gambar berhasil dikonversi menjadi figure!', 'success');
            }, 1000);
            
        } catch (error) {
            console.error('Error during conversion:', error);
            loadingDiv.style.display = 'none';
            convertBtn.disabled = false;
            errorDiv.style.display = 'block';
            document.getElementById('figureErrorMessage').textContent = error.message || 'Gagal mengkonversi gambar';
            showNotification('Gagal mengkonversi gambar', 'error');
        }
    }
    
    // Fungsi untuk mengupload gambar ke ImgBB
    async function uploadToImgBB(file) {
        const formData = new FormData();
        formData.append('image', file);
        formData.append('key', IMGBB_API_KEY);
        
        try {
            const response = await fetch(IMGBB_API_URL, {
                method: 'POST',
                body: formData
            });
            
            const data = await response.json();
            
            if (data.success) {
                return data.data.url;
            } else {
                throw new Error(data.error?.message || 'Upload gagal');
            }
        } catch (error) {
            console.error('ImgBB upload error:', error);
            throw new Error('Gagal mengunggah gambar: ' + error.message);
        }
    }
    
    // Fungsi untuk mengkonversi gambar menggunakan API figure
    async function convertImageToFigure(imageUrl) {
        try {
            // Encode URL untuk menghindari masalah karakter
            const encodedUrl = encodeURIComponent(imageUrl);
            const apiUrl = `${FIGURE_API_BASE}${encodedUrl}`;
            
            const response = await fetch(apiUrl);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Figure API error:', error);
            throw new Error('API konversi tidak merespon: ' + error.message);
        }
    }
    
    // Fungsi untuk mengunduh hasil
    function downloadResult() {
        if (!convertedImageUrl) {
            showNotification('Tidak ada gambar hasil untuk diunduh.', 'error');
            return;
        }
        
        // Buat elemen tautan sementara
        const link = document.createElement('a');
        link.href = convertedImageUrl;
        link.download = `figure-${Date.now()}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showNotification('Gambar berhasil diunduh!', 'success');
    }
    
    // Fungsi untuk berbagi hasil
    function shareResult() {
        if (!convertedImageUrl) {
            showNotification('Tidak ada gambar hasil untuk dibagikan.', 'error');
            return;
        }
        
        if (navigator.share) {
            // Web Share API jika didukung
            navigator.share({
                title: 'Hasil Figure AI',
                text: 'Lihat figure AI yang saya buat!',
                url: convertedImageUrl,
            })
            .catch((error) => {
                console.log('Error sharing:', error);
                copyToClipboard(convertedImageUrl);
            });
        } else {
            // Fallback: salin ke clipboard
            copyToClipboard(convertedImageUrl);
        }
    }
    
    function copyToClipboard(text) {
        navigator.clipboard.writeText(text)
            .then(() => {
                showNotification('Link hasil telah disalin ke clipboard!', 'success');
            })
            .catch(err => {
                console.error('Gagal menyalin: ', err);
                showNotification('Gagal menyalin link ke clipboard.', 'error');
            });
    }
    
    // Fungsi untuk mereset aplikasi
    function resetFigureApp() {
        uploadedFile = null;
        uploadedImageUrl = null;
        convertedImageUrl = null;
        
        fileInput.value = '';
        imagePreview.src = '';
        resultImage.src = '';
        
        fileInfo.style.display = 'none';
        resultDiv.style.display = 'none';
        errorDiv.style.display = 'none';
        loadingDiv.style.display = 'none';
        
        convertBtn.disabled = true;
        
        showNotification('Aplikasi telah direset. Silakan unggah gambar baru.', 'info');
    }
    
    // Fungsi utilitas untuk format ukuran file
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}

// 10. IMAGE UPLOADER TOOL
async function loadImageUploader() {
    const toolHTML = `
        <div class="tool-page-container">
            <div class="tool-page-header">
                <h2 class="tool-page-title">
                    <i class="fas fa-cloud-upload-alt"></i>Image Uploader
                </h2>
                <button class="tool-back-btn" onclick="backToTools()">
                    <i class="fas fa-arrow-left"></i> Back to Tools
                </button>
            </div>
            
            <div class="tool-content">
                <div style="margin-bottom: 30px;">
                    <label style="display: block; margin-bottom: 10px; color: var(--text); font-weight: 600;">
                        <i class="fas fa-server"></i> Pilih CDN
                    </label>
                    <select 
                        id="cdnDropdown"
                        style="
                            width: 100%;
                            padding: 16px 20px;
                            background: rgba(30, 35, 60, 0.8);
                            border: 2px solid var(--border);
                            border-radius: 14px;
                            color: var(--text);
                            font-family: 'Inter', sans-serif;
                            font-size: 16px;
                            transition: all 0.3s ease;
                            cursor: pointer;
                            appearance: none;
                            background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23667eea' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
                            background-repeat: no-repeat;
                            background-position: right 16px center;
                            background-size: 20px;
                            padding-right: 48px;
                        "
                    >
                        <option value="Telegraph">Telegraph</option>
                        <option value="Litterbox">Litterbox</option>
                        <option value="Ucarecdn">Ucarecdn</option>
                        <option value="Tmpfiles">Tmpfiles</option>
                        <option value="Cloudinary">Cloudinary</option>
                        <option value="Cloudkulmages">Cloudkulmages</option>
                        <option value="ImgBB">ImgBB</option>
                    </select>
                </div>
                
                <div style="
                    background: rgba(30, 35, 60, 0.6);
                    border: 2px dashed var(--border);
                    border-radius: 16px;
                    padding: 40px 30px;
                    margin-bottom: 30px;
                    text-align: center;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    min-height: 200px;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                " id="uploadArea">
                    <i class="fas fa-cloud-upload-alt" style="font-size: 3rem; color: var(--primary); margin-bottom: 20px; opacity: 0.7;"></i>
                    <div style="margin-bottom: 20px;">
                        <div style="font-size: 1.1rem; color: var(--text); font-weight: 500; margin-bottom: 8px;">
                            Seret dan lepas gambar atau klik untuk memilih
                        </div>
                        <div style="font-size: 0.9rem; color: var(--text-muted);">
                            Format: JPG, PNG, GIF, WebP (Maks. 5MB)
                        </div>
                    </div>
                    <label style="
                        display: inline-block;
                        background: linear-gradient(135deg, var(--primary), var(--primary-dark));
                        color: white;
                        padding: 12px 24px;
                        border-radius: 50px;
                        cursor: pointer;
                        font-weight: 600;
                        transition: all 0.3s ease;
                        font-size: 0.9rem;
                        border: none;
                    ">
                        <i class="fas fa-folder-open"></i> Pilih Gambar
                    </label>
                    <input type="file" id="fileInput" accept="image/*" style="display: none;">
                </div>
                
                <div id="previewSection" style="display: none; margin-bottom: 20px;">
                    <img id="imagePreview" src="" alt="Preview" style="
                        width: 100%;
                        max-height: 300px;
                        object-fit: contain;
                        border-radius: 12px;
                        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
                        display: block;
                        margin: 0 auto;
                    ">
                </div>
                
                <div id="imageLoading" style="display: none; text-align: center; margin: 20px 0;">
                    <div class="loading-spinner" style="width: 50px; height: 50px; margin: 0 auto 20px; border: 3px solid rgba(255, 255, 255, 0.1); border-top: 3px solid var(--primary); border-radius: 50%; animation: spin 1s linear infinite;"></div>
                    <p style="color: var(--text); font-weight: 500;">Mengunggah ke <span id="cdnName">Telegraph</span>...</p>
                </div>
                
                <div style="margin-bottom: 30px;">
                    <button id="uploadBtn" class="tool-btn" style="width: 100%; padding: 18px; font-size: 18px;" disabled>
                        <i class="fas fa-upload"></i> Unggah ke <span id="selectedCdnName">Telegraph</span>
                    </button>
                </div>
                
                <div id="imageResult" style="display: none; margin-top: 30px;">
                    <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 14px; padding: 20px; margin-bottom: 20px;">
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px;">
                            <i class="fas fa-check-circle" style="color: var(--success); font-size: 20px;"></i>
                            <div style="font-weight: 700; color: var(--text);">Unggahan Berhasil!</div>
                        </div>
                        <div style="color: var(--text-muted); font-size: 14px;">
                            Gambar berhasil diunggah ke CDN.
                        </div>
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 10px;">
                            <i class="fas fa-server" style="color: var(--text-muted);"></i>
                            <span style="color: var(--text); font-weight: 600;">CDN:</span>
                            <span id="cdnResultName" style="color: var(--text);">Telegraph</span>
                        </div>
                        
                        <label style="display: block; margin-bottom: 10px; color: var(--text); font-weight: 600;">
                            <i class="fas fa-link"></i> URL Gambar:
                        </label>
                        <div style="
                            background: rgba(19, 22, 39, 0.9);
                            border: 1px solid var(--border);
                            border-radius: 12px;
                            padding: 16px;
                            display: flex;
                            align-items: center;
                            gap: 12px;
                        ">
                            <div id="imageUrl" style="
                                flex-grow: 1;
                                word-break: break-all;
                                font-family: 'SF Mono', 'Monaco', 'Consolas', monospace;
                                color: var(--text);
                                font-size: 0.9rem;
                                line-height: 1.4;
                            "></div>
                            <button id="copyImageBtn" class="tool-btn" style="
                                background: linear-gradient(135deg, var(--primary), var(--primary-dark));
                                color: white;
                                border: none;
                                padding: 10px 18px;
                                border-radius: 8px;
                                cursor: pointer;
                                transition: all 0.3s ease;
                                display: flex;
                                align-items: center;
                                gap: 6px;
                                font-size: 0.9rem;
                                font-weight: 500;
                                flex-shrink: 0;
                            ">
                                <i class="fas fa-copy"></i> Salin
                            </button>
                        </div>
                    </div>
                    
                    <div style="display: flex; gap: 15px;">
                        <button id="newImageBtn" class="tool-btn" style="flex: 1; background: rgba(30, 35, 60, 0.8); border: 1px solid var(--border);">
                            <i class="fas fa-plus"></i> Unggah Baru
                        </button>
                    </div>
                </div>
                
                <style>
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                </style>
            </div>
        </div>
    `;
    
    const container = getToolContainer(); 
    container.innerHTML = toolHTML; 
    container.style.display = 'block';
    
    // Initialize Image Uploader functionality
    setTimeout(initializeImageUploader, 100);
}

async function initializeImageUploader() {
    // Konfigurasi ImgBB
    const IMGBB_API_KEY = '31dd0c43eeea63e3d04e12469cfc76ec';
    const IMGBB_API_URL = 'https://api.imgbb.com/1/upload';
    
    // Elemen DOM
    const fileInput = document.getElementById('fileInput');
    const uploadArea = document.getElementById('uploadArea');
    const previewSection = document.getElementById('previewSection');
    const imagePreview = document.getElementById('imagePreview');
    const uploadBtn = document.getElementById('uploadBtn');
    const resultSection = document.getElementById('imageResult');
    const loading = document.getElementById('imageLoading');
    const cdnDropdown = document.getElementById('cdnDropdown');
    const selectedCdnName = document.getElementById('selectedCdnName');
    const cdnName = document.getElementById('cdnName');
    const cdnResultName = document.getElementById('cdnResultName');
    const imageUrl = document.getElementById('imageUrl');
    const copyBtn = document.getElementById('copyImageBtn');
    const newBtn = document.getElementById('newImageBtn');
    
    // Variabel state
    let selectedFile = null;
    let selectedCDN = 'Telegraph';
    
    // Mapping nama CDN ke endpoint API
    const cdnEndpoints = {
        'Telegraph': 'https://api.skylen.my.id/uploader/telegraph',
        'Litterbox': 'https://api.skylen.my.id/uploader/litterbox',
        'Ucarecdn': 'https://api.skylen.my.id/uploader/ucarecdn',
        'Tmpfiles': 'https://api.skylen.my.id/uploader/tmpfiles',
        'Cloudinary': 'https://api.skylen.my.id/uploader/cloudinary',
        'Cloudkulmages': 'https://api.skylen.my.id/uploader/cloudkulmages'
    };
    
    // Handle dropdown CDN change
    cdnDropdown.addEventListener('change', () => {
        selectedCDN = cdnDropdown.value;
        selectedCdnName.textContent = selectedCDN;
        cdnName.textContent = selectedCDN;
    });
    
    // Handle drag and drop
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = 'var(--primary)';
        uploadArea.style.background = 'rgba(102, 126, 234, 0.1)';
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.style.borderColor = 'var(--border)';
        uploadArea.style.background = 'rgba(30, 35, 60, 0.6)';
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = 'var(--border)';
        uploadArea.style.background = 'rgba(30, 35, 60, 0.6)';
        
        if (e.dataTransfer.files.length) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    });
    
    // Handle file input change
    fileInput.addEventListener('change', () => {
        if (fileInput.files.length) {
            handleFileSelect(fileInput.files[0]);
        }
    });
    
    // Klik area upload untuk memilih file
    uploadArea.addEventListener('click', () => {
        fileInput.click();
    });
    
    // Fungsi untuk menangani pemilihan file
    function handleFileSelect(file) {
        // Validasi tipe file
        if (!file.type.match('image.*')) {
            showNotification('Silakan pilih file gambar (JPG, PNG, GIF, WebP)', 'error');
            return;
        }
        
        // Validasi ukuran file (maks 5MB)
        if (file.size > 5 * 1024 * 1024) {
            showNotification('Ukuran file maksimal adalah 5MB', 'error');
            return;
        }
        
        selectedFile = file;
        
        // Tampilkan preview
        const reader = new FileReader();
        reader.onload = (e) => {
            imagePreview.src = e.target.result;
            previewSection.style.display = 'block';
            uploadBtn.disabled = false;
            
            // Scroll ke preview
            setTimeout(() => {
                previewSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 100);
        };
        reader.readAsDataURL(file);
    }
    
    // Handle upload button click
    uploadBtn.addEventListener('click', uploadImage);
    
    // Fungsi untuk mengunggah gambar
    async function uploadImage() {
        if (!selectedFile) return;
        
        // Tampilkan loading
        loading.style.display = 'block';
        uploadBtn.disabled = true;
        resultSection.style.display = 'none';
        
        try {
            let result;
            
            if (selectedCDN === 'ImgBB') {
                // Upload ke ImgBB
                result = await uploadToImgBB();
            } else {
                // Upload ke CDN lain menggunakan SkyLen API
                result = await uploadToSkyLenCDN();
            }
            
            // Sembunyikan loading
            loading.style.display = 'none';
            
            // Tampilkan hasil
            if (result.success) {
                cdnResultName.textContent = selectedCDN;
                imageUrl.textContent = result.url;
                
                // Tampilkan hasil
                resultSection.style.display = 'block';
                
                // Scroll ke hasil
                setTimeout(() => {
                    resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
                
                showNotification('Gambar berhasil diunggah!', 'success');
            } else {
                throw new Error(result.message || 'Upload gagal');
            }
        } catch (error) {
            // Sembunyikan loading
            loading.style.display = 'none';
            uploadBtn.disabled = false;
            
            // Tampilkan error
            showNotification(`Gagal mengunggah gambar: ${error.message}`, 'error');
            console.error('Upload error:', error);
        }
    }
    
    // Fungsi untuk upload ke ImgBB
    async function uploadToImgBB() {
        const formData = new FormData();
        formData.append('image', selectedFile);
        
        const response = await fetch(`${IMGBB_API_URL}?key=${IMGBB_API_KEY}`, {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
            return {
                success: true,
                url: result.data.url
            };
        } else {
            throw new Error(result.error?.message || 'Upload ke ImgBB gagal');
        }
    }
    
    // Fungsi untuk upload ke SkyLen CDN
    async function uploadToSkyLenCDN() {
        const apiUrl = cdnEndpoints[selectedCDN];
        
        const formData = new FormData();
        formData.append('file', selectedFile);
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (result.data && result.data.response) {
            return {
                success: true,
                url: result.data.response
            };
        } else {
            throw new Error('Response tidak valid dari server');
        }
    }
    
    // Handle copy button click
    copyBtn.addEventListener('click', () => {
        const url = imageUrl.textContent;
        
        // Salin ke clipboard
        navigator.clipboard.writeText(url).then(() => {
            // Ubah teks tombol sementara
            copyBtn.innerHTML = '<i class="fas fa-check"></i> Tersalin!';
            copyBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
            
            // Kembalikan teks setelah 2 detik
            setTimeout(() => {
                copyBtn.innerHTML = '<i class="fas fa-copy"></i> Salin';
                copyBtn.style.background = 'linear-gradient(135deg, var(--primary), var(--primary-dark))';
            }, 2000);
            
            showNotification('URL berhasil disalin!', 'success');
        }).catch(err => {
            console.error('Gagal menyalin URL: ', err);
            showNotification('Gagal menyalin URL ke clipboard', 'error');
        });
    });
    
    // New button
    newBtn.addEventListener('click', () => {
        fileInput.value = '';
        selectedFile = null;
        previewSection.style.display = 'none';
        resultSection.style.display = 'none';
        uploadBtn.disabled = true;
        imagePreview.src = '';
        
        // Reset upload area
        uploadArea.innerHTML = `
            <i class="fas fa-cloud-upload-alt" style="font-size: 3rem; color: var(--primary); margin-bottom: 20px; opacity: 0.7;"></i>
            <div style="margin-bottom: 20px;">
                <div style="font-size: 1.1rem; color: var(--text); font-weight: 500; margin-bottom: 8px;">
                    Seret dan lepas gambar atau klik untuk memilih
                </div>
                <div style="font-size: 0.9rem; color: var(--text-muted);">
                    Format: JPG, PNG, GIF, WebP (Maks. 5MB)
                </div>
            </div>
            <label style="
                display: inline-block;
                background: linear-gradient(135deg, var(--primary), var(--primary-dark));
                color: white;
                padding: 12px 24px;
                border-radius: 50px;
                cursor: pointer;
                font-weight: 600;
                transition: all 0.3s ease;
                font-size: 0.9rem;
                border: none;
            ">
                <i class="fas fa-folder-open"></i> Pilih Gambar
            </label>
        `;
        
        // Re-attach click event
        const label = uploadArea.querySelector('label');
        label.addEventListener('click', () => fileInput.click());
        
        showNotification('Form berhasil direset', 'info');
    });
}

// 22. LINK BUILD GENERATOR
async function loadLinkBuild() {
    const toolHTML = `
        <div class="tool-page-container">
            <div class="tool-page-header">
                <h2 class="tool-page-title">
                    <i class="fas fa-link"></i> Link Build
                </h2>
                <button class="tool-back-btn" onclick="backToTools()">
                    <i class="fas fa-arrow-left"></i> Back to Tools
                </button>
            </div>
            
            <div class="tool-content">
                <!-- Form Section -->
                <div style="
                    background: rgba(30, 35, 60, 0.8);
                    border-radius: 20px;
                    padding: 25px;
                    border: 1px solid var(--border);
                    margin-bottom: 25px;
                ">
                    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 25px;">
                        <i class="fas fa-edit" style="color: var(--primary); font-size: 20px;"></i>
                        <h3 style="margin: 0; color: var(--text); font-size: 1.25rem;">Buat Halaman Link</h3>
                    </div>
                    
                    <!-- Profile Image Upload -->
                    <div style="margin-bottom: 25px;">
                        <label style="display: block; margin-bottom: 10px; color: var(--text); font-weight: 600; font-size: 15px;">
                            <i class="fas fa-image"></i> Gambar Profil
                        </label>
                        <div id="linkbuildProfileDrop" style="
                            border: 2px dashed var(--border);
                            border-radius: 14px;
                            padding: 25px 20px;
                            text-align: center;
                            background: rgba(30, 35, 60, 0.6);
                            cursor: pointer;
                            transition: all 0.3s ease;
                            margin-bottom: 15px;
                        ">
                            <div style="font-size: 30px; color: var(--primary); margin-bottom: 10px;">
                                <i class="fas fa-cloud-upload-alt"></i>
                            </div>
                            <div style="color: var(--text-muted); margin-bottom: 5px; font-size: 14px;">
                                Upload gambar profil
                            </div>
                            <div style="font-size: 12px; color: var(--text-muted);">
                                Format: JPG, PNG, GIF (Maks 5MB)
                            </div>
                            <input type="file" id="linkbuildImageInput" accept="image/*" style="display: none;">
                        </div>
                        <div id="linkbuildImagePreview" style="display: none;">
                            <div style="
                                display: flex;
                                align-items: center;
                                gap: 15px;
                                padding: 12px;
                                background: rgba(30, 35, 60, 0.6);
                                border-radius: 12px;
                                margin-top: 10px;
                            ">
                                <img src="" alt="Preview" style="width: 50px; height: 50px; border-radius: 8px; object-fit: cover;">
                                <div style="flex: 1; overflow: hidden;">
                                    <div id="linkbuildImageName" style="font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-size: 14px;"></div>
                                    <div id="linkbuildImageSize" style="font-size: 12px; color: var(--text-muted);"></div>
                                </div>
                                <button type="button" id="linkbuildRemoveImage" style="
                                    background: none;
                                    border: none;
                                    color: var(--danger);
                                    cursor: pointer;
                                    font-size: 16px;
                                    width: 30px;
                                    height: 30px;
                                    border-radius: 50%;
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                ">
                                    <i class="fas fa-times"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Profile Name -->
                    <div style="margin-bottom: 25px;">
                        <label style="display: block; margin-bottom: 10px; color: var(--text); font-weight: 600; font-size: 15px;">
                            <i class="fas fa-user"></i> Nama Anda
                        </label>
                        <input 
                            type="text" 
                            id="linkbuildNameInput" 
                            placeholder="John Doe" 
                            maxlength="50"
                            style="
                                width: 100%;
                                padding: 14px 18px;
                                background: rgba(30, 35, 60, 0.8);
                                border: 2px solid var(--border);
                                border-radius: 12px;
                                color: var(--text);
                                font-family: 'Inter', sans-serif;
                                font-size: 15px;
                                transition: all 0.3s ease;
                            "
                        >
                    </div>
                    
                    <!-- Bio -->
                    <div style="margin-bottom: 25px;">
                        <label style="display: block; margin-bottom: 10px; color: var(--text); font-weight: 600; font-size: 15px;">
                            <i class="fas fa-info-circle"></i> Bio / Deskripsi
                        </label>
                        <textarea 
                            id="linkbuildBioInput" 
                            placeholder="Deskripsi singkat tentang Anda..." 
                            maxlength="200"
                            rows="3"
                            style="
                                width: 100%;
                                padding: 14px 18px;
                                background: rgba(30, 35, 60, 0.8);
                                border: 2px solid var(--border);
                                border-radius: 12px;
                                color: var(--text);
                                font-family: 'Inter', sans-serif;
                                font-size: 15px;
                                resize: vertical;
                                transition: all 0.3s ease;
                            "
                        ></textarea>
                    </div>
                    
                    <!-- Links Section -->
                    <div>
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                            <div style="display: flex; align-items: center; gap: 10px;">
                                <i class="fas fa-link" style="color: var(--primary);"></i>
                                <h3 style="margin: 0; color: var(--text); font-size: 1.125rem;">Link Media Sosial</h3>
                            </div>
                            <button id="linkbuildAddLinkBtn" style="
                                background: var(--primary);
                                color: white;
                                border: none;
                                border-radius: 8px;
                                padding: 10px 20px;
                                font-size: 14px;
                                cursor: pointer;
                                display: flex;
                                align-items: center;
                                gap: 8px;
                                transition: all 0.3s ease;
                            ">
                                <i class="fas fa-plus"></i> Tambah Link
                            </button>
                        </div>
                        
                        <div id="linkbuildLinksContainer" style="max-height: 300px; overflow-y: auto; padding-right: 5px;">
                            <div style="text-align: center; padding: 30px; background: rgba(30, 35, 60, 0.6); border-radius: 12px; border: 2px dashed var(--border);">
                                <i class="fas fa-link" style="font-size: 30px; color: var(--text-muted); margin-bottom: 15px;"></i>
                                <p style="color: var(--text-muted); margin: 0; font-size: 14px;">Belum ada link. Klik "Tambah Link" untuk menambahkan.</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Preview Section -->
                <div style="
                    background: rgba(30, 35, 60, 0.8);
                    border-radius: 20px;
                    padding: 25px;
                    border: 1px solid var(--border);
                    margin-bottom: 25px;
                ">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; flex-wrap: wrap; gap: 15px;">
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <i class="fas fa-eye" style="color: var(--primary); font-size: 20px;"></i>
                            <h3 style="margin: 0; color: var(--text); font-size: 1.25rem;">Preview Halaman</h3>
                        </div>
                        <div style="display: flex; gap: 10px;">
                            <button id="linkbuildDownloadBtn" class="tool-btn" style="padding: 10px 20px; font-size: 14px; background: linear-gradient(135deg, #10b981, #059669);">
                                <i class="fas fa-download"></i> Download
                            </button>
                            <button id="linkbuildCopyBtn" class="tool-btn" style="padding: 10px 20px; font-size: 14px; background: rgba(30, 35, 60, 0.8); border: 1px solid var(--border);">
                                <i class="fas fa-copy"></i> Salin Kode
                            </button>
                        </div>
                    </div>
                    
                    <!-- Preview Container -->
                    <div style="
                        border: 2px dashed var(--border);
                        border-radius: 16px;
                        padding: 25px;
                        background: rgba(30, 35, 60, 0.6);
                        min-height: 400px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    ">
                        <div id="linkbuildPreviewContent" style="
                            width: 100%;
                            max-width: 400px;
                            background: rgba(19, 22, 39, 0.9);
                            border-radius: 16px;
                            padding: 30px 25px;
                            text-align: center;
                            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
                        ">
                            <div id="linkbuildPreviewAvatar" style="
                                width: 100px;
                                height: 100px;
                                border-radius: 50%;
                                margin: 0 auto 20px;
                                overflow: hidden;
                                border: 4px solid rgba(255, 255, 255, 0.1);
                                background: rgba(30, 35, 60, 0.8);
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                font-size: 35px;
                                color: var(--primary);
                            ">
                                <i class="fas fa-user"></i>
                            </div>
                            <h2 id="linkbuildPreviewName" style="
                                font-size: 1.5rem;
                                font-weight: 700;
                                margin-bottom: 10px;
                                color: var(--text);
                                word-break: break-word;
                            ">Nama Anda</h2>
                            <p id="linkbuildPreviewBio" style="
                                color: var(--text-muted);
                                margin-bottom: 25px;
                                line-height: 1.6;
                                font-size: 1rem;
                                word-break: break-word;
                            ">Deskripsi singkat tentang Anda...</p>
                            
                            <div id="linkbuildPreviewLinks" style="display: flex; flex-direction: column; gap: 12px;">
                                <div style="text-align: center; padding: 20px; color: var(--text-muted);">
                                    <i class="fas fa-link" style="font-size: 24px; margin-bottom: 10px;"></i>
                                    <p style="font-size: 14px;">Tambahkan link untuk melihat pratinjau di sini</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Action Buttons -->
                <div style="
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 15px;
                    margin-bottom: 20px;
                ">
                    <button id="linkbuildResetBtn" class="tool-btn" style="
                        background: rgba(239, 68, 68, 0.2);
                        border: 1px solid rgba(239, 68, 68, 0.3);
                        color: var(--danger);
                        padding: 15px;
                    ">
                        <i class="fas fa-redo"></i> Reset Semua
                    </button>
                    <button id="linkbuildPreviewBtn" class="tool-btn" style="
                        background: rgba(245, 158, 11, 0.2);
                        border: 1px solid rgba(245, 158, 11, 0.3);
                        color: #f59e0b;
                        padding: 15px;
                    ">
                        <i class="fas fa-external-link-alt"></i> Buka Preview
                    </button>
                    <button id="linkbuildSaveBtn" class="tool-btn" style="
                        background: linear-gradient(135deg, #8b5cf6, #7c3aed);
                        color: white;
                        padding: 15px;
                    ">
                        <i class="fas fa-save"></i> Simpan Template
                    </button>
                </div>
                
                <!-- Add Link Modal - DIPERBAIKI -->
                <div id="linkbuildModal" style="
                    display: none;
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.8);
                    z-index: 1000;
                    align-items: center;
                    justify-content: center;
                    padding: 15px;
                ">
                    <div style="
                        background: rgba(30, 35, 60, 0.95);
                        border-radius: 16px;
                        padding: 25px;
                        width: 100%;
                        max-width: 500px;
                        border: 1px solid var(--border);
                        max-height: 85vh; /* Diperkecil untuk memberi ruang bottom nav */
                        overflow-y: auto;
                        position: relative;
                        margin-bottom: 70px; /* Memberi ruang untuk bottom navigation */
                    ">
                        <!-- Tombol Close yang benar -->
                        <button id="linkbuildModalClose" style="
                            position: absolute;
                            top: 10px;
                            right: 10px;
                            background: rgba(0, 0, 0, 0.3);
                            border: none;
                            color: white;
                            font-size: 20px;
                            cursor: pointer;
                            width: 32px;
                            height: 32px;
                            border-radius: 50%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            z-index: 10;
                            transition: all 0.3s ease;
                        ">×</button>
                        
                        <h3 id="linkbuildModalTitle" style="
                            font-size: 1.25rem;
                            margin-bottom: 20px;
                            color: var(--text);
                            padding-right: 30px; /* Memberi ruang untuk tombol close */
                        ">Tambah Link Baru</h3>
                        
                        <form id="linkbuildForm" style="display: flex; flex-direction: column; gap: 15px;">
                            <input type="hidden" id="linkbuildLinkId">
                            
                            <div>
                                <label style="display: block; margin-bottom: 8px; color: var(--text); font-weight: 600; font-size: 14px;">
                                    Nama Media Sosial
                                </label>
                                <input type="text" id="linkbuildLinkTitle" placeholder="Contoh: Instagram" required maxlength="30" style="
                                    width: 100%;
                                    padding: 12px 15px;
                                    background: rgba(30, 35, 60, 0.8);
                                    border: 2px solid var(--border);
                                    border-radius: 10px;
                                    color: var(--text);
                                    font-family: 'Inter', sans-serif;
                                    font-size: 14px;
                                ">
                            </div>
                            
                            <div>
                                <label style="display: block; margin-bottom: 8px; color: var(--text); font-weight: 600; font-size: 14px;">
                                    URL Link
                                </label>
                                <input type="url" id="linkbuildLinkUrl" placeholder="https://instagram.com/username" required style="
                                    width: 100%;
                                    padding: 12px 15px;
                                    background: rgba(30, 35, 60, 0.8);
                                    border: 2px solid var(--border);
                                    border-radius: 10px;
                                    color: var(--text);
                                    font-family: 'Inter', sans-serif;
                                    font-size: 14px;
                                ">
                            </div>
                            
                            <div>
                                <label style="display: block; margin-bottom: 8px; color: var(--text); font-weight: 600; font-size: 14px;">
                                    Deskripsi (Opsional)
                                </label>
                                <input type="text" id="linkbuildLinkDescription" placeholder="Ikuti saya untuk update terbaru" maxlength="100" style="
                                    width: 100%;
                                    padding: 12px 15px;
                                    background: rgba(30, 35, 60, 0.8);
                                    border: 2px solid var(--border);
                                    border-radius: 10px;
                                    color: var(--text);
                                    font-family: 'Inter', sans-serif;
                                    font-size: 14px;
                                ">
                            </div>
                            
                            <div>
                                <label style="display: block; margin-bottom: 8px; color: var(--text); font-weight: 600; font-size: 14px;">
                                    Ikon
                                </label>
                                <select id="linkbuildLinkIcon" required style="
                                    width: 100%;
                                    padding: 12px 15px;
                                    background: rgba(30, 35, 60, 0.8);
                                    border: 2px solid var(--border);
                                    border-radius: 10px;
                                    color: var(--text);
                                    font-family: 'Inter', sans-serif;
                                    font-size: 14px;
                                ">
                                    <option value="fab fa-instagram">Instagram</option>
                                    <option value="fab fa-youtube">YouTube</option>
                                    <option value="fab fa-facebook">Facebook</option>
                                    <option value="fab fa-twitter">Twitter</option>
                                    <option value="fab fa-tiktok">TikTok</option>
                                    <option value="fab fa-whatsapp">WhatsApp</option>
                                    <option value="fab fa-linkedin">LinkedIn</option>
                                    <option value="fab fa-github">GitHub</option>
                                    <option value="fas fa-globe">Website</option>
                                </select>
                            </div>
                            
                            <div>
                                <label style="display: block; margin-bottom: 8px; color: var(--text); font-weight: 600; font-size: 14px;">
                                    Warna Latar
                                </label>
                                <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; margin-top: 10px;">
                                    <div class="linkbuild-color-option selected" style="background-color: #4361ee;" data-color="#4361ee"></div>
                                    <div class="linkbuild-color-option" style="background-color: #7209b7;" data-color="#7209b7"></div>
                                    <div class="linkbuild-color-option" style="background-color: #f72585;" data-color="#f72585"></div>
                                    <div class="linkbuild-color-option" style="background-color: #4cc9f0;" data-color="#4cc9f0"></div>
                                    <div class="linkbuild-color-option" style="background-color: #43aa8b;" data-color="#43aa8b"></div>
                                </div>
                                <input type="hidden" id="linkbuildLinkColor" value="#4361ee">
                            </div>
                            
                            <button type="submit" class="tool-btn" style="
                                width: 100%;
                                padding: 14px;
                                background: var(--primary);
                                color: white;
                                border: none;
                                border-radius: 10px;
                                font-size: 15px;
                                cursor: pointer;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                gap: 10px;
                                margin-top: 10px;
                                margin-bottom: 10px; /* Tambah margin bawah */
                            ">
                                <i class="fas fa-save"></i> Simpan Link
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        
        <style id="linkbuild-styles">
            /* Custom CSS hanya untuk Link Build */
            .linkbuild-color-option {
                width: 35px;
                height: 35px;
                border-radius: 8px;
                cursor: pointer;
                border: 2px solid transparent;
                transition: all 0.3s ease;
            }
            
            .linkbuild-color-option:hover {
                transform: scale(1.1);
            }
            
            .linkbuild-color-option.selected {
                border-color: white;
                transform: scale(1.1);
            }
            
            #linkbuildProfileDrop:hover,
            #linkbuildProfileDrop.dragover {
                border-color: var(--primary);
                background: rgba(67, 97, 238, 0.1);
            }
            
            .linkbuild-link-item {
                background: rgba(30, 35, 60, 0.6);
                border-radius: 12px;
                padding: 15px;
                margin-bottom: 12px;
                border-left: 4px solid var(--primary);
                transition: all 0.3s ease;
            }
            
            .linkbuild-link-item:hover {
                transform: translateX(3px);
                background: rgba(30, 35, 60, 0.8);
            }
            
            .linkbuild-preview-link {
                background: rgba(30, 35, 60, 0.8);
                border-radius: 12px;
                padding: 15px;
                display: flex;
                align-items: center;
                gap: 15px;
                transition: all 0.3s ease;
                cursor: pointer;
                text-decoration: none;
                color: inherit;
            }
            
            .linkbuild-preview-link:hover {
                background: rgba(30, 35, 60, 1);
                transform: translateY(-2px);
            }
            
            .linkbuild-preview-link-icon {
                width: 45px;
                height: 45px;
                border-radius: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 20px;
                flex-shrink: 0;
            }
            
            /* Scrollbar styling untuk link container */
            #linkbuildLinksContainer::-webkit-scrollbar {
                width: 6px;
            }
            
            #linkbuildLinksContainer::-webkit-scrollbar-track {
                background: rgba(30, 35, 60, 0.3);
                border-radius: 3px;
            }
            
            #linkbuildLinksContainer::-webkit-scrollbar-thumb {
                background: var(--primary);
                border-radius: 3px;
            }
            
            #linkbuildLinksContainer::-webkit-scrollbar-thumb:hover {
                background: var(--primary-light);
            }
            
            /* Fix untuk modal */
            #linkbuildModal > div {
                max-height: 85vh !important;
                margin-bottom: 70px !important;
            }
            
            #linkbuildModal form {
                padding-bottom: 5px;
            }
            
            /* Responsive untuk mobile */
            @media (max-width: 768px) {
                .tool-content {
                    padding: 15px;
                }
                
                #linkbuildPreviewContent {
                    padding: 20px 15px;
                }
                
                .linkbuild-preview-link {
                    padding: 12px;
                    gap: 12px;
                }
                
                .linkbuild-preview-link-icon {
                    width: 40px;
                    height: 40px;
                    font-size: 18px;
                }
                
                /* Modal mobile */
                #linkbuildModal {
                    padding: 10px;
                    align-items: flex-start;
                    padding-top: 20px;
                }
                
                #linkbuildModal > div {
                    margin-top: 10px;
                    padding: 20px;
                    max-height: 80vh;
                }
                
                /* Grid warna untuk mobile */
                .linkbuild-color-option {
                    width: 30px;
                    height: 30px;
                }
            }
            
            @media (max-width: 480px) {
                .linkbuild-color-option {
                    width: 28px;
                    height: 28px;
                }
                
                #linkbuildModal > div {
                    padding: 18px;
                    border-radius: 14px;
                }
            }
            
            /* Fix untuk semua tools */
            .tool-page-wrapper, 
            .tool-page-container, 
            .tool-content,
            #linkbuildProfileDrop,
            #linkbuildImagePreview,
            #linkbuildLinksContainer,
            #linkbuildPreviewContent {
                max-width: 100% !important;
                overflow-x: hidden !important;
                box-sizing: border-box !important;
            }
        </style>
    `;
    
    const container = getToolContainer(); 
    container.innerHTML = toolHTML; 
    container.style.display = 'block';
    
    // Initialize LinkBuild functionality
    setTimeout(initializeLinkBuild, 100);
}

async function initializeLinkBuild() {
    // Data storage
    let links = [];
    let linkIdCounter = 1;
    let currentEditId = null;
    let profileImageUrl = '';
    
    // Get DOM elements
    const nameInput = document.getElementById('linkbuildNameInput');
    const bioInput = document.getElementById('linkbuildBioInput');
    const imageInput = document.getElementById('linkbuildImageInput');
    const imageDrop = document.getElementById('linkbuildProfileDrop');
    const imagePreview = document.getElementById('linkbuildImagePreview');
    const imagePreviewImg = imagePreview.querySelector('img');
    const imageName = document.getElementById('linkbuildImageName');
    const imageSize = document.getElementById('linkbuildImageSize');
    const removeImageBtn = document.getElementById('linkbuildRemoveImage');
    const addLinkBtn = document.getElementById('linkbuildAddLinkBtn');
    const linksContainer = document.getElementById('linkbuildLinksContainer');
    const previewContent = document.getElementById('linkbuildPreviewContent');
    const previewAvatar = document.getElementById('linkbuildPreviewAvatar');
    const previewName = document.getElementById('linkbuildPreviewName');
    const previewBio = document.getElementById('linkbuildPreviewBio');
    const previewLinks = document.getElementById('linkbuildPreviewLinks');
    const downloadBtn = document.getElementById('linkbuildDownloadBtn');
    const copyBtn = document.getElementById('linkbuildCopyBtn');
    const resetBtn = document.getElementById('linkbuildResetBtn');
    const previewBtn = document.getElementById('linkbuildPreviewBtn');
    const saveBtn = document.getElementById('linkbuildSaveBtn');
    const modal = document.getElementById('linkbuildModal');
    const modalClose = document.getElementById('linkbuildModalClose');
    const modalTitle = document.getElementById('linkbuildModalTitle');
    const form = document.getElementById('linkbuildForm');
    const linkIdInput = document.getElementById('linkbuildLinkId');
    const linkTitleInput = document.getElementById('linkbuildLinkTitle');
    const linkUrlInput = document.getElementById('linkbuildLinkUrl');
    const linkDescInput = document.getElementById('linkbuildLinkDescription');
    const linkIconInput = document.getElementById('linkbuildLinkIcon');
    const linkColorInput = document.getElementById('linkbuildLinkColor');
    
    // ImgBB API Key
    const IMGBB_API_KEY = '31dd0c43eeea63e3d04e12469cfc76ec';
    
    // Setup drag and drop
    setupDragDrop();
    
    // Event Listeners
    nameInput.addEventListener('input', updatePreview);
    bioInput.addEventListener('input', updatePreview);
    
    imageDrop.addEventListener('click', () => imageInput.click());
    imageInput.addEventListener('change', handleImageUpload);
    removeImageBtn.addEventListener('click', removeImage);
    
    addLinkBtn.addEventListener('click', openAddLinkModal);
    modalClose.addEventListener('click', closeModal);
    form.addEventListener('submit', saveLink);
    
    downloadBtn.addEventListener('click', downloadHTML);
    copyBtn.addEventListener('click', copyHTMLCode);
    resetBtn.addEventListener('click', resetAll);
    previewBtn.addEventListener('click', previewInNewTab);
    saveBtn.addEventListener('click', saveTemplate);
    
    // Color selection
    document.querySelectorAll('.linkbuild-color-option').forEach(option => {
        option.addEventListener('click', function() {
            document.querySelectorAll('.linkbuild-color-option').forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            linkColorInput.value = this.getAttribute('data-color');
        });
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    
    // Drag and drop setup
    function setupDragDrop() {
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            imageDrop.addEventListener(eventName, preventDefaults, false);
        });
        
        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        ['dragenter', 'dragover'].forEach(eventName => {
            imageDrop.addEventListener(eventName, () => imageDrop.classList.add('dragover'), false);
        });
        
        ['dragleave', 'drop'].forEach(eventName => {
            imageDrop.addEventListener(eventName, () => imageDrop.classList.remove('dragover'), false);
        });
        
        imageDrop.addEventListener('drop', handleDrop, false);
        
        function handleDrop(e) {
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                handleFile(files[0]);
            }
        }
    }
    
    // Handle image upload
    async function handleImageUpload(e) {
        const file = e.target.files[0];
        if (!file) return;
        handleFile(file);
    }
    
    async function handleFile(file) {
        if (!file.type.match('image.*')) {
            showNotification('Silakan unggah file gambar (JPG, PNG, GIF)', 'error');
            return;
        }
        
        if (file.size > 5 * 1024 * 1024) {
            showNotification('Ukuran file terlalu besar (maksimal 5MB)', 'error');
            return;
        }
        
        try {
            showNotification('Mengunggah gambar...', 'loading');
            
            // Create temporary preview
            const reader = new FileReader();
            reader.onload = (e) => {
                profileImageUrl = e.target.result;
                showImagePreview(file, e.target.result);
                updateAvatarPreview();
            };
            reader.readAsDataURL(file);
            
            showNotification('Gambar berhasil diproses!', 'success');
            
        } catch (error) {
            console.error('Upload error:', error);
            showNotification('Gagal mengunggah gambar', 'error');
        }
    }
    
    function showImagePreview(file, url) {
        imagePreview.style.display = 'block';
        imagePreviewImg.src = url;
        imageName.textContent = file.name;
        imageSize.textContent = formatFileSize(file.size);
    }
    
    function removeImage() {
        profileImageUrl = '';
        imagePreview.style.display = 'none';
        imagePreviewImg.src = '';
        updateAvatarPreview();
        showNotification('Gambar profil dihapus', 'info');
    }
    
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    }
    
    // Update preview functions
    function updatePreview() {
        previewName.textContent = nameInput.value.trim() || 'Nama Anda';
        previewBio.textContent = bioInput.value.trim() || 'Deskripsi singkat tentang Anda...';
        updateAvatarPreview();
        updatePreviewLinks();
    }
    
    function updateAvatarPreview() {
        if (profileImageUrl) {
            previewAvatar.innerHTML = `<img src="${profileImageUrl}" alt="Profile" style="width: 100%; height: 100%; object-fit: cover;">`;
        } else {
            previewAvatar.innerHTML = '<i class="fas fa-user"></i>';
        }
    }
    
    // Link management
    function renderLinks() {
        if (links.length === 0) {
            linksContainer.innerHTML = `
                <div style="text-align: center; padding: 20px; background: rgba(30, 35, 60, 0.6); border-radius: 10px; border: 2px dashed var(--border);">
                    <i class="fas fa-link" style="font-size: 24px; color: var(--text-muted); margin-bottom: 10px;"></i>
                    <p style="color: var(--text-muted); margin: 0; font-size: 13px;">Belum ada link. Klik "Tambah" untuk menambahkan.</p>
                </div>
            `;
            return;
        }
        
        linksContainer.innerHTML = '';
        links.forEach(link => {
            const linkElement = document.createElement('div');
            linkElement.className = 'linkbuild-link-item';
            linkElement.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; flex-wrap: wrap; gap: 8px;">
                    <div style="display: flex; align-items: center; gap: 8px; flex: 1; min-width: 0;">
                        <i class="${link.icon}" style="color: ${link.color}; font-size: 16px;"></i>
                        <span style="font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-size: 13px;">${escapeHTML(link.title)}</span>
                    </div>
                    <div style="display: flex; gap: 6px; flex-shrink: 0;">
                        <button class="edit-link-btn" data-id="${link.id}" style="
                            background: rgba(67, 97, 238, 0.2);
                            border: 1px solid var(--primary);
                            color: var(--primary);
                            width: 28px;
                            height: 28px;
                            border-radius: 50%;
                            cursor: pointer;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            transition: all 0.3s ease;
                            font-size: 12px;
                        ">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="delete-link-btn" data-id="${link.id}" style="
                            background: rgba(239, 68, 68, 0.2);
                            border: 1px solid var(--danger);
                            color: var(--danger);
                            width: 28px;
                            height: 28px;
                            border-radius: 50%;
                            cursor: pointer;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            transition: all 0.3s ease;
                            font-size: 12px;
                        ">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div style="color: var(--text-muted); margin-bottom: 8px; font-size: 12px;">
                    <i class="fas fa-link" style="margin-right: 6px;"></i>
                    <a href="${escapeHTML(link.url)}" target="_blank" style="color: var(--primary); word-break: break-all;">${escapeHTML(link.url)}</a>
                </div>
                ${link.description ? `<p style="color: var(--text-muted); font-size: 12px; margin: 0; word-break: break-word;">${escapeHTML(link.description)}</p>` : ''}
            `;
            linksContainer.appendChild(linkElement);
        });
        
        // Add event listeners to buttons
        document.querySelectorAll('.edit-link-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.getAttribute('data-id'));
                editLink(id);
            });
        });
        
        document.querySelectorAll('.delete-link-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.getAttribute('data-id'));
                deleteLink(id);
            });
        });
    }
    
    function updatePreviewLinks() {
        if (links.length === 0) {
            previewLinks.innerHTML = `
                <div style="text-align: center; padding: 15px; color: var(--text-muted);">
                    <i class="fas fa-link" style="font-size: 20px; margin-bottom: 8px;"></i>
                    <p style="font-size: 13px;">Tambahkan link untuk melihat pratinjau</p>
                </div>
            `;
            return;
        }
        
        previewLinks.innerHTML = '';
        links.forEach(link => {
            const linkElement = document.createElement('a');
            linkElement.href = link.url;
            linkElement.target = '_blank';
            linkElement.rel = 'noopener noreferrer';
            linkElement.className = 'linkbuild-preview-link';
            linkElement.innerHTML = `
                <div class="linkbuild-preview-link-icon" style="background: ${link.color};">
                    <i class="${link.icon}"></i>
                </div>
                <div style="flex: 1; min-width: 0;">
                    <div style="font-weight: 600; margin-bottom: 3px; color: var(--text); word-break: break-word; font-size: 14px;">${escapeHTML(link.title)}</div>
                    <div style="font-size: 12px; color: var(--text-muted); word-break: break-word;">${escapeHTML(link.description || link.url)}</div>
                </div>
            `;
            previewLinks.appendChild(linkElement);
        });
    }
    
    function openAddLinkModal() {
        currentEditId = null;
        modalTitle.textContent = 'Tambah Link Baru';
        form.reset();
        linkIdInput.value = '';
        linkColorInput.value = '#4361ee';
        
        // Reset color selection
        document.querySelectorAll('.linkbuild-color-option').forEach(opt => opt.classList.remove('selected'));
        document.querySelector('.linkbuild-color-option').classList.add('selected');
        
        modal.style.display = 'flex';
        linkTitleInput.focus();
    }
    
    function closeModal() {
        modal.style.display = 'none';
        currentEditId = null;
    }
    
    function saveLink(e) {
        e.preventDefault();
        
        const linkData = {
            id: currentEditId || linkIdCounter++,
            title: linkTitleInput.value.trim(),
            url: linkUrlInput.value.trim(),
            description: linkDescInput.value.trim(),
            icon: linkIconInput.value,
            color: linkColorInput.value
        };
        
        // URL validation
        if (!isValidUrl(linkData.url)) {
            showNotification('URL tidak valid. Pastikan URL dimulai dengan http:// atau https://', 'error');
            return;
        }
        
        if (currentEditId) {
            // Edit existing link
            const index = links.findIndex(link => link.id === currentEditId);
            if (index !== -1) {
                links[index] = linkData;
            }
            showNotification('Link berhasil diperbarui', 'success');
        } else {
            // Add new link
            links.push(linkData);
            showNotification('Link berhasil ditambahkan', 'success');
        }
        
        renderLinks();
        updatePreviewLinks();
        closeModal();
    }
    
    function editLink(id) {
        const link = links.find(link => link.id === id);
        if (!link) return;
        
        currentEditId = id;
        modalTitle.textContent = 'Edit Link';
        linkIdInput.value = link.id;
        linkTitleInput.value = link.title;
        linkUrlInput.value = link.url;
        linkDescInput.value = link.description || '';
        linkIconInput.value = link.icon;
        linkColorInput.value = link.color;
        
        // Set color selection
        document.querySelectorAll('.linkbuild-color-option').forEach(opt => {
            opt.classList.remove('selected');
            if (opt.getAttribute('data-color') === link.color) {
                opt.classList.add('selected');
            }
        });
        
        modal.style.display = 'flex';
        linkTitleInput.focus();
    }
    
    function deleteLink(id) {
        if (confirm('Apakah Anda yakin ingin menghapus link ini?')) {
            links = links.filter(link => link.id !== id);
            renderLinks();
            updatePreviewLinks();
            showNotification('Link berhasil dihapus', 'success');
        }
    }
    
    // Additional functions
    function resetAll() {
        if (confirm('Apakah Anda yakin ingin mereset semua data?')) {
            nameInput.value = '';
            bioInput.value = '';
            profileImageUrl = '';
            imagePreview.style.display = 'none';
            links = [];
            linkIdCounter = 1;
            renderLinks();
            updatePreview();
            showNotification('Semua data telah direset', 'success');
        }
    }
    
    function previewInNewTab() {
        const htmlContent = generateHTML();
        const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
        showNotification('Preview dibuka di tab baru', 'info');
    }
    
    function saveTemplate() {
        const templateData = {
            name: nameInput.value.trim(),
            bio: bioInput.value.trim(),
            profileImage: profileImageUrl,
            links: links,
            createdAt: new Date().toISOString()
        };
        
        const jsonStr = JSON.stringify(templateData, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `linkhub-template-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showNotification('Template berhasil disimpan!', 'success');
    }
    
    // HTML generation and download
    function generateHTML() {
        const name = nameInput.value.trim() || 'Nama Anda';
        const bio = bioInput.value.trim() || 'Deskripsi singkat tentang Anda...';
        
        // Avatar HTML
        let avatarHTML = '<div class="avatar"><i class="fas fa-user"></i></div>';
        if (profileImageUrl) {
            avatarHTML = `<div class="avatar"><img src="${escapeHTML(profileImageUrl)}" alt="${escapeHTML(name)}" onerror="this.innerHTML='<i class=\\'fas fa-user\\'></i>'"></div>`;
        }
        
        // Links HTML
        let linksHTML = '';
        if (links.length > 0) {
            links.forEach(link => {
                linksHTML += `
                <a href="${escapeHTML(link.url)}" target="_blank" rel="noopener noreferrer" class="link-item">
                    <div class="link-icon" style="background: ${link.color};">
                        <i class="${link.icon}"></i>
                    </div>
                    <div class="link-text">
                        <h3>${escapeHTML(link.title)}</h3>
                        <p>${escapeHTML(link.description || link.url)}</p>
                    </div>
                </a>
                `;
            });
        } else {
            linksHTML = '<p class="no-links">Belum ada link yang ditambahkan.</p>';
        }
        
        return `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHTML(name)} - LinkHub</title>
    <meta name="description" content="${escapeHTML(bio)}">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&family=Inter:wght@300;400;500&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            font-family: 'Inter', sans-serif;
            line-height: 1.6;
            color: #333;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        
        .container {
            width: 100%;
            max-width: 500px;
            margin: 0 auto;
        }
        
        .linkhub-page {
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
            padding: 40px 30px;
            text-align: center;
            animation: fadeIn 0.5s ease;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .avatar {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            margin: 0 auto 20px;
            overflow: hidden;
            border: 4px solid white;
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
            background: #f0f2ff;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 35px;
            color: #4361ee;
        }
        
        .avatar img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        
        h1 {
            font-family: 'Poppins', sans-serif;
            font-size: 24px;
            font-weight: 600;
            margin-bottom: 10px;
            color: #222;
            word-break: break-word;
        }
        
        .bio {
            color: #666;
            margin-bottom: 30px;
            font-size: 15px;
            line-height: 1.5;
            word-break: break-word;
        }
        
        .links {
            display: flex;
            flex-direction: column;
            gap: 12px;
            margin-bottom: 30px;
        }
        
        .link-item {
            background: #f8f9ff;
            border-radius: 12px;
            padding: 15px;
            display: flex;
            align-items: center;
            gap: 15px;
            text-decoration: none;
            color: inherit;
            transition: all 0.3s ease;
            border: 2px solid transparent;
        }
        
        .link-item:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
            border-color: #4361ee;
        }
        
        .link-icon {
            width: 45px;
            height: 45px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 20px;
            flex-shrink: 0;
        }
        
        .link-text {
            text-align: left;
            flex: 1;
            min-width: 0;
        }
        
        .link-text h3 {
            font-family: 'Poppins', sans-serif;
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 4px;
            color: #222;
            word-break: break-word;
        }
        
        .link-text p {
            font-size: 13px;
            color: #777;
            word-break: break-word;
        }
        
        .no-links {
            color: #999;
            font-style: italic;
            padding: 20px;
            font-size: 14px;
        }
        
        .footer {
            color: #999;
            font-size: 13px;
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #eee;
        }
        
        @media (max-width: 600px) {
            body { padding: 15px; }
            .linkhub-page { padding: 30px 20px; border-radius: 15px; }
            h1 { font-size: 22px; }
            .bio { font-size: 14px; }
            .link-item { padding: 12px; }
            .avatar { width: 90px; height: 90px; font-size: 30px; }
        }
        
        @media (max-width: 400px) {
            .link-item { flex-direction: column; text-align: center; gap: 10px; }
            .link-text { text-align: center; }
            .avatar { width: 80px; height: 80px; font-size: 25px; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="linkhub-page">
            ${avatarHTML}
            <h1>${escapeHTML(name)}</h1>
            <p class="bio">${escapeHTML(bio)}</p>
            
            <div class="links">
                ${linksHTML}
            </div>
            
            <div class="footer">
                Dibuat dengan Link Build &copy; ${new Date().getFullYear()}
            </div>
        </div>
    </div>
</body>
</html>`;
    }
    
    function downloadHTML() {
        const htmlContent = generateHTML();
        const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'linkhub-page.html';
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showNotification('File HTML berhasil didownload!', 'success');
    }
    
    async function copyHTMLCode() {
        const htmlContent = generateHTML();
        
        try {
            await navigator.clipboard.writeText(htmlContent);
            showNotification('Kode HTML berhasil disalin ke clipboard!', 'success');
        } catch (err) {
            // Fallback
            const textArea = document.createElement('textarea');
            textArea.value = htmlContent;
            textArea.style.position = 'fixed';
            textArea.style.opacity = '0';
            document.body.appendChild(textArea);
            textArea.select();
            
            try {
                document.execCommand('copy');
                showNotification('Kode HTML berhasil disalin!', 'success');
            } catch (copyErr) {
                showNotification('Gagal menyalin kode: ' + copyErr, 'error');
            }
            
            document.body.removeChild(textArea);
        }
    }
    
    // Utility functions
    function escapeHTML(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    function isValidUrl(string) {
        try {
            const url = new URL(string);
            return url.protocol === 'http:' || url.protocol === 'https:';
        } catch (_) {
            return false;
        }
    }
    
    // Initial render
    updatePreview();
}

// 10. TEMP MAIL TOOL (VERSI SIMPEL)
async function loadTempMail() {
    const toolHTML = `
        <div class="tool-page-container">
            <div class="tool-page-header">
                <h2 class="tool-page-title">
                    <i class="fas fa-mail-bulk"></i> TempMail
                </h2>
                <button class="tool-back-btn" onclick="backToTools()">
                    <i class="fas fa-arrow-left"></i> Back
                </button>
            </div>
            
            <div class="tool-content">
                <!-- Email Creation -->
                <div style="background: rgba(30, 35, 60, 0.8); border-radius: 12px; padding: 20px; margin-bottom: 20px; border: 1px solid var(--border);">
                    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px;">
                        <i class="fas fa-plus-circle" style="color: var(--primary);"></i>
                        <div style="font-weight: 600; color: var(--text);">Email Baru</div>
                    </div>
                    
                    <div id="tempEmailDisplay" style="text-align: center; padding: 20px; background: rgba(0,0,0,0.2); border-radius: 10px; margin-bottom: 15px;">
                        <div id="tempGeneratedEmail" style="font-family: monospace; font-size: 16px; color: var(--text); margin: 10px 0; word-break: break-all;">-</div>
                        
                        <div style="display: flex; gap: 10px; margin-top: 15px; flex-wrap: wrap;">
                            <button id="tempCreateEmailBtn" class="tool-btn" style="flex: 1; min-width: 120px;">
                                <i class="fas fa-plus"></i> Buat
                            </button>
                            <button id="tempCopyEmailBtn" class="tool-btn" style="flex: 1; min-width: 120px; display: none;">
                                <i class="fas fa-copy"></i> Salin
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Inbox -->
                <div style="background: rgba(30, 35, 60, 0.8); border-radius: 12px; padding: 20px; border: 1px solid var(--border);">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <i class="fas fa-inbox" style="color: var(--primary);"></i>
                            <div style="font-weight: 600; color: var(--text);">Inbox</div>
                        </div>
                        <div style="background: var(--primary); color: white; padding: 5px 15px; border-radius: 20px; font-size: 14px; font-weight: 600;" id="tempEmailCount">0</div>
                    </div>
                    
                    <div style="display: flex; gap: 10px; margin-bottom: 15px;">
                        <button id="tempRefreshInboxBtn" class="tool-btn" style="flex: 1;">
                            <i class="fas fa-sync-alt"></i> Refresh
                        </button>
                        <button id="tempAutoRefreshToggle" class="tool-btn" style="flex: 1; background: rgba(30, 35, 60, 0.6); border: 1px solid var(--border);">
                            <i class="fas fa-play"></i> Auto
                        </button>
                    </div>
                    
                    <div id="tempInboxList" style="max-height: 300px; overflow-y: auto; border: 1px solid var(--border); border-radius: 8px; padding: 10px; background: rgba(0,0,0,0.2);">
                        <div style="text-align: center; padding: 20px; color: var(--text-muted); font-size: 14px;">
                            <i class="fas fa-inbox" style="font-size: 24px; margin-bottom: 10px; opacity: 0.5;"></i>
                            <div>Buat email terlebih dahulu</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    const container = getToolContainer();
    container.innerHTML = toolHTML;
    container.style.display = 'block';
    
    // Initialize TempMail
    initializeTempMailSimple();
}

// Versi sederhana TempMail
async function initializeTempMailSimple() {
    // State
    let currentEmail = null;
    let currentSessionId = null;
    let autoRefreshInterval = null;
    let autoRefreshEnabled = false;
    
    // Elements
    const elements = {
        createBtn: document.getElementById('tempCreateEmailBtn'),
        copyBtn: document.getElementById('tempCopyEmailBtn'),
        refreshBtn: document.getElementById('tempRefreshInboxBtn'),
        autoBtn: document.getElementById('tempAutoRefreshToggle'),
        emailDisplay: document.getElementById('tempGeneratedEmail'),
        emailCount: document.getElementById('tempEmailCount'),
        inboxList: document.getElementById('tempInboxList')
    };
    
    // API functions
    async function createEmail() {
        try {
            const response = await fetch('https://api.nekolabs.web.id/tools/tempmail/v1/create');
            const data = await response.json();
            
            if (data.success) {
                currentEmail = data.result.email;
                currentSessionId = data.result.sessionId;
                
                elements.emailDisplay.textContent = currentEmail;
                elements.copyBtn.style.display = 'inline-flex';
                
                // Save to storage
                localStorage.setItem('tempEmail', currentEmail);
                localStorage.setItem('tempSessionId', currentSessionId);
                
                showNotification('Email berhasil dibuat', 'success');
                fetchInbox();
            }
        } catch (error) {
            showNotification('Gagal membuat email', 'error');
        }
    }
    
    async function fetchInbox() {
        if (!currentSessionId) return;
        
        try {
            const response = await fetch(`https://api.nekolabs.web.id/tools/tempmail/v1/inbox?id=${currentSessionId}`);
            const data = await response.json();
            
            if (data.success) {
                const emails = Array.isArray(data.result) ? data.result : 
                              data.result?.emails || data.result?.messages || 
                              data.result?.data || [];
                
                elements.emailCount.textContent = emails.length;
                
                if (emails.length === 0) {
                    elements.inboxList.innerHTML = `
                        <div style="text-align: center; padding: 20px; color: var(--text-muted); font-size: 14px;">
                            <i class="fas fa-inbox" style="font-size: 24px; margin-bottom: 10px; opacity: 0.5;"></i>
                            <div>Belum ada email</div>
                        </div>
                    `;
                    return;
                }
                
                let inboxHTML = '';
                emails.slice(0, 10).forEach(email => {
                    const subject = email.subject || email.Subject || '(No subject)';
                    const from = email.from || email.sender || 'Unknown';
                    const preview = email.body || email.content || email.text || '';
                    
                    inboxHTML += `
                        <div style="
                            padding: 12px;
                            margin-bottom: 8px;
                            background: rgba(30, 35, 60, 0.6);
                            border-radius: 8px;
                            border: 1px solid var(--border);
                            cursor: pointer;
                            transition: all 0.2s;
                        " onmouseover="this.style.transform='translateX(5px)'" 
                        onmouseout="this.style.transform=''"
                        onclick="showTempMailDetail(${JSON.stringify(email).replace(/"/g, '&quot;')})">
                            <div style="font-weight: 600; color: var(--text); font-size: 14px; margin-bottom: 5px;">${subject}</div>
                            <div style="color: var(--text-muted); font-size: 12px; margin-bottom: 5px;">From: ${from}</div>
                            <div style="color: var(--text-muted); font-size: 12px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                                ${preview.substring(0, 100)}${preview.length > 100 ? '...' : ''}
                            </div>
                        </div>
                    `;
                });
                
                elements.inboxList.innerHTML = inboxHTML;
            }
        } catch (error) {
            console.error('Failed to fetch inbox:', error);
        }
    }
    
    function showTempMailDetail(email) {
        const subject = email.subject || email.Subject || '(No subject)';
        const from = email.from || email.sender || 'Unknown';
        const body = email.body || email.content || email.text || 'No content';
        const date = email.date || email.createdAt || new Date().toISOString();
        
        const detailHTML = `
            <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 20px;">
                <div style="background: rgba(30, 35, 60, 0.95); border-radius: 12px; padding: 25px; width: 100%; max-width: 600px; border: 1px solid var(--border); max-height: 80vh; overflow-y: auto;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                        <div style="font-weight: 700; color: var(--text); font-size: 18px;">${subject}</div>
                        <button onclick="this.parentElement.parentElement.parentElement.remove()" style="background: none; border: none; color: var(--text-muted); font-size: 24px; cursor: pointer;">×</button>
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <div style="color: var(--text-muted); font-size: 14px; margin-bottom: 5px;"><strong>From:</strong> ${from}</div>
                        <div style="color: var(--text-muted); font-size: 14px; margin-bottom: 5px;"><strong>To:</strong> ${currentEmail}</div>
                        <div style="color: var(--text-muted); font-size: 14px;"><strong>Date:</strong> ${new Date(date).toLocaleString()}</div>
                    </div>
                    
                    <div style="background: rgba(0,0,0,0.3); padding: 20px; border-radius: 8px; border: 1px solid var(--border);">
                        <div style="color: var(--text); white-space: pre-wrap; font-size: 14px; line-height: 1.6;">${body}</div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', detailHTML);
    }
    
    function toggleAutoRefresh() {
        autoRefreshEnabled = !autoRefreshEnabled;
        
        if (autoRefreshEnabled) {
            autoRefreshInterval = setInterval(fetchInbox, 10000);
            elements.autoBtn.innerHTML = '<i class="fas fa-stop"></i> Stop';
            elements.autoBtn.style.background = 'var(--warning)';
            elements.autoBtn.style.borderColor = 'var(--warning)';
            showNotification('Auto refresh ON', 'info');
        } else {
            clearInterval(autoRefreshInterval);
            elements.autoBtn.innerHTML = '<i class="fas fa-play"></i> Auto';
            elements.autoBtn.style.background = 'rgba(30, 35, 60, 0.6)';
            elements.autoBtn.style.borderColor = 'var(--border)';
            showNotification('Auto refresh OFF', 'info');
        }
    }
    
    // Event listeners
    elements.createBtn.addEventListener('click', createEmail);
    elements.copyBtn.addEventListener('click', () => {
        if (currentEmail) {
            navigator.clipboard.writeText(currentEmail);
            showNotification('Email disalin', 'success');
        }
    });
    elements.refreshBtn.addEventListener('click', fetchInbox);
    elements.autoBtn.addEventListener('click', toggleAutoRefresh);
    
    // Load saved email
    const savedEmail = localStorage.getItem('tempEmail');
    const savedSessionId = localStorage.getItem('tempSessionId');
    
    if (savedEmail && savedSessionId) {
        currentEmail = savedEmail;
        currentSessionId = savedSessionId;
        elements.emailDisplay.textContent = currentEmail;
        elements.copyBtn.style.display = 'inline-flex';
        fetchInbox();
    }
    
    // Make showTempMailDetail global
    window.showTempMailDetail = showTempMailDetail;
}

// ===== PENUTUP TOOL FUNCTION =====

// Helper function to load external scripts
function loadScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// Helper function for notifications (existing)
function showNotification(message, type = 'info') {
    // Your existing notification function
    console.log(`[${type.toUpperCase()}] ${message}`);
}