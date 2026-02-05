// ===== GLOBAL VARIABLES =====
let currentPage = 'homePage';
let currentTool = null;
let musicPlayer = null;
let spotifyAudioPlayer = null;
let currentTrackIndex = 0;
let currentSpotifyTrackIndex = -1;
let isPlaying = false;
let isSpotifyPlaying = false;
let isShuffle = false;
let isRepeat = false;
let currentCategory = 'all';
let tradingChartData = [];
let tradingChartSVG = null;

// ===== GLOBAL VARIABLES FOR SERVICE CHART =====
let serviceChartData = [];
let chartTimeRange = 'live';
let chartZoom = 1;
let chartPanOffset = 0;
let chartToolUsageData = {};
let peakPoints = [];
let chartAnimationFrame = null;
let chartLastUpdate = Date.now();
let chartColors = [
    '#647cf7', // TikTok
    '#E1306C', // Instagram
    '#1DB954', // Spotify
    '#000000', // iPhone
    '#10B981', // Worm GPT
    '#F59E0B', // ByyVerse AI
    '#1877f2', // Facebook
    '#ff0000', // YouTube
    '#3B82F6', // Tracker NIK
    '#8B5CF6'  // NGL Spam
];

// ===== TOKEN AUTH GLOBAL VARIABLES =====
let tokenSessionTimer = null;

// Tools categories
const toolCategories = [
    { id: 'all', name: 'All Tools', icon: 'fas fa-th', count: 0 },
    { id: 'downloader', name: 'Downloader', icon: 'fas fa-download', count: 0 },
    { id: 'maker', name: 'Maker', icon: 'fas fa-tools', count: 0 },
    { id: 'ai', name: 'AI Tools', icon: 'fas fa-robot', count: 0 },
    { id: 'social', name: 'Social Media', icon: 'fas fa-share-alt', count: 0 },
    { id: 'utility', name: 'Utility', icon: 'fas fa-cog', count: 0 }
];

// Music playlist
const playlist = [
    {
        title: "Monolog",
        artist: "Pamungkas",
        url: "https://files.catbox.moe/c6rvkt.mp3",
        duration: "3:23"
    },
    {
        title: "Bergema Sampai Selamanya",
        artist: "Nadhif Basalamah",
        url: "https://files.catbox.moe/vkdf84.mp3",
        duration: "4:20"
    },
    {
        title: "Multo",
        artist: "Cup Of Joe",
        url: "https://files.catbox.moe/8qso57.mp3",
        duration: "3:15"
    },
    {
        title: "About You",
        artist: "The 1975",
        url: "https://files.catbox.moe/4lnc6i.mp3",
        duration: "4:30"
    },
    {
        title: "Sailor Song",
        artist: "Gigi Perez",
        url: "https://files.catbox.moe/cjnlw6.mp3",
        duration: "3:30"
    },
    {
        title: "Payphone",
        artist: "Maroon 5",
        url: "https://files.catbox.moe/9uy9wn.m4a",
        duration: "4:00"
    }
];

// Spotify search results
let spotifySearchResults = [];
let currentSpotifyTrack = null;

// Tools list dengan kategori (semua tools terbuka)
const allTools = [
    {
        id: 'brat',
        name: 'Brat Generator',
        description: 'Create custom Brat stickers with text',
        icon: 'fas fa-sticky-note',
        color: '#647cf7',
        function: 'loadBratGenerator',
        category: 'maker'
    },
    {
        id: 'tiktok',
        name: 'TikTok Downloader',
        description: 'Download TikTok videos without watermark',
        icon: 'fab fa-tiktok',
        color: '#000000',
        function: 'loadTikTokDownloader',
        category: 'downloader'
    },
    {
        id: 'getcode',
        name: 'GET Code Generator',
        description: 'Generate embed codes for websites',
        icon: 'fas fa-code',
        color: '#10b981',
        function: 'loadGetCodeGenerator',
        category: 'maker'
    },
    {
        id: 'byyunbanned',
        name: 'Byy Unbanned',
        description: 'Generate ban appeal emails',
        icon: 'fas fa-unlock',
        color: '#f59e0b',
        function: 'loadByyUnbanned',
        category: 'utility'
    },
    {
        id: 'whatsapp-auto-react',
        name: 'WhatsApp Auto React',
        description: 'Auto react to WhatsApp messages with custom emoji',
        icon: 'fab fa-whatsapp',
        color: '#25D366',
        function: 'loadWhatsAppAutoReact',
        category: 'utility'
    }, 
    {
        id: 'iphone',
        name: 'iPhone Generator',
        description: 'Create iPhone message screenshots',
        icon: 'fab fa-apple',
        color: '#000000',
        function: 'loadiPhoneGenerator',
        category: 'maker'
    },
    {
        id: 'xpro',
        name: 'XPRO INVICTUS',
        description: 'WhatsApp bug simulation tool',
        icon: 'fas fa-bug',
        color: '#ef4444',
        function: 'loadXPROInvictus',
        category: 'utility'
    },
    {
        id: 'ngl',
        name: 'NGL Spam',
        description: 'Send messages to NGL links',
        icon: 'fas fa-paper-plane',
        color: '#8B5CF6',
        function: 'loadNGLSpam',
        category: 'utility'
    },
    {
        id: 'qris',
        name: 'QRIS Converter',
        description: 'Convert QRIS images to dynamic QR',
        icon: 'fas fa-qrcode',
        color: '#06D6A0',
        function: 'loadQRISConverter',
        category: 'utility'
    },
    {
        id: 'nik',
        name: 'Tracker NIK',
        description: 'Search NIK information',
        icon: 'fas fa-id-card',
        color: '#3B82F6',
        function: 'loadTrackerNIK',
        category: 'utility'
    },
    {
        id: 'wormgpt',
        name: 'Worm GPT AI',
        description: 'Advanced AI assistant',
        icon: 'fas fa-robot',
        color: '#10B981',
        function: 'loadWormGPT',
        category: 'ai'
    },
    {
        id: 'byyverseai',
        name: 'ByyVerse AI',
        description: 'Smart coding assistant',
        icon: 'fas fa-brain',
        color: '#F59E0B',
        function: 'loadByyverseAI',
        category: 'ai'
    },
    {
        id: 'fbdownloader',
        name: 'FB Video Downloader',
        description: 'Download video Facebook dengan berbagai kualitas dan audio',
        icon: 'fab fa-facebook',
        color: '#1877f2',
        function: 'loadFBVideoDownloader',
        category: 'downloader'
    },
    {
        id: 'instagram',
        name: 'Instagram Downloader',
        description: 'Download video & view Instagram profiles easily',
        icon: 'fab fa-instagram',
        color: '#E1306C',
        function: 'loadInstagramTool',
        category: 'downloader'
    }, 
    {
        id: 'ytdownloader',
        name: 'YouTube Downloader',
        description: 'Download video YouTube dalam format MP3 dan MP4 berkualitas',
        icon: 'fab fa-youtube',
        color: '#ff0000',
        function: 'loadYouTubeDownloader',
        category: 'downloader'
    }, 
    {
        id: 'encoder',
        name: 'Hard Encoder',
        description: 'Encrypt code with multiple security layers',
        icon: 'fas fa-lock',
        color: '#000000',
        function: 'loadHardEncoder',
        category: 'utility'
    },
    {
        id: 'mentang',
        name: 'Mentang Creator',
        description: 'Create trendy "Text Line" style memes',
        icon: 'fas fa-quote-right',
        color: '#647cf7',
        function: 'loadMentangCreator',
        category: 'maker'
    }, 
    {
        id: 'hd-upscaler',
        name: 'HD Upscaler',
        description: 'Enhance image quality to HD/UHD',
        icon: 'fas fa-expand-alt',
        color: '#5a6bf2',   
        function: 'loadHDUpscaler',
        category: 'utility'
    }, 
    {
        id: 'weather-Forecast',
        name: 'Cek Cuaca',
        description: 'Get real-time weather updates for every city and region across Indonesia',
        icon: 'fas fa-cloud-sun',
        color: '#4A90E2',
        function: 'loadWeatherForecast',
        category: 'utility'
    }, 
    {
        id: 'text-to-qr',
        name: 'Text to QR',
        description: 'Convert any text or URL into a scannable QR Code instantly',
        icon: 'fas fa-qrcode',
        color: '#8B5CF6',
        function: 'loadTextToQR',
        category: 'maker'
    }, 
    {
        id: 'osint-tool',
        name: 'OSINT Tool',
        description: 'Advanced OSINT platform for digital security analysis',
        icon: 'fas fa-search',
        color: '#111111',
        function: 'loadOSINTTool',
        category: 'utility'
    }, 
    {
        id: 'webzip-pro',
        name: 'WebZip Pro',
        description: 'Convert websites to ZIP archives instantly with all assets',
        icon: 'fas fa-file-archive',
        color: '#6366f1',
        function: 'loadWebZipPro',
        category: 'utility'
    },
    {
        id: 'twitter-downloader', 
        name: 'Twitter/X DL',
        description: 'Download videos from Twitter/X in multiple qualities',
        icon: 'fab fa-twitter',
        color: '#1da1f2',
        function: 'loadTwitterDownloader',
        category: 'downloader'
    },
    {
        id: 'cek-gempa',
        name: 'Earthquake Monitor',
        description: 'Check the latest real-time earthquake activity.',
        icon: 'fas fa-house-damage',
        color: '#E74C3C',
        function: 'loadCekGempa',
        category: 'utility'
    },
    {
        id: 'allmedia',
        name: 'All Media Downloader',
        description: 'Download media from multiple platforms quickly and easily.',
        icon: 'fas fa-cloud-download-alt',
         color: '#1ABC9C',
         function: 'loadAllMediaDownloader',
         category: 'downloader'
    },
    {
        id: 'image-to-figure',
        name: 'Image to Figure',
        description: 'Convert images to AI figures with advanced transformation',
        icon: 'fas fa-robot',
        color: '#8B5CF6',
        function: 'loadImageToFigure',
        category: 'ai'
    },
    {
        id: 'image-uploader',
        name: 'Image Uploader',
        description: 'Upload images to multiple CDN providers with easy sharing',
        icon: 'fas fa-cloud-upload-alt',
        color: '#3B82F6',
        function: 'loadImageUploader',
        category: 'utility'
    }, 
    {
        id: 'linkbuild',
        name: 'Link Build',
        description: 'Buat halaman link profesional dalam hitungan menit',
        icon: 'fas fa-link',
        color: '#4361ee',
        function: 'loadLinkBuild',
        category: 'utility'
    }, 
    {
        id: 'tempmail',
        name: 'TempMail',
        description: 'Email sementara gratis untuk verifikasi',
        icon: 'fas fa-mail-bulk',
        color: '#3b82f6',
        function: 'loadTempMail',
        category: 'maker'
    }
];

// ===== CORS PROXY FUNCTION =====
function getCorsProxyUrl(url) {
    return `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
}

// ===== SIMPLE LOADING SCREEN =====
function createGeometricParticles() {
    const container = document.getElementById('geometricParticles');
    if (!container) return;
    
    // Hapus particles lama
    container.innerHTML = '';
    
    // Buat 8 particles geometric sederhana
    const shapes = ['square', 'circle', 'triangle', 'diamond'];
    
    for (let i = 0; i < 8; i++) {
        const particle = document.createElement('div');
        const shape = shapes[i % shapes.length];
        
        particle.className = `geometric-particle ${shape}`;
        
        // Random position
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        particle.style.left = `${x}%`;
        particle.style.top = `${y}%`;
        
        // Custom properties untuk animasi
        const tx = (Math.random() - 0.5) * 100;
        const ty = (Math.random() - 0.5) * 100;
        
        particle.style.setProperty('--tx', `${tx}px`);
        particle.style.setProperty('--ty', `${ty}px`);
        
        // Variasi kecepatan
        const duration = 3 + Math.random() * 2;
        particle.style.animationDuration = `${duration}s`;
        
        // Variasi size
        const size = 8 + Math.random() * 8;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Variasi opacity
        const opacity = 0.1 + Math.random() * 0.2;
        particle.style.opacity = opacity;
        
        // Delay untuk efek ripple
        const delay = Math.random() * 2;
        particle.style.animationDelay = `${delay}s`;
        
        container.appendChild(particle);
    }
}

function initializeLogoShape() {
    const logoShape = document.getElementById('logoShape');
    if (!logoShape) return;
    
    logoShape.style.animation = 'morphShape 8s ease-in-out infinite';
}

function simulateLoading() {
    try {
        const progressBar = document.getElementById('simpleProgress');
        const percentage = document.getElementById('loadingPercentage');
        const status = document.getElementById('loadingStatus');
        const loadingScreen = document.getElementById('loading-screen');
        
        if (!progressBar || !percentage || !status || !loadingScreen) {
            console.log('Elemen loading tidak ditemukan, langsung lanjut ke main content');
            hideLoadingScreen();
            return;
        }
        
        let progress = 0;
        
        // Tips yang lebih simple
        const loadingSteps = [
            { percent: 15, message: "Loading core modules..." },
            { percent: 35, message: "Preparing interface..." },
            { percent: 55, message: "Loading tools..." },
            { percent: 75, message: "Optimizing performance..." },
            { percent: 90, message: "Finalizing..." },
            { percent: 100, message: "Ready!" }
        ];
        
        let currentStep = 0;
        
        const interval = setInterval(() => {
            // Progress dengan easing
            let increment;
            if (progress < 40) {
                increment = 1.5 + Math.random() * 1;
            } else if (progress < 80) {
                increment = 1 + Math.random() * 0.8;
            } else {
                increment = 0.5 + Math.random() * 0.3;
            }
            
            progress = Math.min(progress + increment, 100);
            
            // Update progress bar
            progressBar.style.width = `${progress}%`;
            
            // Update percentage
            percentage.textContent = `${Math.round(progress)}%`;
            
            // Update status message berdasarkan progress
            const step = loadingSteps.find(s => progress >= s.percent && currentStep < s.percent);
            if (step && step.percent > currentStep) {
                currentStep = step.percent;
                status.textContent = step.message;
                
                // Efek fade untuk status message
                status.style.opacity = '0';
                setTimeout(() => {
                    status.style.opacity = '1';
                    status.style.transition = 'opacity 0.3s ease';
                }, 100);
            }
            
            // Complete loading
            if (progress >= 100) {
                clearInterval(interval);
                
                // Efek penyelesaian
                progressBar.style.background = 'linear-gradient(90deg, #647cf7, #3b82f6)';
                status.textContent = "ByyVerse Ready!";
                
                // Animasi selesai
                setTimeout(() => {
                    loadingScreen.style.opacity = '0';
                    loadingScreen.style.transition = 'opacity 0.6s ease';
                    
                    setTimeout(() => {
                        loadingScreen.style.display = 'none';
                        
                        // Welcome notification (2 detik)
                        setTimeout(() => {
                            showNotification('🎉 Welcome to ByyVerse! Explore all available tools.', 'success', 2000);
                        }, 500);
                        
                        // Initialize components
                        initializeComponents();
                        
                        // Play welcome sound
                        setTimeout(() => {
                            playWelcomeSound();
                        }, 1000);
                        
                    }, 600);
                }, 800);
            }
        }, 40);
    } catch (error) {
        console.error('Error in simulateLoading:', error);
        hideLoadingScreen();
    }
}

function initializeComponents() {
    // Apply initial animations
    applyTextAnimations();
    
    // Initialize enhanced chart
    setTimeout(() => {
        initializeEnhancedChart();
        initializeLiveStatistics();
    }, 500);
    
    // Load tools jika di halaman tools
    if (currentPage === 'toolsPage') {
        loadToolsContainer();
        loadToolsCategories();
    }
}

function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.style.opacity = '0';
        loadingScreen.style.transition = 'opacity 0.5s ease';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            console.log('Loading screen hidden');
        }, 500);
    }
}

// ===== WELCOME SOUND FUNCTION =====
function playWelcomeSound() {
    try {
        const welcomeSound = document.getElementById('welcomeSound');
        if (!welcomeSound) return;
        
        welcomeSound.volume = 0.3;
        
        // Coba play dengan timeout
        setTimeout(() => {
            const playPromise = welcomeSound.play();
            
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.log('Auto-play blocked:', error);
                    // Setup user interaction listener
                    const playOnInteraction = () => {
                        welcomeSound.play().catch(e => console.log('User interaction play failed:', e));
                        document.removeEventListener('click', playOnInteraction);
                        document.removeEventListener('touchstart', playOnInteraction);
                    };
                    
                    document.addEventListener('click', playOnInteraction, { once: true });
                    document.addEventListener('touchstart', playOnInteraction, { once: true });
                });
            }
        }, 500);
        
    } catch (error) {
        console.error('Error in playWelcomeSound:', error);
    }
}

// ===== SIMPLE NOTIFICATION SYSTEM (2 DETIK) =====
function showNotification(message, type = 'info', duration = 2000) {
    const container = document.getElementById('notificationContainer');
    if (!container) {
        console.log('Notification container not found');
        return;
    }
    
    // Clear notifications yang terlalu banyak
    const notifications = container.querySelectorAll('.notification');
    if (notifications.length > 3) {
        notifications[0].remove();
    }
    
    // Buat notification element baru
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    // Ikon berdasarkan type
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-times-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };
    
    notification.innerHTML = `
        <div class="notification-icon">
            <i class="${icons[type] || icons.info}"></i>
        </div>
        <div class="notification-content">
            <div class="notification-message">${message}</div>
            <div class="notification-subtext">ByyVerse</div>
        </div>
        <button class="notification-close" onclick="closeNotification(this)">
            <i class="fas fa-times"></i>
        </button>
        <div class="notification-progress">
            <div class="progress-bar-inner"></div>
        </div>
    `;
    
    container.appendChild(notification);
    
    // Progress bar animation
    const progressInner = notification.querySelector('.progress-bar-inner');
    if (progressInner && duration > 0) {
        progressInner.style.animation = `progressShrink ${duration}ms linear forwards`;
    }
    
    // Auto remove setelah 2 detik
    if (duration > 0) {
        setTimeout(() => {
            closeNotificationElement(notification);
        }, duration);
    }
}

function closeNotification(button) {
    const notification = button.closest('.notification');
    closeNotificationElement(notification);
}

function closeNotificationElement(notification) {
    if (!notification) return;
    
    notification.style.animation = 'notificationSlideOut 0.3s ease forwards';
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// ===== PWA FUNCTIONS =====
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/service-worker.js')
                .then(registration => {
                    console.log('[Service Worker] Registered:', registration);
                    showNotification('Aplikasi siap diinstall untuk akses offline!', 'success', 2000);
                })
                .catch(error => {
                    console.log('[Service Worker] Registration failed:', error);
                });
        });
    }
}

let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    // Tampilkan prompt setelah 5 detik
    setTimeout(() => {
        showInstallPrompt();
    }, 5000);
});

function showInstallPrompt() {
    if (deferredPrompt && !localStorage.getItem('installPromptShown')) {
        const installNotification = document.createElement('div');
        installNotification.className = 'install-notification';
        installNotification.innerHTML = `
            <div class="install-content">
                <i class="fas fa-download"></i>
                <div>
                    <strong>Install ByyVerse</strong>
                    <small>Akses offline & lebih cepat</small>
                </div>
                <button class="install-btn" onclick="installPWA()">Install</button>
                <button class="install-close" onclick="closeInstallPrompt()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        document.body.appendChild(installNotification);
        
        // Auto hide after 15 seconds
        setTimeout(() => {
            if (installNotification.parentNode) {
                installNotification.remove();
                localStorage.setItem('installPromptShown', 'true');
            }
        }, 15000);
    }
}

function installPWA() {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                showNotification('Aplikasi sedang diinstall...', 'success', 2000);
                localStorage.setItem('installPromptShown', 'true');
            } else {
                showNotification('Installasi dibatalkan', 'info', 2000);
            }
            deferredPrompt = null;
        });
    }
}

function closeInstallPrompt() {
    const notification = document.querySelector('.install-notification');
    if (notification) notification.remove();
    localStorage.setItem('installPromptShown', 'true');
}

// ===== OFFLINE DETECTION =====
function setupOfflineDetection() {
    window.addEventListener('online', () => {
        showNotification('Koneksi internet aktif!', 'success', 2000);
        checkApiStatus();
    });
    
    window.addEventListener('offline', () => {
        showNotification('Anda sedang offline. Beberapa fitur terbatas.', 'warning', 2000);
    });
}

// ===== TOKEN AUTHENTICATION SYSTEM =====

// Fungsi untuk membuka modal token
function showTokenModal() {
    const modal = document.getElementById('tokenModal');
    if (!modal) return;
    
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    // Update session info jika sudah login
    updateSessionInfo();
    
    // Focus ke input token
    setTimeout(() => {
        const tokenInput = document.getElementById('tokenInput');
        if (tokenInput) tokenInput.focus();
    }, 300);
}

// Fungsi untuk menutup modal token
function closeTokenModal() {
    const modal = document.getElementById('tokenModal');
    if (!modal) return;
    
    modal.classList.remove('show');
    document.body.style.overflow = '';
    
    // Clear timer
    if (tokenSessionTimer) {
        clearInterval(tokenSessionTimer);
        tokenSessionTimer = null;
    }
}

// Toggle visibility token
function toggleTokenVisibility() {
    const tokenInput = document.getElementById('tokenInput');
    const eyeBtn = document.querySelector('.show-token-btn i');
    
    if (!tokenInput) return;
    
    if (tokenInput.type === 'password') {
        tokenInput.type = 'text';
        eyeBtn.className = 'fas fa-eye-slash';
    } else {
        tokenInput.type = 'password';
        eyeBtn.className = 'fas fa-eye';
    }
}

// ===== TOKEN FUNCTIONS (UPDATE) =====

// Submit token dengan loading spinner
function submitToken() {
    const tokenInput = document.getElementById('tokenInput');
    const submitBtn = document.querySelector('.btn-primary');
    const originalHTML = submitBtn.innerHTML;
    
    if (!tokenInput) return;
    
    const token = tokenInput.value.trim();
    
    // Validasi input
    if (!token) {
        showInputError('Token tidak boleh kosong');
        return;
    }
    
    if (token.length !== 15) {
        showInputError('Token harus 15 karakter');
        return;
    }
    
    // Show loading spinner
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verifying...';
    submitBtn.disabled = true;
    
    // Simulate API call delay
    setTimeout(() => {
        // Validasi token
        if (tokenAuth.validateToken(token)) {
            // Token valid
            tokenInput.value = '';
            
            // Success animation
            submitBtn.innerHTML = '<i class="fas fa-check"></i> Verified!';
            submitBtn.style.background = 'linear-gradient(135deg, #10b981, #34d399)';
            
            showNotification('✅ Token berhasil diverifikasi! Mengalihkan ke Tools...', 'success', 2000);
            
            // Tutup modal dengan animasi smooth setelah 2 detik
            setTimeout(() => {
                closeTokenModalSmooth();
                showPage('toolsPage');
                
                // Reset button setelah modal tertutup
                setTimeout(() => {
                    submitBtn.innerHTML = originalHTML;
                    submitBtn.disabled = false;
                    submitBtn.style.background = '';
                }, 500);
            }, 2000);
        } else {
            // Token tidak valid
            showInputError('Token tidak valid');
            showNotification('❌ Token salah! Silakan cek kembali atau dapatkan token baru.', 'error', 3000);
            
            // Reset button
            submitBtn.innerHTML = originalHTML;
            submitBtn.disabled = false;
            
            // Log invalid attempt
            console.warn('Invalid token attempt:', token);
        }
    }, 1500);
}

// Tutup modal dengan animasi smooth
function closeTokenModalSmooth() {
    const modal = document.getElementById('tokenModal');
    if (!modal) return;
    
    // Animasi keluar
    modal.style.animation = 'modalSlideOut 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards';
    
    setTimeout(() => {
        modal.classList.remove('show');
        modal.style.animation = '';
        document.body.style.overflow = '';
        
        // Clear timer
        if (tokenSessionTimer) {
            clearInterval(tokenSessionTimer);
            tokenSessionTimer = null;
        }
    }, 400);
}

// Dapatkan link token (langsung buka)
function getTokenLink() {
    const link = 'https://sfl.gl/oqD9x4G9';
    window.open(link, '_blank');
    
    showNotification('🔗 Membuka halaman token...', 'info', 2000);
}

// Button tutorial cara melewati link
function openTutorialLink() {
    const tutorialLink = 'https://youtube.com/shorts/Ulx8ttZ9NxE?si=sA4XnsOAUI7wynf9';
    window.open(tutorialLink, '_blank');
    
    showNotification('📺 Membuka tutorial...', 'info', 2000);
}

// Tutup modal biasa (untuk tombol close)
function closeTokenModal() {
    closeTokenModalSmooth();
}

// Show error pada input
function showInputError(message) {
    const tokenInput = document.getElementById('tokenInput');
    const inputGroup = document.querySelector('.token-input-group');
    
    if (!tokenInput || !inputGroup) return;
    
    // Add error class
    tokenInput.classList.add('token-input-error');
    inputGroup.classList.add('token-input-error');
    
    // Show hint message
    const hint = document.querySelector('.input-hint');
    if (hint) {
        hint.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${message}`;
        hint.style.color = '#ef4444';
    }
    
    // Shake animation
    tokenInput.style.animation = 'shake 0.5s ease';
    
    // Remove error state after 3 seconds
    setTimeout(() => {
        tokenInput.classList.remove('token-input-error');
        inputGroup.classList.remove('token-input-error');
        tokenInput.style.animation = '';
        
        if (hint) {
            hint.innerHTML = `<i class="fas fa-info-circle"></i> Token: 15 karakter alfanumerik`;
            hint.style.color = '';
        }
    }, 3000);
}

// Logout token
function logoutToken() {
    if (confirm('Yakin ingin logout? Anda perlu token baru untuk mengakses tools.')) {
        tokenAuth.resetToken();
        closeTokenModal();
        showNotification('👋 Anda telah logout dari Tools Page', 'info', 2000);
    }
}

// Update session info
function updateSessionInfo() {
    const sessionInfo = document.getElementById('sessionInfo');
    const sessionTimer = document.getElementById('sessionTimer');
    const logoutBtn = document.querySelector('.btn-logout');
    
    if (!sessionInfo || !sessionTimer || !logoutBtn) return;
    
    // Cek apakah sudah login
    if (tokenAuth.isAuthenticated()) {
        // Dapatkan session data
        const sessionData = localStorage.getItem('byyverse_session');
        if (sessionData) {
            try {
                const session = JSON.parse(sessionData);
                const expiryTime = session.timestamp + session.expiry;
                const remaining = expiryTime - Date.now();
                
                if (remaining > 0) {
                    // Update timer setiap detik
                    if (tokenSessionTimer) clearInterval(tokenSessionTimer);
                    
                    tokenSessionTimer = setInterval(() => {
                        const now = Date.now();
                        const timeLeft = expiryTime - now;
                        
                        if (timeLeft <= 0) {
                            clearInterval(tokenSessionTimer);
                            sessionTimer.textContent = '00:00:00';
                            showNotification('⏰ Sesi token telah berakhir', 'warning', 3000);
                            tokenAuth.clearAuth();
                            logoutBtn.style.display = 'none';
                            return;
                        }
                        
                        // Format waktu
                        const hours = Math.floor(timeLeft / (1000 * 60 * 60));
                        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
                        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
                        
                        sessionTimer.textContent = 
                            `${hours.toString().padStart(2, '0')}:` +
                            `${minutes.toString().padStart(2, '0')}:` +
                            `${seconds.toString().padStart(2, '0')}`;
                    }, 1000);
                    
                    // Show logout button
                    logoutBtn.style.display = 'flex';
                }
            } catch (error) {
                console.error('Error parsing session:', error);
            }
        }
    } else {
        sessionTimer.textContent = '--:--:--';
        logoutBtn.style.display = 'none';
    }
}

// Intercept Tools Page access
function checkToolsAccess() {
    if (currentPage === 'toolsPage') {
        if (!tokenAuth.isAuthenticated()) {
            showTokenModal();
            return false;
        }
    }
    return true;
}

// Auto-check session expiry setiap 5 menit
setInterval(() => {
    if (tokenAuth.isAuthenticated()) {
        updateSessionInfo();
    }
}, 5 * 60 * 1000);

// ===== INITIALIZATION =====
function initializeApp() {
    try {
        // Setup simple loading
        createGeometricParticles();
        initializeLogoShape();
        simulateLoading();
        
        // Initialize audio players
        musicPlayer = document.getElementById('audioPlayer');
        spotifyAudioPlayer = document.getElementById('spotifyAudioPlayer');
        
        if (musicPlayer) initializeMusicPlayer();
        if (spotifyAudioPlayer) initializeSpotifyPlayer();
        
        // Load saved theme
        const savedTheme = localStorage.getItem('theme') || 'dark';
        setTheme(savedTheme);
        
        // Update tool categories count
        updateToolCategoriesCount();
        
        // Setup event listeners
        setTimeout(() => {
            setupEventListeners();
            checkApiStatus();
            
            // Setup periodic API checks
            setInterval(checkApiStatus, 30000);
            
            // Register Service Worker
            registerServiceWorker();
            
            // Setup offline detection
            setupOfflineDetection();
            
        }, 300);
        
    } catch (error) {
        console.error('Error in initializeApp:', error);
        hideLoadingScreen();
    }
}

function updateToolCategoriesCount() {
    toolCategories.forEach(category => {
        if (category.id === 'all') {
            category.count = allTools.length;
        } else {
            category.count = allTools.filter(tool => tool.category === category.id).length;
        }
    });
}

function setupEventListeners() {
    // Theme toggle
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Search functionality
    const searchInput = document.getElementById('searchTools');
    if (searchInput) {
        searchInput.addEventListener('input', filterTools);
    }
    
    // Email form enter key
    const messageInput = document.getElementById('messageInput');
    if (messageInput) {
        messageInput.addEventListener('keypress', handleEmailEnter);
    }
    
    // Debounced resize handler
    window.addEventListener('resize', debounce(adjustToolGrid, 300));
    
    // Apply animations on page change
    document.addEventListener('click', function(e) {
        if (e.target.closest('.nav-btn') || e.target.closest('[onclick^="showPage"]')) {
            setTimeout(applyTextAnimations, 300);
        }
    });
    
    // Token modal enter key support
    const tokenInput = document.getElementById('tokenInput');
    if (tokenInput) {
        tokenInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                submitToken();
            }
        });
    }
    
    function handleEmailEnter(e) {
        if (e.key === 'Enter' && e.ctrlKey) {
            e.preventDefault();
            sendEmailMessage();
        }
    }
}

// ===== LIVE STATISTICS ANIMATION =====
function initializeLiveStatistics() {
    generateTradingChart();
    
    setInterval(() => {
        updateLiveStatistics();
        updateMiniCharts();
        updateTradingChart();
    }, 10000);
    
    animateStatisticsNumbers();
}

// ===== TRADING CHART FUNCTIONS =====
function generateTradingChart() {
    const chartContainer = document.getElementById('tradingChart');
    if (!chartContainer) return;
    
    // Create SVG element
    const svg = document.getElementById('chartSVG');
    if (!svg) return;
    
    tradingChartSVG = svg;
    
    // Generate grid lines
    generateChartGrid();
    
    // Generate initial data
    tradingChartData = [];
    const baseValue = 50;
    
    for (let i = 0; i < 50; i++) {
        tradingChartData.push({
            x: i,
            y: baseValue + Math.sin(i * 0.3) * 15 + Math.random() * 10 - 5
        });
    }
    
    drawTradingChart();
}

function generateChartGrid() {
    const gridContainer = document.getElementById('chartGrid');
    if (!gridContainer) return;
    
    gridContainer.innerHTML = '';
    
    // Create 10x5 grid
    for (let row = 0; row <= 5; row++) {
        for (let col = 0; col <= 10; col++) {
            const gridCell = document.createElement('div');
            gridCell.className = 'grid-line';
            gridContainer.appendChild(gridCell);
        }
    }
}

function drawTradingChart() {
    const svg = tradingChartSVG;
    if (!svg) return;
    
    svg.innerHTML = '';
    
    const width = svg.clientWidth || 800;
    const height = svg.clientHeight || 250;
    const padding = 30;
    
    // Calculate scales
    const xScale = (width - padding * 2) / (tradingChartData.length - 1);
    const yMin = Math.min(...tradingChartData.map(d => d.y)) - 10;
    const yMax = Math.max(...tradingChartData.map(d => d.y)) + 10;
    const yScale = (height - padding * 2) / (yMax - yMin);
    
    // Create path for line
    let pathData = '';
    
    tradingChartData.forEach((point, i) => {
        const x = padding + i * xScale;
        const y = height - padding - (point.y - yMin) * yScale;
        
        if (i === 0) {
            pathData += `M ${x} ${y} `;
        } else {
            pathData += `L ${x} ${y} `;
        }
    });
    
    // Create line path
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', pathData);
    path.setAttribute('class', 'chart-path');
    path.setAttribute('stroke', '#647cf7');
    path.setAttribute('stroke-width', '3');
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('stroke-linejoin', 'round');
    
    svg.appendChild(path);
    
    // Create points
    tradingChartData.forEach((point, i) => {
        const x = padding + i * xScale;
        const y = height - padding - (point.y - yMin) * yScale;
        
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', x);
        circle.setAttribute('cy', y);
        circle.setAttribute('r', '3');
        circle.setAttribute('class', 'chart-point');
        circle.setAttribute('fill', 'white');
        circle.setAttribute('stroke', '#647cf7');
        circle.setAttribute('stroke-width', '2');
        
        // Add hover effect
        circle.addEventListener('mouseenter', () => {
            circle.setAttribute('r', '5');
            showTooltip(point.y.toFixed(1), x, y);
        });
        
        circle.addEventListener('mouseleave', () => {
            circle.setAttribute('r', '3');
            hideTooltip();
        });
        
        svg.appendChild(circle);
    });
    
    // Animate line drawing
    const pathLength = path.getTotalLength();
    path.style.strokeDasharray = pathLength;
    path.style.strokeDashoffset = pathLength;
    path.style.animation = `drawChart 2s ease forwards`;
}

function showTooltip(value, x, y) {
    let tooltip = document.getElementById('chartTooltip');
    
    if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.id = 'chartTooltip';
        tooltip.style.position = 'absolute';
        tooltip.style.background = 'var(--bg-secondary)';
        tooltip.style.color = 'var(--text-primary)';
        tooltip.style.padding = '5px 10px';
        tooltip.style.borderRadius = 'var(--radius-sm)';
        tooltip.style.fontSize = '12px';
        tooltip.style.boxShadow = 'var(--shadow)';
        tooltip.style.border = '1px solid var(--border)';
        tooltip.style.zIndex = '1000';
        tooltip.style.pointerEvents = 'none';
        tooltip.style.opacity = '0';
        tooltip.style.transition = 'opacity 0.3s';
        document.querySelector('.trading-chart').appendChild(tooltip);
    }
    
    tooltip.textContent = `Value: ${value}`;
    tooltip.style.left = `${x}px`;
    tooltip.style.top = `${y - 40}px`;
    tooltip.style.opacity = '1';
}

function hideTooltip() {
    const tooltip = document.getElementById('chartTooltip');
    if (tooltip) {
        tooltip.style.opacity = '0';
    }
}

function updateTradingChart() {
    if (tradingChartData.length < 50) return;
    
    // Remove first point and add new random point
    tradingChartData.shift();
    
    const lastPoint = tradingChartData[tradingChartData.length - 1];
    const newY = Math.max(10, Math.min(90, 
        lastPoint.y + (Math.random() - 0.5) * 10
    ));
    
    tradingChartData.push({
        x: tradingChartData.length,
        y: newY
    });
    
    // Update all x values
    tradingChartData.forEach((point, i) => {
        point.x = i;
    });
    
    drawTradingChart();
}

function updateMiniCharts() {
    const miniBars = document.querySelectorAll('.mini-chart-bar');
    miniBars.forEach(bar => {
        const randomHeight = 50 + Math.random() * 50;
        bar.style.height = `${randomHeight}%`;
    });
}

function updateLiveStatistics() {
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    
    const timeFactor = hour + minute / 60;
    const dayFactor = Math.sin(timeFactor * Math.PI / 12) * 0.5 + 0.5;
    
    const users = Math.floor(10000 + dayFactor * 2000 + Math.random() * 500);
    const downloads = Math.floor(240000 + dayFactor * 10000 + Math.random() * 2000);
    const aiRequests = Math.floor(15000 + (hour >= 9 && hour <= 17 ? 3000 : 1000) + Math.random() * 500);
    const uptime = 99.5 + Math.random() * 0.5;
    const responseTime = 0.5 + Math.random() * 0.5;
    const dataProcessed = 4.0 + Math.random() * 0.5;
    const securityScore = 98 + Math.random() * 2;
    
    animateNumberChange('liveUsers', users);
    animateNumberChange('liveDownloads', downloads);
    animateNumberChange('liveAIRequests', aiRequests);
    
    document.getElementById('liveUptime').textContent = `${uptime.toFixed(1)}%`;
    document.getElementById('responseTime').textContent = `${responseTime.toFixed(1)}s`;
    document.getElementById('dataProcessed').textContent = `${dataProcessed.toFixed(1)}TB`;
    document.getElementById('securityScore').textContent = `${Math.round(securityScore)}%`;
    
    const progressBars = document.querySelectorAll('.progress-fill');
    if (progressBars[0]) {
        const responseWidth = Math.min(95, Math.max(70, 85 + (Math.random() - 0.5) * 10));
        progressBars[0].style.width = `${responseWidth}%`;
    }
    if (progressBars[1]) {
        const dataWidth = Math.min(98, Math.max(85, 92 + (Math.random() - 0.5) * 6));
        progressBars[1].style.width = `${dataWidth}%`;
    }
    if (progressBars[2]) {
        const securityWidth = Math.min(100, Math.max(95, 98 + (Math.random() - 0.5) * 4));
        progressBars[2].style.width = `${securityWidth}%`;
    }
}

function changeChartPeriod(period) {
    showNotification(`Switched to ${period === 'live' ? 'Live' : period === 'day' ? '24 Hours' : 'Weekly'} view`, 'info', 2000);
    
    // Reset chart dengan data baru berdasarkan period
    tradingChartData = [];
    const baseValue = 50;
    
    let dataPoints = 50;
    if (period === 'day') dataPoints = 100;
    if (period === 'week') dataPoints = 200;
    
    for (let i = 0; i < dataPoints; i++) {
        tradingChartData.push({
            x: i,
            y: baseValue + Math.sin(i * 0.1) * 20 + Math.random() * 15 - 7.5
        });
    }
    
    drawTradingChart();
}

function animateNumberChange(elementId, newValue) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const oldValue = parseInt(element.textContent.replace(/,/g, '')) || 0;
    const diff = newValue - oldValue;
    
    let current = oldValue;
    const increment = diff / 20;
    const duration = 1000;
    
    const interval = setInterval(() => {
        current += increment;
        
        if ((increment > 0 && current >= newValue) || 
            (increment < 0 && current <= newValue)) {
            current = newValue;
            clearInterval(interval);
        }
        
        element.textContent = Math.floor(current).toLocaleString();
    }, duration / 20);
}

function animateStatisticsNumbers() {
    const statNumbers = document.querySelectorAll('.stat-value, .metric-value');
    statNumbers.forEach(number => {
        const originalText = number.textContent;
        const isPercent = originalText.includes('%');
        const isSeconds = originalText.includes('s');
        const isData = originalText.includes('TB');
        
        let targetValue;
        if (isPercent) {
            targetValue = parseFloat(originalText);
        } else if (isSeconds) {
            targetValue = parseFloat(originalText);
        } else if (isData) {
            targetValue = parseFloat(originalText);
        } else {
            targetValue = parseInt(originalText.replace(/,/g, '')) || 0;
        }
        
        number.textContent = '0' + (isPercent ? '%' : isSeconds ? 's' : isData ? 'TB' : '');
        
        setTimeout(() => {
            let current = 0;
            const increment = targetValue / 30;
            const duration = 2000;
            
            const interval = setInterval(() => {
                current += increment;
                
                if (current >= targetValue) {
                    current = targetValue;
                    clearInterval(interval);
                    number.textContent = originalText;
                } else {
                    if (isPercent || isSeconds || isData) {
                        number.textContent = current.toFixed(1) + (isPercent ? '%' : isSeconds ? 's' : isData ? 'TB' : '');
                    } else {
                        number.textContent = Math.floor(current).toLocaleString();
                    }
                }
            }, duration / 30);
        }, 500);
    });
}

// ===== API STATUS CHECKER =====
function checkApiStatus() {
    const apiStatus = document.getElementById('apiStatus');
    const statusIndicator = document.getElementById('statusIndicator');
    const statusText = document.getElementById('statusText');
    
    if (!apiStatus || !statusIndicator || !statusText) return;
    
    // Simple online check
    const isOnline = navigator.onLine;
    
    if (isOnline) {
        apiStatus.classList.remove('offline');
        apiStatus.classList.add('online');
        statusIndicator.classList.remove('offline');
        statusIndicator.classList.add('online');
        statusText.textContent = 'Online';
    } else {
        apiStatus.classList.remove('online');
        apiStatus.classList.add('offline');
        statusIndicator.classList.remove('online');
        statusIndicator.classList.add('offline');
        statusText.textContent = 'Offline';
    }
    
    apiStatus.style.animation = 'bounceIn 0.5s ease';
    setTimeout(() => {
        apiStatus.style.animation = '';
    }, 500);
}

// ===== EMAIL MESSAGE FUNCTION =====
function sendEmailMessage() {
    const emailInput = document.getElementById('emailInput');
    const messageInput = document.getElementById('messageInput');
    
    if (!emailInput || !messageInput) return;
    
    const email = emailInput.value.trim();
    const message = messageInput.value.trim();
    
    if (!email) {
        showNotification('Please enter your email', 'error', 2000);
        emailInput.focus();
        return;
    }
    
    if (!message) {
        showNotification('Please enter your message', 'error', 2000);
        messageInput.focus();
        return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showNotification('Please enter a valid email address', 'error', 2000);
        emailInput.focus();
        return;
    }
    
    showNotification('Sending message...', 'info', 2000);
    
    const sendBtn = document.querySelector('[onclick="sendEmailMessage()"]');
    const originalText = sendBtn.innerHTML;
    sendBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    sendBtn.disabled = true;
    
    setTimeout(() => {
        showNotification('Message sent successfully! We\'ll respond soon.', 'success', 2000);
        
        emailInput.value = '';
        messageInput.value = '';
        
        sendBtn.innerHTML = originalText;
        sendBtn.disabled = false;
        
        const form = document.querySelector('.email-form');
        form.style.animation = 'bounceIn 0.5s ease';
        setTimeout(() => {
            form.style.animation = '';
        }, 500);
        
    }, 1500);
}

// ===== APPLY TEXT ANIMATIONS =====
function applyTextAnimations() {
    setTimeout(() => {
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle) {
            heroTitle.classList.add('floating-words');
        }
        
        const statsTitle = document.querySelector('.platform-stats-section .section-title');
        if (statsTitle) {
            statsTitle.classList.add('glitch-text-enhanced');
            const textSpan = statsTitle.querySelector('.neon-wave-text-enhanced');
            if (textSpan) {
                textSpan.style.animation = 'neonWaveEnhanced 4s ease-in-out infinite';
            }
        }
        
        const sectionTitles = document.querySelectorAll('.section-title:not(.platform-stats-section .section-title), .page-title');
        sectionTitles.forEach(title => {
            title.classList.add('scale-pulse-text');
        });
        
        const statNumbers = document.querySelectorAll('.stat-number');
        statNumbers.forEach(number => {
            number.classList.add('animated-gradient-text');
        });
        
        const statCards = document.querySelectorAll('.stat-card-enhanced');
        statCards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
            card.classList.add('fadeInUp');
        });
        
        const toolNames = document.querySelectorAll('.tool-name');
        toolNames.forEach(name => {
            name.classList.add('slide-in-text');
        });
        
        const logo = document.querySelector('.logo');
        if (logo) {
            const logoText = logo.querySelector('span');
            if (logoText) {
                logoText.classList.add('neon-flicker');
            }
        }
        
        setTimeout(() => {
            const bars = document.querySelectorAll('.mini-chart-bar');
            bars.forEach((bar, index) => {
                bar.style.animationDelay = `${index * 0.1}s`;
            });
        }, 1000);
        
    }, 100);
}

// ===== THEME MANAGEMENT =====
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    // Apply rotation animation to icon
    const icon = document.querySelector('#themeToggle i');
    if (icon) {
        icon.style.animation = 'rotateSlow 0.6s ease';
        
        // Update icon after animation
        setTimeout(() => {
            icon.className = newTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
            icon.style.animation = '';
        }, 600);
    }
    
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    
    showNotification(`Theme changed to ${newTheme} mode`, 'info', 2000);
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
}

// ===== PAGE NAVIGATION =====
function showPage(pageId) {
    // Jika mencoba akses tools page, cek token dulu
    if (pageId === 'toolsPage') {
        if (!tokenAuth.isAuthenticated()) {
            showTokenModal();
            return;
        }
    }
    
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.remove('active');
    });
    
    const toolContainer = document.getElementById('toolContainer');
    if (toolContainer) {
        toolContainer.style.display = 'none';
        toolContainer.classList.remove('active');
    }
    
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
        currentPage = pageId;
        
        updateBottomNav(pageId);
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        if (pageId === 'toolsPage') {
            loadToolsContainer();
            loadToolsCategories();
        }
        
        if (pageId === 'musikPage') {
            switchMusicTab('local');
        }
        
        setTimeout(applyTextAnimations, 100);
        
        if (pageId === 'homePage') {
            setTimeout(() => {
                generateTradingChart();
                updateMiniCharts();
            }, 300);
        }
        
        setTimeout(() => {
            const toolCards = document.querySelectorAll('.tool-card');
            toolCards.forEach((card, index) => {
                card.style.animationDelay = `${index * 0.1}s`;
                card.style.animation = 'fadeInUp 0.5s ease forwards';
            });
        }, 200);
    }
}

function updateBottomNav(pageId) {
    const navBtns = document.querySelectorAll('.nav-btn');
    navBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('onclick')?.includes(pageId)) {
            btn.classList.add('active');
        }
    });
}

// ===== TOOLS MANAGEMENT =====
function loadToolsCategories() {
    const categoriesContainer = document.getElementById('toolsCategories');
    if (!categoriesContainer) return;
    
    categoriesContainer.innerHTML = toolCategories.map(category => `
        <button class="category-btn ${category.id === 'all' ? 'active' : ''}" 
                onclick="filterToolsByCategory('${category.id}')">
            <i class="${category.icon}"></i>
            <span class="category-btn-text">${category.name} (${category.count})</span>
        </button>
    `).join('');
}

function loadToolsContainer() {
    const container = document.getElementById('toolsContainer');
    if (!container) return;
    
    const filteredTools = currentCategory === 'all' 
        ? allTools 
        : allTools.filter(tool => tool.category === currentCategory);
    
    if (filteredTools.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px; color: var(--text-muted); grid-column: 1 / -1;">
                <i class="fas fa-search fa-2x" style="margin-bottom: 15px; opacity: 0.5;"></i>
                <div style="font-weight: 600; font-size: 16px;">No tools found</div>
                <div style="font-size: 14px; margin-top: 5px;">
                    Try a different search term or category
                </div>
            </div>
        `;
        return;
    }
    
    container.innerHTML = filteredTools.map((tool, index) => `
        <div class="tool-card" onclick="handleToolCardClick(event, '${tool.id}')" 
             style="animation-delay: ${index * 0.1}s; --delay: ${index * 0.1}s">
            <div class="tool-icon" style="background: ${hexToRgba(tool.color, 0.15)}; color: ${tool.color}; border: 1px solid ${hexToRgba(tool.color, 0.2)}">
                <i class="${tool.icon}"></i>
            </div>
            <div class="tool-info">
                <h3 class="tool-name">${tool.name}</h3>
                <p class="tool-desc">${tool.description}</p>
                <div class="tool-category-badge">
                    ${getCategoryName(tool.category)}
                </div>
            </div>
            <div class="tool-action">
                <i class="fas fa-arrow-right"></i>
            </div>
            <div class="tool-card-hover-effect"></div>
        </div>
    `).join('');
}

function handleToolCardClick(event, toolId) {
    const card = event.currentTarget;
    
    // Create ripple effect
    const ripple = document.createElement('div');
    ripple.className = 'tool-card-click-effect';
    
    const rect = card.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    
    card.appendChild(ripple);
    
    // Add click animation
    card.style.animation = 'toolCardClick 0.3s ease';
    
    // Remove ripple after animation
    setTimeout(() => {
        ripple.remove();
        card.style.animation = '';
    }, 600);
    
    // Load tool
    setTimeout(() => {
        loadTool(toolId);
    }, 300);
}

function getCategoryName(categoryId) {
    const categoryMap = {
        'downloader': 'Downloader',
        'maker': 'Maker',
        'ai': 'AI Tools',
        'social': 'Social Media',
        'utility': 'Utility',
        'all': 'All Tools'
    };
    return categoryMap[categoryId] || categoryId.charAt(0).toUpperCase() + categoryId.slice(1);
}

function filterToolsByCategory(categoryId) {
    currentCategory = categoryId;
    
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent.includes(categoryId.charAt(0).toUpperCase() + categoryId.slice(1))) {
            btn.classList.add('active');
        }
    });
    
    loadToolsContainer();
}

function filterTools() {
    const searchInput = document.getElementById('searchTools');
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    
    const filteredTools = (currentCategory === 'all' 
        ? allTools 
        : allTools.filter(tool => tool.category === currentCategory))
        .filter(tool => 
            tool.name.toLowerCase().includes(searchTerm) || 
            tool.description.toLowerCase().includes(searchTerm)
        );
    
    const container = document.getElementById('toolsContainer');
    if (!container) return;
    
    if (filteredTools.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px; color: var(--text-muted); grid-column: 1 / -1;">
                <i class="fas fa-search fa-2x" style="margin-bottom: 15px; opacity: 0.5;"></i>
                <div style="font-weight: 600; font-size: 16px;">No tools found</div>
                <div style="font-size: 14px; margin-top: 5px;">
                    Try a different search term or category
                </div>
            </div>
        `;
        return;
    }
    
    container.innerHTML = filteredTools.map((tool, index) => `
        <div class="tool-card" onclick="handleToolCardClick(event, '${tool.id}')" 
             style="animation-delay: ${index * 0.1}s; --delay: ${index * 0.1}s">
            <div class="tool-icon" style="background: ${hexToRgba(tool.color, 0.15)}; color: ${tool.color}; border: 1px solid ${hexToRgba(tool.color, 0.2)}">
                <i class="${tool.icon}"></i>
            </div>
            <div class="tool-info">
                <h3 class="tool-name">${tool.name}</h3>
                <p class="tool-desc">${tool.description}</p>
                <div class="tool-category-badge">
                    ${getCategoryName(tool.category)}
                </div>
            </div>
            <div class="tool-action">
                <i class="fas fa-arrow-right"></i>
            </div>
            <div class="tool-card-hover-effect"></div>
        </div>
    `).join('');
}

// ===== TOOL LOADING =====
function loadTool(toolId) {
    const tool = allTools.find(t => t.id === toolId);
    if (!tool) {
        showNotification('Tool not found!', 'error', 2000);
        return;
    }
    
    loadToolInternal(tool);
}

function loadToolInternal(tool) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.remove('active');
    });
    
    const toolContainer = document.getElementById('toolContainer');
    if (toolContainer) {
        toolContainer.style.display = 'block';
        toolContainer.classList.add('active');
    }
    
    currentTool = tool;
    
    // Show loading overlay
    const loadingOverlay = document.getElementById('toolLoadingOverlay');
    if (loadingOverlay) {
        loadingOverlay.classList.add('show');
    }
    
    // Load tool with delay
    setTimeout(() => {
        if (typeof window[tool.function] === 'function') {
            try {
                window[tool.function]();
            } catch (error) {
                console.error('Error loading tool:', error);
                showNotification(`Failed to load ${tool.name}!`, 'error', 2000);
                showPage('toolsPage');
            }
        } else {
            showNotification(`Function ${tool.function} not found!`, 'error', 2000);
            showPage('toolsPage');
        }
        
        // Hide loading overlay
        if (loadingOverlay) {
            loadingOverlay.classList.remove('show');
        }
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
        showNotification(`${tool.name} loaded successfully!`, 'success', 2000);
    }, 1000);
}

function backToTools() {
    showPage('toolsPage');
}

// ===== MUSIC PLAYER FUNCTIONS =====
function initializeMusicPlayer() {
    const playlistElement = document.getElementById('playlist');
    if (!playlistElement) return;
    
    playlistElement.innerHTML = playlist.map((track, index) => `
        <div class="track-item ${index === currentTrackIndex ? 'active' : ''}" onclick="playTrack(${index})">
            <div class="track-number">${index + 1}</div>
            <div class="track-details">
                <div class="track-title">${track.title}</div>
                <div class="track-artist">${track.artist}</div>
            </div>
            <div class="track-duration">${track.duration}</div>
        </div>
    `).join('');
    
    musicPlayer.addEventListener('timeupdate', updateProgress);
    musicPlayer.addEventListener('loadedmetadata', updateDuration);
    musicPlayer.addEventListener('ended', nextTrack);
    
    loadTrack(currentTrackIndex);
}

function loadTrack(index) {
    if (index < 0 || index >= playlist.length) return;
    
    currentTrackIndex = index;
    const track = playlist[index];
    
    document.getElementById('currentTrack').textContent = track.title;
    document.getElementById('currentArtist').textContent = track.artist;
    
    document.querySelectorAll('.track-item').forEach((item, i) => {
        item.classList.toggle('active', i === index);
    });
    
    musicPlayer.src = track.url;
    
    if (isPlaying) {
        musicPlayer.play().catch(e => {
            console.error('Play error:', e);
            isPlaying = false;
            updatePlayButton();
        });
    }
}

function togglePlay() {
    if (!musicPlayer.src) {
        loadTrack(currentTrackIndex);
    }
    
    if (isPlaying) {
        musicPlayer.pause();
    } else {
        musicPlayer.play().catch(e => {
            console.error('Play error:', e);
            showNotification('Failed to play audio', 'error', 2000);
        });
    }
    
    isPlaying = !isPlaying;
    updatePlayButton();
}

function updatePlayButton() {
    const playBtn = document.getElementById('playBtn');
    if (!playBtn) return;
    
    playBtn.innerHTML = isPlaying ? 
        '<i class="fas fa-pause"></i>' : 
        '<i class="fas fa-play"></i>';
    playBtn.classList.toggle('playing', isPlaying);
}

function playTrack(index) {
    if (index === currentTrackIndex && isPlaying) {
        togglePlay();
    } else {
        if (index !== currentTrackIndex) {
            loadTrack(index);
        }
        if (!isPlaying) {
            togglePlay();
        }
    }
}

function nextTrack() {
    let nextIndex;
    if (isShuffle) {
        do {
            nextIndex = Math.floor(Math.random() * playlist.length);
        } while (nextIndex === currentTrackIndex && playlist.length > 1);
    } else {
        nextIndex = (currentTrackIndex + 1) % playlist.length;
    }
    
    loadTrack(nextIndex);
    if (isPlaying) {
        musicPlayer.play();
    }
}

function previousTrack() {
    let prevIndex;
    if (isShuffle) {
        do {
            prevIndex = Math.floor(Math.random() * playlist.length);
        } while (prevIndex === currentTrackIndex && playlist.length > 1);
    } else {
        prevIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
    }
    
    loadTrack(prevIndex);
    if (isPlaying) {
        musicPlayer.play();
    }
}

function updateProgress() {
    const progress = document.getElementById('progress');
    const currentTime = document.getElementById('currentTime');
    
    if (!progress || !currentTime || !musicPlayer.duration) return;
    
    if (isPlaying && musicPlayer.currentTime < musicPlayer.duration) {
        const percent = (musicPlayer.currentTime / musicPlayer.duration) * 100;
        progress.style.width = `${percent}%`;
        currentTime.textContent = formatTime(musicPlayer.currentTime);
    }
}

function updateDuration() {
    const duration = document.getElementById('duration');
    if (duration && musicPlayer.duration) {
        duration.textContent = formatTime(musicPlayer.duration);
    }
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function seekTrack(event) {
    const progressBar = event.currentTarget;
    const clickPosition = event.offsetX;
    const totalWidth = progressBar.clientWidth;
    const percent = (clickPosition / totalWidth);
    
    if (musicPlayer.duration) {
        musicPlayer.currentTime = percent * musicPlayer.duration;
    }
}

function changeVolume(value) {
    if (musicPlayer) {
        musicPlayer.volume = value / 100;
    }
}

function toggleShuffle() {
    isShuffle = !isShuffle;
    const btn = document.getElementById('shuffleBtn');
    if (btn) {
        btn.classList.toggle('active', isShuffle);
    }
    showNotification(isShuffle ? '🔀 Shuffle enabled' : '🔀 Shuffle disabled', 'info', 2000);
}

function toggleRepeat() {
    isRepeat = !isRepeat;
    const btn = document.getElementById('repeatBtn');
    if (btn) {
        btn.classList.toggle('active', isRepeat);
    }
    if (musicPlayer) {
        musicPlayer.loop = isRepeat;
    }
    showNotification(isRepeat ? '🔁 Repeat enabled' : '🔁 Repeat disabled', 'info', 2000);
}

// ===== SPOTIFY PLAYER FUNCTIONS =====
function initializeSpotifyPlayer() {
    spotifyAudioPlayer.addEventListener('timeupdate', updateSpotifyProgress);
    spotifyAudioPlayer.addEventListener('loadedmetadata', updateSpotifyDuration);
    spotifyAudioPlayer.addEventListener('ended', spotifyNext);
}

async function searchSpotify() {
    const searchInput = document.getElementById('spotifySearchInput');
    const searchTerm = searchInput.value.trim();
    
    if (!searchTerm) {
        showNotification('Please enter a search term', 'error', 2000);
        return;
    }
    
    const resultsContainer = document.getElementById('spotifyResults');
    const loadingDiv = document.getElementById('spotifyLoading');
    
    resultsContainer.innerHTML = '';
    loadingDiv.style.display = 'block';
    
    try {
        const response = await fetch(`https://api-faa.my.id/faa/spotify-play?q=${encodeURIComponent(searchTerm)}`);
        const data = await response.json();
        
        if (data.status) {
            spotifySearchResults = [{
                id: 1,
                title: data.info.title || 'Unknown Track',
                artist: data.info.artist || 'Unknown Artist',
                album: data.info.album || 'Search Results',
                duration: data.info.duration || '0:00',
                thumbnail: data.info.thumbnail || '',
                url: data.download.url || '#',
                spotify_url: data.info.spotify_url || '#'
            }];
            
            loadingDiv.style.display = 'none';
            displaySpotifyResults(spotifySearchResults);
            showNotification(`Found: ${data.info.title}`, 'success', 2000);
        } else {
            loadingDiv.style.display = 'none';
            showNotification('No results found. Try a different search term.', 'error', 2000);
            resultsContainer.innerHTML = `
                <div style="text-align: center; padding: 40px; color: var(--text-muted);">
                    <i class="fab fa-spotify fa-2x" style="margin-bottom: 15px; opacity: 0.5;"></i>
                    <div style="font-weight: 600; font-size: 16px;">No results found</div>
                    <div style="font-size: 14px; margin-top: 5px;">
                        Try different search terms
                    </div>
            `;
        }
        
    } catch (error) {
        console.error('API Error:', error);
        loadingDiv.style.display = 'none';
        showNotification('Failed to search. Please try again.', 'error', 2000);
        
        resultsContainer.innerHTML = `
            <div style="text-align: center; padding: 40px; color: var(--text-muted);">
                <i class="fas fa-exclamation-triangle fa-2x" style="margin-bottom: 15px; color: var(--danger);"></i>
                <div style="font-weight: 600; font-size: 16px;">Connection Error</div>
                <div style="font-size: 14px; margin-top: 5px;">
                    Failed to connect to Spotify service
                </div>
            </div>
        `;
    }
}

function displaySpotifyResults(results) {
    const resultsContainer = document.getElementById('spotifyResults');
    
    if (results.length === 0) {
        resultsContainer.innerHTML = `
            <div style="text-align: center; padding: 40px; color: var(--text-muted);">
                <i class="fab fa-spotify fa-2x" style="margin-bottom: 15px; opacity: 0.5;"></i>
                <div style="font-weight: 600; font-size: 16px;">No results found</div>
                <div style="font-size: 14px; margin-top: 5px;">
                    Try different search terms
                </div>
            </div>
        `;
        return;
    }
    
    resultsContainer.innerHTML = results.map((track, index) => `
        <div class="spotify-track-item ${currentSpotifyTrackIndex === index ? 'active' : ''}" 
             onclick="playSpotifyTrack(${index})">
            <div class="spotify-track-art">
                ${track.thumbnail ? 
                    `<img src="${track.thumbnail}" alt="${track.title}">` : 
                    `<i class="fas fa-music"></i>`
                }
            </div>
            <div class="spotify-track-info">
                <div class="spotify-track-title">${track.title}</div>
                <div class="spotify-track-artist">${track.artist} • ${track.album}</div>
            </div>
            <div class="spotify-track-duration">${track.duration}</div>
        </div>
    `).join('');
}

function playSpotifyTrack(index) {
    if (index < 0 || index >= spotifySearchResults.length) return;
    
    currentSpotifyTrackIndex = index;
    currentSpotifyTrack = spotifySearchResults[index];
    
    document.getElementById('spotifyNowPlaying').style.display = 'block';
    
    document.getElementById('spotifyTrackTitle').textContent = currentSpotifyTrack.title;
    document.getElementById('spotifyArtistName').textContent = currentSpotifyTrack.artist;
    
    const albumArt = document.getElementById('spotifyAlbumArt');
    if (currentSpotifyTrack.thumbnail) {
        albumArt.innerHTML = `<img src="${currentSpotifyTrack.thumbnail}" alt="${currentSpotifyTrack.title}" 
                             style="width:100%;height:100%;object-fit:cover; border-radius: 12px;">`;
    } else {
        albumArt.innerHTML = '<i class="fab fa-spotify"></i>';
    }
    
    document.querySelectorAll('.spotify-track-item').forEach((item, i) => {
        item.classList.toggle('active', i === index);
    });
    
    if (currentSpotifyTrack.url && currentSpotifyTrack.url !== '#') {
        spotifyAudioPlayer.src = currentSpotifyTrack.url;
        
        if (isSpotifyPlaying) {
            spotifyAudioPlayer.play().catch(e => {
                console.error('Play error:', e);
                isSpotifyPlaying = false;
                updateSpotifyPlayButton();
                showNotification('Failed to play audio. Try clicking play again.', 'error', 2000);
            });
        }
    } else {
        showNotification('Audio not available for this track', 'warning', 2000);
    }
    
    updateSpotifyPlayButton();
}

function toggleSpotifyPlay() {
    if (!spotifyAudioPlayer.src) {
        if (spotifySearchResults.length > 0) {
            if (currentSpotifyTrackIndex === -1) {
                playSpotifyTrack(0);
            } else {
                playSpotifyTrack(currentSpotifyTrackIndex);
            }
        } else {
            showNotification('Search for a song first', 'error', 2000);
            return;
        }
    }
    
    if (isSpotifyPlaying) {
        spotifyAudioPlayer.pause();
    } else {
        spotifyAudioPlayer.play().catch(e => {
            console.error('Spotify play error:', e);
            showNotification('Failed to play audio. Try another track.', 'error', 2000);
        });
    }
    
    isSpotifyPlaying = !isSpotifyPlaying;
    updateSpotifyPlayButton();
}

function updateSpotifyPlayButton() {
    const playBtn = document.getElementById('spotifyPlayBtn');
    if (!playBtn) return;
    
    playBtn.innerHTML = isSpotifyPlaying ? 
        '<i class="fas fa-pause"></i>' : 
        '<i class="fas fa-play"></i>';
    playBtn.classList.toggle('playing', isSpotifyPlaying);
}

function spotifyNext() {
    if (spotifySearchResults.length === 0) return;
    
    let nextIndex;
    if (isShuffle) {
        do {
            nextIndex = Math.floor(Math.random() * spotifySearchResults.length);
        } while (nextIndex === currentSpotifyTrackIndex && spotifySearchResults.length > 1);
    } else {
        nextIndex = (currentSpotifyTrackIndex + 1) % spotifySearchResults.length;
    }
    
    playSpotifyTrack(nextIndex);
    if (isSpotifyPlaying) {
        spotifyAudioPlayer.play();
    }
}

function spotifyPrevious() {
    if (spotifySearchResults.length === 0) return;
    
    let prevIndex;
    if (isShuffle) {
        do {
            prevIndex = Math.floor(Math.random() * spotifySearchResults.length);
        } while (prevIndex === currentSpotifyTrackIndex && spotifySearchResults.length > 1);
    } else {
        prevIndex = (currentSpotifyTrackIndex - 1 + spotifySearchResults.length) % spotifySearchResults.length;
    }
    
    playSpotifyTrack(prevIndex);
    if (isSpotifyPlaying) {
        spotifyAudioPlayer.play();
    }
}

function updateSpotifyProgress() {
    const progress = document.getElementById('spotifyProgress');
    const currentTime = document.getElementById('spotifyCurrentTime');
    
    if (!progress || !currentTime || !spotifyAudioPlayer.duration) return;
    
    if (isSpotifyPlaying && spotifyAudioPlayer.currentTime < spotifyAudioPlayer.duration) {
        const percent = (spotifyAudioPlayer.currentTime / spotifyAudioPlayer.duration) * 100;
        progress.style.width = `${percent}%`;
        currentTime.textContent = formatTime(spotifyAudioPlayer.currentTime);
    }
}

function updateSpotifyDuration() {
    const duration = document.getElementById('spotifyDuration');
    if (duration && spotifyAudioPlayer.duration) {
        duration.textContent = formatTime(spotifyAudioPlayer.duration);
    }
}

function seekSpotifyTrack(event) {
    const progressBar = event.currentTarget;
    const clickPosition = event.offsetX;
    const totalWidth = progressBar.clientWidth;
    const percent = (clickPosition / totalWidth);
    
    if (spotifyAudioPlayer.duration) {
        spotifyAudioPlayer.currentTime = percent * spotifyAudioPlayer.duration;
    }
}

function changeSpotifyVolume(value) {
    if (spotifyAudioPlayer) {
        spotifyAudioPlayer.volume = value / 100;
    }
}

// ===== MUSIC TAB MANAGEMENT =====
function switchMusicTab(tabName) {
    document.getElementById('localTabBtn').classList.toggle('active', tabName === 'local');
    document.getElementById('spotifyTabBtn').classList.toggle('active', tabName === 'spotify');
    
    document.getElementById('localMusicTab').classList.toggle('active', tabName === 'local');
    document.getElementById('spotifyMusicTab').classList.toggle('active', tabName === 'spotify');
    
    if (tabName === 'local') {
        if (isSpotifyPlaying) {
            spotifyAudioPlayer.pause();
            isSpotifyPlaying = false;
            updateSpotifyPlayButton();
        }
    } else {
        if (isPlaying) {
            musicPlayer.pause();
            isPlaying = false;
            updatePlayButton();
        }
    }
    
    showNotification(`Switched to ${tabName === 'local' ? 'Local Music' : 'Spotify'}`, 'info', 2000);
}

// ===== UTILITY FUNCTIONS =====
function hexToRgba(hex, alpha = 1) {
    if (!hex || hex.length < 7) return `rgba(100, 124, 247, ${alpha})`;
    
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function adjustToolGrid() {
    const container = document.getElementById('toolsContainer');
    if (container) {
        const width = window.innerWidth;
        if (width < 768) {
            container.style.gridTemplateColumns = '1fr';
        } else if (width < 1024) {
            container.style.gridTemplateColumns = 'repeat(2, 1fr)';
        } else {
            container.style.gridTemplateColumns = 'repeat(auto-fill, minmax(280px, 1fr))';
        }
    }
}

function loadToolsGrid() {
    const container = document.getElementById('toolsContainer');
    if (container) {
        adjustToolGrid();
    }
}

// ===== ENHANCED CHART FUNCTIONS - SIMPLE SERVICE CHART =====

function initializeEnhancedChart() {
    console.log('Initializing service chart...');
    
    // Generate initial data
    generateServiceChartData();
    
    // Initialize chart
    drawServiceChart();
    
    // Start real-time updates
    startServiceChartUpdates();
}

function generateServiceChartData() {
    // Generate data points untuk grafik layanan
    const now = Date.now();
    const points = 50; // 50 data points
    
    // Data untuk grafik layanan (simple line)
    serviceChartData = [];
    
    // Generate random data dengan pattern yang smooth
    let lastValue = 1000; // Base value
    for (let i = 0; i < points; i++) {
        // Random movement with smooth pattern
        const randomMove = (Math.random() - 0.5) * 150;
        const trend = Math.sin(i * 0.1) * 100;
        const noise = Math.random() * 50 - 25;
        
        lastValue = Math.max(500, Math.min(2000, lastValue + randomMove * 0.3 + trend * 0.1 + noise));
        
        serviceChartData.push({
            x: i,
            y: lastValue,
            timestamp: now - ((points - i) * 5 * 60 * 1000) // 5 minute intervals
        });
    }
}

function drawServiceChart() {
    const svg = document.getElementById('lineChartSVG');
    if (!svg) return;
    
    svg.innerHTML = '';
    
    const width = 800;
    const height = 300;
    const padding = { top: 20, right: 30, bottom: 40, left: 60 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;
    
    // Create SVG group for chart
    const chartGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    chartGroup.setAttribute('transform', `translate(${padding.left}, ${padding.top})`);
    
    // Find min and max values
    const values = serviceChartData.map(d => d.y);
    const yMin = Math.min(...values) * 0.9; // 10% padding
    const yMax = Math.max(...values) * 1.1; // 10% padding
    
    // Calculate scales
    const xScale = chartWidth / (serviceChartData.length - 1);
    const yScale = chartHeight / (yMax - yMin);
    
    // Create gradient for the line
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    gradient.setAttribute('id', 'serviceChartGradient');
    gradient.setAttribute('x1', '0%');
    gradient.setAttribute('y1', '0%');
    gradient.setAttribute('x2', '100%');
    gradient.setAttribute('y2', '0%');
    
    const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop1.setAttribute('offset', '0%');
    stop1.setAttribute('stop-color', '#647cf7');
    stop1.setAttribute('stop-opacity', '1');
    
    const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop2.setAttribute('offset', '100%');
    stop2.setAttribute('stop-color', '#8b5cf6');
    stop2.setAttribute('stop-opacity', '1');
    
    gradient.appendChild(stop1);
    gradient.appendChild(stop2);
    defs.appendChild(gradient);
    chartGroup.appendChild(defs);
    
    // Create area path (filled under line)
    let areaPath = '';
    let linePath = '';
    
    serviceChartData.forEach((point, index) => {
        const x = index * xScale;
        const y = chartHeight - ((point.y - yMin) * yScale);
        
        if (index === 0) {
            areaPath = `M ${x} ${chartHeight} L ${x} ${y} `;
            linePath = `M ${x} ${y} `;
        } else {
            areaPath += `L ${x} ${y} `;
            linePath += `L ${x} ${y} `;
        }
        
        if (index === serviceChartData.length - 1) {
            areaPath += `L ${x} ${chartHeight} Z`;
        }
    });
    
    // Create area element (filled background)
    const area = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    area.setAttribute('d', areaPath);
    area.setAttribute('fill', 'url(#serviceChartGradient)');
    area.setAttribute('fill-opacity', '0.2');
    area.setAttribute('stroke', 'none');
    area.classList.add('service-chart-area');
    
    // Create line element
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    line.setAttribute('d', linePath);
    line.setAttribute('fill', 'none');
    line.setAttribute('stroke', 'url(#serviceChartGradient)');
    line.setAttribute('stroke-width', '3');
    line.setAttribute('stroke-linecap', 'round');
    line.setAttribute('stroke-linejoin', 'round');
    line.classList.add('service-chart-line');
    
    chartGroup.appendChild(area);
    chartGroup.appendChild(line);
    
    // Add Y-axis labels
    const yLabels = 5;
    for (let i = 0; i <= yLabels; i++) {
        const value = yMin + ((yMax - yMin) / yLabels) * i;
        const y = chartHeight - ((value - yMin) * yScale);
        
        // Add grid line
        const gridLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        gridLine.setAttribute('x1', 0);
        gridLine.setAttribute('y1', y);
        gridLine.setAttribute('x2', chartWidth);
        gridLine.setAttribute('y2', y);
        gridLine.setAttribute('stroke', 'rgba(255, 255, 255, 0.1)');
        gridLine.setAttribute('stroke-width', '1');
        gridLine.setAttribute('stroke-dasharray', '4,4');
        
        chartGroup.appendChild(gridLine);
        
        // Add label
        const yLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        yLabel.setAttribute('x', -10);
        yLabel.setAttribute('y', y + 3);
        yLabel.setAttribute('text-anchor', 'end');
        yLabel.setAttribute('fill', 'var(--text-secondary)');
        yLabel.setAttribute('font-size', '11');
        yLabel.textContent = formatServiceValue(value);
        
        chartGroup.appendChild(yLabel);
    }
    
    // Add X-axis labels (timestamps)
    const xLabelCount = 6;
    for (let i = 0; i <= xLabelCount; i++) {
        const index = Math.floor((serviceChartData.length - 1) * (i / xLabelCount));
        const point = serviceChartData[index];
        const x = index * xScale;
        
        // Add grid line vertical
        const gridLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        gridLine.setAttribute('x1', x);
        gridLine.setAttribute('y1', 0);
        gridLine.setAttribute('x2', x);
        gridLine.setAttribute('y2', chartHeight);
        gridLine.setAttribute('stroke', 'rgba(255, 255, 255, 0.1)');
        gridLine.setAttribute('stroke-width', '1');
        gridLine.setAttribute('stroke-dasharray', '4,4');
        
        chartGroup.appendChild(gridLine);
        
        // Add label
        const time = new Date(point.timestamp);
        const timeStr = `${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}`;
        
        const xLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        xLabel.setAttribute('x', x);
        xLabel.setAttribute('y', chartHeight + 20);
        xLabel.setAttribute('text-anchor', 'middle');
        xLabel.setAttribute('fill', 'var(--text-secondary)');
        xLabel.setAttribute('font-size', '11');
        xLabel.textContent = timeStr;
        
        chartGroup.appendChild(xLabel);
    }
    
    // Add X-axis line
    const xAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    xAxis.setAttribute('x1', 0);
    xAxis.setAttribute('y1', chartHeight);
    xAxis.setAttribute('x2', chartWidth);
    xAxis.setAttribute('y2', chartHeight);
    xAxis.setAttribute('stroke', 'var(--border)');
    xAxis.setAttribute('stroke-width', '1');
    
    chartGroup.appendChild(xAxis);
    
    // Add Y-axis line
    const yAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    yAxis.setAttribute('x1', 0);
    yAxis.setAttribute('y1', 0);
    yAxis.setAttribute('x2', 0);
    yAxis.setAttribute('y2', chartHeight);
    yAxis.setAttribute('stroke', 'var(--border)');
    yAxis.setAttribute('stroke-width', '1');
    
    chartGroup.appendChild(yAxis);
    
    svg.appendChild(chartGroup);
    
    // Animate line drawing
    setTimeout(() => {
        const length = line.getTotalLength();
        line.style.strokeDasharray = length;
        line.style.strokeDashoffset = length;
        line.style.animation = `drawLine 1.5s ease forwards`;
    }, 100);
}

function formatServiceValue(value) {
    if (value >= 1000) {
        return (value / 1000).toFixed(1) + 'K';
    }
    return Math.round(value).toString();
}

function startServiceChartUpdates() {
    // Update chart every 5 seconds
    setInterval(() => {
        updateServiceChartData();
    }, 5000);
}

function updateServiceChartData() {
    // Remove first point
    serviceChartData.shift();
    
    // Add new point
    const lastPoint = serviceChartData[serviceChartData.length - 1];
    const newTimestamp = Date.now();
    
    // Generate new value based on trend
    const trend = Math.sin(serviceChartData.length * 0.1) * 100;
    const randomMove = (Math.random() - 0.5) * 200;
    const noise = Math.random() * 50 - 25;
    
    const newValue = Math.max(500, Math.min(2000, 
        lastPoint.y + randomMove * 0.2 + trend * 0.1 + noise
    ));
    
    serviceChartData.push({
        x: serviceChartData.length,
        y: newValue,
        timestamp: newTimestamp
    });
    
    // Update x values
    serviceChartData.forEach((point, i) => {
        point.x = i;
    });
    
    // Redraw chart
    drawServiceChart();
    
    // Update stats
    updateServiceStats();
}

function updateServiceStats() {
    const values = serviceChartData.map(d => d.y);
    const currentValue = values[values.length - 1];
    const avgValue = values.reduce((a, b) => a + b, 0) / values.length;
    const maxValue = Math.max(...values);
    
    // Update legend stats
    document.getElementById('totalRequests').textContent = formatServiceValue(currentValue);
    document.getElementById('peakUsage').textContent = formatServiceValue(maxValue);
    document.getElementById('activeTools').textContent = Math.round(avgValue).toLocaleString();
    
    // Update timestamp
    const now = new Date();
    document.getElementById('legendUpdateTime').textContent = 
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function changeChartPeriod(period) {
    chartTimeRange = period;
    
    // Update button states
    document.querySelectorAll('.chart-period-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Regenerate data based on period
    generateServiceChartData();
    
    // Redraw chart
    drawServiceChart();
    
    showNotification(`Switched to ${period === 'live' ? 'Live' : period === 'hour' ? '1 Hour' : '24 Hours'} view`, 'info', 2000);
}

function zoomChart(factor) {
    chartZoom *= factor;
    chartZoom = Math.max(0.5, Math.min(3, chartZoom));
    
    const svg = document.getElementById('lineChartSVG');
    if (svg) {
        const currentViewBox = svg.getAttribute('viewBox')?.split(' ').map(Number) || [0, 0, 800, 300];
        const newWidth = currentViewBox[2] * factor;
        const newHeight = currentViewBox[3] * factor;
        
        svg.setAttribute('viewBox', `0 0 ${newWidth} ${newHeight}`);
        svg.style.transform = `scale(${chartZoom})`;
    }
    
    showNotification(`Chart zoom: ${Math.round(chartZoom * 100)}%`, 'info', 1500);
}

function resetChartZoom() {
    chartZoom = 1;
    const svg = document.getElementById('lineChartSVG');
    if (svg) {
        svg.setAttribute('viewBox', '0 0 800 300');
        svg.style.transform = 'scale(1)';
    }
    
    showNotification('Chart zoom reset', 'info', 1500);
}

function handleChartResize() {
    const chartContainer = document.querySelector('.enhanced-chart-container');
    const legendContainer = document.querySelector('.chart-legend-enhanced');
    
    if (!chartContainer || !legendContainer) return;
    
    const windowWidth = window.innerWidth;
    
    if (windowWidth < 768) {
        // Mobile: Full width untuk semua elemen
        chartContainer.style.width = '100%';
        legendContainer.style.width = '100%';
        legendContainer.style.maxWidth = '100%';
    } else if (windowWidth < 1024) {
        // Tablet: Adjust proportions
        chartContainer.style.width = '100%';
        legendContainer.style.width = '100%';
        legendContainer.style.maxWidth = '400px';
    } else {
        // Desktop: Flexible layout
        chartContainer.style.width = '';
        legendContainer.style.width = '';
        legendContainer.style.maxWidth = '320px';
    }
    
    // Redraw chart jika perlu
    if (typeof drawServiceChart === 'function') {
        setTimeout(drawServiceChart, 100);
    }
}

// Panggil saat resize
window.addEventListener('resize', debounce(handleChartResize, 300));

// ===== GLOBAL FUNCTIONS EXPORT =====
window.loadTool = loadTool;
window.backToTools = backToTools;
window.showPage = showPage;
window.showNotification = showNotification;
window.togglePlay = togglePlay;
window.previousTrack = previousTrack;
window.nextTrack = nextTrack;
window.toggleShuffle = toggleShuffle;
window.toggleRepeat = toggleRepeat;
window.changeVolume = changeVolume;
window.seekTrack = seekTrack;
window.playTrack = playTrack;
window.searchSpotify = searchSpotify;
window.playSpotifyTrack = playSpotifyTrack;
window.toggleSpotifyPlay = toggleSpotifyPlay;
window.spotifyPrevious = spotifyPrevious;
window.spotifyNext = spotifyNext;
window.seekSpotifyTrack = seekSpotifyTrack;
window.changeSpotifyVolume = changeSpotifyVolume;
window.switchMusicTab = switchMusicTab;
window.sendEmailMessage = sendEmailMessage;
window.checkApiStatus = checkApiStatus;
window.changeChartPeriod = changeChartPeriod;
window.filterToolsByCategory = filterToolsByCategory;
window.filterTools = filterTools;
window.installPWA = installPWA;
window.closeInstallPrompt = closeInstallPrompt;
window.closeNotification = closeNotification;
window.hideLoadingScreen = hideLoadingScreen;
window.handleToolCardClick = handleToolCardClick;

// ===== TOKEN FUNCTIONS EXPORT =====
window.showTokenModal = showTokenModal;
window.closeTokenModal = closeTokenModal;
window.toggleTokenVisibility = toggleTokenVisibility;
window.submitToken = submitToken;
window.getTokenLink = getTokenLink;
window.openTutorialLink = openTutorialLink;
window.logoutToken = logoutToken;

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    try {
        initializeApp();
        
        // Panggil saat inisialisasi
        setTimeout(handleChartResize, 500);
        
        // Token auth initialization
        // Check jika sudah ada session aktif
        if (tokenAuth.isAuthenticated()) {
            console.log('Token session active');
            updateSessionInfo();
        }
        
        // Add token verification to Tools Page navigation
        const toolsNavBtn = document.querySelector('.nav-btn[onclick*="toolsPage"]');
        if (toolsNavBtn) {
            toolsNavBtn.addEventListener('click', function(e) {
                if (!tokenAuth.isAuthenticated()) {
                    e.preventDefault();
                    e.stopPropagation();
                    showTokenModal();
                    return false;
                }
            });
        }
        
        // Backup safety check
        setTimeout(() => {
            const loadingScreen = document.getElementById('loading-screen');
            if (loadingScreen && loadingScreen.style.display !== 'none') {
                console.log('Safety check: Forcing loading screen to hide');
                hideLoadingScreen();
            }
        }, 5000);
    } catch (error) {
        console.error('Error during app initialization:', error);
        hideLoadingScreen();
    }
});