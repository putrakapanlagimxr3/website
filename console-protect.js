/**
 * CONSOLE PROTECTION SYSTEM - REVISED
 * Melindungi aplikasi dari inspeksi console dan debug
 * ByyVerse Security Layer - Enhanced Version
 * Hanya merespons akses langsung ke console/devtools
 */

class ConsoleProtect {
    constructor() {
        this.enabled = true;
        this.debugMode = false; // Set true untuk development
        this.attemptCount = 0;
        this.maxAttempts = 5; // Tambah dari 3 ke 5
        this.blockedKeys = [];
        this.protectionEnabled = true;
        this.lastViolationTime = 0;
        this.cooldownPeriod = 3000; // Tambah dari 2 detik ke 3 detik
        this.consoleAccessAttempted = false;
        this.consoleWarningCount = 0;
        this.lastConsoleWarning = 0;
        
        // Whitelist untuk script internal
        this.internalScripts = [
            'main.js',
            'fungsiaslialltools.js',
            'console-protect.js',
            'token-auth.js',
            'byyverse',
            'ByyVerse'
        ];
        
        this.init();
    }
    
    init() {
        if (this.debugMode) {
            console.log('[ConsoleProtect] Debug mode aktif - Proteksi dinonaktifkan');
            return;
        }
        
        console.log('[ConsoleProtect] Sistem proteksi console diaktifkan');
        
        // Event listeners untuk keyboard shortcuts
        this.bindKeyboardEvents();
        
        // Proteksi right-click
        this.protectContextMenu();
        
        // Proteksi element inspection
        this.protectInspection();
        
        // Console access protection
        this.protectConsoleAccess();
        
        // HANYA gunakan deteksi yang aman
        this.safeConsoleDetection();
    }
    
    // ===== KEYBOARD SHORTCUT PROTECTION =====
    bindKeyboardEvents() {
        document.addEventListener('keydown', (e) => {
            const now = Date.now();
            
            // Prevent too frequent triggers
            if (now - this.lastViolationTime < 500) {
                return;
            }
            
            // Block F12
            if (e.key === 'F12') {
                e.preventDefault();
                e.stopPropagation();
                this.lastViolationTime = now;
                this.handleViolation('F12 pressed');
                return false;
            }
            
            // Block Ctrl+Shift+I (Chrome Dev Tools)
            if (e.ctrlKey && e.shiftKey && e.key === 'I') {
                e.preventDefault();
                e.stopPropagation();
                this.lastViolationTime = now;
                this.handleViolation('Ctrl+Shift+I pressed');
                return false;
            }
            
            // Block Ctrl+Shift+J (Chrome Console)
            if (e.ctrlKey && e.shiftKey && e.key === 'J') {
                e.preventDefault();
                e.stopPropagation();
                this.lastViolationTime = now;
                this.handleViolation('Ctrl+Shift+J pressed');
                return false;
            }
            
            // Block Ctrl+U (View Source)
            if (e.ctrlKey && e.key === 'u') {
                e.preventDefault();
                e.stopPropagation();
                this.lastViolationTime = now;
                this.handleViolation('Ctrl+U pressed');
                return false;
            }
            
            // Block Ctrl+Shift+C (Inspect Element)
            if (e.ctrlKey && e.shiftKey && e.key === 'C') {
                e.preventDefault();
                e.stopPropagation();
                this.lastViolationTime = now;
                this.handleViolation('Ctrl+Shift+C pressed');
                return false;
            }
            
            // Block right-click dengan Shift+F10
            if (e.shiftKey && e.key === 'F10') {
                e.preventDefault();
                e.stopPropagation();
                this.lastViolationTime = now;
                this.handleViolation('Shift+F10 pressed (Right-click)');
                return false;
            }
        }, true);
    }
    
    // ===== CONTEXT MENU PROTECTION =====
    protectContextMenu() {
        document.addEventListener('contextmenu', (e) => {
            const now = Date.now();
            if (now - this.lastViolationTime < 500) return;
            
            e.preventDefault();
            e.stopPropagation();
            this.lastViolationTime = now;
            this.handleViolation('Right-click attempted');
            return false;
        }, true);
    }
    
    // ===== ELEMENT INSPECTION PROTECTION =====
    protectInspection() {
        // Mencegah inspect element dengan mencegah element selection
        document.addEventListener('selectstart', (e) => {
            if (this.attemptCount > 0) {
                e.preventDefault();
                return false;
            }
        });
        
        // Proteksi dengan CSS untuk mencegah text selection
        const style = document.createElement('style');
        style.textContent = `
            * {
                -webkit-user-select: none !important;
                -moz-user-select: none !important;
                -ms-user-select: none !important;
                user-select: none !important;
            }
            
            input, textarea, [contenteditable] {
                -webkit-user-select: text !important;
                -moz-user-select: text !important;
                -ms-user-select: text !important;
                user-select: text !important;
            }
            
            /* Blink effect untuk violation */
            .byyverse-violation-blink {
                animation: violationBlink 0.5s ease 3;
            }
            
            @keyframes violationBlink {
                0%, 100% { background-color: transparent; }
                50% { background-color: rgba(239, 68, 68, 0.3); }
            }
        `;
        document.head.appendChild(style);
    }
    
    // ===== CONSOLE ACCESS PROTECTION =====
    protectConsoleAccess() {
        // Simpan console asli
        const originalConsole = {
            log: console.log,
            info: console.info,
            warn: console.warn,
            error: console.error,
            debug: console.debug,
            clear: console.clear,
            dir: console.dir,
            dirxml: console.dirxml,
            table: console.table,
            trace: console.trace,
            group: console.group,
            groupCollapsed: console.groupCollapsed,
            groupEnd: console.groupEnd,
            time: console.time,
            timeEnd: console.timeEnd,
            count: console.count,
            assert: console.assert
        };
        
        // Fungsi untuk deteksi console access yang lebih akurat
        const detectConsoleAccess = (methodName, args) => {
            const now = Date.now();
            
            // Cooldown untuk mencegah spam
            if (now - this.lastViolationTime < 1000) {
                return;
            }
            
            // HANYA deteksi jika benar-benar user membuka console
            // Skip jika berasal dari:
            // 1. Kode kita sendiri
            // 2. Browser extension
            // 3. Auto-complete browser
            
            try {
                const stack = new Error().stack;
                if (!stack) return;
                
                // Skip jika ada indikasi dari kode kita
                let isInternalScript = false;
                for (const script of this.internalScripts) {
                    if (stack.includes(script)) {
                        isInternalScript = true;
                        break;
                    }
                }
                
                if (isInternalScript) {
                    return;
                }
                
                // Skip jika mungkin dari browser extension
                if (stack.includes('chrome-extension://') ||
                    stack.includes('moz-extension://') ||
                    stack.includes('extension://') ||
                    stack.includes('safari-extension://')) {
                    return;
                }
                
                // Skip jika dari browser devtools sendiri
                if (stack.includes('devtools://') || stack.includes('chrome-devtools://')) {
                    return;
                }
            } catch (e) {
                // Jika error, abaikan
                return;
            }
            
            // Hanya trigger untuk methods tertentu yang jarang digunakan otomatis
            const suspiciousMethods = ['debug', 'dir', 'dirxml', 'table', 'trace', 'profile'];
            if (!suspiciousMethods.includes(methodName)) {
                return;
            }
            
            // Hanya trigger jika benar-benar ada argumen yang dikirim
            if (!args || args.length === 0) {
                return;
            }
            
            // Log warning terlebih dahulu, jangan langsung violation
            originalConsole.warn('[ByyVerse Security] Console access detected');
            
            // Tunggu 2x akses dalam 3 detik baru violation
            if (!this.consoleWarningCount) this.consoleWarningCount = 0;
            if (!this.lastConsoleWarning) this.lastConsoleWarning = 0;
            
            const timeSinceLastWarning = now - this.lastConsoleWarning;
            
            if (timeSinceLastWarning < 3000) {
                this.consoleWarningCount++;
                if (this.consoleWarningCount >= 2) {
                    this.handleViolation(`Multiple console.${methodName} calls`);
                    this.consoleWarningCount = 0;
                }
            } else {
                this.consoleWarningCount = 1;
            }
            
            this.lastConsoleWarning = now;
        };
        
        // Override semua console methods dengan cara yang lebih aman
        const consoleMethods = Object.keys(originalConsole);
        consoleMethods.forEach(method => {
            // Simpan original function
            const originalMethod = originalConsole[method];
            
            // Override function
            const overrideFunction = function(...args) {
                // Jika debug mode aktif atau ada flag khusus, biarkan akses
                if (window.byyverseDebug || window.location.search.includes('debug=true')) {
                    return originalMethod.apply(this, args);
                }
                
                // Untuk method yang umum digunakan oleh aplikasi, jangan deteksi
                const safeMethods = ['log', 'info', 'warn', 'error', 'clear'];
                if (!safeMethods.includes(method)) {
                    // Deteksi akses console (hanya untuk methods yang mencurigakan)
                    detectConsoleAccess(method, args);
                }
                
                // Eksekusi original function
                return originalMethod.apply(this, args);
            };
            
            // Ganti console method
            console[method] = overrideFunction;
            
            // Coba lock the method, tapi jangan terlalu ketat
            try {
                Object.defineProperty(console, method, {
                    configurable: false,
                    writable: false
                });
            } catch (e) {
                // Jika gagal, tidak apa-apa
            }
        });
        
        // Proteksi console object itu sendiri
        try {
            Object.defineProperty(window, 'console', {
                configurable: false,
                writable: false,
                value: console
            });
        } catch (e) {
            // Jika gagal, tidak apa-apa
        }
    }
    
    // ===== SAFE CONSOLE DETECTION =====
    safeConsoleDetection() {
        // HANYA gunakan metode yang tidak menyebabkan false positive
        this.detectConsoleOpenSimple();
    }
    
    detectConsoleOpenSimple() {
        // Method yang aman tanpa debugger statement
        const checkConsole = () => {
            // Coba akses console - jika tidak error berarti console terbuka
            try {
                // Coba buat console log
                const temp = console;
                if (temp && !window.byyverseDebug) {
                    // Jika console ada, log biasa saja
                    console.log('[ByyVerse] Console protection active');
                }
            } catch (e) {
                // Console tidak tersedia - ini normal
            }
        };
        
        // Check hanya saat page load
        setTimeout(checkConsole, 1000);
        
        // COMMENT OUT resize detection yang menyebabkan false positive
        /*
        let lastWidth = window.innerWidth;
        let lastHeight = window.innerHeight;
        
        window.addEventListener('resize', () => {
            // Debounce resize events
            setTimeout(() => {
                const newWidth = window.innerWidth;
                const newHeight = window.innerHeight;
                
                // Hanya trigger jika perbedaan signifikan DAN user sedang berinteraksi
                if (Math.abs(newWidth - lastWidth) > 100 || 
                    Math.abs(newHeight - lastHeight) > 100) {
                    
                    // Simpan ukuran baru
                    lastWidth = newWidth;
                    lastHeight = newHeight;
                }
            }, 100);
        });
        */
    }
    
    // ===== VIOLATION HANDLER =====
    handleViolation(reason) {
        if (!this.protectionEnabled) return;
        
        const now = Date.now();
        
        // Cooldown check
        if (now - this.lastViolationTime < this.cooldownPeriod && this.attemptCount > 0) {
            return;
        }
        
        this.attemptCount++;
        this.lastViolationTime = now;
        
        console.warn(`[ConsoleProtect] Security violation: ${reason} (Attempt ${this.attemptCount}/${this.maxAttempts})`);
        
        // Show violation warning to user
        this.showWarning(reason);
        
        // Apply visual feedback
        document.body.classList.add('byyverse-violation-blink');
        setTimeout(() => {
            document.body.classList.remove('byyverse-violation-blink');
        }, 1500);
        
        // Log the attempt
        this.logViolation(reason);
        
        // Jika terlalu banyak attempts, take stronger action
        if (this.attemptCount >= this.maxAttempts) {
            setTimeout(() => {
                this.enforceStrictMode();
            }, 1000);
        }
    }
    
    showWarning(reason) {
        // Create warning overlay
        let warning = document.getElementById('byyverse-security-warning');
        
        if (!warning) {
            warning = document.createElement('div');
            warning.id = 'byyverse-security-warning';
            warning.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(15, 23, 42, 0.95);
                color: white;
                padding: 20px 30px;
                border-radius: 12px;
                border: 2px solid #ef4444;
                z-index: 999999;
                font-family: 'Inter', sans-serif;
                text-align: center;
                backdrop-filter: blur(10px);
                box-shadow: 0 10px 30px rgba(239, 68, 68, 0.3);
                max-width: 90%;
                width: 400px;
                display: none;
            `;
            
            document.body.appendChild(warning);
        }
        
        warning.innerHTML = `
            <div style="margin-bottom: 15px;">
                <i class="fas fa-shield-alt" style="font-size: 2em; color: #ef4444; margin-bottom: 10px;"></i>
            </div>
            <h3 style="margin: 0 0 10px 0; color: #fca5a5;">Security Alert</h3>
            <p style="margin: 0 0 15px 0; font-size: 14px; line-height: 1.5;">
                ${this.attemptCount === 1 ? 'Developer tools are not allowed.' : 
                  this.attemptCount === 2 ? 'Please close developer tools.' : 
                  'Final warning: Disable developer tools immediately.'}
            </p>
            <div style="font-size: 12px; color: #94a3b8; margin-top: 10px;">
                Attempt ${this.attemptCount}/${this.maxAttempts}
            </div>
        `;
        
        warning.style.display = 'block';
        
        // Auto hide after 3 seconds
        setTimeout(() => {
            warning.style.display = 'none';
        }, 3000);
    }
    
    logViolation(reason) {
        // Internal logging
        const violation = {
            timestamp: new Date().toISOString(),
            reason: reason,
            attempt: this.attemptCount,
            userAgent: navigator.userAgent,
            url: window.location.href
        };
        
        // Store in memory
        if (!window.byyverseViolations) {
            window.byyverseViolations = [];
        }
        window.byyverseViolations.push(violation);
    }
    
    enforceStrictMode() {
        // Actions untuk attempt berlebihan
        console.warn('[ByyVerse Security] Maximum violation attempts reached');
        
        // Clear page content
        document.body.innerHTML = `
            <div style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: #0f172a;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-family: 'Inter', sans-serif;
                text-align: center;
                padding: 20px;
                z-index: 9999999;
            ">
                <div>
                    <i class="fas fa-ban" style="font-size: 3em; color: #ef4444; margin-bottom: 20px;"></i>
                    <h2 style="margin-bottom: 10px;">Access Restricted</h2>
                    <p style="margin-bottom: 20px; max-width: 500px;">
                        Developer tools are not permitted on this platform.
                        Please refresh the page and avoid using inspection tools.
                    </p>
                    <button onclick="location.reload()" style="
                        background: #647cf7;
                        color: white;
                        border: none;
                        padding: 12px 24px;
                        border-radius: 8px;
                        cursor: pointer;
                        font-weight: 600;
                    ">
                        <i class="fas fa-redo"></i> Reload Page
                    </button>
                </div>
            </div>
        `;
        
        // Disable semua event listeners
        this.protectionEnabled = false;
        
        // Redirect setelah 10 detik
        setTimeout(() => {
            window.location.href = '/';
        }, 10000);
    }
    
    // ===== UTILITY METHODS =====
    disableProtection() {
        this.protectionEnabled = false;
        this.enabled = false;
        console.log('[ConsoleProtect] Proteksi dinonaktifkan');
    }
    
    enableProtection() {
        this.protectionEnabled = true;
        this.enabled = true;
        console.log('[ConsoleProtect] Proteksi diaktifkan');
    }
    
    // Untuk development/debugging
    enableDebugMode() {
        this.debugMode = true;
        this.disableProtection();
        console.log('[ConsoleProtect] Debug mode diaktifkan');
    }
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    // Tunggu sebentar sebelum inisialisasi
    setTimeout(() => {
        window.consoleProtect = new ConsoleProtect();
        
        // Tambahkan fungsi bantuan untuk debugging (hanya jika diaktifkan)
        if (window.location.search.includes('debug=true')) {
            window.byyverseDebug = true;
            window.consoleProtect.enableDebugMode();
            console.log('[ByyVerse] Debug mode aktif - Proteksi console dinonaktifkan');
        }
    }, 1000);
});

// ===== ADDITIONAL PROTECTION LAYERS =====

// Layer 1: Prevent console clearing (simplified)
(function() {
    if (!window.byyverseDebug) {
        const originalClear = console.clear;
        console.clear = function() {
            console.warn('[ByyVerse Security] Console clear is disabled');
            return;
        };
    }
})();

// Layer 2: Simplified error handling
window.addEventListener('error', function(e) {
    // Hanya obfuscate jika ada pattern sensitive
    const sensitivePatterns = [
        /token-auth\.js/,
        /byyverse/i,
        /encrypt|decrypt/i,
        /token/i
    ];
    
    let shouldObfuscate = false;
    for (const pattern of sensitivePatterns) {
        if (pattern.test(e.message)) {
            shouldObfuscate = true;
            break;
        }
    }
    
    if (shouldObfuscate) {
        console.error('[ByyVerse] An error occurred');
        e.preventDefault();
        return true;
    }
});

// Layer 3: Anti-tampering protection (simplified)
(function() {
    const importantFiles = [
        'token-auth.js',
        'main.js',
        'console-protect.js'
    ];
    
    // Hanya cek sekali saat load
    setTimeout(() => {
        importantFiles.forEach(file => {
            const script = document.querySelector(`script[src*="${file}"]`);
            if (script) {
                script.setAttribute('data-protected', 'true');
            }
        });
    }, 2000);
})();

// Layer 4: Prevent iframe embedding
if (window.self !== window.top) {
    // Jika di-embed dalam iframe
    try {
        window.top.location = window.self.location;
    } catch (e) {
        document.body.innerHTML = `
            <div style="text-align: center; padding: 50px; color: #ef4444;">
                <i class="fas fa-shield-alt fa-3x" style="margin-bottom: 20px;"></i>
                <h2>Access Denied</h2>
                <p>This application cannot be embedded in iframes for security reasons.</p>
            </div>
        `;
    }
}

// Export untuk akses global
window.ConsoleProtect = ConsoleProtect;